-- Create table for caching universe images
CREATE TABLE public.universe_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  universe_id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  image_url TEXT NOT NULL,
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(universe_id, lang)
);

-- Enable RLS
ALTER TABLE public.universe_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view universe images" 
ON public.universe_images 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage universe images" 
ON public.universe_images 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create storage bucket for fallback images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('universe-images', 'universe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Universe images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'universe-images');

CREATE POLICY "Service role can upload universe images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'universe-images');

CREATE POLICY "Service role can update universe images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'universe-images');

-- Add trigger for timestamps
CREATE TRIGGER update_universe_images_updated_at
BEFORE UPDATE ON public.universe_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();