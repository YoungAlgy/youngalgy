# supabase/migrations — known gap

This folder is a **patch log, not a full schema source**. Every file here is
meant to be pasted into the Supabase SQL editor by hand (see the
`PASTE THIS ENTIRE FILE INTO ... AND CLICK "RUN"` comment in most of them) —
there's no CLI migration runner applying these automatically.

**There is no `CREATE TABLE` for `public.opportunities` or `public.interviews`
anywhere in this folder or its git history.** Checked with a full-history
grep (`git log --all -p -- 'supabase/*'`) — the only `CREATE TABLE` that has
ever existed here is `client_errors` in `20260420_client_errors.sql`. Both
`opportunities` and `interviews` were created directly on the live DB
(Supabase Studio / SQL editor) before this migration folder existed, so this
folder can only ever replay *patches* on top of that already-drifted
baseline — never recreate the tables from scratch.

Columns we know about only because a later migration touched them:
- `opportunities`: `status`, `bot_type`, `notes`, `created_at`, `id` (referenced,
  never defined) + `first_reply_at`, `reply_kind` (added in
  `20260427_reply_tracking.sql`)
- `interviews`: no columns are visible anywhere in this folder — only the
  table name, via RLS policies.

The full column list, types, defaults, and constraints for both tables are
**only** visible on the live project
(`https://supabase.com/dashboard/project/oydhnnqgbcsxvdttkncm`).

If/when this dashboard schema is worth keeping long-term, pull it for real
before trusting this folder as documentation:

```
supabase db dump --db-url <connection-string> --schema public \
  -t opportunities -t interviews --schema-only
```

(or Supabase's schema-diff / "migration from diff" tooling), then check the
result in as a baseline migration. Don't hand-write the `CREATE TABLE`
statements from guesswork — the columns listed above are only the ones this
repo happens to reference; the live table almost certainly has more.
