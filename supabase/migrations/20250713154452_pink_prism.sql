/*
  # Fresh Start Schema

  1. Schema Setup
    - Drop existing tables and functions (if any)
    - Create enums and types
    - Create tables with proper constraints
    - Create functions and triggers
    - Set up Row Level Security (RLS)
    - Create views for analytics

  2. Security
    - Enable RLS on all tables
    - Create policies for students, teachers, and admins
*/

-- Clean up existing schema if needed (optional, comment out if not needed)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user role enum
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- Create enrollment status enum
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');

-- Create attendance status enum
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');

-- Create grade type enum
CREATE TYPE grade_type AS ENUM ('assignment', 'quiz', 'midterm', 'final');

-- Create assignment type enum
CREATE TYPE assignment_type AS ENUM ('homework', 'quiz', 'project', 'exam');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role user_role NOT NULL,
  identifier TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  profile_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT users_identifier_check CHECK (
    (role = 'student' AND identifier ~ '^S-\d{6}$') OR
    (role = 'teacher' AND identifier ~ '^T-\d{6}$') OR
    (role = 'admin' AND identifier ~ '^A-\d{6}$')
  )
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_identifier ON users(identifier);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  semester INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT courses_course_id_check CHECK (course_id ~ '^C-\d{4}$'),
  CONSTRAINT courses_semester_check CHECK (semester >= 1 AND semester <= 8)
);

CREATE INDEX idx_courses_course_id ON courses(course_id);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMPTZ DEFAULT now(),
  status enrollment_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  type grade_type NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT grades_score_check CHECK (score >= 0 AND score <= 100),
  CONSTRAINT grades_max_score_check CHECK (max_score > 0),
  CONSTRAINT grades_weight_check CHECK (weight >= 0 AND weight <= 100)
);

CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_course ON grades(course_id);
CREATE INDEX idx_grades_type ON grades(type);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status DEFAULT 'absent',
  duration INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, course_id, date)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_course ON attendance(course_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_from ON comments(from_id);
CREATE INDEX idx_comments_to ON comments(to_id);
CREATE INDEX idx_comments_course ON comments(course_id);

-- Create student historic data table
CREATE TABLE IF NOT EXISTS student_historic_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  percentile NUMERIC(5,2) NOT NULL,
  cgpa NUMERIC(3,2) NOT NULL,
  strengths TEXT,
  weaknesses TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, year),
  CONSTRAINT student_historic_data_year_check CHECK (year >= 2000 AND year <= 2100),
  CONSTRAINT student_historic_data_percentile_check CHECK (percentile >= 0 AND percentile <= 100),
  CONSTRAINT student_historic_data_cgpa_check CHECK (cgpa >= 0 AND cgpa <= 10)
);

CREATE INDEX idx_student_historic_data_student ON student_historic_data(student_id);
CREATE INDEX idx_student_historic_data_year ON student_historic_data(year);

-- Create conversations table for AI bot
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  bot_type TEXT DEFAULT 'academic',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_conversations_user ON conversations(user_id);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_size BIGINT,
  file_type TEXT,
  resource_type TEXT DEFAULT 'document',
  uploaded_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_resources_course ON resources(course_id);
CREATE INDEX idx_resources_uploaded_by ON resources(uploaded_by);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id),
  group_id UUID,
  course_id UUID REFERENCES courses(id),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  message_type TEXT DEFAULT 'direct',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_course ON messages(course_id);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  total_marks INTEGER NOT NULL,
  weightage NUMERIC(5,2) NOT NULL,
  status TEXT DEFAULT 'draft',
  subtopics_covered JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT assessments_weightage_check CHECK (weightage >= 0 AND weightage <= 1),
  CONSTRAINT assessments_total_marks_check CHECK (total_marks > 0)
);

CREATE INDEX idx_assessments_course ON assessments(course_id);
CREATE INDEX idx_assessments_due_date ON assessments(due_date);
CREATE INDEX idx_assessments_status ON assessments(status);

