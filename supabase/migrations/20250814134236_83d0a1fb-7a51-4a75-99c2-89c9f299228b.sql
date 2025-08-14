-- 1) Table
create table if not exists public.universes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users,
  slug text not null unique,
  title text not null,
  subject text not null,
  grade_level text not null,
  lang text not null default 'en',
  description text,
  goals jsonb,
  visibility text not null default 'private',
  image_url text,
  image_status text not null default 'none',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) RLS
alter table public.universes enable row level security;

-- 3) Policies (create only if they don't exist)
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'universes' and policyname = 'universes_public_read') then
    create policy universes_public_read
    on public.universes for select
    using (visibility = 'public' or auth.uid() = owner_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'universes' and policyname = 'universes_owner_insert') then
    create policy universes_owner_insert
    on public.universes for insert
    with check (auth.uid() = owner_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'universes' and policyname = 'universes_owner_update') then
    create policy universes_owner_update
    on public.universes for update
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'universes' and policyname = 'universes_owner_delete') then
    create policy universes_owner_delete
    on public.universes for delete
    using (auth.uid() = owner_id);
  end if;
end $$;

-- 4) Update trigger (keeps updated_at fresh)
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists universes_touch_updated_at on public.universes;
create trigger universes_touch_updated_at
before update on public.universes
for each row execute function public.touch_updated_at();