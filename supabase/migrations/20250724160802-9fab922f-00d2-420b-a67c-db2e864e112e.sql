-- ================================================
-- TRAINING GROUND PARAMETER STORAGE TABLES
-- Store all 12 parameters for personalized content
-- ================================================

-- School/Institution Settings Table
CREATE TABLE IF NOT EXISTS public.school_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  pedagogy TEXT DEFAULT 'balanced, evidence-based style',
  curriculum_standards TEXT DEFAULT 'broadly accepted topics and skills for that grade',
  default_lesson_duration INTEGER DEFAULT 35,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teacher Dashboard Settings
CREATE TABLE IF NOT EXISTS public.teacher_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.school_settings(id),
  teaching_approach TEXT DEFAULT 'balanced, evidence-based style',
  curriculum_alignment TEXT,
  lesson_duration_minutes INTEGER DEFAULT 35,
  subject_priorities JSONB DEFAULT '{"Mathematics": "medium", "English": "medium", "Science": "medium"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Student Profiles (extends existing if needed)
CREATE TABLE IF NOT EXISTS public.enhanced_student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  grade_level INTEGER DEFAULT 6,
  learning_style_preference TEXT DEFAULT 'multimodal approach',
  interests TEXT[] DEFAULT '{}',
  abilities_assessment TEXT DEFAULT 'mixed ability with both support and challenges',
  performance_accuracy DECIMAL(5,2) DEFAULT 75.0,
  engagement_level TEXT DEFAULT 'moderate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar & Seasonal Context
CREATE TABLE IF NOT EXISTS public.calendar_context (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.school_settings(id),
  active_themes TEXT[] DEFAULT '{}',
  seasonal_keywords TEXT[] DEFAULT '{}',
  current_unit_duration TEXT DEFAULT 'standalone session',
  unit_timeframe TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Ground Generated Content Log
CREATE TABLE IF NOT EXISTS public.training_ground_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  generated_content JSONB NOT NULL,
  context_parameters JSONB NOT NULL, -- Stores all 12 parameters used
  generation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  was_completed BOOLEAN DEFAULT FALSE,
  completion_time_seconds INTEGER,
  student_rating INTEGER CHECK (student_rating >= 1 AND student_rating <= 5)
);

-- Enable RLS on all tables
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_ground_content ENABLE ROW LEVEL SECURITY;

-- School settings policies (admin only)
CREATE POLICY "School settings viewable by authenticated users" 
ON public.school_settings FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "School settings manageable by admins" 
ON public.school_settings FOR ALL 
TO authenticated 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles 
  WHERE role = 'admin' OR role = 'school_admin'
));

-- Teacher settings policies
CREATE POLICY "Teachers can view and edit their own settings" 
ON public.teacher_settings FOR ALL 
USING (auth.uid() = teacher_id);

-- Student profile policies
CREATE POLICY "Students can view and edit their own enhanced profile" 
ON public.enhanced_student_profiles FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view their students' enhanced profiles" 
ON public.enhanced_student_profiles FOR SELECT 
USING (auth.uid() IN (
  SELECT teacher_id FROM public.teacher_settings
));

-- Calendar context policies
CREATE POLICY "Calendar context viewable by school members" 
ON public.calendar_context FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Calendar context manageable by teachers and admins" 
ON public.calendar_context FOR ALL 
TO authenticated 
USING (auth.uid() IN (
  SELECT teacher_id FROM public.teacher_settings
  UNION
  SELECT user_id FROM public.profiles WHERE role IN ('admin', 'school_admin', 'teacher')
));

-- Training Ground content policies
CREATE POLICY "Students can view their own Training Ground content" 
ON public.training_ground_content FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own completion data" 
ON public.training_ground_content FOR UPDATE 
USING (auth.uid() = student_id);

CREATE POLICY "System can insert Training Ground content for any student" 
ON public.training_ground_content FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_school_settings_updated_at
  BEFORE UPDATE ON public.school_settings
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_teacher_settings_updated_at
  BEFORE UPDATE ON public.teacher_settings
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_enhanced_student_profiles_updated_at
  BEFORE UPDATE ON public.enhanced_student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_calendar_context_updated_at
  BEFORE UPDATE ON public.calendar_context
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();