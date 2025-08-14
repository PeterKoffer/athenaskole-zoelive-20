-- Make universe-images bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'universe-images';

-- Ensure public read policy exists (PostgreSQL version check)
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
END $$;