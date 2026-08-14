-- 2026-08-14: fix a UID transcription typo that's been silently blocking
-- youngalgy@gmail.com from ever updating opportunities/interviews.
--
-- update_algy_opportunities / update_algy_interviews were created (see
-- 20260516_fix_algy_uid_in_update_policies.sql) with UID
-- 34d884ec-14f6-48b8-8ee1-72b6b381756c -- one digit off from the real
-- magic-link UID, 34d884ec-14f6-48b8-8ee1-72b6b301756c (confirmed live
-- against auth.users). select_algy_* already used the correct UID, so
-- reads worked fine; only the UPDATE path was silently dead. Found
-- alongside a portfolio security sweep, fixed in the same session.

alter policy update_algy_opportunities on public.opportunities
  using      ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b301756c'::uuid )
  with check ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b301756c'::uuid );

alter policy update_algy_interviews on public.interviews
  using      ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b301756c'::uuid )
  with check ( auth.uid() = '34d884ec-14f6-48b8-8ee1-72b6b301756c'::uuid );
