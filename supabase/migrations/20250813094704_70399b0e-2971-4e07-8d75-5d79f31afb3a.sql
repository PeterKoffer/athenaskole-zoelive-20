-- Hardening for public.events: force RLS, constrain payload, secure purge function + cron

-- 1) Force Row Level Security (prevents owner bypass)
alter table public.events force row level security;

-- 2) Constrain payload shape and size (8KB) - idempotent add
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'events_payload_is_object'
  ) then
    alter table public.events
      add constraint events_payload_is_object check (jsonb_typeof(payload) = 'object');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'events_payload_size'
  ) then
    alter table public.events
      add constraint events_payload_size check (pg_column_size(payload) <= 8192);
  end if;
end$$;

-- 3) Secure purge function (30-day retention) and schedule via pg_cron
create or replace function public.purge_old_events()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.events where created_at < now() - interval '30 days';
end;
$$;

-- Re-schedule the daily job to call the function (idempotent)
do $$
declare
  _jobid int;
begin
  select jobid into _jobid from cron.job where jobname = 'nelie_events_retention_daily' limit 1;
  if _jobid is not null then
    perform cron.unschedule(_jobid);
  end if;
  perform cron.schedule(
    'nelie_events_retention_daily',
    '0 3 * * *',
    $$ select public.purge_old_events(); $$
  );
end$$;

-- 4) (Re)create precise admin read-all policy to be explicit
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='events' AND policyname='admins read all events'
  ) THEN
    EXECUTE 'drop policy "admins read all events" on public.events';
  END IF;
  EXECUTE $$
    create policy "admins read all events"
    on public.events
    for select
    to authenticated
    using (public.has_role(auth.uid(), 'admin') = true)
  $$;
END$$;