-- Update adventures table to support multiple image variants by age group
ALTER TABLE public.adventures 
ADD COLUMN image_url_child TEXT,
ADD COLUMN image_url_teen TEXT, 
ADD COLUMN image_url_adult TEXT,
ADD COLUMN image_generated_child BOOLEAN DEFAULT FALSE,
ADD COLUMN image_generated_teen BOOLEAN DEFAULT FALSE,
ADD COLUMN image_generated_adult BOOLEAN DEFAULT FALSE;

-- Create indexes for the new columns
CREATE INDEX idx_adventures_child_generated ON public.adventures (image_generated_child);
CREATE INDEX idx_adventures_teen_generated ON public.adventures (image_generated_teen);
CREATE INDEX idx_adventures_adult_generated ON public.adventures (image_generated_adult);

COMMENT ON COLUMN public.adventures.image_url_child IS 'Child-friendly image for grades 0-4';
COMMENT ON COLUMN public.adventures.image_url_teen IS 'Teen-appropriate image for grades 5-8';
COMMENT ON COLUMN public.adventures.image_url_adult IS 'Adult/sophisticated image for grades 9+';