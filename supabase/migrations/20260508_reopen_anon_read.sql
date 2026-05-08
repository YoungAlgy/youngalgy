-- 2026-05-08: Re-open anon SELECT on dashboard tables so the cosmetic
-- PasswordGate (toggle813) flow works end-to-end again.
--
-- Context: 20260426_lockdown_rls.sql locked SELECT to authenticated-only
-- in tandem with the SupabaseAuthGate magic-link flow. Algy reverted to
-- PasswordGate (his preferred UX for a private personal tracker) and
-- accepts the explicit tradeoff: PasswordGate is cosmetic — anyone who
-- finds the URL can curl the data without the password. That's fine
-- for his use case (private dashboard, no PII beyond his own job apps).
--
-- This migration:
--   - Drops the authenticated-only SELECT policies
--   - Adds back permissive anon SELECT (matches pre-2026-04-26 state)
--   - LEAVES the anon insert/update/delete revoke in place — writes stay
--     bot-only via service_role, which bypasses RLS
--
-- PASTE THIS ENTIRE FILE INTO https://supabase.com/dashboard/project/oydhnnqgbcsxvdttkncm/sql/new AND CLICK "RUN".

-- 1. Drop the authenticated-only policies added on 2026-04-26
drop policy if exists select_authenticated_opportunities on public.opportunities;
drop policy if exists select_authenticated_interviews    on public.interviews;

-- 2. Add back permissive anon SELECT
create policy anon_read_opportunities
  on public.opportunities
  for select
  to anon
  using ( true );

create policy anon_read_interviews
  on public.interviews
  for select
  to anon
  using ( true );

-- 3. Defense-in-depth: keep anon writes revoked (intentionally not undone)
--    service_role bypasses RLS so insert_applied_jobs.py keeps working.
--    Comment kept for clarity; nothing to do.

-- 4. Sanity check — should return the two new anon policies
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('opportunities', 'interviews')
order by tablename, policyname;
