-- 2026-04-26: Lock down dashboard tables to authenticated reads only.
--
-- Before this migration: anon SELECT on opportunities + interviews returns
-- the full dataset, including job-application notes. The PasswordGate at
-- /dashboard was cosmetic only.
--
-- After this migration: anon SELECT returns []. Only authenticated users
-- (post-magic-link sign-in) see the data. service_role bypasses RLS so
-- the bots that write rows (insert_applied_jobs_*.py) keep working.
--
-- PASTE THIS ENTIRE FILE INTO https://supabase.com/dashboard/project/oydhnnqgbcsxvdttkncm/sql/new AND CLICK "RUN".

-- 1. Make sure RLS is on for both tables
alter table public.opportunities enable row level security;
alter table public.interviews    enable row level security;

-- 2. Drop any existing permissive anon-read policies on these tables
do $$
declare
  r record;
begin
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('opportunities', 'interviews')
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- 3. Add restrictive policies: SELECT requires an authenticated session
create policy select_authenticated_opportunities
  on public.opportunities
  for select
  to authenticated
  using ( auth.uid() is not null );

create policy select_authenticated_interviews
  on public.interviews
  for select
  to authenticated
  using ( auth.uid() is not null );

-- 4. Defense-in-depth: revoke anon write access too. service_role bypasses
-- RLS so the existing bots (which use SUPABASE_SECRET_KEY) keep working.
revoke insert, update, delete on public.opportunities from anon;
revoke insert, update, delete on public.interviews    from anon;

-- 5. Sanity check — should return the two new policies
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('opportunities', 'interviews')
order by tablename, policyname;

-- ROLLBACK (only run if you need to undo this)
-- create policy anon_read_opportunities
--   on public.opportunities for select to anon using (true);
-- create policy anon_read_interviews
--   on public.interviews for select to anon using (true);
