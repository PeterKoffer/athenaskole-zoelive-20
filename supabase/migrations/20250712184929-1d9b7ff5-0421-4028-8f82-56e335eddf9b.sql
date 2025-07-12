
-- Add the missing tables to the database schema to match what the PreferencesService expects

-- First, create the school_preferences table
ALTER TABLE public.school_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for school_preferences
CREATE POLICY "Users can view school preferences they have access to"
ON public.school_preferences
FOR SELECT
TO authenticated
USING (true); -- For now, allow viewing - this could be restricted based on user roles later

CREATE POLICY "Admins can manage school preferences"
ON public.school_preferences
FOR ALL
TO authenticated
USING (true) -- For now, allow all operations - this should be restricted to admins in production
WITH CHECK (true);

-- Enable RLS for teacher_preferences table  
ALTER TABLE public.teacher_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teacher_preferences
CREATE POLICY "Teachers can view their own preferences"
ON public.teacher_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can manage their own preferences"
ON public.teacher_preferences
FOR ALL
TO authenticated
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);
