-- Create comprehensive caching tables for adventure content and images

-- Table for storing generated lesson content with all metadata
CREATE TABLE IF NOT EXISTS public.adventure_lesson_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  content_hash TEXT NOT NULL, -- Hash of input parameters to ensure uniqueness
  lesson_data JSONB NOT NULL, -- Complete lesson structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(content_hash)
);

-- Table for storing generated images with metadata
CREATE TABLE IF NOT EXISTS public.adventure_image_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  prompt_hash TEXT NOT NULL, -- Hash of the prompt for deduplication
  image_url TEXT NOT NULL,
  image_data TEXT, -- Base64 image data if needed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(prompt_hash)
);

-- Enable RLS
ALTER TABLE public.adventure_lesson_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adventure_image_cache ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access to cached content
CREATE POLICY "Allow read access to adventure lesson cache" 
ON public.adventure_lesson_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert to adventure lesson cache" 
ON public.adventure_lesson_cache 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow read access to adventure image cache" 
ON public.adventure_image_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert to adventure image cache" 
ON public.adventure_image_cache 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_adventure_lesson_cache_content_hash ON public.adventure_lesson_cache(content_hash);
CREATE INDEX IF NOT EXISTS idx_adventure_lesson_cache_title_subject ON public.adventure_lesson_cache(adventure_title, subject, grade_level);
CREATE INDEX IF NOT EXISTS idx_adventure_image_cache_prompt_hash ON public.adventure_image_cache(prompt_hash);
CREATE INDEX IF NOT EXISTS idx_adventure_image_cache_title ON public.adventure_image_cache(adventure_title);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_adventure_cache_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_adventure_lesson_cache_updated_at
  BEFORE UPDATE ON public.adventure_lesson_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_adventure_cache_updated_at();