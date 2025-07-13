/*
  # Foundation Schema Setup

  1. Core Tables
    - `groups` - For classes/sections/departments
    - `users` - Core user table with roles
    - `courses` - Courses with subtopics and teachers
    - `assessments` - Quizzes, exams, etc.

  2. Security
    - Enable RLS on all tables
    - Create policies for role-based access
    - Students see only their data
    - Teachers see their class data
    - Admins see all data

  3. Indexes
    - Add indexes on foreign keys for performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Groups table (for classes/sections/departments)
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('class', 'department')),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (core user table with roles)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  group_id UUID REFERENCES groups(id),
  admission_number TEXT UNIQUE, -- For students
  employee_id TEXT UNIQUE, -- For teachers/admin
  department TEXT,
  joining_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table (courses with subtopics and teachers)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  teacher_id UUID REFERENCES users(id),
  group_ids UUID[] DEFAULT '{}', -- Array of group IDs
  subtopics JSONB DEFAULT '[]'::JSONB, -- Array of {name: TEXT, description: TEXT}
  type TEXT CHECK (type IN ('theory', 'lab')) DEFAULT 'theory',
  semester INTEGER,
  academic_year TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessments table (quizzes, exams, etc.)
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('quiz', 'midterm', 'final', 'digital', 'assignment')) NOT NULL,
  weightage NUMERIC NOT NULL CHECK (weightage >= 0 AND weightage <= 1), -- 0.2 for 20%
  total_marks NUMERIC NOT NULL DEFAULT 100,
  subtopics_covered JSONB DEFAULT '[]'::JSONB, -- Links to course subtopics
  due_date TIMESTAMP,
  instructions TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_group_id ON users(group_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments(course_id);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "Groups are viewable by authenticated users"
  ON groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify groups"
  ON groups
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Teachers can view students in their groups"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    role = 'student' AND
    EXISTS (
      SELECT 1 FROM users teacher
      WHERE teacher.id = auth.uid()
      AND teacher.role = 'teacher'
      AND teacher.group_id = users.group_id
    )
  );

CREATE POLICY "Only admins can modify users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for courses
CREATE POLICY "Users can view courses they're associated with"
  ON courses
  FOR SELECT
  TO authenticated
  USING (
    -- Teachers can see their own courses
    teacher_id = auth.uid() OR
    -- Students can see courses for their group
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.group_id = ANY(courses.group_ids)
    ) OR
    -- Admins can see all courses
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Teachers can modify their courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for assessments
CREATE POLICY "Users can view assessments for their courses"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = assessments.course_id
      AND (
        -- Teachers can see assessments for their courses
        courses.teacher_id = auth.uid() OR
        -- Students can see assessments for their group courses
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.group_id = ANY(courses.group_ids)
        ) OR
        -- Admins can see all assessments
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Teachers can modify assessments for their courses"
  ON assessments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = assessments.course_id
      AND (
        courses.teacher_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role = 'admin'
        )
      )
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();