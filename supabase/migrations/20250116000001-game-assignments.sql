-- Create table for teacher game assignments to lessons/objectives
CREATE TABLE public.game_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  skill_area TEXT,
  learning_objective TEXT,
  lesson_id TEXT,
  assigned_to_class TEXT,
  assigned_to_students TEXT[], -- Array of student IDs
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create table for enhanced game session tracking with learning outcomes
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  assignment_id UUID REFERENCES public.game_assignments(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  skill_area TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  score INTEGER DEFAULT 0,
  completion_status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  learning_objectives_met TEXT[], -- Array of objectives achieved
  engagement_metrics JSONB DEFAULT '{}', -- Custom engagement data
  performance_data JSONB DEFAULT '{}', -- Detailed performance metrics
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for game assignments (teachers only)
ALTER TABLE public.game_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage their own game assignments" 
  ON public.game_assignments 
  FOR ALL 
  USING (auth.uid() = teacher_id);

-- Add RLS policies for game sessions
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own game sessions" 
  ON public.game_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game sessions" 
  ON public.game_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions" 
  ON public.game_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_game_assignments_teacher_id ON public.game_assignments(teacher_id);
CREATE INDEX idx_game_assignments_subject ON public.game_assignments(subject);
CREATE INDEX idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_id ON public.game_sessions(game_id);
CREATE INDEX idx_game_sessions_assignment_id ON public.game_sessions(assignment_id);