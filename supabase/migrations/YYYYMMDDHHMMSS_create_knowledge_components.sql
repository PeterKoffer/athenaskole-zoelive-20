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
    difficulty_estimate NUMERIC, -- Using NUMERIC for flexibility (e.g., 0.0 to 1.0 or 1-5)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_components ENABLE ROW LEVEL SECURITY;

-- Policies: For now, allow public read access, and restrict modifications.
-- This can be refined later based on who should manage KCs.
CREATE POLICY "Allow public read access to knowledge components"
ON public.knowledge_components
FOR SELECT
USING (true);

-- Example: Allow all authenticated users to insert/update/delete.
-- Adjust this to a specific admin role in a real scenario.
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

COMMENT ON TABLE public.knowledge_components IS 'Stores fine-grained Knowledge Components (KCs) used in the learning system.';
COMMENT ON COLUMN public.knowledge_components.id IS 'Unique identifier for the KC, e.g., "kc_math_g4_add_fractions_likedenom"';
COMMENT ON COLUMN public.knowledge_components.name IS 'Human-readable name of the KC. TODO: Future localization may require this to be a reference key or move to a separate kc_translations table.';
COMMENT ON COLUMN public.knowledge_components.description IS 'Optional detailed description of the KC. TODO: Future localization considerations apply here as well.';
COMMENT ON COLUMN public.knowledge_components.subject IS 'Subject domain of the KC, e.g., "Mathematics". TODO: Subject names may also need localization or a mapping table.';
COMMENT ON COLUMN public.knowledge_components.grade_levels IS 'Array of applicable grade levels, e.g., [3, 4].';
COMMENT ON COLUMN public.knowledge_components.curriculum_standards IS 'Array of links to specific curriculum standards; JSONB structure: [{standardId: "UUID_of_standard_in_curriculum_standards_table", standardSet: "CCSSM", description: "..."}].';
COMMENT ON COLUMN public.knowledge_components.prerequisite_kcs IS 'Array of KC IDs that are prerequisites for this one.';
COMMENT ON COLUMN public.knowledge_components.postrequisite_kcs IS 'Array of KC IDs that this KC is a prerequisite for.';
COMMENT ON COLUMN public.knowledge_components.difficulty_estimate IS 'Initial estimate of difficulty (e.g., value between 0.0 and 1.0, or a 1-5 scale).';
