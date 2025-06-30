
-- Create knowledge_components table
CREATE TABLE public.knowledge_components (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    grade_levels INTEGER[],
    domain TEXT,
    curriculum_standards JSONB,
    prerequisite_kcs TEXT[],
    postrequisite_kcs TEXT[],
    tags TEXT[],
    difficulty_estimate NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_components ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access for now
CREATE POLICY "Allow public read access to knowledge components"
ON public.knowledge_components
FOR SELECT
USING (true);

-- Allow authenticated users to manage knowledge components
CREATE POLICY "Allow authenticated users to manage knowledge components"
ON public.knowledge_components
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX idx_kc_subject ON public.knowledge_components(subject);
CREATE INDEX idx_kc_grade_levels ON public.knowledge_components USING GIN (grade_levels);
CREATE INDEX idx_kc_tags ON public.knowledge_components USING GIN (tags);

-- Trigger to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_knowledge_component_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_knowledge_component_update
BEFORE UPDATE ON public.knowledge_components
FOR EACH ROW
EXECUTE FUNCTION public.handle_knowledge_component_update();
