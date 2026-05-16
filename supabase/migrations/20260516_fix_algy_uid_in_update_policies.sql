-- 2026-05-16: Fix the algy UID in yesterday's update_algy_* / insert_algy_* policies.
--
-- The 20260515_dashboard_update_policies.sql migration used a wrong full UID for
-- the algy magic-link account — extrapolated from a truncated comment in the
-- 20260508_dashboard_uid_lock.sql migration. The real UID matches the existing
-- select_algy_* policies (visible in pg_policies):
--
--   wrong: 34d884ec-7e9f-4d8e-8df5-e36f4a5fce10
--   right: 34d884ec-14f6-48b8-8ee1-72b6b381756c   (youngalgy@gmail.com magic-link)
--
-- Net effect of yesterday's bug: the update_algy_* / insert_algy_* policies were
-- dead code (never matched any real session). The dashboard@youngalgy.local path
-- (89c79ed9-...) was correct and is what the live toggle813 PasswordGate uses,
-- so the dashboard-save persistence fix still landed. This cleanup makes the
-- algy magic-link path real for any future session signed in as
-- youngalgy@gmail.com.
--
-- Verified the real UID against auth.users at run time:
--   select id, email from auth.users where email = 'youngalgy@gmail.com';
--   → 34d884ec-14f6-48b8-8ee1-72b6b381756c
--
-- PASTE THIS ENTIRE FILE INTO https://supabase.com/dashboard/project/oydhnnqgbcsxvdttkncm/sql/new AND CLICK "RUN".
-- (Supabase will show a "destructive operation" confirmation because of the DROP
-- statements — these only drop yesterday's 4 inert dead-code policies.)

drop policy if exists update_algy_opportunities on public.opportunities;
drop policy if exists insert_algy_opportunities on public.opportunities;
drop policy if exists update_algy_interviews    on public.interviews;
drop policy if exists insert_algy_interviews    on public.interviews;

create policy update_algy_opportunities
  on public.opportunities
  for update
  to authenticated
  using      ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b381756c'::uuid )
  with check ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b381756c'::uuid );

create policy insert_algy_opportunities
  on public.opportunities
  for insert
  to authenticated
  with check ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b381756c'::uuid );

create policy update_algy_interviews
  on public.interviews
  for update
  to authenticated
  using      ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b381756c'::uuid )
  with check ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b381756c'::uuid );

create policy insert_algy_interviews
  on public.interviews
  for insert
  to authenticated
  with check ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b381756c'::uuid );

-- Sanity: 6 algy_* policies, all on the correct UID.
select schemaname, tablename, policyname, roles, cmd,
       coalesce(qual, with_check) as predicate
from pg_policies
where schemaname = 'public'
  and tablename in ('opportunities','interviews')
  and policyname like '%_algy_%'
order by tablename, cmd, policyname;
