/*
  # Create System Settings Table

  1. New Tables
    - `system_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Setting key/identifier
      - `value` (text) - Setting value
      - `category` (text) - Category for grouping settings
      - `description` (text) - Human-readable description
      - `updated_at` (timestamp)
      - `updated_by` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `system_settings` table
    - Add policy for admins to read all settings
    - Add policy for admins to update settings
    - Add policy for all authenticated users to read public settings

  3. Initial Data
    - Insert default institution settings
*/

CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  category text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update settings"
  ON system_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "All authenticated users can read public settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (category = 'public' OR category = 'branding');

INSERT INTO system_settings (key, value, category, description)
VALUES 
  ('institution_name', 'Delhi Public School, Bhilai', 'branding', 'Name of the educational institution'),
  ('institution_type', 'school', 'branding', 'Type of institution (school, college, university)'),
  ('product_name', 'BIG DAY', 'branding', 'Name of the product/platform')
ON CONFLICT (key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