-- Create student_timetable view
CREATE OR REPLACE VIEW student_timetable AS
SELECT 
  c.id AS course_id,
  c.title AS course_name,
  u.id AS teacher_id,
  u.profile_data->>'name' AS teacher_name,
  a.id AS assessment_id,
  a.name AS assessment_name,
  a.type AS assessment_type,
  a.due_date,
  a.weightage,
  CASE
    WHEN a.due_date < NOW() THEN 'overdue'
    WHEN a.due_date < NOW() + INTERVAL '7 days' THEN 'upcoming'
    ELSE 'future'
  END AS urgency_status
FROM 
  courses c
LEFT JOIN 
  assessments a ON c.id = a.course_id
LEFT JOIN 
  enrollments e ON c.id = e.course_id
LEFT JOIN 
  users u ON u.role = 'teacher' AND u.id = c.id::text::uuid
WHERE 
  e.student_id = auth.uid() AND
  e.status = 'active' AND
  (a.id IS NULL OR a.status = 'published');

-- Create teacher_schedule view
CREATE OR REPLACE VIEW teacher_schedule AS
SELECT 
  c.id AS course_id,
  c.title AS course_name,
  c.semester,
  COUNT(DISTINCT e.student_id) AS student_count,
  EXISTS (
    SELECT 1 FROM assessments a 
    WHERE a.course_id = c.id AND 
          a.type = 'quiz' AND 
          DATE(a.due_date) = CURRENT_DATE
  ) AS has_quiz_today,
  COALESCE(
    (SELECT AVG(CASE WHEN att.status = 'present' THEN 1.0 ELSE 0.0 END) * 100
     FROM attendance att
     WHERE att.course_id = c.id AND
           att.date > CURRENT_DATE - INTERVAL '30 days'),
    0
  ) AS attendance_rate
FROM 
  courses c
LEFT JOIN 
  enrollments e ON c.id = e.course_id
WHERE 
  c.id::text::uuid = auth.uid()
GROUP BY 
  c.id, c.title, c.semester;

-- Create RPC functions for student features
CREATE OR REPLACE FUNCTION calculate_current_grade(stud_id UUID, crs_id UUID)
RETURNS TABLE(
  current_grade NUMERIC,
  completed_assessments INTEGER,
  total_weightage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(g.score * a.weightage) / NULLIF(SUM(a.weightage), 0), 0) AS current_grade,
    COUNT(g.id)::INTEGER AS completed_assessments,
    COALESCE(SUM(a.weightage), 0) AS total_weightage
  FROM 
    grades g
  JOIN 
    assessments a ON g.course_id = a.course_id
  WHERE 
    g.student_id = stud_id AND
    g.course_id = crs_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION project_future_grade(stud_id UUID, crs_id UUID, assumed_performance NUMERIC DEFAULT 0.8)
RETURNS TABLE(
  current_grade NUMERIC,
  projected_grade NUMERIC,
  remaining_weightage NUMERIC,
  confidence_level TEXT
) AS $$
DECLARE
  curr_grade NUMERIC;
  completed_weight NUMERIC;
  remain_weight NUMERIC;
BEGIN
  -- Get current grade and completed weightage
  SELECT 
    cg.current_grade, cg.total_weightage
  INTO 
    curr_grade, completed_weight
  FROM 
    calculate_current_grade(stud_id, crs_id) cg;
  
  -- Get remaining weightage
  SELECT 
    COALESCE(SUM(weightage), 0)
  INTO 
    remain_weight
  FROM 
    assessments
  WHERE 
    course_id = crs_id AND
    due_date > NOW();
  
  -- Calculate projected grade
  RETURN QUERY
  SELECT 
    curr_grade,
    curr_grade + (remain_weight * assumed_performance),
    remain_weight,
    CASE
      WHEN remain_weight > 0.5 THEN 'low'
      WHEN remain_weight > 0.3 THEN 'medium'
      ELSE 'high'
    END AS confidence_level;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_attendance_warnings(stud_id UUID, threshold NUMERIC DEFAULT 0.75)
