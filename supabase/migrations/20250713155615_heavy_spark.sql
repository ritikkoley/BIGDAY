/*
  # Synchronize with original approach

  1. Schema Updates
     - Align table structures with original approach
     - Add missing tables and constraints
     - Update enums and check constraints
  
  2. Security
     - Implement consistent RLS policies
     - Ensure proper access control for all roles
  
  3. Functions and Views
     - Add missing RPC functions
     - Create/update views for timetable and dashboards
     - Implement grade calculation and projection functions
*/

-- Drop existing tables if needed (comment out if you want to preserve data)
-- DROP TABLE IF EXISTS conversations;
-- DROP TABLE IF EXISTS resources;
-- DROP TABLE IF EXISTS messages;
-- DROP TABLE IF EXISTS attendance;
-- DROP TABLE IF EXISTS grades;
-- DROP TABLE IF EXISTS assessments;
-- DROP TABLE IF EXISTS courses;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS groups;

-- Drop existing types if needed
-- DROP TYPE IF EXISTS user_role;
-- DROP TYPE IF EXISTS enrollment_status;
-- DROP TYPE IF EXISTS attendance_status;
-- DROP TYPE IF EXISTS grade_type;
-- DROP TYPE IF EXISTS assignment_type;

-- Create or update types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollment_status') THEN
        CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grade_type') THEN
        CREATE TYPE grade_type AS ENUM ('assignment', 'quiz', 'midterm', 'final');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assignment_type') THEN
        CREATE TYPE assignment_type AS ENUM ('homework', 'quiz', 'project', 'exam');
    END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
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
  INSERT INTO users (id, role, identifier, email, profile_data)
  VALUES (
    NEW.id,
    CASE
      WHEN NEW.email LIKE '%@admin.%' THEN 'admin'::user_role
      WHEN NEW.email LIKE '%@teacher.%' THEN 'teacher'::user_role
      ELSE 'student'::user_role
    END,
    CASE
      WHEN NEW.email LIKE '%@admin.%' THEN 'A-' || substring(md5(NEW.email) from 1 for 6)
      WHEN NEW.email LIKE '%@teacher.%' THEN 'T-' || substring(md5(NEW.email) from 1 for 6)
      ELSE 'S-' || substring(md5(NEW.email) from 1 for 6)
    END,
    NEW.email,
    jsonb_build_object(
      'name', coalesce(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      'avatar_url', NEW.raw_user_meta_data->>'avatar_url'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  role user_role NOT NULL,
  identifier text NOT NULL UNIQUE CHECK (
    (role = 'student' AND identifier ~ '^S-\d{6}$') OR
    (role = 'teacher' AND identifier ~ '^T-\d{6}$') OR
    (role = 'admin' AND identifier ~ '^A-\d{6}$')
  ),
  email text NOT NULL UNIQUE,
  profile_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id text NOT NULL UNIQUE CHECK (course_id ~ '^C-\d{4}$'),
  title text NOT NULL,
  description text,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enrollments table if it doesn't exist
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date timestamptz DEFAULT now(),
  status enrollment_status DEFAULT 'active'::enrollment_status,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Create attendance table if it doesn't exist
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  date date NOT NULL,
  status attendance_status DEFAULT 'absent'::attendance_status NOT NULL,
  duration integer NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id, date)
);

-- Create grades table if it doesn't exist
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  type grade_type NOT NULL,
  score numeric(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  max_score numeric(5,2) NOT NULL CHECK (max_score > 0),
  weight numeric(5,2) NOT NULL CHECK (weight >= 0 AND weight <= 100),
  date timestamptz NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_id uuid REFERENCES users(id) ON DELETE CASCADE,
  to_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create student_historic_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS student_historic_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  year integer NOT NULL CHECK (year >= 2000 AND year <= 2100),
  percentile numeric(5,2) NOT NULL CHECK (percentile >= 0 AND percentile <= 100),
  cgpa numeric(3,2) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
  strengths text,
  weaknesses text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, year)
);

