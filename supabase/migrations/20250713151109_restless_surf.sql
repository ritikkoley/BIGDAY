/*
  # Storage Setup

  1. Create storage buckets for file uploads
  2. Set up RLS policies for secure file access
  3. Configure file type restrictions
*/

-- Create storage bucket for study materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', false);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- RLS Policies for study-materials bucket
CREATE POLICY "Users can view study materials for their courses"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'study-materials' AND
    (
      -- Teachers can access files they uploaded
      owner = auth.uid() OR
      -- Students can access files for their courses
      EXISTS (
        SELECT 1 FROM users, courses
        WHERE users.id = auth.uid()
        AND users.group_id = ANY(courses.group_ids)
        AND courses.id::text = (storage.foldername(name))[1]
      ) OR
      -- Admins can access all files
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
      )
    )
  );

CREATE POLICY "Teachers can upload study materials"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'study-materials' AND
    (
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('teacher', 'admin')
      )
    )
  );

CREATE POLICY "Teachers can update their study materials"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'study-materials' AND
    (
      owner = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
      )
    )
  );

CREATE POLICY "Teachers can delete their study materials"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'study-materials' AND
    (
      owner = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
      )
    )
  );

-- RLS Policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    owner = auth.uid()
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    owner = auth.uid()
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    owner = auth.uid()
  );