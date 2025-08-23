-- Teacher-wide overrides (one row per teacher)
create table if not exists public.teacher_settings (
  teacher_id uuid primary key references public.profiles(user_id) on delete cascade,
  country_code text,
  locale text,
  currency_code text,
  measurement_system text check (measurement_system in ('metric','imperial')),
  curriculum_code text,
  timezone text,
  strict_teacher_wins boolean default true,
  updated_at timestamptz not null default now()
);

alter table public.teacher_settings enable row level security;
drop policy if exists "teacher owns settings" on public.teacher_settings;
create policy "teacher owns settings" on public.teacher_settings
  for all to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- Class-specific overrides (if you have a classes table)
create table if not exists public.class_overrides (
  class_id uuid primary key,  -- reference your classes(id) if exists
  country_code text,
  locale text,
  currency_code text,
  measurement_system text check (measurement_system in ('metric','imperial')),
  curriculum_code text,
  timezone text,
  updated_at timestamptz not null default now()
);

alter table public.class_overrides enable row level security;
-- Let class owners/teachers update; adapt to your ownership schema.
drop policy if exists "teachers can manage class overrides" on public.class_overrides;
create policy "teachers can manage class overrides" on public.class_overrides
  for all to authenticated
  using (true) with check (true);

-- Add trigger for updating timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists update_teacher_settings_updated_at on public.teacher_settings;
create trigger update_teacher_settings_updated_at
    before update on public.teacher_settings
    for each row
    execute function public.update_updated_at_column();

drop trigger if exists update_class_overrides_updated_at on public.class_overrides;
create trigger update_class_overrides_updated_at
    before update on public.class_overrides
    for each row
    execute function public.update_updated_at_column();