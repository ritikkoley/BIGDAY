/*
  # School Feed / Celebration Wall System

  1. New Tables
    - `feed_posts` - Main posts with media, categories, and visibility
    - `feed_likes` - User likes on posts
    - `feed_comments` - Comments on posts (staff only)
    - `feed_categories` - Predefined categories for posts
    - `feed_media` - Media file metadata and storage references

  2. Security
    - Enable RLS on all feed tables
    - Students can only SELECT posts from their institution
    - Staff/Admin can INSERT/UPDATE/DELETE posts
    - Comments restricted to staff only
    - Likes enabled for all authenticated users

  3. Performance
    - Indexes for fast infinite scroll
    - Institution-based data isolation
    - Optimized for mobile feed consumption
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Feed Categories (predefined)
CREATE TABLE IF NOT EXISTS feed_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text, -- Lucide icon name
  color text, -- Hex color code
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Feed Posts (main content)
CREATE TABLE IF NOT EXISTS feed_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL, -- Will reference institutions table when available
  title text NOT NULL CHECK (length(title) >= 3 AND length(title) <= 200),
  body text CHECK (length(body) <= 5000),
  category_id uuid REFERENCES feed_categories(id),
  tags text[] DEFAULT '{}',
  event_date date,
  media jsonb DEFAULT '[]', -- Array of media objects
  visibility text CHECK (visibility IN ('public', 'staff_only', 'grade_specific')) DEFAULT 'public',
  grade_filter text[], -- For grade_specific visibility
  featured boolean DEFAULT false,
  pinned boolean DEFAULT false,
  status text CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
  created_by uuid NOT NULL, -- References user_profiles(id)
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Feed Likes
CREATE TABLE IF NOT EXISTS feed_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL, -- References user_profiles(id)
  institution_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Feed Comments
CREATE TABLE IF NOT EXISTS feed_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL, -- References user_profiles(id)
  institution_id uuid NOT NULL,
  comment text NOT NULL CHECK (length(comment) >= 1 AND length(comment) <= 1000),
  parent_comment_id uuid REFERENCES feed_comments(id), -- For threaded comments
  status text CHECK (status IN ('active', 'hidden', 'deleted')) DEFAULT 'active',
  created_by uuid NOT NULL,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Feed Media (file metadata)
CREATE TABLE IF NOT EXISTS feed_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  media_type text CHECK (media_type IN ('image', 'video', 'document', 'audio')) NOT NULL,
  thumbnail_path text, -- For videos and documents
  alt_text text, -- For accessibility
  uploaded_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_feed_posts_institution_created 
  ON feed_posts(institution_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_posts_category_status 
  ON feed_posts(category_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_posts_featured_pinned 
  ON feed_posts(institution_id, featured, pinned, created_at DESC) 
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_feed_posts_visibility_grade 
  ON feed_posts(institution_id, visibility, grade_filter) 
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_feed_likes_post_user 
  ON feed_likes(post_id, user_id);

CREATE INDEX IF NOT EXISTS idx_feed_likes_user_institution 
  ON feed_likes(user_id, institution_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_comments_post_created 
  ON feed_comments(post_id, created_at DESC) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_feed_comments_user_institution 
  ON feed_comments(user_id, institution_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_media_post 
  ON feed_media(post_id, media_type);

-- Full-text search index for posts
CREATE INDEX IF NOT EXISTS idx_feed_posts_search 
  ON feed_posts USING gin(
    to_tsvector('english', 
      coalesce(title, '') || ' ' || 
      coalesce(body, '') || ' ' || 
      array_to_string(coalesce(tags, '{}'), ' ')
    )
  );

-- Enable Row Level Security
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feed_posts
CREATE POLICY "Users can view posts from their institution"
  ON feed_posts FOR SELECT TO authenticated
  USING (
    institution_id = (
      SELECT institution_id FROM user_profiles 
      WHERE id = auth.uid()
    )
    AND status = 'published'
    AND (
      visibility = 'public' OR
      (visibility = 'staff_only' AND EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'admin', 'staff')
      )) OR
      (visibility = 'grade_specific' AND EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND current_standard = ANY(grade_filter)
      ))
    )
  );

CREATE POLICY "Staff can manage posts"
  ON feed_posts FOR ALL TO authenticated
  USING (
    institution_id = (
      SELECT institution_id FROM user_profiles 
      WHERE id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin', 'staff')
    )
  );

-- RLS Policies for feed_likes
CREATE POLICY "Users can view likes from their institution"
  ON feed_likes FOR SELECT TO authenticated
  USING (
    institution_id = (
      SELECT institution_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own likes"
  ON feed_likes FOR ALL TO authenticated
  USING (
    user_id = auth.uid()
    AND institution_id = (
      SELECT institution_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- RLS Policies for feed_comments
CREATE POLICY "Users can view comments from their institution"
  ON feed_comments FOR SELECT TO authenticated
  USING (
    institution_id = (
      SELECT institution_id FROM user_profiles 
      WHERE id = auth.uid()
    )
    AND status = 'active'
  );

CREATE POLICY "Staff can manage comments"
  ON feed_comments FOR ALL TO authenticated
  USING (
    institution_id = (
      SELECT institution_id FROM user_profiles 
      WHERE id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin', 'staff')
    )
  );

-- RLS Policies for feed_media
CREATE POLICY "Users can view media from their institution"
  ON feed_media FOR SELECT TO authenticated
  USING (
    institution_id = (
      SELECT institution_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage media"
  ON feed_media FOR ALL TO authenticated
  USING (
    institution_id = (
      SELECT institution_id FROM user_profiles 
      WHERE id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin', 'staff')
    )
  );

-- RLS Policies for feed_categories
CREATE POLICY "Users can view categories"
  ON feed_categories FOR SELECT TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON feed_categories FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Insert default categories
INSERT INTO feed_categories (name, description, icon, color) VALUES
  ('Achievements', 'Student and school achievements', 'Trophy', '#F59E0B'),
  ('Sports', 'Sports events and competitions', 'Zap', '#10B981'),
  ('Cultural Events', 'Cultural programs and celebrations', 'Music', '#8B5CF6'),
  ('Academics', 'Academic achievements and announcements', 'GraduationCap', '#3B82F6'),
  ('Announcements', 'Important school announcements', 'Megaphone', '#EF4444'),
  ('Community', 'Community service and social initiatives', 'Heart', '#EC4899');

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feed_posts_updated_at 
  BEFORE UPDATE ON feed_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feed_comments_updated_at 
  BEFORE UPDATE ON feed_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();