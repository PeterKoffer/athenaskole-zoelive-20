-- Create table for tracking AI image generation
CREATE TABLE public.ai_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  universe_id TEXT NOT NULL,
  variant TEXT NOT NULL DEFAULT 'cover', -- 'cover', 'scene', 'activity'
  grade_band TEXT NOT NULL, -- 'g1-2', 'g3-5', 'g6-8', 'g9-10', 'g11-12'
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
  prompt TEXT,
  replicate_prediction_id TEXT,
  storage_path TEXT,
  public_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for efficient querying
CREATE INDEX idx_ai_images_universe_variant_grade ON public.ai_images(universe_id, variant, grade_band);
CREATE INDEX idx_ai_images_status ON public.ai_images(status);
CREATE INDEX idx_ai_images_prediction_id ON public.ai_images(replicate_prediction_id);

-- Add trigger for updated_at
CREATE TRIGGER update_ai_images_updated_at
  BEFORE UPDATE ON public.ai_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.ai_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_images
CREATE POLICY "AI images are viewable by everyone" 
  ON public.ai_images 
  FOR SELECT 
  USING (true);

CREATE POLICY "Service role can manage AI images" 
  ON public.ai_images 
  FOR ALL 
  USING (true)
  WITH CHECK (true);