-- Create resources table if it doesn't exist
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_path text,
  file_type text,
  file_size integer,
  uploaded_by uuid REFERENCES users(id),
  is_public boolean DEFAULT true,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  priority text DEFAULT 'normal',
  message_type text DEFAULT 'direct',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create conversations table for AI bot if it doesn't exist
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text,
  bot_type text DEFAULT 'academic',
  created_at timestamptz DEFAULT now()
);

-- Create assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  due_date timestamptz,
  total_marks integer NOT NULL,
  weightage numeric(5,2) NOT NULL,
  status text DEFAULT 'draft',
  subtopics_covered jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create student_timetable view
CREATE OR REPLACE VIEW student_timetable AS
SELECT 
  c.id AS course_id,
  c.title AS course_name,
  u.id AS teacher_id,
  u.profile_data->>'name' AS teacher_name,
  a.id AS assessment_id,
  a.title AS assessment_name,
  a.type AS assessment_type,
  a.due_date,
  a.weightage,
  CASE
    WHEN a.due_date < now() THEN 'overdue'
    WHEN a.due_date < now() + interval '7 days' THEN 'upcoming'
    ELSE 'future'
  END AS urgency_status
FROM 
  courses c
LEFT JOIN 
  assessments a ON c.id = a.course_id
LEFT JOIN 
  enrollments e ON c.id = e.course_id
LEFT JOIN 
  users u ON u.id = (SELECT id FROM users WHERE role = 'teacher' LIMIT 1)
WHERE 
  e.student_id = auth.uid() AND e.status = 'active'
ORDER BY 
  a.due_date ASC NULLS LAST;

-- Create teacher_schedule view
CREATE OR REPLACE VIEW teacher_schedule AS
SELECT 
  c.id AS course_id,
  c.title AS course_name,
  c.semester,
  COUNT(DISTINCT e.student_id) AS student_count,
  EXISTS (
    SELECT 1 FROM assessments a 
    WHERE a.course_id = c.id 
    AND a.type = 'quiz' 
    AND a.due_date::date = CURRENT_DATE
  ) AS has_quiz_today,
  COALESCE(
    (SELECT COUNT(DISTINCT a.student_id)::float / NULLIF(COUNT(DISTINCT e.student_id), 0) * 100
     FROM attendance a
     WHERE a.course_id = c.id
     AND a.status = 'present'
     AND a.date > CURRENT_DATE - interval '30 days'),
    0
  ) AS attendance_rate
FROM 
  courses c
LEFT JOIN 
  enrollments e ON c.id = e.course_id
WHERE 
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'teacher'
  )
GROUP BY 
  c.id, c.title, c.semester;

-- Create calculate_current_grade function
CREATE OR REPLACE FUNCTION calculate_current_grade(stud_id uuid, crs_id uuid)
RETURNS TABLE (
  current_grade numeric,
  completed_assessments integer,
  total_weightage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(g.score * g.weight / g.max_score), 0) AS current_grade,
    COUNT(g.id)::integer AS completed_assessments,
    COALESCE(SUM(g.weight), 0) AS total_weightage
  FROM
    grades g
  WHERE
    g.student_id = stud_id
    AND g.course_id = crs_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create get_attendance_warnings function
CREATE OR REPLACE FUNCTION get_attendance_warnings(stud_id uuid, threshold float DEFAULT 0.75)
RETURNS TABLE (
  course_id uuid,
  course_name text,
  total_classes integer,
  attended_classes integer,
  attendance_rate float,
  classes_needed integer,
  is_at_risk boolean
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
      e.student_id = stud_id
    GROUP BY
      c.id, c.title
  )
  SELECT
    ca.id,
    ca.title,
    ca.total,
    ca.attended,
    CASE WHEN ca.total = 0 THEN 0 ELSE ca.attended::float / ca.total END,
    GREATEST(0, CEIL(threshold * ca.total) - ca.attended)::integer,
    CASE WHEN ca.total = 0 THEN false ELSE ca.attended::float / ca.total < threshold END
  FROM
    course_attendance ca;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create get_subtopic_performance function
