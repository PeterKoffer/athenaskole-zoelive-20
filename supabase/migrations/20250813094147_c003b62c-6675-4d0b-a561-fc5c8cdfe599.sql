-- Create helpful composite indexes for faster filtering by user/session and created_at
create index if not exists events_user_created_idx
  on public.events (user_id, created_at desc);

create index if not exists events_session_created_idx
  on public.events (session_id, created_at desc);