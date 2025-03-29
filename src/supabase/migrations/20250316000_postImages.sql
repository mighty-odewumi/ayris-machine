alter table posts add column image_url text;

-- Update the storage policies using proper UUID casting
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images' AND
  auth.uid()::uuid = (storage.foldername(name))[1]::uuid
);

-- Allow public access to view files
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');