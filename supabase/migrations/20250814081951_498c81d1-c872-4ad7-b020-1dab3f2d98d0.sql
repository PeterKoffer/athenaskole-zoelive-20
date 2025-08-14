-- Create calendar_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     TEXT NOT NULL,
  class_id   TEXT NULL,                      -- null = org-wide
  title      TEXT NOT NULL,
  details    TEXT NULL,
  starts_at  TIMESTAMPTZ NOT NULL,
  ends_at    TIMESTAMPTZ NOT NULL,
  audiences  TEXT[] NOT NULL DEFAULT '{staff,students,family}', -- any of: staff,students,family
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "read events" ON public.calendar_events;
DROP POLICY IF EXISTS "write own events" ON public.calendar_events;
DROP POLICY IF EXISTS "update own events" ON public.calendar_events;

-- Create policies
CREATE POLICY "read events" ON public.calendar_events
FOR SELECT TO authenticated USING (true);

CREATE POLICY "write own events" ON public.calendar_events
FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "update own events" ON public.calendar_events
FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- Create index for performance
CREATE INDEX IF NOT EXISTS calendar_events_range_idx
  ON public.calendar_events (org_id, class_id, starts_at, ends_at);