-- 0) Extensions (leave pg_cron schema alone)
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_cron;  -- no WITH SCHEMA / no SET SCHEMA

-- 1) Enforce RLS + payload constraints (idempotent adds)
alter table public.events force row level security;

do $$
begin
  if not exists (select 1 from pg_constraint where conname='events_payload_is_object') then
    alter table public.events
      add constraint events_payload_is_object check (jsonb_typeof(payload) = 'object');
  end if;
  if not exists (select 1 from pg_constraint where conname='events_payload_size') then
    alter table public.events
      add constraint events_payload_size check (pg_column_size(payload) <= 8192);
  end if;
end$$;

-- 2) Purge function (SECURITY DEFINER + explicit search_path)
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

comment on function public.purge_old_events() is
  'Deletes events older than 30 days (runs under SECURITY DEFINER), called by pg_cron.';

-- 3) Precise DELETE policy for the cron runner (no PUBLIC grant)
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='events' and policyname='cron can purge'
  ) then
    execute 'drop policy "cron can purge" on public.events';
  end if;
end$$;

create policy "cron can purge"
on public.events
for delete
to postgres, supabase_admin
using (true);

-- 4) Least-privilege EXECUTE on the function
revoke all on function public.purge_old_events() from public, authenticated, anon;
grant  execute on function public.purge_old_events() to postgres, supabase_admin;

-- 5) Re-schedule daily purge (03:00) with clean quoting
do $$
declare
  _jobid int;
begin
  select jobid into _jobid
  from cron.job
  where jobname = 'nelie_events_retention_daily'
  limit 1;

  if _jobid is not null then
    perform cron.unschedule(_jobid);
  end if;

  perform cron.schedule(
    'nelie_events_retention_daily',
    '0 3 * * *',
    'select public.purge_old_events();'
  );
end$$;