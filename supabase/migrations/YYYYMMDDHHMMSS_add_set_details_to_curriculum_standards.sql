-- Add set_details column to curriculum_standards table
ALTER TABLE public.curriculum_standards
ADD COLUMN set_details JSONB;

-- Add an index to the new JSONB column if we anticipate querying its keys frequently
-- Example: CREATE INDEX idx_curriculum_standards_set_details_country ON public.curriculum_standards USING GIN ((set_details -> 'country'));
-- For now, I'll omit specific GIN indexes on set_details until query patterns are clearer.

COMMENT ON COLUMN public.curriculum_standards.set_details IS 'JSONB column to store details about the standard set, e.g., {"set_name_short": "CCSSM", "country": "US", "language": "en", "version": "2010"}.';

-- Backfill existing rows with a default or inferred value if necessary.
-- For this example, we'll assume new standards will populate this, or it's handled separately.
-- Example backfill (adjust logic as needed):
-- UPDATE public.curriculum_standards
-- SET set_details = jsonb_build_object(
--    'set_name_short', CASE WHEN code LIKE 'CCSS%' THEN 'CCSSM' ELSE 'UNKNOWN' END,
--    'country', CASE WHEN code LIKE 'CCSS%' THEN 'US' ELSE 'UNKNOWN' END,
--    'language', 'en' -- Assuming existing standards are English
-- )
-- WHERE set_details IS NULL;

-- Note: The actual INSERT statements for sample US and Danish standards
-- will be handled after this migration is applied, either via a seeding script
-- or directly in Supabase Studio, as sourcing them requires external lookup.
-- This migration only alters the table structure.

-- Example INSERT statements for sample standards (IDs should be unique UUIDs if not auto-generated):
-- Make sure to generate actual UUIDs for 'id' when inserting.
/*
-- US Common Core Grade 4 Math
INSERT INTO public.curriculum_standards (id, code, name, description, grade_level, subject, set_details, created_at, updated_at) VALUES
(gen_random_uuid(), 'CCSS.MATH.CONTENT.4.OA.A.1', 'Interpret multiplication as comparison', 'Interpret a multiplication equation as a comparison, e.g., interpret 35 = 5 × 7 as a statement that 35 is 5 times as many as 7 and 7 times as many as 5. Represent verbal statements of multiplicative comparisons as multiplication equations.', 4, 'Mathematics', '{ "set_name_official": "Common Core State Standards for Mathematics", "set_name_short": "CCSSM", "country": "US", "language": "en" }', now(), now()),
(gen_random_uuid(), 'CCSS.MATH.CONTENT.4.NF.A.1', 'Equivalent fractions', 'Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b) by using visual fraction models, with attention to how the number and size of the parts differ even though the two fractions themselves are the same size. Use this principle to recognize and generate equivalent fractions.', 4, 'Mathematics', '{ "set_name_official": "Common Core State Standards for Mathematics", "set_name_short": "CCSSM", "country": "US", "language": "en" }', now(), now());

-- Danish Fælles Mål Grade 4 Math (Illustrative - actual codes/names/descriptions would be in Danish)
INSERT INTO public.curriculum_standards (id, code, name, description, grade_level, subject, set_details, created_at, updated_at) VALUES
(gen_random_uuid(), 'FM.MAT.4.GEO.1', 'Properties of 2D shapes', 'Eleven kan identificere og beskrive egenskaber ved almindelige 2D-figurer, herunder kvadrater, rektangler, trekanter og cirkler.', 4, 'Matematik', '{ "set_name_official": "Fælles Mål", "set_name_short": "FM", "country": "DK", "language": "da" }', now(), now()),
(gen_random_uuid(), 'FM.MAT.4.NUM.1', 'Multiplication of whole numbers', 'Eleven kan multiplicere tocifrede tal med encifrede tal ved hjælp af forskellige strategier.', 4, 'Matematik', '{ "set_name_official": "Fælles Mål", "set_name_short": "FM", "country": "DK", "language": "da" }', now(), now());
*/

-- Update the updated_at trigger if it doesn't exist (it should from previous migrations)
-- Or ensure any direct updates to this table also update updated_at.
-- Assuming a generic trigger like handle_updated_at exists and is applied or one specific for this table.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'handle_curriculum_standards_updated_at' AND tgrelid = 'public.curriculum_standards'::regclass
    ) THEN
        CREATE OR REPLACE FUNCTION public.handle_generic_updated_at()
        RETURNS TRIGGER AS $function$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $function$ LANGUAGE plpgsql;

        CREATE TRIGGER handle_curriculum_standards_updated_at
        BEFORE UPDATE ON public.curriculum_standards
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_generic_updated_at();
    END IF;
END;
$$;
