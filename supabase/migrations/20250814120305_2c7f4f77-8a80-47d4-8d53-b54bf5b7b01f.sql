-- Ensure universe-images bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'universe-images';

-- Ensure public read policy exists
DROP POLICY IF EXISTS "public read universe-images" ON storage.objects;
CREATE POLICY "public read universe-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'universe-images');