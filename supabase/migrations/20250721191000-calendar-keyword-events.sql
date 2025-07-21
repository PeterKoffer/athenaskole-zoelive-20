-- Drop existing calendar_events if present
DROP TABLE IF EXISTS public.calendar_events CASCADE;
DROP TYPE IF EXISTS public.calendar_layer;

-- Main calendar events table
CREATE TABLE public.calendar_event (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  layer VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  visibility JSONB,
  editable_by JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table to hold keyword-based events
CREATE TABLE public.keyword_event (
  id SERIAL PRIMARY KEY,
  calendar_event_id INTEGER REFERENCES public.calendar_event(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  scope_type VARCHAR(20) NOT NULL,
  scope_target JSONB,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER set_calendar_event_updated_at
BEFORE UPDATE ON public.calendar_event
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_keyword_event_updated_at
BEFORE UPDATE ON public.keyword_event
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
