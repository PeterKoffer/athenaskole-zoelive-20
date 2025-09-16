-- Create adventures table to store all 500 adventures
CREATE TABLE public.adventures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  universe_id TEXT NOT NULL,
  grade_int INTEGER NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT,
  description TEXT,
  subject TEXT,
  image_url TEXT,
  image_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index on universe_id and grade_int combination
CREATE UNIQUE INDEX idx_adventures_universe_grade ON public.adventures (universe_id, grade_int);

-- Create index for faster lookups
CREATE INDEX idx_adventures_subject ON public.adventures (subject);
CREATE INDEX idx_adventures_image_generated ON public.adventures (image_generated);

-- Enable Row Level Security
ALTER TABLE public.adventures ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (since these are educational content)
CREATE POLICY "Adventures are viewable by everyone" 
ON public.adventures 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_adventures_updated_at
BEFORE UPDATE ON public.adventures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();