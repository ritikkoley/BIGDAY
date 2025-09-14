/*
  # Holistic Progress Card (HPC) System Database Schema
  
  This migration creates the complete HPC system for CBSE-compliant 360° student evaluation.
  
  ## 1. New Tables
    - `hpc_parameters` - CBSE evaluation parameters (scholastic, co-scholastic, life skills)
    - `hpc_rubrics` - 5-level performance descriptors (A+ to D)
    - `hpc_parameter_assignments` - Role-based evaluation responsibilities
    - `hpc_evaluations` - Multi-stakeholder evaluation inputs
    - `hpc_evaluation_cycles` - Evaluation periods and deadlines
    - `hpc_reports` - Compiled student reports with approval workflow
    - `hpc_approval_workflows` - Multi-step approval process
    - `hpc_analytics` - Performance analytics and growth tracking
    - `hpc_achievements` - Student achievements and certificates
    - `hpc_reflections` - Student self-reflections and goal setting
    - `hpc_conversations` - AI bot interactions for HPC guidance

  ## 2. Security
    - Enable RLS on all tables
    - Role-based access policies
    - Data privacy protection
    - Audit trail integration

  ## 3. Performance
    - Optimized indexes for common queries
    - Full-text search capabilities
    - Efficient aggregation functions
*/

-- Create HPC Parameters table
CREATE TABLE IF NOT EXISTS public.hpc_parameters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('scholastic', 'co_scholastic', 'life_skills', 'discipline')),
  sub_category text NOT NULL,
  weightage decimal NOT NULL CHECK (weightage > 0 AND weightage <= 1),
  description text NOT NULL,
  cbse_code text NOT NULL,
  grade_applicability text[] NOT NULL DEFAULT '{}',
  evaluation_frequency text NOT NULL CHECK (evaluation_frequency IN ('continuous', 'periodic', 'annual')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cbse_code)
);

-- Create HPC Rubrics table
CREATE TABLE IF NOT EXISTS public.hpc_rubrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parameter_id uuid NOT NULL REFERENCES public.hpc_parameters(id) ON DELETE CASCADE,
  level text NOT NULL CHECK (level IN ('A+', 'A', 'B', 'C', 'D')),
  grade_equivalent text NOT NULL CHECK (grade_equivalent IN ('outstanding', 'excellent', 'good', 'satisfactory', 'needs_improvement')),
  descriptor text NOT NULL,
  detailed_description text NOT NULL,
  examples text[] DEFAULT '{}',
  indicators text[] DEFAULT '{}',
  version integer DEFAULT 1,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parameter_id, level, version)
);

-- Create HPC Parameter Assignments table
CREATE TABLE IF NOT EXISTS public.hpc_parameter_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parameter_id uuid NOT NULL REFERENCES public.hpc_parameters(id) ON DELETE CASCADE,
  evaluator_role text NOT NULL CHECK (evaluator_role IN ('teacher', 'parent', 'peer', 'self', 'counselor', 'coach')),
  is_required boolean DEFAULT true,
  weightage decimal NOT NULL CHECK (weightage > 0 AND weightage <= 1),
  evaluation_frequency text NOT NULL CHECK (evaluation_frequency IN ('continuous', 'periodic', 'annual')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(parameter_id, evaluator_role)
);

-- Create HPC Evaluation Cycles table
CREATE TABLE IF NOT EXISTS public.hpc_evaluation_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  cycle_type text NOT NULL CHECK (cycle_type IN ('continuous', 'mid_term', 'final', 'annual')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  parameters text[] DEFAULT '{}',
  evaluator_roles text[] DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('planned', 'active', 'completed', 'cancelled')) DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create HPC Evaluations table