RETURNS TABLE(
  course_id UUID,
  course_name TEXT,
  total_classes INTEGER,
  attended_classes INTEGER,
  attendance_rate NUMERIC,
  classes_needed INTEGER,
  is_at_risk BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH course_attendance AS (
    SELECT 
      c.id AS course_id,
      c.title AS course_name,
      COUNT(a.id) AS total_classes,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS attended_classes
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
    ca.course_id,
    ca.course_name,
    ca.total_classes,
    ca.attended_classes,
    CASE WHEN ca.total_classes > 0 THEN 
      ca.attended_classes::NUMERIC / ca.total_classes 
    ELSE 0 END AS attendance_rate,
    GREATEST(
      CEILING(threshold * ca.total_classes) - ca.attended_classes,
      0
    )::INTEGER AS classes_needed,
    CASE WHEN ca.total_classes > 0 AND 
              ca.attended_classes::NUMERIC / ca.total_classes < threshold
         THEN TRUE
         ELSE FALSE
    END AS is_at_risk
  FROM 
    course_attendance ca;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_subtopic_performance(stud_id UUID, crs_id UUID)
RETURNS TABLE(
  subtopic_name TEXT,
  average_score NUMERIC,
  assessment_count INTEGER,
  trend TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH subtopic_scores AS (
    SELECT 
      jsonb_array_elements_text(a.subtopics_covered) AS subtopic,
      g.score,
      g.date
    FROM 
      grades g
    JOIN 
      assessments a ON g.course_id = a.course_id
    WHERE 
      g.student_id = stud_id AND
      g.course_id = crs_id
  ),
  subtopic_trends AS (
    SELECT 
      subtopic,
      AVG(score) AS avg_score,
      COUNT(*) AS count,
      COALESCE(
        CASE 
          WHEN CORR(EXTRACT(EPOCH FROM date), score) > 0.3 THEN 'improving'
          WHEN CORR(EXTRACT(EPOCH FROM date), score) < -0.3 THEN 'declining'
          ELSE 'stable'
        END,
        'stable'
      ) AS trend
    FROM 
      subtopic_scores
    GROUP BY 
      subtopic
  )
  SELECT 
    subtopic AS subtopic_name,
    avg_score AS average_score,
    count AS assessment_count,
    trend
  FROM 
    subtopic_trends
  ORDER BY 
    avg_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Create RPC functions for teacher features
CREATE OR REPLACE FUNCTION get_pending_tasks(teacher_uuid UUID)
RETURNS TABLE(
  task_type TEXT,
  course_id UUID,
  course_name TEXT,
  title TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT
) AS $$
BEGIN
  -- Ungraded assessments
  RETURN QUERY
  SELECT 
    'grading' AS task_type,
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
    c.id::text::uuid = teacher_uuid AND
    a.status = 'published' AND
    a.due_date < NOW() AND
    NOT EXISTS (
      SELECT 1 FROM grades g
      WHERE g.course_id = a.course_id
    )
  
  UNION ALL
  
  -- Missing attendance
  SELECT 
    'attendance' AS task_type,
    c.id AS course_id,
    c.title AS course_name,
    'Take attendance for ' || TO_CHAR(CURRENT_DATE, 'Mon DD') AS title,
    NOW() AS due_date,
    'medium' AS priority
  FROM 
    courses c
  WHERE 
    c.id::text::uuid = teacher_uuid AND
    NOT EXISTS (
      SELECT 1 FROM attendance a
      WHERE a.course_id = c.id AND
            a.date = CURRENT_DATE
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
    c.id::text::uuid = teacher_uuid AND
    a.type = 'quiz' AND
    a.status = 'draft' AND
    a.due_date > NOW() AND
    a.due_date < NOW() + INTERVAL '7 days'
  
  ORDER BY 
    priority DESC, due_date ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_recent_submissions(teacher_uuid UUID)
RETURNS TABLE(
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
    u.id AS student_id,
    u.profile_data->>'name' AS student_name,
    c.id AS course_id,
    c.title AS course_name,
    a.id AS assessment_id,
    a.name AS assessment_name,
    g.created_at AS submitted_at,
    CASE WHEN g.feedback IS NOT NULL THEN 'graded' ELSE 'pending' END AS status
  FROM 
    grades g
  JOIN 
    users u ON g.student_id = u.id
  JOIN 
    courses c ON g.course_id = c.id
  JOIN 
    assessments a ON g.course_id = a.course_id
  WHERE 
    c.id::text::uuid = teacher_uuid
  ORDER BY 
    g.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_class_performance(teacher_uuid UUID)
RETURNS TABLE(
  course_id UUID,
  course_name TEXT,
  average_score NUMERIC,
  attendance_rate NUMERIC,
  risk_students INTEGER,
  top_performers INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH course_stats AS (
    SELECT 
      c.id AS course_id,
      c.title AS course_name,
      COALESCE(AVG(g.score), 0) AS avg_score,
      COALESCE(
        (SELECT AVG(CASE WHEN a.status = 'present' THEN 1.0 ELSE 0.0 END) * 100
         FROM attendance a
         WHERE a.course_id = c.id),
        0
      ) AS att_rate,
      COUNT(DISTINCT CASE WHEN g.score < 60 THEN g.student_id END) AS risk_count,
      COUNT(DISTINCT CASE WHEN g.score >= 90 THEN g.student_id END) AS top_count
    FROM 
      courses c
    LEFT JOIN 
      grades g ON c.id = g.course_id
    WHERE 
      c.id::text::uuid = teacher_uuid
    GROUP BY 
      c.id, c.title
  )
  SELECT 
    cs.course_id,
    cs.course_name,
    cs.avg_score AS average_score,
    cs.att_rate AS attendance_rate,
    cs.risk_count AS risk_students,
    cs.top_count AS top_performers
  FROM 
    course_stats cs;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
BEFORE UPDATE ON grades
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
BEFORE UPDATE ON attendance
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_historic_data_updated_at
BEFORE UPDATE ON student_historic_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create trigger function for new user handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, role, identifier, email, profile_data)
  VALUES (
    NEW.id,
    CASE
      WHEN NEW.email LIKE '%@admin.%' THEN 'admin'
      WHEN NEW.email LIKE '%@teacher.%' THEN 'teacher'
      ELSE 'student'
    END,
    CASE
      WHEN NEW.email LIKE '%@admin.%' THEN 'A-' || SUBSTRING(MD5(NEW.email) FROM 1 FOR 6)
      WHEN NEW.email LIKE '%@teacher.%' THEN 'T-' || SUBSTRING(MD5(NEW.email) FROM 1 FOR 6)
      ELSE 'S-' || SUBSTRING(MD5(NEW.email) FROM 1 FOR 6)
    END,
    NEW.email,
    jsonb_build_object(
      'name', COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      'avatar_url', NEW.raw_user_meta_data->>'avatar_url'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

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

-- Create RLS policies for users
CREATE POLICY "Users can read own data" 
ON users FOR SELECT 
TO authenticated 
USING (uid() = id);

CREATE POLICY "Admins can manage all users" 
ON users FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Create RLS policies for courses
CREATE POLICY "Anyone can view courses" 
ON courses FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Teachers and admins can manage courses" 
ON courses FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role IN ('teacher', 'admin')
));

-- Create RLS policies for enrollments
CREATE POLICY "Students can view own enrollments" 
ON enrollments FOR SELECT 
TO authenticated 
USING (student_id = uid());

CREATE POLICY "Teachers can view course enrollments" 
ON enrollments FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'teacher'
));

CREATE POLICY "Admins can manage all enrollments" 
ON enrollments FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Create RLS policies for grades
CREATE POLICY "Students can view own grades" 
ON grades FOR SELECT 
TO authenticated 
USING (student_id = uid());

CREATE POLICY "Teachers can manage grades for their courses" 
ON grades FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'teacher'
));

CREATE POLICY "Admins can manage all grades" 
ON grades FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Create RLS policies for attendance
CREATE POLICY "Students can view own attendance" 
ON attendance FOR SELECT 
TO authenticated 
USING (student_id = uid());

CREATE POLICY "Teachers can manage attendance for their courses" 
ON attendance FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'teacher'
));

