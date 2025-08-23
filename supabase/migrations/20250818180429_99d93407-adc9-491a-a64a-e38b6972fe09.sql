-- Enforce uniqueness in the DB (can't be bypassed)
-- Slugs are the canonical identity
CREATE UNIQUE INDEX IF NOT EXISTS universes_slug_key ON public.universes(slug);

-- Optional but powerful: content-level dedupe
CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE public.universes
  ADD COLUMN IF NOT EXISTS content_hash text;

-- title+subject+grade are a good "sameness" signal
UPDATE public.universes
SET content_hash = encode(
  digest(
    lower(trim(title)) || '|' || lower(trim(subject)) || '|' || coalesce(grade_level,''),
    'sha256'
  ),
  'hex'
)
WHERE content_hash IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS universes_content_hash_key
  ON public.universes(content_hash);

-- Dedupe image banking too (no duplicate AI renders)
-- Treat NULL seed as 0 to dedupe deterministic prompts
CREATE UNIQUE INDEX IF NOT EXISTS ai_images_dedupe
ON public.ai_images (
  universe_id,
  model_version,
  width,
  height,
  prompt,
  (COALESCE(seed, 0))
);

-- Create function for safe universe upserting
CREATE OR REPLACE FUNCTION public.upsert_universes(_data jsonb, _owner_id uuid DEFAULT NULL)
RETURNS TABLE (
  attempted integer,
  inserted integer,
  skipped_slugs text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
BEGIN
  -- Use provided owner_id or fall back to existing one
  v_owner := COALESCE(_owner_id, (SELECT owner_id FROM public.universes LIMIT 1));
  
  IF v_owner IS NULL THEN
    RAISE EXCEPTION 'No owner_id provided and no existing universes found';
  END IF;

  WITH payload AS (
    SELECT jsonb_array_elements(_data) AS j
  ),
  ins AS (
    INSERT INTO public.universes
      (id, owner_id, slug, title, subject, grade_level, description, metadata, visibility, content_hash)
    SELECT
      gen_random_uuid(),
      v_owner,
      j->>'slug',
      j->>'title',
      j->>'subject',
      j->>'grade_level',
      j->>'description',
      COALESCE(j->'metadata', '{}'::jsonb),
      COALESCE(j->>'visibility', 'public'),
      encode(digest(lower(trim(j->>'title')) || '|' || lower(trim(j->>'subject')) || '|' || COALESCE(j->>'grade_level',''), 'sha256'),'hex')
    FROM payload
    ON CONFLICT (slug) DO NOTHING
    RETURNING slug
  )
  SELECT
    (SELECT count(*) FROM payload)::integer,
    (SELECT count(*) FROM ins)::integer,
    (SELECT array_agg(j->>'slug') FROM payload p
     WHERE EXISTS (SELECT 1 FROM public.universes u WHERE u.slug = (p.j->>'slug')))::text[];
END $$;