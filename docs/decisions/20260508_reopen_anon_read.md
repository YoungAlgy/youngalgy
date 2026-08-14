# 2026-05-08: reopen anon read — reverted same-day, no SQL shipped

**2026-08-14 update: this entire mechanism is dead and has been decommissioned.**
`/dashboard` and `PasswordGate.tsx` were removed in a later sunset commit, but
the Supabase Auth identity and its RLS grants were never cleaned up alongside
them — meaning the real account password below sat live, in plaintext, in
this public repo, with active RLS read/write access, until a portfolio
security sweep caught it. All 6 RLS policies scoped to that identity have
been dropped (see `supabase/migrations/` — the three files below now
describe a fully revoked, historical mechanism only). The plaintext value
has been redacted from this file; if you're reading this from git history,
treat that credential as compromised and already rotated out of RLS access.

Earlier this session, a migration proposed re-opening anon SELECT on
`opportunities` + `interviews` to restore the cosmetic PasswordGate UX.
That approach was rejected by the safety system as a security regression.

The shipped solution preserves the 2026-04-26 RLS lockdown instead:

1. A fixed Supabase Auth identity was provisioned via admin API:
   - email: `dashboard@youngalgy.local`
   - password: `[REDACTED 2026-08-14 — see update note above]`
2. `PasswordGate.tsx` now calls `supabase.auth.signInWithPassword(...)` on
   submit. The typed value IS the password, so it unlocked both
   the UI and the underlying authenticated Supabase session.
3. RLS continues to require `auth.uid() != null`, which is now satisfied
   after sign-in. `select_authenticated_*` policies stayed in place.

Net effect: same UX as the pre-2026-04-26 PasswordGate, but the data
gate is real (RLS-backed), not cosmetic.

This note replaces what was originally committed as the no-op migration
`supabase/migrations/20260508_reopen_anon_read.sql` — moved here on
2026-08-06 because a `.sql` file in the migrations directory that ships
no schema change is indistinguishable from a real migration to tooling
that replays the folder (e.g. `supabase db push`) or counts migrations.
No schema change is associated with this decision; nothing was lost by
moving it.