CREATE TABLE IF NOT EXISTS public.hpc_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  parameter_id uuid NOT NULL REFERENCES public.hpc_parameters(id) ON DELETE CASCADE,
  evaluator_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  evaluator_role text NOT NULL CHECK (evaluator_role IN ('teacher', 'parent', 'peer', 'self', 'counselor', 'coach')),
  score decimal NOT NULL CHECK (score >= 1 AND score <= 5),
  grade text NOT NULL CHECK (grade IN ('A+', 'A', 'B', 'C', 'D')),
  qualitative_remark text NOT NULL,
  evidence_notes text,
  confidence_level decimal CHECK (confidence_level >= 0 AND confidence_level <= 1),
  evaluation_date date DEFAULT CURRENT_DATE,
  term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  cycle_id uuid REFERENCES public.hpc_evaluation_cycles(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved')) DEFAULT 'draft',
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, parameter_id, evaluator_id, term_id, version)
);

-- Create HPC Reports table
CREATE TABLE IF NOT EXISTS public.hpc_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  cycle_id uuid REFERENCES public.hpc_evaluation_cycles(id) ON DELETE SET NULL,
  overall_grade text NOT NULL CHECK (overall_grade IN ('A+', 'A', 'B', 'C', 'D')),
  overall_score decimal NOT NULL CHECK (overall_score >= 1 AND overall_score <= 5),
  summary_json jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('draft', 'under_review', 'approved', 'published')) DEFAULT 'draft',
  compiled_at timestamptz DEFAULT now(),
  compiled_by uuid NOT NULL REFERENCES public.user_profiles(id),
  approved_at timestamptz,
  approved_by uuid REFERENCES public.user_profiles(id),
  published_at timestamptz,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, term_id, version)
);

-- Create HPC Approval Workflows table
CREATE TABLE IF NOT EXISTS public.hpc_approval_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.hpc_reports(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  approver_role text NOT NULL CHECK (approver_role IN ('class_teacher', 'subject_teacher', 'counselor', 'principal', 'vice_principal')),
  approver_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('waiting', 'pending', 'approved', 'rejected', 'needs_revision')) DEFAULT 'waiting',
  assigned_at timestamptz,
  approved_at timestamptz,
  due_date timestamptz NOT NULL,
  comments text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_id, step_number)
);

-- Create HPC Analytics table
CREATE TABLE IF NOT EXISTS public.hpc_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  parameter_id uuid REFERENCES public.hpc_parameters(id) ON DELETE CASCADE,
  term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  report_id uuid REFERENCES public.hpc_reports(id) ON DELETE CASCADE,
  class_percentile decimal CHECK (class_percentile >= 0 AND class_percentile <= 100),
  grade_percentile decimal CHECK (grade_percentile >= 0 AND grade_percentile <= 100),
  school_percentile decimal CHECK (school_percentile >= 0 AND school_percentile <= 100),
  growth_trajectory text CHECK (growth_trajectory IN ('improving', 'declining', 'stable')),
  predicted_next_score decimal CHECK (predicted_next_score >= 1 AND predicted_next_score <= 5),
  confidence_interval jsonb DEFAULT '{}',
  strengths_identified text[] DEFAULT '{}',
  improvement_areas text[] DEFAULT '{}',
  risk_indicators text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create HPC Achievements table
CREATE TABLE IF NOT EXISTS public.hpc_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('academic', 'sports', 'arts', 'social', 'leadership', 'community')),
  description text NOT NULL,
  date_achieved date NOT NULL,
  evidence_url text,
  verified_by uuid NOT NULL REFERENCES public.user_profiles(id),
  points_awarded integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create HPC Reflections table
CREATE TABLE IF NOT EXISTS public.hpc_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  reflection_type text NOT NULL CHECK (reflection_type IN ('self_assessment', 'goal_setting', 'learning_journal', 'peer_feedback')),
  content text NOT NULL,
  goals_set text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create HPC Conversations table (for AI bot interactions)
CREATE TABLE IF NOT EXISTS public.hpc_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  context_type text CHECK (context_type IN ('evaluation_help', 'report_explanation', 'goal_setting', 'general')),
  timestamp timestamptz DEFAULT now()
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_hpc_parameters_category ON public.hpc_parameters(category);
CREATE INDEX IF NOT EXISTS idx_hpc_parameters_active ON public.hpc_parameters(active);
CREATE INDEX IF NOT EXISTS idx_hpc_parameters_grade ON public.hpc_parameters USING gin(grade_applicability);