CREATE OR REPLACE FUNCTION get_subtopic_performance(stud_id uuid, crs_id uuid)
RETURNS TABLE (
  subtopic_name text,
  average_score numeric,
  assessment_count integer,
  trend text
) AS $$
BEGIN
  RETURN QUERY
  WITH subtopic_scores AS (
    SELECT
      s.key AS subtopic,
      g.score,
      g.date,
      ROW_NUMBER() OVER (PARTITION BY s.key ORDER BY g.date) AS score_num
    FROM
      grades g,
      jsonb_each(g.subtopic_performance) s
    WHERE
      g.student_id = stud_id
      AND g.course_id = crs_id
  ),
  subtopic_trends AS (
    SELECT
      subtopic,
      AVG(score) AS avg_score,
      COUNT(*) AS count,
      COALESCE(
        AVG(CASE WHEN score_num > 1 THEN score - LAG(score) OVER (PARTITION BY subtopic ORDER BY date) END),
        0
      ) AS avg_change
    FROM
      subtopic_scores
    GROUP BY
      subtopic
  )
  SELECT
    st.subtopic,
    st.avg_score,
    st.count::integer,
    CASE
      WHEN st.avg_change > 1 THEN 'improving'
      WHEN st.avg_change < -1 THEN 'declining'
      ELSE 'stable'
    END
  FROM
    subtopic_trends st;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create get_pending_tasks function
CREATE OR REPLACE FUNCTION get_pending_tasks(teacher_uuid uuid)
RETURNS TABLE (
  task_type text,
  course_id uuid,
  course_name text,
  title text,
  due_date text,
  priority text
) AS $$
BEGIN
  RETURN QUERY
  -- Ungraded assessments
  SELECT
    'grading' AS task_type,
    c.id AS course_id,
    c.title AS course_name,
    a.title,
    a.due_date::text,
    CASE
      WHEN a.due_date < now() - interval '7 days' THEN 'high'
      WHEN a.due_date < now() THEN 'medium'
      ELSE 'low'
    END AS priority
  FROM
    assessments a
  JOIN
    courses c ON a.course_id = c.id
  WHERE
    a.due_date < now()
    AND NOT EXISTS (
      SELECT 1 FROM grades g
      WHERE g.course_id = c.id
      AND g.date::date = a.due_date::date
    )
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = teacher_uuid
      AND u.role = 'teacher'
    )
  
  UNION ALL
  
  -- Missing attendance
  SELECT
    'attendance' AS task_type,
    c.id AS course_id,
    c.title AS course_name,
    'Take attendance for ' || to_char(CURRENT_DATE, 'Mon DD') AS title,
    CURRENT_DATE::text AS due_date,
    'medium' AS priority
  FROM
    courses c
  WHERE
    NOT EXISTS (
      SELECT 1 FROM attendance a
      WHERE a.course_id = c.id
      AND a.date = CURRENT_DATE
    )
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = teacher_uuid
      AND u.role = 'teacher'
    )
  
  UNION ALL
  
  -- Upcoming quizzes
  SELECT
    'quiz' AS task_type,
    c.id AS course_id,
    c.title AS course_name,
    a.title,
    a.due_date::text,
    CASE
      WHEN a.due_date < now() + interval '1 day' THEN 'high'
      WHEN a.due_date < now() + interval '3 days' THEN 'medium'
      ELSE 'low'
    END AS priority
  FROM
    assessments a
  JOIN
    courses c ON a.course_id = c.id
  WHERE
    a.type = 'quiz'
    AND a.due_date > now()
    AND a.due_date < now() + interval '7 days'
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = teacher_uuid
      AND u.role = 'teacher'
    )
  ORDER BY
    priority DESC, due_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create get_recent_submissions function
