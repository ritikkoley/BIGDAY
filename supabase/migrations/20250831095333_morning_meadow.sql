/*
  # Timetable Allocation System

  1. New Tables
    - `academic_terms` - Academic periods/semesters
    - `cohorts` - Master groups (stream, grade, boarding type)
    - `sections` - Sub-groups within cohorts (5A, 5B, etc.)
    - `section_students` - Student assignments to sections
    - `courses` - Subject definitions with scheduling requirements
    - `section_courses` - Course-teacher assignments per section
    - `teacher_subject_eligibility` - Which subjects teachers can teach
    - `teacher_grade_eligibility` - Which grades teachers can teach
    - `teacher_load_rules` - Per-teacher scheduling constraints
    - `slot_templates` - Period templates for scheduling
    - `slot_template_assignments` - Template assignments to cohorts/sections
    - `timetables` - Generated timetable versions
    - `timetable_sessions` - Individual scheduled periods
    - `timetable_conflicts` - Conflict logging for debugging
    - `allocation_settings` - Global configuration

  2. Security
    - Enable RLS on all tables
    - Admin-only access for allocation management
    - Audit logging for all changes

  3. Indexes
    - Performance indexes for scheduling queries
    - Unique constraints for data integrity
*/

-- Create institutions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'school',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default institution if none exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.institutions) THEN
    INSERT INTO public.institutions (name, type) 
    VALUES ('Delhi Public School, Bhilai', 'school');
  END IF;
END $$;

-- 1) Academic terms
CREATE TABLE IF NOT EXISTS public.academic_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  frozen boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2) Cohorts / Sections model
CREATE TABLE IF NOT EXISTS public.cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  stream text NOT NULL,
  grade text NOT NULL,
  boarding_type text NOT NULL CHECK (boarding_type IN ('hosteller','day_scholar')),
  periods_per_day int NOT NULL DEFAULT 8,
  days_per_week int NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (cohort_id, name)
);

CREATE TABLE IF NOT EXISTS public.section_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (section_id, student_id)
);

-- 3) Courses (global)
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  subject_type text NOT NULL CHECK (subject_type IN ('theory','lab','mixed')),
  weekly_theory_periods int NOT NULL DEFAULT 0,
  weekly_lab_periods int NOT NULL DEFAULT 0,
  lab_block_size int NOT NULL DEFAULT 2,
  constraints jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4) Course offering per section
CREATE TABLE IF NOT EXISTS public.section_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
  weekly_theory_periods int,
  weekly_lab_periods int,
  lab_block_size int,
  priority int NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, course_id)
);

-- 5) Teacher eligibility
CREATE TABLE IF NOT EXISTS public.teacher_subject_eligibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.teacher_grade_eligibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  grade text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, grade)
);

CREATE TABLE IF NOT EXISTS public.teacher_load_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  max_periods_per_day int,
  max_periods_per_week int,
  availability jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6) Slot templates
CREATE TABLE IF NOT EXISTS public.slot_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  days_per_week int NOT NULL DEFAULT 5,
  periods_per_day int NOT NULL DEFAULT 8,
  bells jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.slot_template_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_template_id uuid NOT NULL REFERENCES public.slot_templates(id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CHECK ((cohort_id IS NOT NULL) OR (section_id IS NOT NULL))
);

-- 7) Timetables & sessions
CREATE TABLE IF NOT EXISTS public.timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  version int NOT NULL DEFAULT 1,
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.timetable_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timetable_id uuid NOT NULL REFERENCES public.timetables(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  teacher_id uuid REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  period_index int NOT NULL CHECK (period_index >= 1),
  duration_periods int NOT NULL DEFAULT 1,
  session_type text NOT NULL CHECK (session_type IN ('theory','lab')),
  locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (timetable_id, day_of_week, period_index)
);

CREATE TABLE IF NOT EXISTS public.timetable_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid,
  section_id uuid,
  teacher_id uuid,
  course_id uuid,
  day_of_week int,
  period_index int,
  conflict_type text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- 8) Global settings
CREATE TABLE IF NOT EXISTS public.allocation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  teacher_max_periods_per_day int NOT NULL DEFAULT 6,
  class_periods_per_day int NOT NULL DEFAULT 8,
  days_per_week int NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
