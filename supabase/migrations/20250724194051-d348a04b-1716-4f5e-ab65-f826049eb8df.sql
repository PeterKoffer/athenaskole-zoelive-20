-- Create AI metrics table for observability
CREATE TABLE public.ai_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  duration_ms INTEGER,
  model TEXT,
  status TEXT, -- 'success', 'error', 'timeout'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous access for metrics (logging purposes)
CREATE POLICY "Allow anonymous read access to metrics" 
ON public.ai_metrics 
FOR SELECT 
USING (true);

CREATE POLICY "Allow anonymous insert to metrics" 
ON public.ai_metrics 
FOR INSERT 
WITH CHECK (true);