CREATE POLICY "Admins can manage all attendance" 
ON attendance FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Create RLS policies for comments
CREATE POLICY "Users can view comments they sent or received" 
ON comments FOR SELECT 
TO authenticated 
USING (from_id = uid() OR to_id = uid());

CREATE POLICY "Teachers can create comments" 
ON comments FOR INSERT 
TO authenticated 
WITH CHECK (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'teacher'
));

CREATE POLICY "Admins can manage all comments" 
ON comments FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Create RLS policies for student_historic_data
CREATE POLICY "Students can view own historic data" 
ON student_historic_data FOR SELECT 
TO authenticated 
USING (student_id = uid());

CREATE POLICY "Teachers can view their students' historic data" 
ON student_historic_data FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM enrollments e
  JOIN courses c ON e.course_id = c.id
  WHERE e.student_id = student_historic_data.student_id
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = uid() AND u.role = 'teacher'
  )
));

CREATE POLICY "Admins can manage all historic data" 
ON student_historic_data FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Create RLS policies for conversations
CREATE POLICY "Users can manage their own conversations" 
ON conversations FOR ALL 
TO authenticated 
USING (user_id = uid());

-- Create RLS policies for resources
CREATE POLICY "Anyone can view public resources" 
ON resources FOR SELECT 
TO authenticated 
USING (is_public = true);

