-- 2026-05-08: Tighten dashboard SELECT policies to specific user UID.
--
-- Earlier today's policy used `auth.uid() is not null`, which means ANY signed-up
-- Supabase user could read the job-search dashboard data. Since this Supabase
-- project also hosts Money Mitch (which legitimately needs open signup for fan
-- registration), we can't disable signup project-wide. So instead we lock the
-- dashboard SELECT to the specific dashboard@youngalgy.local UID.
--
-- Pre-existing select_algy_* policies are preserved (they target the
-- youngalgy@gmail.com magic-link account UID 34d884ec...).
-- New select_dashboard_* policies allow the toggle813 PasswordGate identity
-- (UID 89c79ed9-fafd-48a7-b414-d76a03a97de4 = dashboard@youngalgy.local).
--
-- After this:
--   anon                  -> 0 rows (no policy applies)
--   any random signup     -> 0 rows (uid doesn't match either allowed)
--   youngalgy@gmail.com   -> all rows (matches select_algy_*)
--   dashboard@youngalgy   -> all rows (matches select_dashboard_*)
--   service_role          -> all rows (bypasses RLS; bot writes still work)

drop policy if exists select_authenticated_opportunities on public.opportunities;
drop policy if exists select_authenticated_interviews    on public.interviews;

create policy select_dashboard_opportunities
  on public.opportunities
  for select
  to authenticated
  using ( auth.uid() = '89c79ed9-fafd-48a7-b414-d76a03a97de4'::uuid );

create policy select_dashboard_interviews
  on public.interviews
  for select
  to authenticated
  using ( auth.uid() = '89c79ed9-fafd-48a7-b414-d76a03a97de4'::uuid );

select schemaname, tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename in ('opportunities','interviews')
order by tablename, policyname;
