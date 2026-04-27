-- 2026-04-27: Reply tracking columns on opportunities.
--
-- Goal: dashboard needs to show "Awaiting reply" vs "Replied" vs "Stale"
-- so we can see at a glance which apps still need follow-up vs ghosted.
--
-- New columns (both nullable so existing rows are unaffected):
--   first_reply_at  timestamptz  — when the company first responded
--   reply_kind      text         — 'rejection' | 'screen' | 'interview' | 'question' | 'offer' | 'other'
--
-- Auto-fill trigger: when an opportunity's status changes from 'applied'
-- to anything other than 'applied'/'ghosted' for the first time, stamp
-- first_reply_at = now() if it's still NULL. Status='ghosted' is a
-- timeout, not a real reply, so it doesn't count.
--
-- "Stale" is derived in the UI: status='applied' AND first_reply_at IS NULL
-- AND created_at < now() - interval '14 days'.

-- 1. Add the columns (idempotent)
alter table public.opportunities
  add column if not exists first_reply_at timestamptz,
  add column if not exists reply_kind text;

-- 2. Add a CHECK constraint on reply_kind values (idempotent guard)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'opportunities_reply_kind_check'
  ) then
    alter table public.opportunities
      add constraint opportunities_reply_kind_check
      check (
        reply_kind is null
        or reply_kind in ('rejection','screen','interview','question','offer','other')
      );
  end if;
end $$;

-- 3. Index for "stale" / "awaiting reply" dashboard queries
create index if not exists idx_opportunities_first_reply_at
  on public.opportunities (first_reply_at)
  where first_reply_at is null;

-- 4. Auto-stamp trigger: status moves off 'applied' (not to 'ghosted') -> stamp
create or replace function public.fn_stamp_first_reply()
returns trigger
language plpgsql
as $$
begin
  if NEW.status is not null
     and NEW.status <> OLD.status
     and OLD.status = 'applied'
     and NEW.status not in ('applied','ghosted')
     and NEW.first_reply_at is null
  then
    NEW.first_reply_at := now();

    -- Best-effort reply_kind inference. UI / manual edits can override.
    if NEW.reply_kind is null then
      NEW.reply_kind := case NEW.status
        when 'rejected'     then 'rejection'
        when 'phone_screen' then 'screen'
        when 'interview'    then 'interview'
        when 'offer'        then 'offer'
        else 'other'
      end;
    end if;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_stamp_first_reply on public.opportunities;
create trigger trg_stamp_first_reply
  before update on public.opportunities
  for each row
  execute function public.fn_stamp_first_reply();

-- 5. Backfill: any opportunity already in a non-applied/non-ghosted/non-saved
-- status that has first_reply_at NULL gets stamped to created_at (best
-- approximation since we don't have the actual response timestamp).
update public.opportunities
set
  first_reply_at = created_at,
  reply_kind = case status
    when 'rejected'     then 'rejection'
    when 'phone_screen' then 'screen'
    when 'interview'    then 'interview'
    when 'offer'        then 'offer'
    else 'other'
  end
where first_reply_at is null
  and status is not null
  and status not in ('applied','ghosted','saved','withdrew');

-- 6. Sanity check
select
  count(*) filter (where status = 'applied' and first_reply_at is null) as awaiting_reply,
  count(*) filter (where first_reply_at is not null) as replied,
  count(*) filter (where status = 'applied' and first_reply_at is null
                   and created_at < now() - interval '14 days') as stale
from public.opportunities
where bot_type = 'manual';
