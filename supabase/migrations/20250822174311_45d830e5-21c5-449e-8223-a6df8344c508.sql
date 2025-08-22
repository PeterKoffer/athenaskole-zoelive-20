-- Fix storage policies for universe-images bucket

-- Drop duplicate policies if they exist
DROP POLICY IF EXISTS "authenticated_users_read_universe_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_users_sign_universe_images" ON storage.objects;

-- Create single clean policy for reading universe images
CREATE POLICY "read_universe_images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'universe-images');