CREATE POLICY "Teachers can manage resources for their courses" 
ON resources FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'teacher'
));

CREATE POLICY "Admins can manage all resources" 
ON resources FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Create RLS policies for messages
CREATE POLICY "Users can view messages they sent or received" 
ON messages FOR SELECT 
TO authenticated 
USING (sender_id = uid() OR recipient_id = uid() OR 
       EXISTS (
         SELECT 1 FROM users u
         WHERE u.id = uid() AND u.profile_data->>'group_id' = group_id::text
       ));

CREATE POLICY "Users can send messages" 
ON messages FOR INSERT 
TO authenticated 
WITH CHECK (sender_id = uid());

CREATE POLICY "Admins can manage all messages" 
ON messages FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Create RLS policies for assessments
CREATE POLICY "Students can view published assessments" 
ON assessments FOR SELECT 
TO authenticated 
USING (status = 'published' AND EXISTS (
  SELECT 1 FROM enrollments e
  WHERE e.course_id = assessments.course_id AND e.student_id = uid()
));

CREATE POLICY "Teachers can manage assessments for their courses" 
ON assessments FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'teacher'
));

CREATE POLICY "Admins can manage all assessments" 
ON assessments FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM users WHERE id = uid() AND role = 'admin'
));

-- Insert sample data (optional)
-- Uncomment and modify as needed for your testing

-- INSERT INTO users (role, identifier, email, profile_data)
-- VALUES 
--   ('admin', 'A-123456', 'admin@example.com', '{"name": "Admin User"}'),
--   ('teacher', 'T-123456', 'teacher@example.com', '{"name": "Teacher User"}'),
--   ('student', 'S-123456', 'student@example.com', '{"name": "Student User"}');

-- INSERT INTO courses (course_id, title, description, semester)
-- VALUES 
--   ('C-1001', 'Introduction to Computer Science', 'Fundamentals of programming', 1),
--   ('C-1002', 'Data Structures', 'Advanced programming concepts', 2);

-- Create storage buckets for file uploads
-- Note: This needs to be done via the Supabase dashboard or CLI
-- The SQL below is just a placeholder for documentation

-- CREATE STORAGE BUCKET study_materials;
-- CREATE STORAGE BUCKET profile_images;