create table if not exists feature_flags (
  key text primary key,
  enabled boolean not null default false,
  cohort text default 'all'
);

insert into feature_flags (key, enabled) values ('new_image_pipeline', false)
on conflict (key) do nothing;