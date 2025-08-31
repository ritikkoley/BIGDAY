/*
  # Allocation System Database Schema

  1. New Tables
    - `academic_terms` - Academic year/semester periods
    - `cohorts` - Grade levels and streams (e.g., Grade 6-A, Grade 7-Science)
    - `sections` - Individual class sections within cohorts
    - `section_students` - Student assignments to sections
    - `courses` - Subject/course definitions
    - `section_courses` - Course assignments to sections with teacher allocation
    - `teacher_subject_eligibility` - Which subjects each teacher can teach
    - `teacher_grade_eligibility` - Which grade levels each teacher can teach
    - `teacher_load_rules` - Teacher workload limits and availability
    - `slot_templates` - Period schedule templates (bell times)
    - `slot_template_assignments` - Template assignments to cohorts/sections
    - `timetables` - Generated timetable instances
    - `timetable_sessions` - Individual class sessions in timetables
    - `timetable_conflicts` - Scheduling conflicts and issues
    - `allocation_settings` - System-wide allocation configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access and appropriate user access
    - Ensure data isolation and security

  3. Indexes
    - Add performance indexes for common queries
    - Foreign key indexes for joins
    - Search indexes where needed
*/

-- Academic Terms
CREATE TABLE IF NOT EXISTS academic_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  frozen boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage academic terms"
  ON academic_terms
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Cohorts (Grade levels and streams)
CREATE TABLE IF NOT EXISTS cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  academic_term_id uuid NOT NULL REFERENCES academic_terms(id) ON DELETE CASCADE,
  stream text NOT NULL,
  grade text NOT NULL,
  boarding_type text DEFAULT 'day_scholar' CHECK (boarding_type IN ('day_scholar', 'hosteller')),
  periods_per_day integer DEFAULT 8,
  days_per_week integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cohorts"
  ON cohorts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Sections (Individual classes within cohorts)
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sections"
  ON sections
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Section Students (Student assignments to sections)
CREATE TABLE IF NOT EXISTS section_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(section_id, student_id)
);

ALTER TABLE section_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage section students"
  ON section_students
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Courses (Subject definitions)
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  title text NOT NULL,
  code text NOT NULL,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Teachers can view courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('teacher', 'admin')
  ));

-- Section Courses (Course assignments to sections)
CREATE TABLE IF NOT EXISTS section_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  weekly_theory_periods integer DEFAULT 0,
  weekly_lab_periods integer DEFAULT 0,
  lab_block_size integer DEFAULT 1,
  priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, course_id)
);

ALTER TABLE section_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage section courses"
  ON section_courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Teacher Subject Eligibility
CREATE TABLE IF NOT EXISTS teacher_subject_eligibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, course_id)
);

ALTER TABLE teacher_subject_eligibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage teacher subject eligibility"
  ON teacher_subject_eligibility
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Teacher Grade Eligibility
CREATE TABLE IF NOT EXISTS teacher_grade_eligibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  grade text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, grade)
);

ALTER TABLE teacher_grade_eligibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage teacher grade eligibility"
  ON teacher_grade_eligibility
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Teacher Load Rules
CREATE TABLE IF NOT EXISTS teacher_load_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  max_periods_per_day integer DEFAULT 6,
  max_periods_per_week integer DEFAULT 30,
  availability jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id)
);

ALTER TABLE teacher_load_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage teacher load rules"
  ON teacher_load_rules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Slot Templates (Period schedules)
CREATE TABLE IF NOT EXISTS slot_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  name text NOT NULL,
  days_per_week integer DEFAULT 5,
  periods_per_day integer DEFAULT 8,
  bells jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE slot_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage slot templates"
  ON slot_templates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Slot Template Assignments
