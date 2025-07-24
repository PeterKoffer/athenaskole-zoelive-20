-- Create ai_cache table for storing AI-generated content
CREATE TABLE public.ai_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_cache (allow service role access)
CREATE POLICY "Allow service role full access to ai_cache" 
ON public.ai_cache 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_ai_cache_key ON public.ai_cache(key);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_cache_updated_at
BEFORE UPDATE ON public.ai_cache
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();