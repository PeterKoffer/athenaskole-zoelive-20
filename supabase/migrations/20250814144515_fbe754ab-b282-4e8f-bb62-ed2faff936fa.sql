-- Ensure global unique slugs (case-insensitive) and drop per-owner constraint
CREATE UNIQUE INDEX IF NOT EXISTS uniq_universes_slug_ci
ON public.universes (lower(slug));

-- Drop per-owner uniqueness if it exists
DROP INDEX IF EXISTS uniq_universes_owner_slug;

-- Add storage policy for public read of universe images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'public read universe-images'
  ) THEN
    CREATE POLICY "public read universe-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'universe-images');
  END IF;
END
$$;

-- Add performance indexes for universe lists
CREATE INDEX IF NOT EXISTS universes_owner_created_idx
ON public.universes(owner_id, created_at DESC);

CREATE INDEX IF NOT EXISTS universes_visibility_created_idx
ON public.universes(visibility, created_at DESC);