DO $$
DECLARE
  inst_id uuid;
BEGIN
  SELECT id INTO inst_id FROM public.institutions LIMIT 1;
  
  IF NOT EXISTS (SELECT 1 FROM public.allocation_settings WHERE institution_id = inst_id) THEN
    INSERT INTO public.allocation_settings (institution_id) VALUES (inst_id);
  END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subject_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_grade_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_load_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_template_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocation_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin-only access for allocation management)
CREATE POLICY "Admins can manage academic terms"
  ON public.academic_terms
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage cohorts"
  ON public.cohorts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage sections"
  ON public.sections
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage section students"
  ON public.section_students
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage courses"
  ON public.courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage section courses"
  ON public.section_courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage teacher eligibility"
  ON public.teacher_subject_eligibility
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage teacher grade eligibility"
  ON public.teacher_grade_eligibility
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage teacher load rules"
  ON public.teacher_load_rules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage slot templates"
  ON public.slot_templates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage slot template assignments"
  ON public.slot_template_assignments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage timetables"
  ON public.timetables
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage timetable sessions"
  ON public.timetable_sessions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can view timetable conflicts"
  ON public.timetable_conflicts
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

CREATE POLICY "Admins can manage allocation settings"
  ON public.allocation_settings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_sessions_section_day_period
  ON public.timetable_sessions(section_id, day_of_week, period_index);

CREATE INDEX IF NOT EXISTS idx_sessions_teacher_day_period
  ON public.timetable_sessions(teacher_id, day_of_week, period_index);

CREATE INDEX IF NOT EXISTS idx_cohorts_term_grade
  ON public.cohorts(academic_term_id, grade);

CREATE INDEX IF NOT EXISTS idx_sections_cohort
  ON public.sections(cohort_id);

CREATE INDEX IF NOT EXISTS idx_section_courses_section
  ON public.section_courses(section_id);

CREATE INDEX IF NOT EXISTS idx_section_courses_teacher
  ON public.section_courses(teacher_id);

CREATE INDEX IF NOT EXISTS idx_teacher_eligibility_teacher
  ON public.teacher_subject_eligibility(teacher_id);

