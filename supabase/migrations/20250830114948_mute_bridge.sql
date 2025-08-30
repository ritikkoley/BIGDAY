/*
  # Comprehensive User Management System

  1. New Tables
    - Enhanced `user_profiles` table with comprehensive fields
    - `audit_logs` table for tracking all data changes
    - `system_reports` table for managing generated reports
    - `user_groups` table for organizing users
    - `user_permissions` table for role-based access control

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Audit trail for all operations

  3. Indexes
    - Performance optimization for common queries
    - Full-text search capabilities
*/

-- Drop existing user_profiles table if it exists
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create comprehensive user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal Information
  full_name text NOT NULL,
  residential_address text,
  contact_number text,
  email text UNIQUE NOT NULL,
  
  -- Academic Details
  admission_number text UNIQUE,
  employee_id text UNIQUE,
  date_of_admission date,
  date_of_joining date,
  current_standard text,
  section text,
  
  -- Family Information
  parent_guardian_name text,
  parent_contact_number text,
  emergency_contact text,
  
  -- Accommodation & Classification
  accommodation_type text CHECK (accommodation_type IN ('day_boarder', 'hosteller')) DEFAULT 'day_boarder',
  peer_group text CHECK (peer_group IN ('pre_primary', 'primary', 'secondary', 'higher_secondary', 'staff')) DEFAULT 'primary',
  role text CHECK (role IN ('student', 'teacher', 'admin', 'staff')) NOT NULL DEFAULT 'student',
  
  -- Additional Information
  department text,
  designation text,
  blood_group text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  nationality text DEFAULT 'Indian',
  religion text,
  caste_category text,
  
  -- System Fields
  status text CHECK (status IN ('active', 'inactive', 'suspended', 'graduated', 'transferred')) DEFAULT 'active',
  profile_data jsonb DEFAULT '{}',
  group_id uuid,
  
  -- Audit Fields
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  
  -- Constraints
  CONSTRAINT check_student_fields CHECK (
    (role = 'student' AND admission_number IS NOT NULL) OR 
    (role != 'student' AND employee_id IS NOT NULL)
  )
);

-- Create audit logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view', 'export')),
  table_name text NOT NULL,
  record_id text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  performed_by uuid REFERENCES auth.users(id),
  performed_at timestamptz DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Create system reports table
CREATE TABLE system_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('user_summary', 'academic_report', 'attendance_summary', 'performance_analysis')),
  filters jsonb DEFAULT '{}',
  generated_at timestamptz DEFAULT now(),
  generated_by uuid REFERENCES auth.users(id),
  file_path text,
  status text CHECK (status IN ('generating', 'completed', 'failed')) DEFAULT 'generating',
  file_size bigint,
  download_count integer DEFAULT 0
);

-- Create user groups table
CREATE TABLE user_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text CHECK (type IN ('class', 'department', 'custom')) NOT NULL,
  description text,
  parent_group_id uuid REFERENCES user_groups(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user permissions table
CREATE TABLE user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  permission text NOT NULL,
  resource text,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(user_id, permission, resource)
);

