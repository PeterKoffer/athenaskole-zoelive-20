-- Make universe-images bucket public to fix 400 errors
UPDATE storage.buckets 
SET public = true 
WHERE id = 'universe-images';