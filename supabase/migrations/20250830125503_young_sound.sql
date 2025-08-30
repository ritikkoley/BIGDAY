/*
  # Comprehensive Timetable Generation and Course Management System

  1. New Tables
    - `academic_terms` - Academic term/semester management
    - `groups` - Academic classes/sections with scheduling parameters
    - `courses` - Subject/course definitions with period requirements
    - `group_courses` - Bridge table for group-course-teacher assignments
    - `timetables` - Timetable versions and metadata
    - `timetable_sessions` - Individual scheduled sessions

  2. User Table Extensions
    - Add timetable-related fields to existing user_profiles table

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for role-based access

  4. Constraints and Indexes
    - Proper foreign key relationships
    - Unique constraints for business logic
    - Performance indexes for common queries
*/

-- Extend existing user_profiles table with timetable fields
DO $$
BEGIN
  -- Add group_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN group_id uuid;
  END IF;

  -- Add class_teacher_of if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'class_teacher_of'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN class_teacher_of uuid;
  END IF;

  -- Add timezone if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN timezone text DEFAULT 'Asia/Kolkata';
  END IF;

  -- Add max_daily_periods if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'max_daily_periods'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN max_daily_periods integer;
  END IF;

  -- Add availability_pref if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'availability_pref'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN availability_pref jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create academic_terms table
CREATE TABLE IF NOT EXISTS academic_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  frozen boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  academic_term_id uuid NOT NULL REFERENCES academic_terms(id),
  period_length_minutes integer DEFAULT 45,
  days_per_week integer DEFAULT 6,
  periods_per_day integer DEFAULT 8,
  max_daily_periods integer DEFAULT 7,
  lab_block_size integer DEFAULT 2,
  business_hours jsonb DEFAULT '{}'::jsonb,
  holiday_calendar jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  weekly_theory_periods integer DEFAULT 0,
  weekly_lab_periods integer DEFAULT 0,
  lab_block_size integer DEFAULT 2,
  constraints jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_courses bridge table
CREATE TABLE IF NOT EXISTS group_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES user_profiles(id),
  weekly_theory_periods integer,
  weekly_lab_periods integer,
  lab_block_size integer,
  priority integer DEFAULT 5,
  effective_from date DEFAULT CURRENT_DATE,
  effective_to date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(group_id, course_id, effective_from)
);

-- Create timetables table
CREATE TABLE IF NOT EXISTS timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES academic_terms(id),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version integer DEFAULT 1,
  generated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  published_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create timetable_sessions table
