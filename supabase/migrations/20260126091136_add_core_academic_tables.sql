/*
  # Add Core Academic Tables for Student/Teacher Consoles

  This migration adds the missing core academic tables required by the
  student, teacher, and admin consoles for grades, attendance, messaging,
  and resources.

  ## New Tables

  1. `groups`
     - Student groups/classes for organizing students
     - Columns: id, name, academic_term_id, type, description, settings

  2. `assessments`
     - Tracks exams, quizzes, assignments
     - Columns: id, course_id, name, type, total_marks, weightage, due_date, status

  3. `grades`
     - Student grades for assessments
     - Columns: id, student_id, assessment_id, score, max_score, percentile, feedback

  4. `attendance`
     - Daily attendance records per student per course
     - Columns: id, student_id, course_id, date, status, notes, marked_by

  5. `messages`
     - Internal messaging system
     - Columns: id, sender_id, recipient_id, group_id, subject, content, priority, is_read

  6. `resources`
     - Course materials and files
     - Columns: id, course_id, name, description, file_path, file_type, uploaded_by

  7. `extracurricular`
     - Extracurricular activities and disciplinary records
     - Columns: id, user_id, type, description, date, impact

  ## Views

  1. `student_upcoming`
     - View showing upcoming assessments for students

  ## Security

  - RLS enabled on all tables
  - Role-based access policies for students, teachers, and admins
*/

-- Groups table (for organizing students into classes)
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  academic_term_id uuid REFERENCES academic_terms(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'class' CHECK (type IN ('class', 'department', 'section', 'cohort')),
  description text,
  parent_group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage groups" ON groups;
CREATE POLICY "Admins can manage groups"
  ON groups FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );

DROP POLICY IF EXISTS "Teachers and students can view groups" ON groups;
CREATE POLICY "Teachers and students can view groups"
  ON groups FOR SELECT
  TO authenticated
  USING (true);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('quiz', 'midterm', 'final', 'assignment', 'digital', 'practical')),
  total_marks numeric NOT NULL DEFAULT 100,
  weightage numeric DEFAULT 0,
  due_date timestamptz,
  instructions text,
  subtopics_covered jsonb DEFAULT '[]',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_due_date ON assessments(due_date);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all assessments" ON assessments;
CREATE POLICY "Admins can manage all assessments"
  ON assessments FOR ALL
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

DROP POLICY IF EXISTS "Teachers can manage their course assessments" ON assessments;
CREATE POLICY "Teachers can manage their course assessments"
  ON assessments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM section_courses sc
      JOIN user_profiles up ON up.id = auth.uid()
      WHERE sc.course_id = assessments.course_id
      AND sc.teacher_id = auth.uid()
      AND up.role = 'teacher'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM section_courses sc
      JOIN user_profiles up ON up.id = auth.uid()
      WHERE sc.course_id = assessments.course_id
      AND sc.teacher_id = auth.uid()
      AND up.role = 'teacher'
    )
  );

DROP POLICY IF EXISTS "Students can view published assessments" ON assessments;
CREATE POLICY "Students can view published assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (
    status IN ('published', 'completed')
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'teacher')
    )
  );

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  score numeric NOT NULL,
  max_score numeric NOT NULL DEFAULT 100,
  percentile numeric,
  subtopic_performance jsonb,
  feedback text,
  graded_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  graded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT grades_score_valid CHECK (score >= 0 AND score <= max_score),
  UNIQUE(student_id, assessment_id)
);

CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_assessment_id ON grades(assessment_id);
CREATE INDEX IF NOT EXISTS idx_grades_graded_at ON grades(graded_at);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all grades" ON grades;
CREATE POLICY "Admins can manage all grades"
  ON grades FOR ALL
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

DROP POLICY IF EXISTS "Teachers can manage grades for their assessments" ON grades;
CREATE POLICY "Teachers can manage grades for their assessments"
  ON grades FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments a
      JOIN section_courses sc ON sc.course_id = a.course_id
      WHERE a.id = grades.assessment_id
      AND sc.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments a
      JOIN section_courses sc ON sc.course_id = a.course_id
      WHERE a.id = grades.assessment_id
      AND sc.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can view their own grades" ON grades;
CREATE POLICY "Students can view their own grades"
  ON grades FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'teacher')
    )
  );

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes text,
  marked_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course_id ON attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all attendance" ON attendance;
CREATE POLICY "Admins can manage all attendance"
  ON attendance FOR ALL
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

DROP POLICY IF EXISTS "Teachers can manage attendance for their courses" ON attendance;
CREATE POLICY "Teachers can manage attendance for their courses"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM section_courses sc
      WHERE sc.course_id = attendance.course_id
      AND sc.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM section_courses sc
      WHERE sc.course_id = attendance.course_id
      AND sc.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can view their own attendance" ON attendance;
