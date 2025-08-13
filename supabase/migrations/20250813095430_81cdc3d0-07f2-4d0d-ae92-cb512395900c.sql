-- 0) Ensure pg_cron exists
create extension if not exists pg_cron;

-- 1) Force RLS and ensure payload constraints exist
alter table public.events force row level security;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'events_payload_is_object'
  ) then
    alter table public.events
      add constraint events_payload_is_object check (jsonb_typeof(payload) = 'object');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'events_payload_size'
  ) then
    alter table public.events
      add constraint events_payload_size check (pg_column_size(payload) <= 8192);
  end if;
end$$;

-- 2) Purge function runs as definer and stays in public schema
create or replace function public.purge_old_events()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.events
  where created_at < now() - interval '30 days';
end;
$$;

comment on function public.purge_old_events() is 'Deletes events older than 30 days. Called by pg_cron.';

-- 3) Allow the cron runner to DELETE despite RLS (precise roles only)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='events' AND policyname='cron can purge'
  ) THEN
    EXECUTE 'drop policy "cron can purge" on public.events';
  END IF;
END$$;

create policy "cron can purge"
on public.events
for delete
to public
using ( current_user::text in ('postgres','supabase_admin') );

-- 4) Re-schedule daily purge at 03:00 using clean quoting
DO $$
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
    'select public.purge_old_events();'
  );
end$$;