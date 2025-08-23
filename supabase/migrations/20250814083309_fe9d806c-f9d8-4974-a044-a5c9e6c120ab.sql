-- Add practical fields for school calendar functionality
ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS all_day boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS rrule text;

-- Helpful index for range queries
CREATE INDEX IF NOT EXISTS calendar_events_time_idx
  ON public.calendar_events (org_id, class_id, starts_at, ends_at);