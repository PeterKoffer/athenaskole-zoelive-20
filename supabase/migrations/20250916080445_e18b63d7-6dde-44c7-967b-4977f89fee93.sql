-- Create table to track student adventure progress
CREATE TABLE public.student_adventures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  universe_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_recap BOOLEAN NOT NULL DEFAULT false,
  performance_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique combination per student and universe (unless recap)
  UNIQUE(student_id, universe_id, is_recap)
);

-- Enable Row Level Security
ALTER TABLE public.student_adventures ENABLE ROW LEVEL SECURITY;

-- Create policies for student access
CREATE POLICY "Students can view their own adventures" 
ON public.student_adventures 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own adventures" 
ON public.student_adventures 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own adventures" 
ON public.student_adventures 
FOR UPDATE 
USING (auth.uid() = student_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_adventures_updated_at
BEFORE UPDATE ON public.student_adventures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_student_adventures_student_id ON public.student_adventures(student_id);
CREATE INDEX idx_student_adventures_universe_id ON public.student_adventures(universe_id);