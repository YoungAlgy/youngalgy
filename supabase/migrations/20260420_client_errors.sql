-- Optional table for client-side error reports.
-- Drop this table at any time to disable the log sink in src/lib/log.ts.
-- RLS: allow anon INSERT only, no SELECT/UPDATE/DELETE from client.

create table if not exists public.client_errors (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  context text not null,
  message text,
  path text,
  user_agent text
);

alter table public.client_errors enable row level security;

drop policy if exists "anon_insert_client_errors" on public.client_errors;
create policy "anon_insert_client_errors"
  on public.client_errors
  for insert
  to anon
  with check (true);

-- No read/update/delete policies → anon can't read or modify rows.
-- Use service_role (Supabase Studio) to inspect them.
