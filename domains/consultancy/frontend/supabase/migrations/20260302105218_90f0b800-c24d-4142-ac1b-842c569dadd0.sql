
-- Add file_url column to resources table
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_url text;

-- Create a public storage bucket for resource files
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-files', 'resource-files', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view/download resource files
CREATE POLICY "Anyone can view resource files"
ON storage.objects FOR SELECT
USING (bucket_id = 'resource-files');

-- Authenticated admins can upload resource files
CREATE POLICY "Admins can upload resource files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update resource files
CREATE POLICY "Admins can update resource files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete resource files
CREATE POLICY "Admins can delete resource files"
ON storage.objects FOR DELETE
USING (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));
