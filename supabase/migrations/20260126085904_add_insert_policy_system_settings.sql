/*
  # Add INSERT policy for system_settings

  This migration adds an INSERT policy for admins and operations staff
  to allow upsert operations on the system_settings table.

  ## Changes
  - Add INSERT policy for admins and operations staff
*/

DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can insert settings" ON system_settings;
END $$;

CREATE POLICY "Admins can insert settings"
  ON system_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );
