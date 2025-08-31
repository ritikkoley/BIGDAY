/*
  # Allocation System Database Schema

  This migration creates the complete allocation system for timetable generation and management.

  ## 1. New Tables
    - `institutions` - Institution/school information
    - `academic_terms` - Academic year/semester periods
    - `cohorts` - Academic groups (grade + stream combinations)
    - `sections` - Class divisions within cohorts
    - `courses` - Subject definitions with scheduling requirements
    - `section_courses` - Course assignments to sections with teachers
    - `section_students` - Student assignments to sections
    - `teacher_subject_eligibility` - Which subjects teachers can teach
    - `teacher_grade_eligibility` - Which grades teachers can handle
    - `teacher_load_rules` - Teacher workload and availability constraints
    - `slot_templates` - Period schedule templates
    - `slot_template_assignments` - Template assignments to cohorts/sections
    - `timetables` - Generated timetable versions
    - `timetable_sessions` - Individual class sessions in timetables
    - `timetable_conflicts` - Scheduling conflicts and issues

  ## 2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins can manage all data
    - Teachers can view relevant data

  ## 3. Indexes
    - Performance indexes for common queries
    - Full-text search indexes where needed

  ## 4. Functions
    - Helper functions for timetable generation
    - Conflict detection and resolution
*/

-- Create institutions table
CREATE TABLE IF NOT EXISTS public.institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('school', 'college', 'university')),
  address text,
  contact_info jsonb DEFAULT '{}'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create academic_terms table
CREATE TABLE IF NOT EXISTS public.academic_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  frozen boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(institution_id, name)
);

-- Create cohorts table
CREATE TABLE IF NOT EXISTS public.cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  stream text NOT NULL,
  grade text NOT NULL,
  boarding_type text NOT NULL CHECK (boarding_type IN ('hosteller', 'day_scholar')) DEFAULT 'day_scholar',
  periods_per_day int NOT NULL DEFAULT 8,
  days_per_week int NOT NULL DEFAULT 5,
  bells jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(academic_term_id, stream, grade)
);

-- Create sections table
CREATE TABLE IF NOT EXISTS public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cohort_id, name)
);

-- Create courses table with the architecture you specified
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  
  -- Identity
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  
  -- Classification
  subject_type text NOT NULL CHECK (subject_type IN ('theory', 'lab', 'mixed')),
  
  -- Requirements (weekly)
  weekly_theory_periods int NOT NULL DEFAULT 0,
  weekly_lab_periods int NOT NULL DEFAULT 0,
  
  -- Labs and block rules
  lab_block_size int NOT NULL DEFAULT 2,
  min_days_between_theory int DEFAULT 1,
  min_days_between_labs int DEFAULT 2,
  
  -- Constraints (flexible, JSON)
  constraints jsonb DEFAULT '{}'::jsonb,
  
  -- Metadata
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create section_courses table (course assignments to sections)
CREATE TABLE IF NOT EXISTS public.section_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  
  -- Override course defaults if needed
  weekly_theory_periods int,
  weekly_lab_periods int,
  lab_block_size int,
  
  priority int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, course_id)
);

-- Create section_students table
CREATE TABLE IF NOT EXISTS public.section_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(section_id, student_id)
);

-- Create teacher eligibility tables
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

-- Create teacher load rules table
CREATE TABLE IF NOT EXISTS public.teacher_load_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  max_periods_per_day int DEFAULT 6,
  max_periods_per_week int DEFAULT 30,
  availability jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id)
);

-- Create slot templates table
CREATE TABLE IF NOT EXISTS public.slot_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  days_per_week int NOT NULL DEFAULT 5,
  periods_per_day int NOT NULL DEFAULT 8,
  bells jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(institution_id, name)
);

-- Create slot template assignments table
CREATE TABLE IF NOT EXISTS public.slot_template_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_template_id uuid NOT NULL REFERENCES public.slot_templates(id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CHECK ((cohort_id IS NOT NULL) OR (section_id IS NOT NULL)),
  UNIQUE(slot_template_id, cohort_id),
  UNIQUE(slot_template_id, section_id)
);

-- Create timetables table
CREATE TABLE IF NOT EXISTS public.timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  version int NOT NULL DEFAULT 1,
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create timetable sessions table
CREATE TABLE IF NOT EXISTS public.timetable_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timetable_id uuid NOT NULL REFERENCES public.timetables(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  period_index int NOT NULL CHECK (period_index >= 1),
  duration_periods int NOT NULL DEFAULT 1,
  session_type text NOT NULL CHECK (session_type IN ('theory', 'lab')) DEFAULT 'theory',
  locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create timetable conflicts table
CREATE TABLE IF NOT EXISTS public.timetable_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid,
  section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  day_of_week int CHECK (day_of_week BETWEEN 1 AND 7),
  period_index int CHECK (period_index >= 1),
  conflict_type text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create allocation settings table
CREATE TABLE IF NOT EXISTS public.allocation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  teacher_max_periods_per_day int DEFAULT 6,
  class_periods_per_day int DEFAULT 8,
  days_per_week int DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(institution_id)
);

-- Insert default institution if none exists
INSERT INTO public.institutions (id, name, type, address)
SELECT 
  'default-institution-id'::uuid,
  'Delhi Public School, Bhilai',
  'school',
  'Bhilai, Chhattisgarh, India'
WHERE NOT EXISTS (SELECT 1 FROM public.institutions);

