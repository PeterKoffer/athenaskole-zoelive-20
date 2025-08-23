-- Create ai_images table for banking universe images
CREATE TABLE IF NOT EXISTS public.ai_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  universe_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued','running','succeeded','failed')),
  provider TEXT NOT NULL DEFAULT 'replicate',
  model_version TEXT NOT NULL,
  prompt TEXT NOT NULL,
  seed BIGINT,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  replicate_prediction_id TEXT,
  storage_path TEXT,  -- e.g. universe-images/{universe_id}/{id}.png
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS ai_images_universe_status_idx ON public.ai_images (universe_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_images_prediction_idx ON public.ai_images (replicate_prediction_id);
CREATE INDEX IF NOT EXISTS ai_images_universe_model_idx ON public.ai_images (universe_id, model_version);

-- Enable RLS
ALTER TABLE public.ai_images ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view ai_images" ON public.ai_images
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage ai_images" ON public.ai_images
  FOR ALL USING (true);