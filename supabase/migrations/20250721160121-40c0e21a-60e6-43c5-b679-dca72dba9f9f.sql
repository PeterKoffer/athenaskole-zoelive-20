-- Create a table for school preferences
CREATE TABLE school_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES auth.users(id),
  subject_weights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a table for teacher preferences  
CREATE TABLE teacher_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id),
  school_id UUID REFERENCES auth.users(id),
  subject_weights JSONB,
  weekly_emphasis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE school_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for school_preferences
CREATE POLICY "School leaders can manage school preferences" 
ON school_preferences 
FOR ALL 
USING (auth.uid() = school_id);

-- Create policies for teacher_preferences
CREATE POLICY "Teachers can manage their own preferences" 
ON teacher_preferences 
FOR ALL 
USING (auth.uid() = teacher_id);