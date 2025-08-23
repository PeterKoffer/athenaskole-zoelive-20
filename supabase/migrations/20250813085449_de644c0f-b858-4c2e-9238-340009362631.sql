-- ===== Extensions (idempotent) =====
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- ===== Helper: has_role(uid, role) (idempotent) =====
create or replace function public.has_role(uid uuid, role text)
returns boolean
language sql
stable
as $$
  -- Read role(s) from JWT app_metadata (single "role" or array "roles")
  select coalesce(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' -> 'roles') ? role
    or (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role') = role,
    false
  );
$$;

-- ===== Table (idempotent) =====
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  session_id  text null,
  name        text not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

comment on table public.events is 'Telemetry events (no PII). user_id set from auth.uid().';

-- ===== RLS =====
alter table public.events enable row level security;

-- Ensure indexes (idempotent)
create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_name_idx      on public.events (name);

-- ===== Trigger: set user_id from auth.uid() on INSERT (idempotent) =====
create or replace function public.events_set_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$fn$;

drop trigger if exists trg_events_set_user_id on public.events;
create trigger trg_events_set_user_id
before insert on public.events
for each row execute function public.events_set_user_id();

-- ===== Policies (recreate idempotently) =====
drop policy if exists "read own events"   on public.events;
drop policy if exists "insert own events" on public.events;
drop policy if exists "admins read all events" on public.events;

-- Users read only their own
create policy "read own events"
on public.events
for select
to authenticated
using (auth.uid() = user_id);

-- Users insert only as themselves
create policy "insert own events"
on public.events
for insert
to authenticated
with check (auth.uid() = coalesce(user_id, auth.uid()));

-- Admins can read all
create policy "admins read all events"
on public.events
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- ===== Retention: 30 days via pg_cron (idempotent) =====
-- Unschedule existing job if present, then reschedule
DO $plpgsql$
DECLARE
  _jobid int;
BEGIN
  SELECT jobid INTO _jobid FROM cron.job WHERE jobname = 'nelie_events_retention_daily' LIMIT 1;
  IF _jobid IS NOT NULL THEN
    PERFORM cron.unschedule(_jobid);
  END IF;

  PERFORM cron.schedule(
    'nelie_events_retention_daily',
    '0 3 * * *',  -- daily at 03:00
    $cron$ delete from public.events where created_at < now() - interval '30 days' $cron$
  );
END
$plpgsql$;