CREATE INDEX IF NOT EXISTS idx_hpc_rubrics_parameter ON public.hpc_rubrics(parameter_id);
CREATE INDEX IF NOT EXISTS idx_hpc_rubrics_active ON public.hpc_rubrics(active);
CREATE INDEX IF NOT EXISTS idx_hpc_rubrics_version ON public.hpc_rubrics(parameter_id, version);

CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_student ON public.hpc_evaluations(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_parameter ON public.hpc_evaluations(parameter_id);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_evaluator ON public.hpc_evaluations(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_term ON public.hpc_evaluations(term_id);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_status ON public.hpc_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_student_term ON public.hpc_evaluations(student_id, term_id);

CREATE INDEX IF NOT EXISTS idx_hpc_reports_student ON public.hpc_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_reports_term ON public.hpc_reports(term_id);
CREATE INDEX IF NOT EXISTS idx_hpc_reports_status ON public.hpc_reports(status);
CREATE INDEX IF NOT EXISTS idx_hpc_reports_student_term ON public.hpc_reports(student_id, term_id);

CREATE INDEX IF NOT EXISTS idx_hpc_workflows_report ON public.hpc_approval_workflows(report_id);
CREATE INDEX IF NOT EXISTS idx_hpc_workflows_approver ON public.hpc_approval_workflows(approver_id);
CREATE INDEX IF NOT EXISTS idx_hpc_workflows_status ON public.hpc_approval_workflows(status);

CREATE INDEX IF NOT EXISTS idx_hpc_analytics_student ON public.hpc_analytics(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_analytics_term ON public.hpc_analytics(term_id);
CREATE INDEX IF NOT EXISTS idx_hpc_analytics_report ON public.hpc_analytics(report_id);

CREATE INDEX IF NOT EXISTS idx_hpc_achievements_student ON public.hpc_achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_achievements_category ON public.hpc_achievements(category);
CREATE INDEX IF NOT EXISTS idx_hpc_achievements_date ON public.hpc_achievements(date_achieved);

CREATE INDEX IF NOT EXISTS idx_hpc_reflections_student ON public.hpc_reflections(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_reflections_term ON public.hpc_reflections(term_id);

CREATE INDEX IF NOT EXISTS idx_hpc_conversations_user ON public.hpc_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_hpc_conversations_timestamp ON public.hpc_conversations(timestamp);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_search ON public.hpc_evaluations USING gin(
  to_tsvector('english', qualitative_remark || ' ' || coalesce(evidence_notes, ''))
);

CREATE INDEX IF NOT EXISTS idx_hpc_reflections_search ON public.hpc_reflections USING gin(
  to_tsvector('english', content)
);

-- Enable Row Level Security
ALTER TABLE public.hpc_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_parameter_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_evaluation_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for HPC Parameters
CREATE POLICY "Admins can manage HPC parameters"
  ON public.hpc_parameters
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view active HPC parameters"
  ON public.hpc_parameters
  FOR SELECT
  TO authenticated
  USING (active = true AND EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  ));

-- RLS Policies for HPC Rubrics
CREATE POLICY "Admins can manage HPC rubrics"
  ON public.hpc_rubrics
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Teachers can view active HPC rubrics"
  ON public.hpc_rubrics
  FOR SELECT
  TO authenticated
  USING (active = true AND EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  ));

-- RLS Policies for HPC Parameter Assignments
CREATE POLICY "Admins can manage parameter assignments"
  ON public.hpc_parameter_assignments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view relevant parameter assignments"
  ON public.hpc_parameter_assignments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('teacher', 'student', 'admin')
  ));

-- RLS Policies for HPC Evaluation Cycles
CREATE POLICY "Admins can manage evaluation cycles"
  ON public.hpc_evaluation_cycles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view active evaluation cycles"
  ON public.hpc_evaluation_cycles
  FOR SELECT
  TO authenticated
  USING (status = 'active' AND EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('teacher', 'student', 'admin')
  ));

-- RLS Policies for HPC Evaluations
CREATE POLICY "Admins can manage all HPC evaluations"
  ON public.hpc_evaluations
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Evaluators can manage their own evaluations"
  ON public.hpc_evaluations
  FOR ALL
  TO authenticated
  USING (evaluator_id = auth.uid());

CREATE POLICY "Students can view their own evaluations"
  ON public.hpc_evaluations
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view evaluations for their students"
  ON public.hpc_evaluations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.section_students ss
      JOIN public.section_courses sc ON ss.section_id = sc.section_id
      WHERE ss.student_id = hpc_evaluations.student_id 
      AND sc.teacher_id = auth.uid()
    )
  ));

-- RLS Policies for HPC Reports
CREATE POLICY "Admins can manage all HPC reports"
  ON public.hpc_reports
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Students can view their own published reports"
  ON public.hpc_reports
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() AND status = 'published');

CREATE POLICY "Teachers can view reports for their students"
  ON public.hpc_reports
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.section_students ss
      JOIN public.section_courses sc ON ss.section_id = sc.section_id
      WHERE ss.student_id = hpc_reports.student_id 
      AND sc.teacher_id = auth.uid()
    )
  ));

CREATE POLICY "Parents can view their children's published reports"
  ON public.hpc_reports
  FOR SELECT
  TO authenticated
  USING (status = 'published' AND EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'parent'
    AND up.profile_data->>'child_id' = hpc_reports.student_id::text
  ));

-- RLS Policies for HPC Approval Workflows
CREATE POLICY "Admins can manage approval workflows"
  ON public.hpc_approval_workflows
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Approvers can view and update their assigned workflows"
  ON public.hpc_approval_workflows
  FOR ALL
  TO authenticated
  USING (approver_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for HPC Analytics
CREATE POLICY "Admins can manage HPC analytics"
  ON public.hpc_analytics
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Students can view their own analytics"
  ON public.hpc_analytics
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view analytics for their students"
  ON public.hpc_analytics
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.section_students ss
      JOIN public.section_courses sc ON ss.section_id = sc.section_id
      WHERE ss.student_id = hpc_analytics.student_id 
      AND sc.teacher_id = auth.uid()
    )
  ));

-- RLS Policies for HPC Achievements
CREATE POLICY "Admins can manage achievements"
  ON public.hpc_achievements
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Students can view their own achievements"
  ON public.hpc_achievements
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can create achievements for their students"
  ON public.hpc_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (verified_by = auth.uid() AND EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'teacher'
  ));

-- RLS Policies for HPC Reflections
CREATE POLICY "Students can manage their own reflections"
  ON public.hpc_reflections
  FOR ALL
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view reflections for their students"
  ON public.hpc_reflections
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.section_students ss
      JOIN public.section_courses sc ON ss.section_id = sc.section_id
      WHERE ss.student_id = hpc_reflections.student_id 
      AND sc.teacher_id = auth.uid()
    )
  ));

CREATE POLICY "Admins can view all reflections"
  ON public.hpc_reflections
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for HPC Conversations
CREATE POLICY "Users can manage their own HPC conversations"
  ON public.hpc_conversations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hpc_parameters_updated_at
  BEFORE UPDATE ON public.hpc_parameters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hpc_evaluation_cycles_updated_at
  BEFORE UPDATE ON public.hpc_evaluation_cycles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hpc_evaluations_updated_at
  BEFORE UPDATE ON public.hpc_evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hpc_reports_updated_at
  BEFORE UPDATE ON public.hpc_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hpc_analytics_updated_at
  BEFORE UPDATE ON public.hpc_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hpc_reflections_updated_at
  BEFORE UPDATE ON public.hpc_reflections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo HPC parameters
INSERT INTO public.hpc_parameters (id, name, category, sub_category, weightage, description, cbse_code, grade_applicability, evaluation_frequency, active) VALUES
('hpc-param-001', 'Mathematics', 'scholastic', 'core_subject', 0.20, 'Mathematical reasoning, problem-solving, and computational skills', 'MATH', '["5","6","7","8","9","10"]', 'continuous', true),
('hpc-param-002', 'Creativity & Innovation', 'co_scholastic', 'arts_creativity', 0.15, 'Creative thinking, artistic expression, and innovative problem-solving', 'CREAT', '["5","6","7","8","9","10"]', 'periodic', true),
('hpc-param-003', 'Teamwork & Collaboration', 'life_skills', 'social_skills', 0.12, 'Ability to work effectively in teams and collaborate with peers', 'TEAM', '["5","6","7","8","9","10"]', 'continuous', true),
('hpc-param-004', 'Empathy & Compassion', 'life_skills', 'emotional_intelligence', 0.10, 'Understanding others'' feelings and showing care and concern', 'EMPATH', '["5","6","7","8","9","10"]', 'periodic', true),
('hpc-param-005', 'Physical Fitness & Health', 'co_scholastic', 'health_physical', 0.08, 'Physical fitness, health awareness, and sports participation', 'PHYS', '["5","6","7","8","9","10"]', 'continuous', true),
('hpc-param-006', 'Discipline & Responsibility', 'discipline', 'behavioral', 0.10, 'Self-discipline, responsibility, and adherence to school values', 'DISC', '["5","6","7","8","9","10"]', 'continuous', true);

-- Insert demo HPC rubrics (sample for Mathematics)
INSERT INTO public.hpc_rubrics (id, parameter_id, level, grade_equivalent, descriptor, detailed_description, examples, indicators, version, active) VALUES
('rubric-math-001', 'hpc-param-001', 'A+', 'outstanding', 'Exceptional mathematical understanding and problem-solving ability', 'Demonstrates exceptional mathematical reasoning, solves complex problems independently, and shows deep conceptual understanding', '["Solves multi-step problems creatively", "Explains mathematical concepts clearly to peers", "Makes connections between different mathematical topics"]', '["95-100% accuracy in assessments", "Helps other students", "Shows mathematical creativity"]', 1, true),
('rubric-math-002', 'hpc-param-001', 'A', 'excellent', 'Strong mathematical skills with good problem-solving ability', 'Shows solid mathematical understanding, solves problems systematically, and demonstrates good conceptual grasp', '["Solves standard problems accurately", "Shows clear working", "Understands mathematical concepts well"]', '["85-94% accuracy in assessments", "Consistent performance", "Good mathematical reasoning"]', 1, true),
('rubric-math-003', 'hpc-param-001', 'B', 'good', 'Satisfactory mathematical understanding with some support needed', 'Demonstrates basic mathematical skills, solves routine problems, but needs guidance for complex tasks', '["Solves basic problems correctly", "Follows standard procedures", "Needs help with word problems"]', '["70-84% accuracy in assessments", "Requires occasional support", "Improving gradually"]', 1, true),
('rubric-math-004', 'hpc-param-001', 'C', 'satisfactory', 'Basic mathematical skills with regular support required', 'Shows elementary mathematical understanding, struggles with problem-solving, needs regular guidance', '["Solves simple problems with help", "Makes computational errors", "Difficulty with concepts"]', '["55-69% accuracy in assessments", "Needs regular support", "Slow progress"]', 1, true),
('rubric-math-005', 'hpc-param-001', 'D', 'needs_improvement', 'Significant mathematical difficulties requiring intensive support', 'Shows limited mathematical understanding, requires extensive support and intervention', '["Struggles with basic operations", "Cannot solve problems independently", "Lacks foundational concepts"]', '["Below 55% accuracy", "Requires intensive support", "Needs remedial intervention"]', 1, true);

-- Insert demo parameter assignments
INSERT INTO public.hpc_parameter_assignments (id, parameter_id, evaluator_role, is_required, weightage, evaluation_frequency) VALUES
-- Mathematics
('assign-001', 'hpc-param-001', 'teacher', true, 0.70, 'continuous'),
('assign-002', 'hpc-param-001', 'parent', true, 0.20, 'periodic'),
('assign-003', 'hpc-param-001', 'self', true, 0.10, 'periodic'),

-- Creativity
('assign-004', 'hpc-param-002', 'teacher', true, 0.60, 'continuous'),
('assign-005', 'hpc-param-002', 'peer', true, 0.25, 'periodic'),
('assign-006', 'hpc-param-002', 'self', true, 0.15, 'periodic'),