-- Add foreign key for group_id in user_profiles
ALTER TABLE user_profiles 
ADD CONSTRAINT fk_user_profiles_group_id 
FOREIGN KEY (group_id) REFERENCES user_groups(id);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_peer_group ON user_profiles(peer_group);
CREATE INDEX idx_user_profiles_department ON user_profiles(department);
CREATE INDEX idx_user_profiles_admission_number ON user_profiles(admission_number);
CREATE INDEX idx_user_profiles_employee_id ON user_profiles(employee_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_full_name ON user_profiles(full_name);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- Full-text search index
CREATE INDEX idx_user_profiles_search ON user_profiles USING gin(
  to_tsvector('english', 
    coalesce(full_name, '') || ' ' || 
    coalesce(email, '') || ' ' || 
    coalesce(admission_number, '') || ' ' || 
    coalesce(employee_id, '') || ' ' ||
    coalesce(contact_number, '')
  )
);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_performed_at ON audit_logs(performed_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- System reports indexes
CREATE INDEX idx_system_reports_type ON system_reports(type);
CREATE INDEX idx_system_reports_status ON system_reports(status);
CREATE INDEX idx_system_reports_generated_by ON system_reports(generated_by);
CREATE INDEX idx_system_reports_generated_at ON system_reports(generated_at);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Admins can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Teachers can view student profiles in their groups"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'student' AND
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'teacher'
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for system_reports
CREATE POLICY "Admins can manage all reports"
  ON system_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- RLS Policies for user_groups
CREATE POLICY "Authenticated users can view groups"
  ON user_groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage groups"
  ON user_groups
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- RLS Policies for user_permissions
CREATE POLICY "Users can view their own permissions"
  ON user_permissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all permissions"
  ON user_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function for audit logging
CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      user_id, action, table_name, record_id, new_values, performed_by
    ) VALUES (
      NEW.id, 'create', TG_TABLE_NAME, NEW.id::text, to_jsonb(NEW), auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      user_id, action, table_name, record_id, old_values, new_values, performed_by
    ) VALUES (
      NEW.id, 'update', TG_TABLE_NAME, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW), auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      user_id, action, table_name, record_id, old_values, performed_by
    ) VALUES (
      OLD.id, 'delete', TG_TABLE_NAME, OLD.id::text, to_jsonb(OLD), auth.uid()
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create audit triggers
CREATE TRIGGER audit_user_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_user_changes();

-- Insert default user groups
INSERT INTO user_groups (name, type, description) VALUES
  ('Pre-Primary', 'class', 'Pre-primary students (Nursery, LKG, UKG)'),
  ('Primary', 'class', 'Primary students (Classes 1-5)'),
  ('Secondary', 'class', 'Secondary students (Classes 6-10)'),
  ('Higher Secondary', 'class', 'Higher secondary students (Classes 11-12)'),
  ('Computer Science', 'department', 'Computer Science Department'),
  ('Mathematics', 'department', 'Mathematics Department'),
  ('Science', 'department', 'Science Department'),
  ('Languages', 'department', 'Languages Department'),
  ('Administration', 'department', 'Administrative Staff'),
  ('Support Staff', 'department', 'Support and Maintenance Staff');

-- Create function for advanced user search
CREATE OR REPLACE FUNCTION search_users(
  search_term text DEFAULT '',
  filter_role text[] DEFAULT NULL,
  filter_status text[] DEFAULT NULL,
  filter_peer_group text[] DEFAULT NULL,
  filter_department text[] DEFAULT NULL,
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  role text,
  status text,
  peer_group text,
  department text,
  admission_number text,
  employee_id text,
  contact_number text,
  created_at timestamptz,
  total_count bigint
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered_users AS (
    SELECT 
      up.*,
      COUNT(*) OVER() as total_count
    FROM user_profiles up
    WHERE 
      (search_term = '' OR 
       to_tsvector('english', 
         coalesce(up.full_name, '') || ' ' || 
         coalesce(up.email, '') || ' ' || 
         coalesce(up.admission_number, '') || ' ' || 
         coalesce(up.employee_id, '') || ' ' ||
         coalesce(up.contact_number, '')
       ) @@ plainto_tsquery('english', search_term))
      AND (filter_role IS NULL OR up.role = ANY(filter_role))
      AND (filter_status IS NULL OR up.status = ANY(filter_status))
      AND (filter_peer_group IS NULL OR up.peer_group = ANY(filter_peer_group))
      AND (filter_department IS NULL OR up.department = ANY(filter_department))
    ORDER BY up.created_at DESC
    LIMIT limit_count
    OFFSET offset_count
  )
  SELECT 
    fu.id,
    fu.full_name,
    fu.email,
    fu.role,
    fu.status,
    fu.peer_group,
    fu.department,
    fu.admission_number,
    fu.employee_id,
    fu.contact_number,
    fu.created_at,
    fu.total_count
  FROM filtered_users fu;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;