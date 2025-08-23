-- Create universe_content table for storing AI-generated content
CREATE TABLE public.universe_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  universe_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  objectives TEXT[] NOT NULL DEFAULT '{}',
  activities JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(universe_id)
);

-- Enable RLS
ALTER TABLE public.universe_content ENABLE ROW LEVEL SECURITY;

-- Create policies for universe content
CREATE POLICY "Universe content is viewable by everyone" 
ON public.universe_content 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create universe content" 
ON public.universe_content 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update universe content" 
ON public.universe_content 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER update_universe_content_updated_at
BEFORE UPDATE ON public.universe_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();