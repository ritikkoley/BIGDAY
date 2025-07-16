-- Initial schema setup for BIGDAY

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) NOT NULL,
  group_id UUID,
  department TEXT,
  profile_data JSONB DEFAULT '{}'::JSONB, -- For baselines {baseline: num, strengths: [], psycho_test: {}}
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups (Classes/Departments)
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('class', 'department')) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  teacher_id UUID REFERENCES user_profiles(id),
  group_ids UUID[] DEFAULT '{}',
  subtopics JSONB DEFAULT '[]'::JSONB, -- [{name: 'Algebra', weight: 0.2}]
  timetable JSONB DEFAULT '[]'::JSONB, -- [{day: 'Monday', time: '10AM-11AM'}]
  holidays JSONB DEFAULT '[]'::JSONB, -- [{date: '2025-07-20', name: 'Holiday'}]
  type TEXT CHECK (type IN ('theory', 'lab')) DEFAULT 'theory',
  semester INTEGER,
  academic_year TEXT,
  allow_quizzes BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('quiz', 'midterm', 'final', 'assignment')) NOT NULL,
  total_marks INTEGER NOT NULL,
  weightage DECIMAL(3,2) DEFAULT 0.1,
  due_date TIMESTAMPTZ,
  subtopics_covered JSONB DEFAULT '[]'::JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grades
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES user_profiles(id),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  percentile INTEGER,
  subtopic_performance JSONB, -- {subtopic_name: score}
  feedback TEXT,
  graded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES user_profiles(id),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')) NOT NULL,
  notes TEXT,
  marked_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES user_profiles(id),
  recipient_id UUID REFERENCES user_profiles(id),
  group_id UUID REFERENCES groups(id),
  course_id UUID REFERENCES courses(id),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  message_type TEXT DEFAULT 'direct' CHECK (message_type IN ('direct', 'announcement', 'reminder', 'alert')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_size BIGINT,
  file_type TEXT,
  resource_type TEXT CHECK (resource_type IN ('material', 'assignment', 'reference', 'video', 'link')) DEFAULT 'material',
  uploaded_by UUID REFERENCES user_profiles(id),
  is_public BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extracurricular activities
CREATE TABLE extracurricular (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  type TEXT CHECK (type IN ('extracurricular', 'disciplinary')),
  description TEXT,
  date DATE,
  impact NUMERIC, -- Positive/negative for value scoring
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations for AI bot
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for group_id in user_profiles
ALTER TABLE user_profiles ADD CONSTRAINT fk_user_profiles_group_id 
  FOREIGN KEY (group_id) REFERENCES groups(id);

-- Indexes for performance
CREATE INDEX idx_grades_student_assess ON grades(student_id, assessment_id);
CREATE INDEX idx_courses_group ON courses USING GIN(group_ids);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, group_id);
CREATE INDEX idx_attendance_student_course ON attendance(student_id, course_id);
CREATE INDEX idx_resources_course ON resources(course_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracurricular ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: Users can view their own profile, teachers can view students in their courses, admins can view all
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Teachers can view students in their courses" ON user_profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses c 
    WHERE c.teacher_id = auth.uid() 
    AND group_ids @> ARRAY[(SELECT group_id FROM user_profiles WHERE id = auth.uid())]
  )
);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR ALL USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);

-- Courses: Students view assigned courses, teachers view own courses, admins view all
CREATE POLICY "Students view assigned courses" ON courses FOR SELECT USING (
  group_ids @> ARRAY[(SELECT group_id FROM user_profiles WHERE id = auth.uid())]
);
CREATE POLICY "Teachers view own courses" ON courses FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "Admins all courses" ON courses FOR ALL USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);

-- Grades: Students see their own grades, teachers see grades for their courses, admins see all
CREATE POLICY "Students can view own grades" ON grades FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Teachers can view grades for their courses" ON grades FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses c 
    JOIN assessments a ON c.id = a.course_id 
    WHERE a.id = assessment_id AND c.teacher_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all grades" ON grades FOR ALL USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);

-- Similar policies for other tables...
CREATE POLICY "Users own extracurricular" ON extracurricular FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own conversations" ON conversations FOR ALL USING (user_id = auth.uid());

-- Functions

-- Calculate projected grade
CREATE OR REPLACE FUNCTION calculate_projected_grade(stud_id UUID, crs_id UUID) 
RETURNS NUMERIC AS $$
DECLARE 
  current_score NUMERIC := 0;
  remaining_weight NUMERIC := 0;
BEGIN
  -- Get current weighted score
  SELECT COALESCE(SUM(g.score * a.weightage), 0) INTO current_score
  FROM grades g 
  JOIN assessments a ON g.assessment_id = a.id 
  WHERE g.student_id = stud_id 
    AND a.course_id = crs_id 
    AND a.status = 'completed';
  
  -- Get remaining weightage
  SELECT COALESCE(SUM(a.weightage), 0) INTO remaining_weight
  FROM assessments a 
  WHERE a.course_id = crs_id 
    AND a.status != 'completed';
  
  -- Assume 80% on remaining assessments
  RETURN current_score + (remaining_weight * 0.8);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get at-risk students
CREATE OR REPLACE FUNCTION get_at_risk(crs_id UUID) 
RETURNS TABLE(student_id UUID, avg_score NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT g.student_id, AVG(g.score) as avg_score
  FROM grades g
  JOIN assessments a ON g.assessment_id = a.id
  WHERE a.course_id = crs_id
  GROUP BY g.student_id
  HAVING AVG(g.score) < 70
  ORDER BY avg_score ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get top performers
CREATE OR REPLACE FUNCTION get_top_performers(crs_id UUID) 
RETURNS TABLE(student_id UUID, avg_score NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT g.student_id, AVG(g.score) as avg_score
  FROM grades g
  JOIN assessments a ON g.assessment_id = a.id
  WHERE a.course_id = crs_id
  GROUP BY g.student_id
  HAVING AVG(g.score) > 80
  ORDER BY avg_score DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate course average
CREATE OR REPLACE FUNCTION calculate_course_avg(crs_id UUID) 
RETURNS NUMERIC AS $$
DECLARE
  course_avg NUMERIC;
BEGIN
  SELECT AVG(g.score) INTO course_avg
  FROM grades g
  JOIN assessments a ON g.assessment_id = a.id
  WHERE a.course_id = crs_id;
  
  RETURN COALESCE(course_avg, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update percentiles after grading
CREATE OR REPLACE FUNCTION update_percentiles(assess_id UUID) 
RETURNS VOID AS $$
BEGIN
  WITH ranked_grades AS (
    SELECT 
      id,
      NTILE(100) OVER (ORDER BY score) as percentile
    FROM grades 
    WHERE assessment_id = assess_id
  )
  UPDATE grades 
  SET percentile = rg.percentile
  FROM ranked_grades rg
  WHERE grades.id = rg.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for student upcoming assessments
CREATE VIEW student_upcoming AS
SELECT 
  a.id, 
  a.name AS assessment, 
  a.due_date, 
  c.name AS course
FROM assessments a 
JOIN courses c ON a.course_id = c.id
WHERE a.due_date > CURRENT_TIMESTAMP 
  AND c.group_ids @> ARRAY[(SELECT group_id FROM user_profiles WHERE id = auth.uid())]
ORDER BY a.due_date ASC;

-- Grant permissions
GRANT SELECT ON student_upcoming TO authenticated;