CREATE OR REPLACE FUNCTION get_recent_submissions(teacher_uuid uuid)
RETURNS TABLE (
  student_id uuid,
  student_name text,
  course_id uuid,
  course_name text,
  assessment_id uuid,
  assessment_name text,
  submitted_at text,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id AS student_id,
    u.profile_data->>'name' AS student_name,
    c.id AS course_id,
    c.title AS course_name,
    a.id AS assessment_id,
    a.title AS assessment_name,
    g.created_at::text AS submitted_at,
    CASE WHEN g.feedback IS NOT NULL THEN 'graded' ELSE 'pending' END AS status
  FROM
    grades g
  JOIN
    users u ON g.student_id = u.id
  JOIN
    courses c ON g.course_id = c.id
  JOIN
    assessments a ON a.id = g.id
  WHERE
    EXISTS (
      SELECT 1 FROM users t
      WHERE t.id = teacher_uuid
      AND t.role = 'teacher'
    )
  ORDER BY
    g.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create get_class_performance function
CREATE OR REPLACE FUNCTION get_class_performance(teacher_uuid uuid)
RETURNS TABLE (
  course_id uuid,
  course_name text,
  average_score numeric,
  attendance_rate numeric,
  risk_students integer,
  top_performers integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS course_id,
    c.title AS course_name,
    COALESCE(AVG(g.score), 0) AS average_score,
    COALESCE(
      (SELECT COUNT(DISTINCT a.student_id)::float / NULLIF(COUNT(DISTINCT e.student_id), 0) * 100
       FROM attendance a
       JOIN enrollments e ON e.course_id = c.id
       WHERE a.course_id = c.id
       AND a.status = 'present'
       AND a.date > CURRENT_DATE - interval '30 days'),
      0
    ) AS attendance_rate,
    COUNT(DISTINCT e.student_id) FILTER (
      WHERE (SELECT AVG(g2.score) FROM grades g2 WHERE g2.student_id = e.student_id AND g2.course_id = c.id) < 60
    ) AS risk_students,
    COUNT(DISTINCT e.student_id) FILTER (
      WHERE (SELECT AVG(g2.score) FROM grades g2 WHERE g2.student_id = e.student_id AND g2.course_id = c.id) >= 90
    ) AS top_performers
  FROM
    courses c
  LEFT JOIN
    enrollments e ON c.id = e.course_id
  LEFT JOIN
    grades g ON g.student_id = e.student_id AND g.course_id = c.id
  WHERE
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = teacher_uuid
      AND u.role = 'teacher'
    )
  GROUP BY
    c.id, c.title;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up RLS policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_historic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

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

-- Comments table policies
CREATE POLICY "Users can view comments they sent or received" ON comments
  FOR SELECT USING ((from_id = auth.uid()) OR (to_id = auth.uid()));

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

-- Resources table policies
CREATE POLICY "Anyone can view public resources" ON resources
  FOR SELECT USING (is_public = true);

CREATE POLICY "Teachers can manage resources" ON resources
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher'
  ));

CREATE POLICY "Admins can manage all resources" ON resources
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Messages table policies
CREATE POLICY "Users can view messages they sent or received" ON messages
  FOR SELECT USING ((sender_id = auth.uid()) OR (recipient_id = auth.uid()));

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Admins can manage all messages" ON messages
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Conversations table policies
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all conversations" ON conversations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Assessments table policies
CREATE POLICY "Anyone can view assessments" ON assessments
  FOR SELECT USING (true);

CREATE POLICY "Teachers can manage assessments" ON assessments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher'
  ));

CREATE POLICY "Admins can manage all assessments" ON assessments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_identifier ON users(identifier);

CREATE INDEX IF NOT EXISTS idx_courses_course_id ON courses(course_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_course ON grades(course_id);
CREATE INDEX IF NOT EXISTS idx_grades_type ON grades(type);

CREATE INDEX IF NOT EXISTS idx_comments_from ON comments(from_id);
CREATE INDEX IF NOT EXISTS idx_comments_to ON comments(to_id);
CREATE INDEX IF NOT EXISTS idx_comments_course ON comments(course_id);

CREATE INDEX IF NOT EXISTS idx_student_historic_data_student ON student_historic_data(student_id);
CREATE INDEX IF NOT EXISTS idx_student_historic_data_year ON student_historic_data(year);

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON enrollments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
BEFORE UPDATE ON attendance
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
BEFORE UPDATE ON grades
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_historic_data_updated_at
BEFORE UPDATE ON student_historic_data
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create auth trigger for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample data for testing (optional)
-- Uncomment and modify as needed
/*
INSERT INTO courses (course_id, title, description, semester)
VALUES 
  ('C-1001', 'Introduction to Computer Science', 'Fundamentals of programming and computer science', 1),
  ('C-1002', 'Data Structures and Algorithms', 'Advanced data structures and algorithm analysis', 2),
  ('C-1003', 'Database Systems', 'Relational database design and SQL', 3);
*/