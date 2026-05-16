-- 2026-05-15: Add UPDATE (+ INSERT) policies for the dashboard UIDs.
--
-- Bug discovered today: ever since 20260426_lockdown_rls.sql, the dashboard
-- EditJobDrawer + StatusSelect have been silently failing to persist edits.
-- The lockdown REVOKED anon insert/update/delete and added only SELECT
-- policies for the authenticated UIDs. Any UPDATE call from the dashboard
-- hits PostgREST, RLS rejects the row at the USING/WITH CHECK gate, and
-- PostgREST returns 200 OK with 0 rows affected — Supabase JS doesn't
-- surface this as an error, so the UI toasts "Saved" while the DB is
-- unchanged.
--
-- Repro path:
--   1. Sign into youngalgy.com/dashboard
--   2. Click any application card's pencil → change Status → Save
--   3. Toast says "Saved", card moves visually
--   4. Reload — card reverts to its old status
--
-- This migration adds the missing UPDATE policies (and INSERT, in case
-- the dashboard ever grows a manual-add affordance) for the same two UIDs
-- that already hold SELECT policies via select_algy_* and select_dashboard_*.
--
--   34d884ec-7e9f-4d8e-8df5-e36f4a5fce10  → youngalgy@gmail.com  (Algy magic-link)
--   89c79ed9-fafd-48a7-b414-d76a03a97de4  → dashboard@youngalgy.local (toggle813 PasswordGate)
--
-- service_role still bypasses RLS, so the existing bots that INSERT new
-- opportunity rows (insert_applied_jobs_*.py) continue to work as before.
--
-- PASTE THIS ENTIRE FILE INTO https://supabase.com/dashboard/project/oydhnnqgbcsxvdttkncm/sql/new AND CLICK "RUN".

-- ─── opportunities ────────────────────────────────────────────────────

-- Algy magic-link UID
create policy update_algy_opportunities
  on public.opportunities
  for update
  to authenticated
  using      ( auth.uid() = '34d884ec-7e9f-4d8e-8df5-e36f4a5fce10'::uuid )
  with check ( auth.uid() = '34d884ec-7e9f-4d8e-8df5-e36f4a5fce10'::uuid );

create policy insert_algy_opportunities
  on public.opportunities
  for insert
  to authenticated
  with check ( auth.uid() = '34d884ec-7e9f-4d8e-8df5-e36f4a5fce10'::uuid );

-- dashboard@youngalgy.local PasswordGate UID
create policy update_dashboard_opportunities
  on public.opportunities
  for update
  to authenticated
  using      ( auth.uid() = '89c79ed9-fafd-48a7-b414-d76a03a97de4'::uuid )
  with check ( auth.uid() = '89c79ed9-fafd-48a7-b414-d76a03a97de4'::uuid );

create policy insert_dashboard_opportunities
  on public.opportunities
  for insert
  to authenticated
  with check ( auth.uid() = '89c79ed9-fafd-48a7-b414-d76a03a97de4'::uuid );

-- ─── interviews ───────────────────────────────────────────────────────

create policy update_algy_interviews
  on public.interviews
  for update
  to authenticated
  using      ( auth.uid() = '34d884ec-7e9f-4d8e-8df5-e36f4a5fce10'::uuid )
  with check ( auth.uid() = '34d884ec-7e9f-4d8e-8df5-e36f4a5fce10'::uuid );

create policy insert_algy_interviews
  on public.interviews
  for insert
  to authenticated
  with check ( auth.uid() = '34d884ec-7e9f-4d8e-8df5-e36f4a5fce10'::uuid );

create policy update_dashboard_interviews
  on public.interviews
  for update
  to authenticated
  using      ( auth.uid() = '89c79ed9-fafd-48a7-b414-d76a03a97de4'::uuid )
  with check ( auth.uid() = '89c79ed9-fafd-48a7-b414-d76a03a97de4'::uuid );

create policy insert_dashboard_interviews
  on public.interviews
  for insert
  to authenticated
  with check ( auth.uid() = '89c79ed9-fafd-48a7-b414-d76a03a97de4'::uuid );

-- Sanity: list every policy on these two tables
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('opportunities','interviews')
order by tablename, cmd, policyname;

-- Smoke test (run as the toggle813 / Algy session via the dashboard):
-- update public.opportunities set notes = notes where id = '<any-id>';
-- → should return 1 row affected, not 0
