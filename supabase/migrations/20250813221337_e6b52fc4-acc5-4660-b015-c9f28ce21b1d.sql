-- ---------- helpers (idempotent) ----------
create or replace function public.trigger_set_timestamp()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ---------- table ----------
create table if not exists public.universe_arcs (
  user_id   uuid        not null,
  class_id  text        not null,
  pack_id   text        not null,
  date      date        not null,
  state     jsonb       not null default '{}'::jsonb, -- your serialized sim state / metrics
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, class_id, date)
);

create index if not exists universe_arcs_class_date_idx on public.universe_arcs (class_id, date desc);

drop trigger if exists set_timestamp_universe_arcs on public.universe_arcs;
create trigger set_timestamp_universe_arcs
  before update on public.universe_arcs
  for each row execute function public.trigger_set_timestamp();

-- ---------- RLS ----------
alter table public.universe_arcs enable row level security;

-- self read/write
drop policy if exists "arcs_self_rw" on public.universe_arcs;
create policy "arcs_self_rw" on public.universe_arcs
as permissive
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- (optional) teacher read by class_id claim (if you set 'class_id' in JWT)
-- drop policy if exists "arcs_teacher_read" on public.universe_arcs;
-- create policy "arcs_teacher_read" on public.universe_arcs
-- as permissive
-- for select
-- to authenticated
-- using (jwt_claims()->>'role' = 'teacher' and class_id = jwt_claims()->>'class_id');

-- ---------- privileges ----------
revoke all on public.universe_arcs from public;