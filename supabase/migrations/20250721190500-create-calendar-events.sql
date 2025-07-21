CREATE TYPE public.calendar_layer AS ENUM ('birthday','holiday','general','league','internal','keyword');

CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer calendar_layer NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  keywords TEXT[],
  scope_type TEXT CHECK (scope_type IN ('school','year','class','custom')) DEFAULT 'school',
  scope_target TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view calendar events" ON public.calendar_events
FOR SELECT USING (
  layer != 'internal' OR coalesce(auth.jwt()->>'role','student') IN ('teacher','school_staff','school_leader','admin')
);

CREATE POLICY "Authorized roles can manage events" ON public.calendar_events
FOR ALL USING (
  coalesce(auth.jwt()->>'role','student') IN ('teacher','school_staff','school_leader','admin')
) WITH CHECK (
  coalesce(auth.jwt()->>'role','student') IN ('teacher','school_staff','school_leader','admin')
);

CREATE INDEX idx_calendar_events_dates ON public.calendar_events(start_date, end_date);

CREATE TRIGGER set_calendar_event_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
