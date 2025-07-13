/*
  # Initial Database Schema

  1. New Tables
    - `users` - Core user table with roles
    - `courses` - Course information
    - `enrollments` - Student course enrollments
    - `grades` - Student assessment scores
    - `attendance` - Class attendance records
    - `comments` - Communication between users
    - `student_historic_data` - Historical performance data
  
  2. Security
    - Enable RLS on all tables
    - Add policies for proper data access
    - Create helper functions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE grade_type AS ENUM ('assignment', 'quiz', 'midterm', 'final');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE assignment_type AS ENUM ('homework', 'quiz', 'project', 'exam');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create handle_new_user function for auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, role, identifier, email)
  VALUES (
    NEW.id,
    CASE
      WHEN NEW.email LIKE '%admin%' THEN 'admin'::user_role
      WHEN NEW.email LIKE '%teacher%' THEN 'teacher'::user_role
      ELSE 'student'::user_role
    END,
    CASE
      WHEN NEW.email LIKE '%admin%' THEN 'A-' || substring(uuid_generate_v4()::text, 1, 6)
      WHEN NEW.email LIKE '%teacher%' THEN 'T-' || substring(uuid_generate_v4()::text, 1, 6)
      ELSE 'S-' || substring(uuid_generate_v4()::text, 1, 6)
    END,
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role user_role NOT NULL,
  identifier TEXT NOT NULL UNIQUE CHECK (
    (role = 'student' AND identifier ~ '^S-\d{6}$') OR
    (role = 'teacher' AND identifier ~ '^T-\d{6}$') OR
    (role = 'admin' AND identifier ~ '^A-\d{6}$')
  ),
  email TEXT NOT NULL UNIQUE,
  profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id TEXT NOT NULL UNIQUE CHECK (course_id ~ '^C-\d{4}$'),
  title TEXT NOT NULL,
  description TEXT,
  semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMPTZ DEFAULT now(),
  status enrollment_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Create grades table
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  type grade_type NOT NULL,
  score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  max_score NUMERIC(5,2) NOT NULL CHECK (max_score > 0),
  weight NUMERIC(5,2) NOT NULL CHECK (weight >= 0 AND weight <= 100),
  date TIMESTAMPTZ NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status DEFAULT 'absent',
  duration INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, course_id, date)
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create student_historic_data table
CREATE TABLE student_historic_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  year INT NOT NULL CHECK (year BETWEEN 2000 AND 2100),
  percentile NUMERIC(5,2) NOT NULL CHECK (percentile >= 0 AND percentile <= 100),
  cgpa NUMERIC(3,2) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
  strengths TEXT,
  weaknesses TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, year)
);

-- Create conversations table for AI bot
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  bot_type TEXT DEFAULT 'academic',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_size INT,
  file_type TEXT,
  resource_type TEXT CHECK (resource_type IN ('material', 'assignment', 'reference', 'video', 'link')),
  uploaded_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT true,
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  group_id UUID,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  message_type TEXT CHECK (message_type IN ('direct', 'announcement', 'reminder', 'alert')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('quiz', 'midterm', 'final', 'assignment')),
  due_date TIMESTAMPTZ,
  total_marks INT NOT NULL,
  weightage NUMERIC(5,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
  subtopics_covered JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create student_timetable view
CREATE OR REPLACE VIEW student_timetable AS
SELECT 
  c.id AS course_id,
  c.title AS course_name,
  u.id AS teacher_id,
  u.identifier AS teacher_name,
  a.id AS assessment_id,
  a.name AS assessment_name,
  a.type AS assessment_type,
  a.due_date,
  a.weightage,
  CASE
    WHEN a.due_date < NOW() THEN 'overdue'
    WHEN a.due_date < (NOW() + INTERVAL '7 days') THEN 'upcoming'
    ELSE 'future'
  END AS urgency_status
FROM 
  courses c
LEFT JOIN 
  assessments a ON c.id = a.course_id
LEFT JOIN 
  enrollments e ON c.id = e.course_id
LEFT JOIN 
  users u ON u.role = 'teacher'
WHERE 
  e.student_id = auth.uid() AND
  e.status = 'active' AND
  (a.id IS NULL OR a.status = 'published');

-- Create RPC functions for student features
CREATE OR REPLACE FUNCTION calculate_current_grade(stud_id UUID, crs_id UUID)
RETURNS TABLE (
  current_grade NUMERIC,
  completed_assessments INT,
  total_weightage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(g.score * a.weightage) / NULLIF(SUM(a.weightage), 0), 0) AS current_grade,
    COUNT(g.id)::INT AS completed_assessments,
    COALESCE(SUM(a.weightage), 0) AS total_weightage
  FROM
    grades g
  JOIN
    assessments a ON g.assessment_id = a.id
  WHERE
    g.student_id = stud_id AND
    a.course_id = crs_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION project_future_grade(stud_id UUID, crs_id UUID, assumed_performance NUMERIC DEFAULT 0.8)
RETURNS TABLE (
  current_grade NUMERIC,
  projected_grade NUMERIC,
  remaining_weightage NUMERIC,
  confidence_level TEXT
) AS $$
DECLARE
  current_result RECORD;
  remaining NUMERIC;
BEGIN
  -- Get current grade
  SELECT * INTO current_result FROM calculate_current_grade(stud_id, crs_id);
  
  -- Calculate remaining weightage
  SELECT
    COALESCE(SUM(weightage), 0) INTO remaining
  FROM
    assessments
  WHERE
    course_id = crs_id AND
    due_date > NOW() AND
    status = 'published';
  
  -- Calculate projected grade
  RETURN QUERY
  SELECT
    current_result.current_grade,
    current_result.current_grade + (remaining * assumed_performance),
    remaining,
    CASE
      WHEN remaining < 0.2 THEN 'high'
      WHEN remaining < 0.5 THEN 'medium'
      ELSE 'low'
    END AS confidence_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_attendance_warnings(stud_id UUID, threshold NUMERIC DEFAULT 0.75)
RETURNS TABLE (
  course_id UUID,
  course_name TEXT,
  total_classes INT,
  attended_classes INT,
  attendance_rate NUMERIC,
  classes_needed INT,
  is_at_risk BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH course_attendance AS (
    SELECT
      c.id,
      c.title,
      COUNT(a.id) AS total,
      COUNT(a.id) FILTER (WHERE a.status = 'present') AS attended
    FROM
      courses c
    JOIN
      enrollments e ON c.id = e.course_id
    LEFT JOIN
      attendance a ON c.id = a.course_id AND a.student_id = stud_id
    WHERE
      e.student_id = stud_id AND
      e.status = 'active'
    GROUP BY
      c.id, c.title
  )
  SELECT
    ca.id,
    ca.title,
    ca.total,
    ca.attended,
    CASE WHEN ca.total = 0 THEN 0 ELSE ca.attended::NUMERIC / ca.total END,
    GREATEST(CEIL(threshold * ca.total) - ca.attended, 0)::INT,
    CASE WHEN ca.total = 0 THEN false ELSE ca.attended::NUMERIC / ca.total < threshold END
  FROM
    course_attendance ca;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_subtopic_performance(stud_id UUID, crs_id UUID)
RETURNS TABLE (
  subtopic_name TEXT,
  average_score NUMERIC,
  assessment_count INT,
  trend TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH subtopic_scores AS (
    SELECT
      s.key AS subtopic,
      g.score,
      g.created_at,
      ROW_NUMBER() OVER (PARTITION BY s.key ORDER BY g.created_at) AS score_num
    FROM
      grades g
    JOIN
      assessments a ON g.assessment_id = a.id,
      jsonb_each(a.subtopics_covered) s
    WHERE
      g.student_id = stud_id AND
      a.course_id = crs_id
  ),
  subtopic_trends AS (
    SELECT
      subtopic,
      AVG(score) AS avg_score,
      COUNT(*) AS count,
      COALESCE(
        AVG(CASE WHEN score_num > COUNT(*) / 2 THEN score ELSE NULL END) -
        AVG(CASE WHEN score_num <= COUNT(*) / 2 THEN score ELSE NULL END),
        0
      ) AS trend_value
    FROM
      subtopic_scores
    GROUP BY
      subtopic
  )
  SELECT
    st.subtopic,
    st.avg_score,
    st.count::INT,
    CASE
      WHEN st.trend_value > 5 THEN 'improving'
      WHEN st.trend_value < -5 THEN 'declining'
      ELSE 'stable'
    END
  FROM
    subtopic_trends st;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC functions for teacher features
CREATE OR REPLACE FUNCTION get_pending_tasks(teacher_uuid UUID)
RETURNS TABLE (
  task_type TEXT,
  course_id UUID,
  course_name TEXT,
  title TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Ungraded assessments
  SELECT
    'grading' AS task_type,
    c.id AS course_id,
    c.title AS course_name,
    a.name AS title,
    a.due_date,
    CASE
      WHEN a.due_date < NOW() - INTERVAL '7 days' THEN 'high'
      WHEN a.due_date < NOW() THEN 'medium'
      ELSE 'low'
    END AS priority
  FROM
    assessments a
  JOIN
    courses c ON a.course_id = c.id
  WHERE
    c.id IN (SELECT course_id FROM courses WHERE teacher_id = teacher_uuid) AND
    a.status = 'published' AND
    a.due_date < NOW() AND
    NOT EXISTS (
      SELECT 1 FROM grades g
      WHERE g.assessment_id = a.id
    )
  
  UNION ALL
  
  -- Upcoming quizzes
  SELECT
    'quiz' AS task_type,
    c.id AS course_id,
    c.title AS course_name,
    a.name AS title,
    a.due_date,
    CASE
      WHEN a.due_date < NOW() + INTERVAL '1 day' THEN 'high'
      WHEN a.due_date < NOW() + INTERVAL '3 days' THEN 'medium'
      ELSE 'low'
    END AS priority
  FROM
    assessments a
  JOIN
    courses c ON a.course_id = c.id
  WHERE
    c.id IN (SELECT course_id FROM courses WHERE teacher_id = teacher_uuid) AND
    a.type = 'quiz' AND
    a.status = 'published' AND
    a.due_date > NOW() AND
    a.due_date < NOW() + INTERVAL '7 days'
  
  ORDER BY
    priority DESC,
    due_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_recent_submissions(teacher_uuid UUID)
RETURNS TABLE (
  student_id UUID,
  student_name TEXT,
  course_id UUID,
  course_name TEXT,
  assessment_id UUID,
  assessment_name TEXT,
  submitted_at TIMESTAMPTZ,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.student_id,
    u.identifier AS student_name,
    c.id AS course_id,
    c.title AS course_name,
    a.id AS assessment_id,
    a.name AS assessment_name,
    g.created_at AS submitted_at,
    CASE WHEN g.feedback IS NULL THEN 'pending' ELSE 'graded' END AS status
  FROM
    grades g
  JOIN
    assessments a ON g.assessment_id = a.id
  JOIN
    courses c ON a.course_id = c.id
  JOIN
    users u ON g.student_id = u.id
  WHERE
    c.id IN (SELECT course_id FROM courses WHERE teacher_id = teacher_uuid)
  ORDER BY
    g.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_class_performance(teacher_uuid UUID)
RETURNS TABLE (
  course_id UUID,
  course_name TEXT,
  average_score NUMERIC,
  attendance_rate NUMERIC,
  risk_students INT,
  top_performers INT
) AS $$
BEGIN
  RETURN QUERY
  WITH course_stats AS (
    SELECT
      c.id AS course_id,
      c.title AS course_name,
      -- Average score
      COALESCE(AVG(g.score), 0) AS avg_score,
      -- Attendance rate
      COALESCE(
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::NUMERIC / 
        NULLIF(COUNT(a.id), 0),
        0
      ) AS att_rate,
      -- Risk students (below 60%)
      COUNT(DISTINCT CASE WHEN g.score < 60 THEN g.student_id END) AS risk_count,
      -- Top performers (above 90%)
      COUNT(DISTINCT CASE WHEN g.score > 90 THEN g.student_id END) AS top_count
    FROM
      courses c
    LEFT JOIN
      grades g ON c.id = g.course_id
    LEFT JOIN
      attendance a ON c.id = a.course_id
    WHERE
      c.id IN (SELECT course_id FROM courses WHERE teacher_id = teacher_uuid)
    GROUP BY
      c.id, c.title
  )
  SELECT
    cs.course_id,
    cs.course_name,
    cs.avg_score,
    cs.att_rate,
    cs.risk_count,
    cs.top_count
  FROM
    course_stats cs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_course ON grades(course_id);
CREATE INDEX IF NOT EXISTS idx_grades_type ON grades(type);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

CREATE INDEX IF NOT EXISTS idx_comments_from ON comments(from_id);
CREATE INDEX IF NOT EXISTS idx_comments_to ON comments(to_id);
CREATE INDEX IF NOT EXISTS idx_comments_course ON comments(course_id);

CREATE INDEX IF NOT EXISTS idx_student_historic_data_student ON student_historic_data(student_id);
CREATE INDEX IF NOT EXISTS idx_student_historic_data_year ON student_historic_data(year);

CREATE INDEX IF NOT EXISTS idx_courses_course_id ON courses(course_id);

CREATE INDEX IF NOT EXISTS idx_users_identifier ON users(identifier);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_historic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users table policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Courses table policies
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Teachers and admins can manage courses" ON courses
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  ));

-- Enrollments table policies
CREATE POLICY "Students can view own enrollments" ON enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view course enrollments" ON enrollments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher'
  ));

CREATE POLICY "Admins can manage all enrollments" ON enrollments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Grades table policies
CREATE POLICY "Students can view own grades" ON grades
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage grades for their courses" ON grades
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher'
  ));

CREATE POLICY "Admins can manage all grades" ON grades
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Attendance table policies
CREATE POLICY "Students can view own attendance" ON attendance
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage attendance for their courses" ON attendance
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher'
  ));

CREATE POLICY "Admins can manage all attendance" ON attendance
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Comments table policies
CREATE POLICY "Users can view comments they sent or received" ON comments
  FOR SELECT USING (from_id = auth.uid() OR to_id = auth.uid());

CREATE POLICY "Teachers can create comments" ON comments
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher'
  ));

CREATE POLICY "Admins can manage all comments" ON comments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Student historic data policies
CREATE POLICY "Students can view own historic data" ON student_historic_data
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view their students' historic data" ON student_historic_data
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = student_historic_data.student_id
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'teacher'
    )
  ));

CREATE POLICY "Admins can manage all historic data" ON student_historic_data
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create update triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_historic_data_updated_at
  BEFORE UPDATE ON student_historic_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO courses (course_id, title, description, semester)
VALUES 
  ('C-1001', 'Introduction to Computer Science', 'Fundamentals of programming and computer science', 1),
  ('C-1002', 'Mathematics for Computer Science', 'Mathematical foundations for CS', 1),
  ('C-1003', 'Data Structures and Algorithms', 'Advanced data structures and algorithm design', 2);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('study-materials', 'Study Materials', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'Profile Images', true);

-- Set up storage policies
CREATE POLICY "Public can read study materials"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'study-materials');

CREATE POLICY "Authenticated users can upload study materials"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'study-materials' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can manage their own profile images"
  ON storage.objects
  USING (
    bucket_id = 'profile-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );