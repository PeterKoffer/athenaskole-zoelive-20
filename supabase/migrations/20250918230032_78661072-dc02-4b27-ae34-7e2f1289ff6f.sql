-- Tests & Results Tables

-- Assessment main table
CREATE TABLE public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  grade_level text NOT NULL,
  standards text[] DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Assessment items bank
CREATE TABLE public.assessment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stem text NOT NULL,
  choices jsonb, -- for MCQ
  correct_answer text,
  rubric jsonb,
  tags jsonb DEFAULT '{}',
  item_type text NOT NULL CHECK (item_type IN ('mcq_single', 'mcq_multi', 'short_answer', 'rubric_task', 'upload', 'numeric')),
  reading_level integer DEFAULT 6,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Assignments (linking assessments to classes)
CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES public.assessments(id) ON DELETE CASCADE,
  class_id text NOT NULL,
  assignees uuid[] DEFAULT '{}', -- specific students if not whole class
  open_at timestamp with time zone,
  due_at timestamp with time zone,
  time_limit_minutes integer,
  accommodations jsonb DEFAULT '{}',
  settings jsonb DEFAULT '{}', -- AI tools allowed, safe mode, etc.
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Student attempts
CREATE TABLE public.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  responses jsonb DEFAULT '{}',
  time_used_minutes integer DEFAULT 0,
  flags jsonb DEFAULT '{}',
  score_by_item jsonb DEFAULT '{}',
  accommodations_used jsonb DEFAULT '{}',
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  started_at timestamp with time zone DEFAULT now(),
  submitted_at timestamp with time zone,
  graded_at timestamp with time zone
);

-- Parent-Teacher Conference Tables

-- Conference events
CREATE TABLE public.ptc_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  location text,
  meeting_link text,
  interpreter_language text,
  attendees jsonb DEFAULT '[]',
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now()
);

-- Conference packets (auto-generated student summaries)
CREATE TABLE public.ptc_packets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.ptc_events(id) ON DELETE CASCADE,
  standards_snapshot jsonb DEFAULT '{}',
  work_links text[] DEFAULT '{}',
  strengths text[] DEFAULT '{}',
  concerns text[] DEFAULT '{}',
  attendance_summary jsonb DEFAULT '{}',
  behavior_notes text,
  generated_at timestamp with time zone DEFAULT now()
);

-- Conference action items
CREATE TABLE public.ptc_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.ptc_events(id) ON DELETE CASCADE,
  action_text text NOT NULL,
  owner_type text NOT NULL CHECK (owner_type IN ('teacher', 'guardian', 'student')),
  owner_name text,
  due_date date,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamp with time zone DEFAULT now()
);

-- Conference summaries
CREATE TABLE public.ptc_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.ptc_events(id) ON DELETE CASCADE,
  summary_for_guardians text,
  private_teacher_notes text,
  guardian_acknowledged boolean DEFAULT false,
  acknowledged_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- School Admin Tables

-- Policies and announcements
CREATE TABLE public.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  file_url text,
  version integer DEFAULT 1,
  policy_type text NOT NULL CHECK (policy_type IN ('handbook', 'grading', 'academic_honesty', 'ai_policy', 'emergency')),
  required_acknowledgment boolean DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Policy acknowledgments
CREATE TABLE public.policy_acknowledgments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid REFERENCES public.policies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  acknowledged_at timestamp with time zone DEFAULT now(),
  UNIQUE(policy_id, user_id)
);

-- Resources for booking
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('room', 'device_cart', 'lab', 'equipment')),
  capacity integer DEFAULT 1,
  location text,
  description text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Resource bookings
CREATE TABLE public.resource_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid REFERENCES public.resources(id) ON DELETE CASCADE,
  booked_by uuid NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  purpose text,
  class_id text,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now()
);

-- Form submissions
CREATE TABLE public.form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type text NOT NULL CHECK (form_type IN ('incident_report', 'behavior_report', 'safety_drill', 'parent_consent')),
  student_id uuid,
  submitted_by uuid NOT NULL,
  form_data jsonb NOT NULL,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'approved', 'rejected')),
  submitted_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid
);

-- Integration logs
CREATE TABLE public.integration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type text NOT NULL CHECK (integration_type IN ('sis_sync', 'gradebook', 'roster_import')),
  status text NOT NULL CHECK (status IN ('success', 'error', 'warning')),
  details jsonb DEFAULT '{}',
  processed_records integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ptc_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ptc_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ptc_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ptc_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Assessments & Tests
CREATE POLICY "Teachers can manage their own assessments" ON public.assessments
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Teachers can manage their own assessment items" ON public.assessment_items
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Teachers can view shared assessment items" ON public.assessment_items
  FOR SELECT USING (true);

CREATE POLICY "Teachers can manage assignments in their classes" ON public.assignments
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Students can view their own attempts" ON public.attempts
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can manage attempts for their assignments" ON public.attempts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.assignments 
      WHERE assignments.id = attempts.assignment_id 
      AND assignments.created_by = auth.uid()
    )
  );

-- RLS Policies for Parent-Teacher Conferences
CREATE POLICY "Teachers can manage their conference events" ON public.ptc_events
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can manage conference packets" ON public.ptc_packets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ptc_events 
      WHERE ptc_events.id = ptc_packets.event_id 
      AND ptc_events.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage conference actions" ON public.ptc_actions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ptc_events 
      WHERE ptc_events.id = ptc_actions.event_id 
      AND ptc_events.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage conference summaries" ON public.ptc_summaries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ptc_events 
      WHERE ptc_events.id = ptc_summaries.event_id 
      AND ptc_events.teacher_id = auth.uid()
    )
  );

-- RLS Policies for School Admin
CREATE POLICY "All users can view policies" ON public.policies
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage policies" ON public.policies
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Users can manage their own acknowledgments" ON public.policy_acknowledgments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "All users can view resources" ON public.resources
  FOR SELECT USING (true);

CREATE POLICY "Teachers can manage resource bookings" ON public.resource_bookings
  FOR ALL USING (auth.uid() = booked_by);

CREATE POLICY "All users can view available bookings" ON public.resource_bookings
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own form submissions" ON public.form_submissions
  FOR ALL USING (auth.uid() = submitted_by);

CREATE POLICY "All users can view integration logs" ON public.integration_logs
  FOR SELECT USING (true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_policies_updated_at
  BEFORE UPDATE ON public.policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();