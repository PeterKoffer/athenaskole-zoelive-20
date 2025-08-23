-- Create lesson plans table for teacher planning
CREATE TABLE IF NOT EXISTS public.lesson_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  class_id text,
  org_id text NOT NULL,
  plan_date date NOT NULL,
  lesson_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(org_id, class_id, plan_date)
);

-- Enable RLS
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Teachers can manage their lesson plans"
ON public.lesson_plans
FOR ALL
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Students can view published lesson plans"
ON public.lesson_plans
FOR SELECT
USING (status = 'published');

-- Create trigger for updated_at
CREATE TRIGGER update_lesson_plans_updated_at
BEFORE UPDATE ON public.lesson_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();