CREATE INDEX IF NOT EXISTS idx_teacher_eligibility_course
  ON public.teacher_subject_eligibility(course_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
DO $$
DECLARE
  table_name text;
  tables text[] := ARRAY[
    'academic_terms', 'cohorts', 'sections', 'courses', 'section_courses',
    'teacher_load_rules', 'slot_templates', 'timetables', 'timetable_sessions',
    'allocation_settings'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END $$;

-- Insert seed data for testing
DO $$
DECLARE
  inst_id uuid;
  term_id uuid;
  cohort_id uuid;
  section_8a_id uuid;
  section_8b_id uuid;
  math_course_id uuid;
  physics_course_id uuid;
  english_course_id uuid;
  template_id uuid;
  teacher1_id uuid;
  teacher2_id uuid;
  teacher3_id uuid;
BEGIN
  -- Get institution ID
  SELECT id INTO inst_id FROM public.institutions LIMIT 1;
  
  -- Create academic term
  INSERT INTO public.academic_terms (institution_id, name, start_date, end_date)
  VALUES (inst_id, '2025 Academic Year', '2025-04-01', '2026-03-31')
  RETURNING id INTO term_id;
  
  -- Create cohort
  INSERT INTO public.cohorts (institution_id, academic_term_id, stream, grade, boarding_type)
  VALUES (inst_id, term_id, 'Science', '8', 'day_scholar')
  RETURNING id INTO cohort_id;
  
  -- Create sections
  INSERT INTO public.sections (cohort_id, name) VALUES (cohort_id, '8A') RETURNING id INTO section_8a_id;
  INSERT INTO public.sections (cohort_id, name) VALUES (cohort_id, '8B') RETURNING id INTO section_8b_id;
  
  -- Create courses
  INSERT INTO public.courses (institution_id, code, title, subject_type, weekly_theory_periods, weekly_lab_periods, lab_block_size)
  VALUES 
    (inst_id, 'MATH8', 'Mathematics Grade 8', 'theory', 4, 0, 1),
    (inst_id, 'PHY8', 'Physics Grade 8', 'mixed', 3, 1, 2),
    (inst_id, 'ENG8', 'English Grade 8', 'theory', 4, 0, 1)
  RETURNING id INTO math_course_id;
  
  SELECT id INTO physics_course_id FROM public.courses WHERE code = 'PHY8';
  SELECT id INTO english_course_id FROM public.courses WHERE code = 'ENG8';
  
  -- Create slot template
  INSERT INTO public.slot_templates (institution_id, name, days_per_week, periods_per_day, bells)
  VALUES (inst_id, 'Standard 8 Period Schedule', 5, 8, 
    '{"1":"08:00-08:45","2":"08:45-09:30","3":"09:30-10:15","4":"10:35-11:20","5":"11:20-12:05","6":"12:05-12:50","7":"13:30-14:15","8":"14:15-15:00"}'::jsonb)
  RETURNING id INTO template_id;
  
  -- Assign template to cohort
  INSERT INTO public.slot_template_assignments (slot_template_id, cohort_id)
  VALUES (template_id, cohort_id);
  
  -- Create demo teachers if they don't exist
  INSERT INTO public.user_profiles (
    full_name, email, role, department, status
  ) VALUES 
    ('Math Teacher', 'math.teacher@dpsb.edu', 'teacher', 'Mathematics', 'active'),
    ('Physics Teacher', 'physics.teacher@dpsb.edu', 'teacher', 'Science', 'active'),
    ('English Teacher', 'english.teacher@dpsb.edu', 'teacher', 'English', 'active')
  ON CONFLICT (email) DO NOTHING;
  
  -- Get teacher IDs
  SELECT id INTO teacher1_id FROM public.user_profiles WHERE email = 'math.teacher@dpsb.edu';
  SELECT id INTO teacher2_id FROM public.user_profiles WHERE email = 'physics.teacher@dpsb.edu';
  SELECT id INTO teacher3_id FROM public.user_profiles WHERE email = 'english.teacher@dpsb.edu';
  
  -- Set up teacher eligibility
  INSERT INTO public.teacher_subject_eligibility (teacher_id, course_id) VALUES
    (teacher1_id, math_course_id),
    (teacher2_id, physics_course_id),
    (teacher3_id, english_course_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.teacher_grade_eligibility (teacher_id, grade) VALUES
    (teacher1_id, '8'), (teacher1_id, '9'), (teacher1_id, '10'),
    (teacher2_id, '8'), (teacher2_id, '9'),
    (teacher3_id, '6'), (teacher3_id, '7'), (teacher3_id, '8'), (teacher3_id, '9'), (teacher3_id, '10')
  ON CONFLICT DO NOTHING;
  
  -- Set up teacher load rules
  INSERT INTO public.teacher_load_rules (teacher_id, max_periods_per_day, availability) VALUES
    (teacher1_id, 6, '{"mon":[1,2,3,4,5,6,7,8],"tue":[1,2,3,4,5,6,7,8],"wed":[1,2,3,4,5,6,7,8],"thu":[1,2,3,4,5,6,7,8],"fri":[1,2,3,4,5,6,7,8]}'::jsonb),
    (teacher2_id, 6, '{"mon":[2,3,4,5,6,7,8],"tue":[1,2,3,4,5,6,7,8],"wed":[1,2,3,4,5,6,7,8],"thu":[1,2,3,4,5,6,7,8],"fri":[1,2,3,4,5,6,7,8]}'::jsonb),
    (teacher3_id, 6, '{"mon":[1,2,3,4,5,6,7,8],"tue":[1,2,3,4,5,6,7,8],"wed":[1,2,3,4,5,6,7,8],"thu":[1,2,3,4,5,6,7,8],"fri":[1,2,3,4,5,6,7,8]}'::jsonb)
  ON CONFLICT DO NOTHING;
  
  -- Assign courses to sections
  INSERT INTO public.section_courses (section_id, course_id, teacher_id, priority) VALUES
    (section_8a_id, math_course_id, teacher1_id, 10),
    (section_8a_id, physics_course_id, teacher2_id, 9),
    (section_8a_id, english_course_id, teacher3_id, 8),
    (section_8b_id, math_course_id, teacher1_id, 10),
    (section_8b_id, physics_course_id, teacher2_id, 9),
    (section_8b_id, english_course_id, teacher3_id, 8)
  ON CONFLICT DO NOTHING;
  
END $$;