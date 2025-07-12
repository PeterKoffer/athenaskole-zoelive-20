
-- Create the school_preferences table
CREATE TABLE public.school_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  subject_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id)
);

-- Create the teacher_preferences table  
CREATE TABLE public.teacher_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  school_id UUID NOT NULL,
  subject_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  weekly_emphasis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id)
);

-- Enable Row Level Security for school_preferences
ALTER TABLE public.school_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for school_preferences
CREATE POLICY "Users can view school preferences they have access to"
ON public.school_preferences
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage school preferences"
ON public.school_preferences
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable Row Level Security for teacher_preferences
ALTER TABLE public.teacher_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teacher_preferences
CREATE POLICY "Teachers can view their own preferences"
ON public.teacher_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = teacher_id::uuid);

CREATE POLICY "Teachers can manage their own preferences"
ON public.teacher_preferences
FOR ALL
TO authenticated
USING (auth.uid() = teacher_id::uuid)
WITH CHECK (auth.uid() = teacher_id::uuid);
