
-- Create concept_mastery table for tracking learner progress on specific concepts
CREATE TABLE public.concept_mastery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  concept_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  mastery_level NUMERIC(3,2) NOT NULL DEFAULT 0.0 CHECK (mastery_level >= 0.0 AND mastery_level <= 1.0),
  practice_count INTEGER NOT NULL DEFAULT 0,
  correct_attempts INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  last_practice TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create curriculum_standards table for educational standards alignment
CREATE TABLE public.curriculum_standards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  grade_level INTEGER NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_objectives table for structured learning goals
CREATE TABLE public.learning_objectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  estimated_time_minutes INTEGER,
  curriculum_standard_id UUID REFERENCES public.curriculum_standards(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for concept_mastery
ALTER TABLE public.concept_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own concept mastery" 
  ON public.concept_mastery 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own concept mastery" 
  ON public.concept_mastery 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own concept mastery" 
  ON public.concept_mastery 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for curriculum_standards (public read access)
ALTER TABLE public.curriculum_standards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view curriculum standards" 
  ON public.curriculum_standards 
  FOR SELECT 
  USING (true);

-- Add RLS policies for learning_objectives (public read access)
ALTER TABLE public.learning_objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning objectives" 
  ON public.learning_objectives 
  FOR SELECT 
  USING (true);

-- Create function to update concept mastery
CREATE OR REPLACE FUNCTION public.update_concept_mastery(
  p_user_id UUID,
  p_concept_name TEXT,
  p_subject TEXT,
  p_is_correct BOOLEAN
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_mastery RECORD;
  new_mastery_level NUMERIC(3,2);
BEGIN
  -- Get current mastery or create default
  SELECT * INTO current_mastery 
  FROM public.concept_mastery 
  WHERE user_id = p_user_id AND concept_name = p_concept_name AND subject = p_subject;
  
  IF current_mastery IS NULL THEN
    -- Create new mastery record
    INSERT INTO public.concept_mastery (
      user_id, concept_name, subject, mastery_level,
      practice_count, correct_attempts, total_attempts, last_practice
    ) VALUES (
      p_user_id, p_concept_name, p_subject,
      CASE WHEN p_is_correct THEN 0.2 ELSE 0.0 END,
      1, CASE WHEN p_is_correct THEN 1 ELSE 0 END, 1, now()
    );
  ELSE
    -- Calculate new mastery level using a learning curve
    new_mastery_level := LEAST(1.0, 
      current_mastery.mastery_level + 
      CASE 
        WHEN p_is_correct THEN 0.1 * (1.0 - current_mastery.mastery_level)
        ELSE -0.05 * current_mastery.mastery_level
      END
    );
    
    -- Update existing mastery
    UPDATE public.concept_mastery SET
      practice_count = current_mastery.practice_count + 1,
      correct_attempts = current_mastery.correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
      total_attempts = current_mastery.total_attempts + 1,
      mastery_level = GREATEST(0.0, new_mastery_level),
      last_practice = now(),
      updated_at = now()
    WHERE user_id = p_user_id AND concept_name = p_concept_name AND subject = p_subject;
  END IF;
END;
$$;

-- Insert some sample curriculum standards and learning objectives
INSERT INTO public.curriculum_standards (code, name, description, grade_level, subject) VALUES
('CCSS.MATH.4.OA.A.1', 'Interpret multiplication equation as comparison', 'Interpret a multiplication equation as a comparison', 4, 'Mathematics'),
('CCSS.MATH.4.OA.A.2', 'Multiply or divide to solve word problems', 'Multiply or divide to solve word problems involving multiplicative comparison', 4, 'Mathematics'),
('CCSS.ELA.5.RL.1', 'Quote accurately from text', 'Quote accurately from a text when explaining what the text says explicitly', 5, 'English'),
('CCSS.SCI.3.LS.1', 'Develop models of life cycles', 'Develop models to describe that organisms have unique life cycles', 3, 'Science');

INSERT INTO public.learning_objectives (title, description, difficulty_level, estimated_time_minutes, curriculum_standard_id)
SELECT 
  'Practice ' || cs.name,
  'Learn to ' || LOWER(cs.description),
  2,
  15,
  cs.id
FROM public.curriculum_standards cs;