CREATE TABLE IF NOT EXISTS timetable_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timetable_id uuid NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES groups(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  teacher_id uuid REFERENCES user_profiles(id),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  period_start_index integer NOT NULL CHECK (period_start_index >= 0),
  duration_periods integer DEFAULT 1 CHECK (duration_periods > 0),
  type text DEFAULT 'theory' CHECK (type IN ('theory', 'lab')),
  locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints for user_profiles extensions
DO $$
BEGIN
  -- Add group_id foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'user_profiles_group_id_fkey'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_group_id_fkey 
    FOREIGN KEY (group_id) REFERENCES groups(id);
  END IF;

  -- Add class_teacher_of foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'user_profiles_class_teacher_of_fkey'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_class_teacher_of_fkey 
    FOREIGN KEY (class_teacher_of) REFERENCES groups(id);
  END IF;

  -- Add teacher role constraint for group_courses
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_courses_teacher_role_check'
  ) THEN
    ALTER TABLE group_courses ADD CONSTRAINT group_courses_teacher_role_check 
    CHECK (teacher_id IS NULL OR EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = teacher_id AND role = 'teacher'
    ));
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_groups_academic_term ON groups(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_group_courses_group ON group_courses(group_id);
CREATE INDEX IF NOT EXISTS idx_group_courses_course ON group_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_group_courses_teacher ON group_courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetables_group_term ON timetables(group_id, academic_term_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_timetable ON timetable_sessions(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_schedule ON timetable_sessions(day_of_week, period_start_index);
CREATE INDEX IF NOT EXISTS idx_user_profiles_group ON user_profiles(group_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_class_teacher ON user_profiles(class_teacher_of);

-- Enable Row Level Security
ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for academic_terms
CREATE POLICY "Admins can manage academic terms"
  ON academic_terms
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers and students can view academic terms"
  ON academic_terms
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for groups
CREATE POLICY "Admins can manage groups"
  ON groups
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view groups they teach"
  ON groups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM group_courses gc
      JOIN user_profiles up ON gc.teacher_id = up.id
      WHERE gc.group_id = groups.id AND up.id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND group_id = groups.id
    )
  );

-- RLS Policies for courses
CREATE POLICY "Admins can manage courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers and students can view courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for group_courses
CREATE POLICY "Admins can manage group courses"
  ON group_courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view their assignments"
  ON group_courses
  FOR SELECT
  TO authenticated
  USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for timetables
CREATE POLICY "Admins can manage timetables"
  ON timetables
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view published timetables for their groups"
  ON timetables
  FOR SELECT
  TO authenticated
  USING (
    status = 'published' AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND group_id = timetables.group_id
      ) OR
      EXISTS (
        SELECT 1 FROM group_courses gc
        WHERE gc.group_id = timetables.group_id AND gc.teacher_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- RLS Policies for timetable_sessions
CREATE POLICY "Admins can manage timetable sessions"
  ON timetable_sessions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view sessions for their timetables"
  ON timetable_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM timetables t
      WHERE t.id = timetable_sessions.timetable_id AND t.status = 'published' AND (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND group_id = t.group_id
        ) OR
        EXISTS (
          SELECT 1 FROM group_courses gc
          WHERE gc.group_id = t.group_id AND gc.teacher_id = auth.uid()
        ) OR
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_academic_terms_updated_at
  BEFORE UPDATE ON academic_terms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_courses_updated_at
  BEFORE UPDATE ON group_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timetables_updated_at
  BEFORE UPDATE ON timetables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timetable_sessions_updated_at
  BEFORE UPDATE ON timetable_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO academic_terms (name, start_date, end_date) VALUES
('2025 Term 1', '2025-01-15', '2025-05-30'),
('2025 Term 2', '2025-06-15', '2025-10-30'),
('2025 Term 3', '2025-11-15', '2026-03-30')
ON CONFLICT DO NOTHING;

-- Insert sample groups
INSERT INTO groups (name, academic_term_id, period_length_minutes, days_per_week, periods_per_day, max_daily_periods, lab_block_size, business_hours) 
SELECT 
  'Grade 10 - A',
  (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1),
  45,
  6,
  8,
  7,
  2,
  '{"monday": [0,1,2,3,4,5,6,7], "tuesday": [0,1,2,3,4,5,6,7], "wednesday": [0,1,2,3,4,5,6,7], "thursday": [0,1,2,3,4,5,6,7], "friday": [0,1,2,3,4,5,6,7], "saturday": [0,1,2,3,4,5,6,7]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM groups WHERE name = 'Grade 10 - A');

INSERT INTO groups (name, academic_term_id, period_length_minutes, days_per_week, periods_per_day, max_daily_periods, lab_block_size, business_hours) 
SELECT 
  'Grade 10 - B',
  (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1),
  45,
  6,
  8,
  7,
  2,
  '{"monday": [0,1,2,3,4,5,6,7], "tuesday": [0,1,2,3,4,5,6,7], "wednesday": [0,1,2,3,4,5,6,7], "thursday": [0,1,2,3,4,5,6,7], "friday": [0,1,2,3,4,5,6,7], "saturday": [0,1,2,3,4,5,6,7]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM groups WHERE name = 'Grade 10 - B');

-- Insert sample courses
INSERT INTO courses (code, title, description, weekly_theory_periods, weekly_lab_periods, lab_block_size) VALUES
('MATH101', 'Mathematics', 'Advanced Mathematics for Grade 10', 5, 0, 1),
('SCI101', 'Science', 'Integrated Science with Lab Work', 3, 2, 2),
('ENG101', 'English', 'English Language and Literature', 4, 0, 1),
('HIN101', 'Hindi', 'Hindi Language and Literature', 3, 0, 1),
('SS101', 'Social Studies', 'History, Geography, and Civics', 3, 0, 1),
('CS101', 'Computer Science', 'Programming and Computer Applications', 2, 2, 2),
('PE101', 'Physical Education', 'Sports and Physical Fitness', 2, 0, 1),
('ART101', 'Arts', 'Drawing and Creative Arts', 1, 1, 2)
ON CONFLICT (code) DO NOTHING;