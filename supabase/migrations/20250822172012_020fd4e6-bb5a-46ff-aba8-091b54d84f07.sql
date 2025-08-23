-- Storage policies for authenticated users to read universe-images

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read objects in universe-images bucket
CREATE POLICY "authenticated_users_read_universe_images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'universe-images');

-- Allow authenticated users to create signed URLs (needed for private bucket access)
CREATE POLICY "authenticated_users_sign_universe_images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'universe-images');