CREATE TABLE IF NOT EXISTS slot_template_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_template_id uuid NOT NULL REFERENCES slot_templates(id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES cohorts(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CHECK ((cohort_id IS NOT NULL) OR (section_id IS NOT NULL))
);

ALTER TABLE slot_template_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage slot template assignments"
  ON slot_template_assignments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Timetables
CREATE TABLE IF NOT EXISTS timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES academic_terms(id) ON DELETE CASCADE,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  generated_at timestamptz DEFAULT now(),
  generated_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  published_at timestamptz,
  published_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage timetables"
  ON timetables
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Timetable Sessions
CREATE TABLE IF NOT EXISTS timetable_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timetable_id uuid NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  period_index integer NOT NULL CHECK (period_index >= 1),
  duration_periods integer DEFAULT 1,
  session_type text DEFAULT 'theory' CHECK (session_type IN ('theory', 'lab', 'practical')),
  locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE timetable_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage timetable sessions"
  ON timetable_sessions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Timetable Conflicts
CREATE TABLE IF NOT EXISTS timetable_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  period_index integer NOT NULL CHECK (period_index >= 1),
  conflict_type text NOT NULL CHECK (conflict_type IN ('teacher_double_booked', 'section_double_booked', 'resource_conflict')),
  details jsonb DEFAULT '{}',
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE timetable_conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage timetable conflicts"
  ON timetable_conflicts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Allocation Settings
CREATE TABLE IF NOT EXISTS allocation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  teacher_max_periods_per_day integer DEFAULT 6,
  class_periods_per_day integer DEFAULT 8,
  days_per_week integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE allocation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage allocation settings"
  ON allocation_settings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academic_terms_institution ON academic_terms(institution_id);
CREATE INDEX IF NOT EXISTS idx_academic_terms_dates ON academic_terms(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_cohorts_academic_term ON cohorts(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_grade ON cohorts(grade);

CREATE INDEX IF NOT EXISTS idx_sections_cohort ON sections(cohort_id);

CREATE INDEX IF NOT EXISTS idx_section_students_section ON section_students(section_id);
CREATE INDEX IF NOT EXISTS idx_section_students_student ON section_students(student_id);

CREATE INDEX IF NOT EXISTS idx_courses_institution ON courses(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);

CREATE INDEX IF NOT EXISTS idx_section_courses_section ON section_courses(section_id);
CREATE INDEX IF NOT EXISTS idx_section_courses_teacher ON section_courses(teacher_id);

CREATE INDEX IF NOT EXISTS idx_teacher_subject_eligibility_teacher ON teacher_subject_eligibility(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_grade_eligibility_teacher ON teacher_grade_eligibility(teacher_id);

CREATE INDEX IF NOT EXISTS idx_slot_templates_institution ON slot_templates(institution_id);

CREATE INDEX IF NOT EXISTS idx_timetables_section ON timetables(section_id);
CREATE INDEX IF NOT EXISTS idx_timetables_academic_term ON timetables(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_timetables_status ON timetables(status);

CREATE INDEX IF NOT EXISTS idx_timetable_sessions_timetable ON timetable_sessions(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_section ON timetable_sessions(section_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_teacher ON timetable_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_schedule ON timetable_sessions(day_of_week, period_index);

CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_teacher ON timetable_conflicts(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_section ON timetable_conflicts(section_id);
CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_resolved ON timetable_conflicts(resolved);

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_academic_terms_updated_at'
  ) THEN
    CREATE TRIGGER update_academic_terms_updated_at
      BEFORE UPDATE ON academic_terms
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_cohorts_updated_at'
  ) THEN
    CREATE TRIGGER update_cohorts_updated_at
      BEFORE UPDATE ON cohorts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_sections_updated_at'
  ) THEN
    CREATE TRIGGER update_sections_updated_at
      BEFORE UPDATE ON sections
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_courses_updated_at'
  ) THEN
    CREATE TRIGGER update_courses_updated_at
      BEFORE UPDATE ON courses
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_section_courses_updated_at'
  ) THEN
    CREATE TRIGGER update_section_courses_updated_at
      BEFORE UPDATE ON section_courses
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_teacher_load_rules_updated_at'
  ) THEN
    CREATE TRIGGER update_teacher_load_rules_updated_at
      BEFORE UPDATE ON teacher_load_rules
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_slot_templates_updated_at'
  ) THEN
    CREATE TRIGGER update_slot_templates_updated_at
      BEFORE UPDATE ON slot_templates
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_timetables_updated_at'
  ) THEN
    CREATE TRIGGER update_timetables_updated_at
      BEFORE UPDATE ON timetables
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_timetable_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_timetable_sessions_updated_at
      BEFORE UPDATE ON timetable_sessions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_allocation_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_allocation_settings_updated_at
      BEFORE UPDATE ON allocation_settings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;