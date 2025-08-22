-- Make universe-images bucket public using standard UPDATE
UPDATE storage.buckets 
SET public = true 
WHERE id = 'universe-images';

-- Verify the bucket is public
SELECT id, public FROM storage.buckets WHERE id = 'universe-images';