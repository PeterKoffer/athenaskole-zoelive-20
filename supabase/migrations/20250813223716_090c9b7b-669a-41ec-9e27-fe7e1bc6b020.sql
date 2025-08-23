-- profiles: add education-localization fields (idempotent)
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists country_code text,               -- e.g., 'US', 'DK'
  add column if not exists locale text,                     -- e.g., 'en-US', 'da-DK'
  add column if not exists currency_code text,              -- e.g., 'USD', 'DKK'
  add column if not exists measurement_system text check (measurement_system in ('metric','imperial')),
  add column if not exists curriculum_code text,            -- e.g., 'US-CCSS', 'DK-COMMON'
  add column if not exists timezone text;                   -- e.g., 'America/New_York'

-- RLS reminder (keep as you already have; no broadening privileges)
revoke all on public.profiles from public;