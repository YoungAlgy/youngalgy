-- 2026-08-14: Remove all RLS access for the dead PasswordGate identity.
--
-- The /dashboard PasswordGate feature (see 20260508_dashboard_uid_lock.sql,
-- 20260515_dashboard_update_policies.sql) was sunset a while back --
-- PasswordGate.tsx and the /dashboard route were deleted from the frontend --
-- but the RLS policies granting its Supabase Auth identity
-- (dashboard@youngalgy.local, UID 89c79ed9-fafd-48a7-b414-d76a03a97de4)
-- read/write access to opportunities/interviews were never cleaned up
-- alongside it. Worse: that identity's real password sat in plaintext in
-- this public repo (docs/decisions/20260508_reopen_anon_read.md and three
-- migration file comments) the entire time -- a live, exploitable
-- RLS-bypass credential, not just a stale grant. Caught by a portfolio
-- security sweep, already applied directly to the project via migration
-- (this file documents it after the fact for the repo's own paper trail).
--
-- Already-live effect of this migration (applied 2026-08-14):
--   dashboard@youngalgy.local -> 0 rows, no read, no write (all 6 policies gone)
--   youngalgy@gmail.com       -> unaffected, still has full access via select/update/insert_algy_*
--   anon / any other signup   -> unaffected, already had 0 rows
--   service_role               -> unaffected, bypasses RLS
--
-- Secondary cleanup, not yet done (needs the Supabase dashboard, not SQL):
-- delete the dashboard@youngalgy.local Auth user entirely. Now harmless
-- since it has zero RLS grants left, but worth doing for hygiene.

drop policy if exists select_dashboard_opportunities on public.opportunities;
drop policy if exists insert_dashboard_opportunities on public.opportunities;
drop policy if exists update_dashboard_opportunities on public.opportunities;
drop policy if exists select_dashboard_interviews on public.interviews;
drop policy if exists insert_dashboard_interviews on public.interviews;
drop policy if exists update_dashboard_interviews on public.interviews;
