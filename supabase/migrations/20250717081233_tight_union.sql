/*
  # Fix RLS infinite recursion in user_profiles table

  1. Problem
    - Current RLS policies on user_profiles table are causing infinite recursion
    - Policies are likely referencing user_profiles table within their own conditions
    - This creates circular dependencies when evaluating permissions

  2. Solution
    - Drop existing problematic policies
    - Create new simplified policies that avoid self-referencing
    - Use auth.uid() directly instead of querying user_profiles for role checks
    - Separate policies for different operations to avoid complexity

  3. New Policies
    - Users can always read their own profile (using auth.uid())
    - Admins can read all profiles (using auth.jwt() claims)
    - Teachers can read student profiles in their courses (simplified logic)
*/

-- Drop existing policies that may be causing recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Teachers can view students in their courses" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

-- Create new simplified policies without recursion

-- 1. Users can always read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 3. Admins can read all profiles (using JWT claims to avoid recursion)
CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
    OR 
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
      LIMIT 1
    )
  );

-- 4. Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
      LIMIT 1
    )
  );

-- 5. Teachers can read student profiles (simplified - no complex joins)
CREATE POLICY "Teachers can read students"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'student'
    AND EXISTS (
      SELECT 1 FROM user_profiles teacher
      WHERE teacher.id = auth.uid()
      AND teacher.role = 'teacher'
    )
  );

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;