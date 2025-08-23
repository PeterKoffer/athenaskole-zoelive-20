-- =========================
-- Canonical scoped settings
-- =========================
create table if not exists public.settings (
  id           uuid primary key default gen_random_uuid(),
  scope        text not null check (scope in ('school','class','teacher','student','system')),
  org_id       uuid null,
  class_id     uuid null,
  user_id      uuid null,
  key          text not null,
  value        jsonb not null,
  version      int not null default 1,
  updated_by   uuid not null default auth.uid(),
  updated_at   timestamptz not null default now(),

  -- one unique row per (scope + target + key)
  constraint settings_unique unique (
    scope,
    coalesce(org_id,    '00000000-0000-0000-0000-000000000000'),
    coalesce(class_id,  '00000000-0000-0000-0000-000000000000'),
    coalesce(user_id,   '00000000-0000-0000-0000-000000000000'),
    key
  )
);

-- Helpful claims reader (already in your DB):
create or replace function public.jwt_claim(name text) returns text
language sql stable as $$
  select coalesce( current_setting('request.jwt.claims', true)::jsonb ->> name, '' );
$$;

-- Quick role helper (supports either roles array or single role):
create or replace function public.jwt_has_role(p_role text) returns boolean
language sql stable as $$
  with claims as (
    select current_setting('request.jwt.claims', true)::jsonb as c
  )
  select
    (c -> 'roles') ? p_role
    or (c ->> 'role') = p_role
  from claims;
$$;

alter table public.settings enable row level security;

-- Read: anyone authenticated in same org can read school/class;
-- teachers read their own teacher scope; students read their own student scope.
drop policy if exists "settings_select" on public.settings;
create policy "settings_select" on public.settings
for select to authenticated
using (
  case scope
    when 'school'  then org_id::text = jwt_claim('school_id')
    when 'class'   then org_id::text = jwt_claim('school_id') -- (optionally also check teacher teaches class)
    when 'teacher' then user_id = auth.uid()
    when 'student' then user_id = auth.uid()
    when 'system'  then true  -- safe to read; write guarded below
  end
);

-- Writes by scope:
drop policy if exists "settings_insert" on public.settings;
create policy "settings_insert" on public.settings
for insert to authenticated
with check (
  case scope
    when 'school'  then org_id::text = jwt_claim('school_id') and (jwt_has_role('school_leader') or jwt_has_role('school_admin'))
    when 'class'   then org_id::text = jwt_claim('school_id') and (jwt_has_role('teacher') or jwt_has_role('school_leader'))
    when 'teacher' then user_id = auth.uid()
    when 'student' then user_id = auth.uid()
    when 'system'  then jwt_has_role('admin')
  end
);

drop policy if exists "settings_update" on public.settings;
create policy "settings_update" on public.settings
for update to authenticated
using (
  case scope
    when 'school'  then org_id::text = jwt_claim('school_id') and (jwt_has_role('school_leader') or jwt_has_role('school_admin'))
    when 'class'   then org_id::text = jwt_claim('school_id') and (jwt_has_role('teacher') or jwt_has_role('school_leader'))
    when 'teacher' then user_id = auth.uid()
    when 'student' then user_id = auth.uid()
    when 'system'  then jwt_has_role('admin')
  end
)
with check (
  case scope
    when 'school'  then org_id::text = jwt_claim('school_id') and (jwt_has_role('school_leader') or jwt_has_role('school_admin'))
    when 'class'   then org_id::text = jwt_claim('school_id') and (jwt_has_role('teacher') or jwt_has_role('school_leader'))
    when 'teacher' then user_id = auth.uid()
    when 'student' then user_id = auth.uid()
    when 'system'  then jwt_has_role('admin')
  end
);

-- Upsert RPC (uses RLS; SECURITY INVOKER)
create or replace function public.upsert_setting(
  p_scope text,
  p_org_id uuid,
  p_class_id uuid,
  p_user_id uuid,
  p_key text,
  p_value jsonb
) returns public.settings
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_row public.settings;
begin
  insert into public.settings(scope, org_id, class_id, user_id, key, value, updated_by)
  values (p_scope, p_org_id, p_class_id, p_user_id, p_key, coalesce(p_value, '{}'::jsonb), auth.uid())
  on conflict (scope,
               coalesce(org_id,   '00000000-0000-0000-0000-000000000000'),
               coalesce(class_id, '00000000-0000-0000-0000-000000000000'),
               coalesce(user_id,  '00000000-0000-0000-0000-000000000000'),
               key)
  do update set
    value = excluded.value,
    version = public.settings.version + 1,
    updated_by = auth.uid(),
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.upsert_setting(text, uuid, uuid, uuid, text, jsonb) from public;
grant execute on function public.upsert_setting(text, uuid, uuid, uuid, text, jsonb) to authenticated, service_role;

-- Helpful index for reads:
create index if not exists settings_lookup_idx
on public.settings(scope, org_id, class_id, user_id, key);