-- Ensure global unique slugs (case-insensitive) and drop per-owner constraint
CREATE UNIQUE INDEX IF NOT EXISTS uniq_universes_slug_ci
ON public.universes (lower(slug));

-- Drop per-owner uniqueness if it exists
DROP INDEX IF EXISTS uniq_universes_owner_slug;

-- Add storage policy for public read of universe images
CREATE POLICY IF NOT EXISTS "public read universe-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'universe-images');

-- Add performance indexes for universe lists
CREATE INDEX IF NOT EXISTS universes_owner_created_idx
ON public.universes(owner_id, created_at DESC);

CREATE INDEX IF NOT EXISTS universes_visibility_created_idx
ON public.universes(visibility, created_at DESC);