CREATE POLICY "Students can view their own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'teacher')
    )
  );

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  message_type text DEFAULT 'direct' CHECK (message_type IN ('direct', 'announcement', 'reminder', 'alert')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  reply_to uuid REFERENCES messages(id) ON DELETE SET NULL,
  attachments jsonb DEFAULT '[]',
  thread_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read) WHERE NOT is_read;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid()
    OR recipient_id = auth.uid()
    OR (group_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.group_id = messages.group_id
    ))
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    recipient_id = auth.uid()
    OR sender_id = auth.uid()
  )
  WITH CHECK (
    recipient_id = auth.uid()
    OR sender_id = auth.uid()
  );

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  file_path text,
  file_size bigint,
  file_type text,
  resource_type text DEFAULT 'material' CHECK (resource_type IN ('material', 'assignment', 'reference', 'video', 'link')),
  uploaded_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  is_public boolean DEFAULT true,
  download_count integer DEFAULT 0,
  tags jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_course_id ON resources(course_id);
CREATE INDEX IF NOT EXISTS idx_resources_uploaded_by ON resources(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_resources_resource_type ON resources(resource_type);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all resources" ON resources;
CREATE POLICY "Admins can manage all resources"
  ON resources FOR ALL
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

DROP POLICY IF EXISTS "Teachers can manage their course resources" ON resources;
CREATE POLICY "Teachers can manage their course resources"
  ON resources FOR ALL
  TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM section_courses sc
      WHERE sc.course_id = resources.course_id
      AND sc.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM section_courses sc
      WHERE sc.course_id = resources.course_id
      AND sc.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can view public resources" ON resources;
CREATE POLICY "Students can view public resources"
  ON resources FOR SELECT
  TO authenticated
  USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'teacher')
    )
  );

-- Extracurricular table
CREATE TABLE IF NOT EXISTS extracurricular (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('extracurricular', 'disciplinary', 'achievement', 'sports', 'cultural')),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  impact numeric DEFAULT 0,
  category text,
  awarded_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  evidence_path text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_extracurricular_user_id ON extracurricular(user_id);
CREATE INDEX IF NOT EXISTS idx_extracurricular_type ON extracurricular(type);
CREATE INDEX IF NOT EXISTS idx_extracurricular_date ON extracurricular(date);

ALTER TABLE extracurricular ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all extracurricular" ON extracurricular;
CREATE POLICY "Admins can manage all extracurricular"
  ON extracurricular FOR ALL
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

DROP POLICY IF EXISTS "Teachers can add extracurricular records" ON extracurricular;
CREATE POLICY "Teachers can add extracurricular records"
  ON extracurricular FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'teacher'
    )
  );

DROP POLICY IF EXISTS "Teachers can view all extracurricular" ON extracurricular;
CREATE POLICY "Teachers can view all extracurricular"
  ON extracurricular FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'teacher'
    )
  );

DROP POLICY IF EXISTS "Students can view their own extracurricular" ON extracurricular;
CREATE POLICY "Students can view their own extracurricular"
  ON extracurricular FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create student_upcoming view for upcoming assessments
CREATE OR REPLACE VIEW student_upcoming AS
SELECT 
  a.id,
  a.name as assessment,
  a.due_date,
  c.title as course
FROM assessments a
JOIN courses c ON c.id = a.course_id
WHERE a.status = 'published'
  AND a.due_date > now()
ORDER BY a.due_date ASC;

-- Add name alias column to user_profiles for backward compatibility
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN name text GENERATED ALWAYS AS (full_name) STORED;
  END IF;
END $$;

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to new tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_groups_updated_at') THEN
    CREATE TRIGGER update_groups_updated_at
      BEFORE UPDATE ON groups
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_assessments_updated_at') THEN
    CREATE TRIGGER update_assessments_updated_at
      BEFORE UPDATE ON assessments
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_grades_updated_at') THEN
    CREATE TRIGGER update_grades_updated_at
      BEFORE UPDATE ON grades
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_attendance_updated_at') THEN
    CREATE TRIGGER update_attendance_updated_at
      BEFORE UPDATE ON attendance
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_messages_updated_at') THEN
    CREATE TRIGGER update_messages_updated_at
      BEFORE UPDATE ON messages
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_resources_updated_at') THEN
    CREATE TRIGGER update_resources_updated_at
      BEFORE UPDATE ON resources
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_extracurricular_updated_at') THEN
    CREATE TRIGGER update_extracurricular_updated_at
      BEFORE UPDATE ON extracurricular
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