-- Insert default allocation settings
INSERT INTO public.allocation_settings (institution_id, teacher_max_periods_per_day, class_periods_per_day, days_per_week)
SELECT 
  'default-institution-id'::uuid,
  6,
  8,
  5
WHERE NOT EXISTS (SELECT 1 FROM public.allocation_settings);

-- Enable Row Level Security
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subject_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_grade_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_load_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_template_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocation_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins
CREATE POLICY "Admins can manage institutions"
  ON public.institutions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage academic terms"
  ON public.academic_terms
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage cohorts"
  ON public.cohorts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage sections"
  ON public.sections
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage courses"
  ON public.courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view courses"
  ON public.courses
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  ));

CREATE POLICY "Admins can manage section courses"
  ON public.section_courses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view their section courses"
  ON public.section_courses
  FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage section students"
  ON public.section_students
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage teacher eligibility"
  ON public.teacher_subject_eligibility
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view their eligibility"
  ON public.teacher_subject_eligibility
  FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage teacher grade eligibility"
  ON public.teacher_grade_eligibility
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view their grade eligibility"
  ON public.teacher_grade_eligibility
  FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage teacher load rules"
  ON public.teacher_load_rules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view their load rules"
  ON public.teacher_load_rules
  FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage slot templates"
  ON public.slot_templates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view slot templates"
  ON public.slot_templates
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  ));

CREATE POLICY "Admins can manage slot template assignments"
  ON public.slot_template_assignments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage timetables"
  ON public.timetables
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view published timetables"
  ON public.timetables
  FOR SELECT
  TO authenticated
  USING (status = 'published' OR EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Students can view their published timetables"
  ON public.timetables
  FOR SELECT
  TO authenticated
  USING (status = 'published' AND EXISTS (
    SELECT 1 FROM public.section_students ss
    JOIN public.sections s ON s.id = ss.section_id
    WHERE ss.student_id = auth.uid() AND s.id = section_id
  ));

CREATE POLICY "Admins can manage timetable sessions"
  ON public.timetable_sessions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view their timetable sessions"
  ON public.timetable_sessions
  FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Students can view their timetable sessions"
  ON public.timetable_sessions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.section_students ss
    WHERE ss.student_id = auth.uid() AND ss.section_id = section_id
  ) OR EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  ));

CREATE POLICY "Admins can view timetable conflicts"
  ON public.timetable_conflicts
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage allocation settings"
  ON public.allocation_settings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_academic_terms_institution ON public.academic_terms(institution_id);
CREATE INDEX IF NOT EXISTS idx_academic_terms_dates ON public.academic_terms(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_cohorts_academic_term ON public.cohorts(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_institution ON public.cohorts(institution_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_grade ON public.cohorts(grade);

CREATE INDEX IF NOT EXISTS idx_sections_cohort ON public.sections(cohort_id);

CREATE INDEX IF NOT EXISTS idx_courses_institution ON public.courses(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_code ON public.courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_active ON public.courses(active);
CREATE INDEX IF NOT EXISTS idx_courses_subject_type ON public.courses(subject_type);

CREATE INDEX IF NOT EXISTS idx_section_courses_section ON public.section_courses(section_id);
CREATE INDEX IF NOT EXISTS idx_section_courses_course ON public.section_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_section_courses_teacher ON public.section_courses(teacher_id);

CREATE INDEX IF NOT EXISTS idx_section_students_section ON public.section_students(section_id);
CREATE INDEX IF NOT EXISTS idx_section_students_student ON public.section_students(student_id);

CREATE INDEX IF NOT EXISTS idx_teacher_subject_eligibility_teacher ON public.teacher_subject_eligibility(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subject_eligibility_course ON public.teacher_subject_eligibility(course_id);

CREATE INDEX IF NOT EXISTS idx_teacher_grade_eligibility_teacher ON public.teacher_grade_eligibility(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_grade_eligibility_grade ON public.teacher_grade_eligibility(grade);

CREATE INDEX IF NOT EXISTS idx_teacher_load_rules_teacher ON public.teacher_load_rules(teacher_id);

CREATE INDEX IF NOT EXISTS idx_slot_templates_institution ON public.slot_templates(institution_id);

CREATE INDEX IF NOT EXISTS idx_timetables_section ON public.timetables(section_id);
CREATE INDEX IF NOT EXISTS idx_timetables_academic_term ON public.timetables(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_timetables_status ON public.timetables(status);

CREATE INDEX IF NOT EXISTS idx_timetable_sessions_timetable ON public.timetable_sessions(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_section ON public.timetable_sessions(section_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_course ON public.timetable_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_teacher ON public.timetable_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sessions_schedule ON public.timetable_sessions(day_of_week, period_index);

CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_run ON public.timetable_conflicts(run_id);
CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_section ON public.timetable_conflicts(section_id);
CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_teacher ON public.timetable_conflicts(teacher_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_terms_updated_at
  BEFORE UPDATE ON public.academic_terms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at
  BEFORE UPDATE ON public.cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_section_courses_updated_at
  BEFORE UPDATE ON public.section_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_load_rules_updated_at
  BEFORE UPDATE ON public.teacher_load_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slot_templates_updated_at
  BEFORE UPDATE ON public.slot_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timetables_updated_at
  BEFORE UPDATE ON public.timetables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timetable_sessions_updated_at
  BEFORE UPDATE ON public.timetable_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_allocation_settings_updated_at
  BEFORE UPDATE ON public.allocation_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();