-- Teamwork
('assign-007', 'hpc-param-003', 'teacher', true, 0.50, 'continuous'),
('assign-008', 'hpc-param-003', 'peer', true, 0.30, 'continuous'),
('assign-009', 'hpc-param-003', 'parent', false, 0.10, 'periodic'),
('assign-010', 'hpc-param-003', 'self', true, 0.10, 'periodic');

-- Create database functions for HPC processing
CREATE OR REPLACE FUNCTION calculate_hpc_parameter_score(
  p_student_id uuid,
  p_parameter_id uuid,
  p_term_id uuid
) RETURNS decimal AS $$
DECLARE
  weighted_sum decimal := 0;
  total_weight decimal := 0;
  assignment_record RECORD;
  evaluation_avg decimal;
BEGIN
  -- Get parameter assignments with weightages
  FOR assignment_record IN 
    SELECT evaluator_role, weightage 
    FROM hpc_parameter_assignments 
    WHERE parameter_id = p_parameter_id
  LOOP
    -- Get average score for this role
    SELECT AVG(score) INTO evaluation_avg
    FROM hpc_evaluations
    WHERE student_id = p_student_id
      AND parameter_id = p_parameter_id
      AND term_id = p_term_id
      AND evaluator_role = assignment_record.evaluator_role
      AND status = 'submitted';
    
    -- Apply weightage if evaluation exists
    IF evaluation_avg IS NOT NULL THEN
      weighted_sum := weighted_sum + (evaluation_avg * assignment_record.weightage);
      total_weight := total_weight + assignment_record.weightage;
    END IF;
  END LOOP;
  
  -- Return weighted average or 0 if no evaluations
  RETURN CASE WHEN total_weight > 0 THEN weighted_sum / total_weight ELSE 0 END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_hpc_overall_score(
  p_student_id uuid,
  p_term_id uuid
) RETURNS decimal AS $$
DECLARE
  weighted_sum decimal := 0;
  total_weight decimal := 0;
  parameter_record RECORD;
  parameter_score decimal;
BEGIN
  -- Get all active parameters with their weightages
  FOR parameter_record IN 
    SELECT id, weightage 
    FROM hpc_parameters 
    WHERE active = true
  LOOP
    -- Calculate parameter score
    SELECT calculate_hpc_parameter_score(p_student_id, parameter_record.id, p_term_id) 
    INTO parameter_score;
    
    -- Apply parameter weightage if score exists
    IF parameter_score > 0 THEN
      weighted_sum := weighted_sum + (parameter_score * parameter_record.weightage);
      total_weight := total_weight + parameter_record.weightage;
    END IF;
  END LOOP;
  
  -- Return overall weighted average
  RETURN CASE WHEN total_weight > 0 THEN weighted_sum / total_weight ELSE 0 END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION convert_score_to_grade(score decimal) 
RETURNS text AS $$
BEGIN
  CASE 
    WHEN score >= 4.5 THEN RETURN 'A+';
    WHEN score >= 3.5 THEN RETURN 'A';
    WHEN score >= 2.5 THEN RETURN 'B';
    WHEN score >= 1.5 THEN RETURN 'C';
    ELSE RETURN 'D';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create view for student HPC summary
CREATE OR REPLACE VIEW hpc_student_summary AS
SELECT 
  up.id as student_id,
  up.full_name as student_name,
  up.current_standard as grade,
  up.section,
  up.admission_number,
  hr.overall_grade,
  hr.overall_score,
  hr.status as report_status,
  hr.compiled_at,
  COUNT(he.id) as total_evaluations,
  AVG(he.score) as average_evaluation_score
FROM public.user_profiles up
LEFT JOIN public.hpc_reports hr ON up.id = hr.student_id
LEFT JOIN public.hpc_evaluations he ON up.id = he.student_id
WHERE up.role = 'student'
GROUP BY up.id, up.full_name, up.current_standard, up.section, 
         up.admission_number, hr.overall_grade, hr.overall_score, 
         hr.status, hr.compiled_at;