-- Make universe-images bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'universe-images';

-- Ensure public read policy exists
CREATE POLICY IF NOT EXISTS "public read universe-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'universe-images');