-- Make universe-images bucket properly public using supported function
SELECT storage.set_bucket_public('universe-images', true);

-- Verify the bucket is public
SELECT id, public FROM storage.buckets WHERE id = 'universe-images';