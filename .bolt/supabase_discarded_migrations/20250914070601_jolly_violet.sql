/*
  # Holistic Progress Card (HPC) System Database Schema
  
  This migration creates a comprehensive CBSE-compliant 360° student evaluation system
  that integrates with the existing BIG DAY education management platform.
  
  ## 1. Core Tables
    - `hpc_parameters` - CBSE evaluation parameters and criteria
    - `hpc_rubrics` - Detailed rubrics and descriptors for each parameter
    - `hpc_evaluations` - Individual evaluation inputs from all stakeholders
    - `hpc_reports` - Compiled final reports per student per term
    - `hpc_evaluation_cycles` - Evaluation periods and deadlines
    - `hpc_stakeholder_assignments` - Who evaluates whom
    - `hpc_achievements` - Student achievements and recognitions
    - `hpc_reflections` - Stakeholder reflections and feedback
    - `hpc_analytics` - Aggregated analytics and insights
    - `hpc_templates` - Report templates and formats
    - `hpc_approvals` - Report approval workflow
    - `hpc_exports` - Export history and file management
  
  ## 2. Security
    - Enable RLS on all tables
    - Role-based access policies
    - Data privacy and CBSE compliance
  
  ## 3. Performance
    - Optimized indexes for report generation
    - Efficient aggregation queries
    - Scalable for large student populations
*/

-- =====================================================
-- 1. HPC PARAMETERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_parameters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parameter Identity
  code text NOT NULL UNIQUE, -- e.g., 'MATH_PROBLEM_SOLVING', 'TEAMWORK_COLLAB'
  name text NOT NULL,
  description text,
  
  -- CBSE Classification
  category text NOT NULL CHECK (category IN (
    'scholastic',           -- Subject-based academic performance
    'co_scholastic_arts',   -- Visual/performing arts
    'co_scholastic_sports', -- Physical education and sports
    'co_scholastic_health', -- Health and wellness
    'co_scholastic_work',   -- Work education and vocational skills
    'life_skills',          -- Life skills and values
    'discipline',           -- Behavioral aspects
    'achievements'          -- Awards and recognitions
  )),
  
  -- Evaluation Configuration
  evaluation_type text NOT NULL CHECK (evaluation_type IN (
    'quantitative',  -- 1-5 scale scoring
    'qualitative',   -- Descriptive feedback only
    'mixed'          -- Both score and remarks
  )) DEFAULT 'mixed',
  
  min_score decimal DEFAULT 1,
  max_score decimal DEFAULT 5,
  weightage decimal DEFAULT 1.0 CHECK (weightage > 0),
  
  -- Stakeholder Configuration
  evaluator_roles text[] DEFAULT ARRAY['teacher'], -- Who can evaluate this parameter
  is_self_assessment boolean DEFAULT false,
  is_peer_assessment boolean DEFAULT false,
  is_parent_assessment boolean DEFAULT false,
  
  -- Hierarchy and Grouping
  parent_parameter_id uuid REFERENCES public.hpc_parameters(id),
  display_order integer DEFAULT 1,
  grade_levels text[] DEFAULT ARRAY['6','7','8','9','10','11','12'],
  
  -- Metadata
  cbse_reference text, -- Official CBSE document reference
  version text DEFAULT '1.0',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id),
  updated_by uuid REFERENCES public.user_profiles(id)
);

-- =====================================================
-- 2. HPC RUBRICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_rubrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Rubric Identity
  parameter_id uuid NOT NULL REFERENCES public.hpc_parameters(id) ON DELETE CASCADE,
  level integer NOT NULL CHECK (level BETWEEN 1 AND 5), -- Performance level (1=Needs Improvement, 5=Outstanding)
  
  -- Rubric Content
  descriptor text NOT NULL, -- Detailed description of this performance level
  indicators text[], -- Specific behavioral indicators
  examples text[], -- Concrete examples for this level
  
  -- Localization Support
  descriptor_hindi text,
  descriptor_regional text,
  language_code text DEFAULT 'en',
  
  -- Version Control
  version text NOT NULL DEFAULT '1.0',
  effective_from date DEFAULT CURRENT_DATE,
  effective_to date,
  active boolean DEFAULT true,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id),
  
  UNIQUE(parameter_id, level, version)
);

-- =====================================================
-- 3. HPC EVALUATION CYCLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_evaluation_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Cycle Identity
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  name text NOT NULL, -- e.g., 'Term 1 HPC Evaluation', 'Annual Assessment'
  cycle_type text NOT NULL CHECK (cycle_type IN ('term', 'semester', 'annual', 'continuous')),
  
  -- Timeline
  start_date date NOT NULL,
  end_date date NOT NULL,
  evaluation_deadline date NOT NULL,
  report_deadline date NOT NULL,
  
  -- Configuration
  parameters jsonb DEFAULT '[]'::jsonb, -- Array of parameter IDs to evaluate
  target_grades text[] DEFAULT ARRAY['6','7','8','9','10','11','12'],
  
  -- Status
  status text NOT NULL CHECK (status IN ('draft', 'active', 'evaluation_phase', 'compilation_phase', 'completed', 'archived')) DEFAULT 'draft',
  
  -- Metadata
  instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id)
);

-- =====================================================
-- 4. HPC STAKEHOLDER ASSIGNMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_stakeholder_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Assignment Identity
  evaluation_cycle_id uuid NOT NULL REFERENCES public.hpc_evaluation_cycles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  evaluator_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Assignment Details
  evaluator_role text NOT NULL CHECK (evaluator_role IN (
    'class_teacher',     -- Primary class teacher
    'subject_teacher',   -- Subject-specific teacher
    'peer',             -- Fellow student
    'parent',           -- Parent/guardian
    'self',             -- Student self-assessment
    'admin',            -- Administrative staff
    'counselor',        -- School counselor
    'coach'             -- Sports/activity coach
  )),
  
  -- Scope Configuration
  parameter_ids uuid[] DEFAULT ARRAY[]::uuid[], -- Specific parameters this evaluator assesses
  subjects text[], -- For subject teachers, which subjects they evaluate
  
  -- Status
  assignment_status text NOT NULL CHECK (assignment_status IN ('assigned', 'in_progress', 'completed', 'overdue')) DEFAULT 'assigned',
  notified_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id),
  
  UNIQUE(evaluation_cycle_id, student_id, evaluator_id, evaluator_role)
);

-- =====================================================
-- 5. HPC EVALUATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Evaluation Identity
  evaluation_cycle_id uuid NOT NULL REFERENCES public.hpc_evaluation_cycles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  parameter_id uuid NOT NULL REFERENCES public.hpc_parameters(id) ON DELETE CASCADE,
  evaluator_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Evaluation Content
  score decimal CHECK (score >= 1 AND score <= 5),
  qualitative_remark text,
  evidence_description text, -- Supporting evidence for the evaluation
  improvement_suggestions text,
  
  -- Context
  evaluator_role text NOT NULL CHECK (evaluator_role IN (
    'class_teacher', 'subject_teacher', 'peer', 'parent', 'self', 'admin', 'counselor', 'coach'
  )),
  subject_context text, -- For subject-specific evaluations
  activity_context text, -- For activity-specific evaluations
  
  -- Evaluation Metadata
  confidence_level integer CHECK (confidence_level BETWEEN 1 AND 5), -- Evaluator's confidence in their assessment
  observation_period text, -- Time period of observation
  evaluation_method text, -- How the evaluation was conducted
  
  -- Status and Workflow
  status text NOT NULL CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved', 'rejected')) DEFAULT 'draft',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES public.user_profiles(id),
  
  -- Version Control
  version integer DEFAULT 1,
  is_latest boolean DEFAULT true,
  replaced_by uuid REFERENCES public.hpc_evaluations(id),
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(evaluation_cycle_id, student_id, parameter_id, evaluator_id, version)
);

-- =====================================================
-- 6. HPC ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Achievement Identity
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  
  -- Achievement Details
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN (
    'academic',           -- Academic competitions, olympiads
    'sports',            -- Sports achievements
    'arts',              -- Cultural and artistic achievements
    'leadership',        -- Leadership roles and responsibilities
    'community_service', -- Social service and community work
    'innovation',        -- Creative projects and innovations
    'character',         -- Character and values demonstration
    'special_recognition' -- Special awards and recognitions
  )),
  
  -- Achievement Metadata
  level text CHECK (level IN ('school', 'district', 'state', 'national', 'international')),
  position text, -- 1st, 2nd, 3rd, Participation, etc.
  date_achieved date,
  issuing_authority text,
  certificate_number text,
  
  -- Evidence and Documentation
  evidence_files text[], -- File paths for certificates, photos, etc.
  witness_teacher_id uuid REFERENCES public.user_profiles(id),
  verification_status text CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  
  -- Impact Assessment
  impact_score integer CHECK (impact_score BETWEEN 1 AND 10), -- Impact on student development
  skills_demonstrated text[], -- Skills showcased through this achievement
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id),
  verified_by uuid REFERENCES public.user_profiles(id),
  verified_at timestamptz
);

-- =====================================================
-- 7. HPC REFLECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reflection Identity
  evaluation_cycle_id uuid NOT NULL REFERENCES public.hpc_evaluation_cycles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reflector_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Reflection Content
  reflector_role text NOT NULL CHECK (reflector_role IN (
    'student',      -- Student self-reflection
    'parent',       -- Parent observations
    'teacher',      -- Teacher insights
    'peer',         -- Peer feedback
    'mentor'        -- Mentor guidance
  )),
  
  -- Structured Reflection
  strengths text NOT NULL,
  areas_for_improvement text NOT NULL,
  goals_for_next_term text,
  support_needed text,
  
  -- Specific Reflection Areas
  academic_reflection text,
  social_emotional_reflection text,
  creative_reflection text,
  physical_development_reflection text,
  
  -- Learning Journey
  learning_highlights text[],
  challenges_faced text[],
  strategies_used text[],
  future_aspirations text,
  
  -- Metadata
  reflection_date date DEFAULT CURRENT_DATE,
  is_confidential boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 8. HPC REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Report Identity
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  evaluation_cycle_id uuid NOT NULL REFERENCES public.hpc_evaluation_cycles(id) ON DELETE CASCADE,
  
  -- Report Content
  overall_grade text CHECK (overall_grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E')),
  overall_percentage decimal CHECK (overall_percentage >= 0 AND overall_percentage <= 100),
  
  -- Aggregated Scores by Category
  scholastic_score decimal,
  co_scholastic_score decimal,
  life_skills_score decimal,
  discipline_score decimal,
  
  -- Comprehensive Summary
  summary_json jsonb DEFAULT '{}'::jsonb, -- Detailed breakdown of all evaluations
  strengths_summary text,
  improvement_areas_summary text,
  recommendations text,
  
  -- Teacher Comments
  class_teacher_comment text,
  principal_comment text,
  
  -- Report Status and Workflow
  status text NOT NULL CHECK (status IN (
    'draft',           -- Being compiled
    'under_review',    -- Under teacher/admin review
    'approved',        -- Approved for publication
    'published',       -- Published to student/parents
    'archived'         -- Archived after term completion
  )) DEFAULT 'draft',
  
  -- Workflow Timestamps
  compiled_at timestamptz,
  compiled_by uuid REFERENCES public.user_profiles(id),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES public.user_profiles(id),
  approved_at timestamptz,
  approved_by uuid REFERENCES public.user_profiles(id),
  published_at timestamptz,
  published_by uuid REFERENCES public.user_profiles(id),
  
  -- Version Control
  version integer DEFAULT 1,
  is_latest boolean DEFAULT true,
  previous_version_id uuid REFERENCES public.hpc_reports(id),
  
  -- Export and Sharing
  pdf_generated boolean DEFAULT false,
  pdf_file_path text,
  shared_with_parents boolean DEFAULT false,
  parent_acknowledgment_at timestamptz,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(student_id, academic_term_id, evaluation_cycle_id, version)
);

-- =====================================================
-- 9. HPC ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Analytics Identity
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  
  -- Performance Analytics
  growth_trajectory jsonb DEFAULT '{}'::jsonb, -- Term-over-term growth patterns
  strength_areas text[],
  development_areas text[],
  
  -- Comparative Analytics
  class_percentile decimal,
  grade_percentile decimal,
  school_percentile decimal,
  
  -- Predictive Insights
  predicted_performance jsonb DEFAULT '{}'::jsonb,
  risk_indicators text[],
  intervention_recommendations text[],
  
  -- Behavioral Patterns
  consistency_score decimal, -- How consistent performance is across parameters
  improvement_velocity decimal, -- Rate of improvement over time
  peer_collaboration_score decimal,
  
  -- AI-Generated Insights
  ai_summary text,
  personalized_recommendations text[],
  learning_style_indicators text[],
  
  -- Metadata
  calculated_at timestamptz DEFAULT now(),
  calculation_version text DEFAULT '1.0',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(student_id, academic_term_id)
);

-- =====================================================
-- 10. HPC TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template Identity
  name text NOT NULL,
  template_type text NOT NULL CHECK (template_type IN (
    'report_card',      -- Main HPC report format
    'evaluation_form',  -- Evaluation input form
    'reflection_form',  -- Reflection input form
    'summary_report',   -- Summary analytics report
    'parent_report'     -- Parent-friendly report
  )),
  
  -- Template Configuration
  grade_levels text[] DEFAULT ARRAY['6','7','8','9','10','11','12'],
  parameters_included uuid[], -- Which parameters to include
  
  -- Template Content
  template_structure jsonb NOT NULL DEFAULT '{}'::jsonb, -- JSON structure of the template
  css_styles text, -- Custom styling for reports
  header_content text,
  footer_content text,
  
  -- Branding and Customization
  school_logo_url text,
  color_scheme jsonb DEFAULT '{}'::jsonb,
  font_preferences jsonb DEFAULT '{}'::jsonb,
  
  -- Version Control
  version text DEFAULT '1.0',
  is_default boolean DEFAULT false,
  active boolean DEFAULT true,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id),
  
  UNIQUE(name, version)
);

-- =====================================================
-- 11. HPC APPROVALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Approval Identity
  report_id uuid NOT NULL REFERENCES public.hpc_reports(id) ON DELETE CASCADE,
  approver_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Approval Details
  approval_level text NOT NULL CHECK (approval_level IN (
    'class_teacher',    -- Class teacher review
    'subject_teacher',  -- Subject teacher verification
    'coordinator',      -- Academic coordinator approval
    'principal',        -- Principal final approval
    'parent'           -- Parent acknowledgment
  )),
  
  approval_status text NOT NULL CHECK (approval_status IN (
    'pending',          -- Awaiting approval
    'approved',         -- Approved
    'rejected',         -- Rejected with comments
    'revision_required' -- Needs revision
  )) DEFAULT 'pending',
  
  -- Approval Content
  comments text,
  suggestions text,
  conditions text, -- Any conditions for approval
  
  -- Workflow
  requested_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  escalated_to uuid REFERENCES public.user_profiles(id),
  escalated_at timestamptz,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(report_id, approver_id, approval_level)
);

-- =====================================================
-- 12. HPC EXPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Export Identity
  export_type text NOT NULL CHECK (export_type IN (
    'individual_report',  -- Single student report
    'class_summary',     -- Class-wise summary
    'grade_analytics',   -- Grade-level analytics
    'school_dashboard',  -- School-wide dashboard
    'cbse_compliance'    -- CBSE compliance report
  )),
  
  -- Export Scope
  student_ids uuid[], -- For individual/batch exports
  class_ids uuid[],   -- For class-wise exports
  grade_levels text[], -- For grade-level exports
  academic_term_id uuid REFERENCES public.academic_terms(id),
  
  -- Export Configuration
  format text NOT NULL CHECK (format IN ('pdf', 'excel', 'csv', 'json')) DEFAULT 'pdf',
  template_id uuid REFERENCES public.hpc_templates(id),
  include_analytics boolean DEFAULT true,
  include_reflections boolean DEFAULT true,
  include_achievements boolean DEFAULT true,
  
  -- Export Status
  status text NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')) DEFAULT 'queued',
  file_path text,
  file_size bigint,
  download_count integer DEFAULT 0,
  
  -- Access Control
  generated_by uuid NOT NULL REFERENCES public.user_profiles(id),
  accessible_to text[] DEFAULT ARRAY['admin'], -- Roles that can access this export
  expires_at timestamptz,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  error_message text
);

-- =====================================================
-- 13. HPC PARAMETER WEIGHTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_parameter_weights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Weight Configuration
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  grade_level text NOT NULL,
  parameter_id uuid NOT NULL REFERENCES public.hpc_parameters(id) ON DELETE CASCADE,
  
  -- Weight Details
  weightage decimal NOT NULL CHECK (weightage > 0 AND weightage <= 1),
  evaluator_role text NOT NULL,
  
  -- Conditional Weights
  subject_specific boolean DEFAULT false,
  subject_code text, -- For subject-specific parameters
  
  -- Metadata
  effective_from date DEFAULT CURRENT_DATE,
  effective_to date,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id),
  
  UNIQUE(academic_term_id, grade_level, parameter_id, evaluator_role, subject_code)
);

-- =====================================================
-- 14. HPC STUDENT GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hpc_student_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Goal Identity
  student_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  academic_term_id uuid NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  parameter_id uuid REFERENCES public.hpc_parameters(id) ON DELETE CASCADE,
  
  -- Goal Details
  goal_title text NOT NULL,
  goal_description text NOT NULL,
  target_score decimal,
  target_date date,
  
  -- Goal Category
  goal_type text NOT NULL CHECK (goal_type IN (
    'academic',         -- Academic improvement goals
    'behavioral',       -- Behavioral development goals
    'skill_development', -- Skill building goals
    'extracurricular',  -- Activity participation goals
    'personal'          -- Personal development goals
  )),
  
  -- Progress Tracking
  current_progress decimal DEFAULT 0 CHECK (current_progress >= 0 AND current_progress <= 100),
  milestones jsonb DEFAULT '[]'::jsonb,
  
  -- Support System
  mentor_teacher_id uuid REFERENCES public.user_profiles(id),
  parent_involvement_level text CHECK (parent_involvement_level IN ('high', 'medium', 'low')),
  peer_support_group text[],
  
  -- Status
  status text NOT NULL CHECK (status IN ('active', 'achieved', 'modified', 'abandoned')) DEFAULT 'active',
  achieved_at timestamptz,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- HPC Parameters indexes
CREATE INDEX IF NOT EXISTS idx_hpc_parameters_category ON public.hpc_parameters(category);
CREATE INDEX IF NOT EXISTS idx_hpc_parameters_active ON public.hpc_parameters(active);
CREATE INDEX IF NOT EXISTS idx_hpc_parameters_grade_levels ON public.hpc_parameters USING gin(grade_levels);
CREATE INDEX IF NOT EXISTS idx_hpc_parameters_evaluator_roles ON public.hpc_parameters USING gin(evaluator_roles);

-- HPC Rubrics indexes
CREATE INDEX IF NOT EXISTS idx_hpc_rubrics_parameter ON public.hpc_rubrics(parameter_id);
CREATE INDEX IF NOT EXISTS idx_hpc_rubrics_level ON public.hpc_rubrics(level);
CREATE INDEX IF NOT EXISTS idx_hpc_rubrics_active ON public.hpc_rubrics(active);

-- HPC Evaluation Cycles indexes
CREATE INDEX IF NOT EXISTS idx_hpc_cycles_term ON public.hpc_evaluation_cycles(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_hpc_cycles_status ON public.hpc_evaluation_cycles(status);
CREATE INDEX IF NOT EXISTS idx_hpc_cycles_dates ON public.hpc_evaluation_cycles(start_date, end_date);

-- HPC Stakeholder Assignments indexes
CREATE INDEX IF NOT EXISTS idx_hpc_assignments_cycle ON public.hpc_stakeholder_assignments(evaluation_cycle_id);
CREATE INDEX IF NOT EXISTS idx_hpc_assignments_student ON public.hpc_stakeholder_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_assignments_evaluator ON public.hpc_stakeholder_assignments(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_hpc_assignments_status ON public.hpc_stakeholder_assignments(assignment_status);

-- HPC Evaluations indexes (Critical for performance)
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_student ON public.hpc_evaluations(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_parameter ON public.hpc_evaluations(parameter_id);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_evaluator ON public.hpc_evaluations(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_cycle ON public.hpc_evaluations(evaluation_cycle_id);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_status ON public.hpc_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_latest ON public.hpc_evaluations(is_latest) WHERE is_latest = true;
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_composite ON public.hpc_evaluations(student_id, evaluation_cycle_id, parameter_id);

-- HPC Reports indexes
CREATE INDEX IF NOT EXISTS idx_hpc_reports_student ON public.hpc_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_reports_term ON public.hpc_reports(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_hpc_reports_status ON public.hpc_reports(status);
CREATE INDEX IF NOT EXISTS idx_hpc_reports_latest ON public.hpc_reports(is_latest) WHERE is_latest = true;

-- HPC Achievements indexes
CREATE INDEX IF NOT EXISTS idx_hpc_achievements_student ON public.hpc_achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_achievements_term ON public.hpc_achievements(academic_term_id);
CREATE INDEX IF NOT EXISTS idx_hpc_achievements_category ON public.hpc_achievements(category);
CREATE INDEX IF NOT EXISTS idx_hpc_achievements_level ON public.hpc_achievements(level);

-- HPC Analytics indexes
CREATE INDEX IF NOT EXISTS idx_hpc_analytics_student ON public.hpc_analytics(student_id);
CREATE INDEX IF NOT EXISTS idx_hpc_analytics_term ON public.hpc_analytics(academic_term_id);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all HPC tables
ALTER TABLE public.hpc_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_evaluation_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_stakeholder_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_parameter_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpc_student_goals ENABLE ROW LEVEL SECURITY;

-- Admin policies (full access)
CREATE POLICY "Admins can manage HPC parameters"
  ON public.hpc_parameters FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage HPC rubrics"
  ON public.hpc_rubrics FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage HPC evaluation cycles"
  ON public.hpc_evaluation_cycles FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage HPC stakeholder assignments"
  ON public.hpc_stakeholder_assignments FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage HPC reports"
  ON public.hpc_reports FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage HPC templates"
  ON public.hpc_templates FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage HPC exports"
  ON public.hpc_exports FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Teacher policies (evaluation and viewing)
CREATE POLICY "Teachers can view relevant HPC parameters"
  ON public.hpc_parameters FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

CREATE POLICY "Teachers can view HPC rubrics"
  ON public.hpc_rubrics FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

CREATE POLICY "Teachers can manage their HPC evaluations"
  ON public.hpc_evaluations FOR ALL TO authenticated
  USING (
    evaluator_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Teachers can view their students' reports"
  ON public.hpc_reports FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.hpc_stakeholder_assignments hsa
      WHERE hsa.student_id = hpc_reports.student_id 
        AND hsa.evaluator_id = auth.uid()
        AND hsa.evaluator_role IN ('class_teacher', 'subject_teacher')
    ) OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Student policies (self-assessment and viewing own data)
CREATE POLICY "Students can view their own HPC data"
  ON public.hpc_evaluations FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create self-assessments"
  ON public.hpc_evaluations FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND 
    evaluator_id = auth.uid() AND 
    evaluator_role = 'self'
  );

CREATE POLICY "Students can view their own reports"
  ON public.hpc_reports FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can manage their own achievements"
  ON public.hpc_achievements FOR ALL TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can manage their own reflections"
  ON public.hpc_reflections FOR ALL TO authenticated
  USING (student_id = auth.uid() OR reflector_id = auth.uid());

CREATE POLICY "Students can manage their own goals"
  ON public.hpc_student_goals FOR ALL TO authenticated
  USING (student_id = auth.uid());

-- Parent policies (limited access to their child's data)
CREATE POLICY "Parents can view their child's reports"
  ON public.hpc_reports FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.hpc_stakeholder_assignments hsa
      WHERE hsa.student_id = hpc_reports.student_id 
        AND hsa.evaluator_id = auth.uid()
        AND hsa.evaluator_role = 'parent'
    )
  );

CREATE POLICY "Parents can create evaluations for their children"
  ON public.hpc_evaluations FOR INSERT TO authenticated
  WITH CHECK (
    evaluator_id = auth.uid() AND 
    evaluator_role = 'parent' AND
    EXISTS (
      SELECT 1 FROM public.hpc_stakeholder_assignments hsa
      WHERE hsa.student_id = hpc_evaluations.student_id 
        AND hsa.evaluator_id = auth.uid()
        AND hsa.evaluator_role = 'parent'
    )
  );

-- =====================================================
-- TRIGGER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hpc_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to maintain evaluation version control
CREATE OR REPLACE FUNCTION manage_hpc_evaluation_versions()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark previous versions as not latest
  UPDATE public.hpc_evaluations 
  SET is_latest = false 
  WHERE student_id = NEW.student_id 
    AND parameter_id = NEW.parameter_id 
    AND evaluator_id = NEW.evaluator_id
    AND evaluation_cycle_id = NEW.evaluation_cycle_id
    AND id != NEW.id;
  
  -- Ensure new record is marked as latest
  NEW.is_latest = true;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to auto-calculate analytics when evaluations change
CREATE OR REPLACE FUNCTION update_hpc_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Trigger analytics recalculation for the student
  INSERT INTO public.hpc_analytics (student_id, academic_term_id, calculated_at)
  VALUES (NEW.student_id, 
    (SELECT academic_term_id FROM public.hpc_evaluation_cycles WHERE id = NEW.evaluation_cycle_id),
    now())
  ON CONFLICT (student_id, academic_term_id) 
  DO UPDATE SET calculated_at = now();
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- APPLY TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_hpc_parameters_updated_at
  BEFORE UPDATE ON public.hpc_parameters
  FOR EACH ROW EXECUTE FUNCTION update_hpc_updated_at();

CREATE TRIGGER update_hpc_rubrics_updated_at
  BEFORE UPDATE ON public.hpc_rubrics
  FOR EACH ROW EXECUTE FUNCTION update_hpc_updated_at();

CREATE TRIGGER update_hpc_evaluation_cycles_updated_at
  BEFORE UPDATE ON public.hpc_evaluation_cycles
  FOR EACH ROW EXECUTE FUNCTION update_hpc_updated_at();

CREATE TRIGGER update_hpc_evaluations_updated_at
  BEFORE UPDATE ON public.hpc_evaluations
  FOR EACH ROW EXECUTE FUNCTION update_hpc_updated_at();

CREATE TRIGGER update_hpc_reports_updated_at
  BEFORE UPDATE ON public.hpc_reports
  FOR EACH ROW EXECUTE FUNCTION update_hpc_updated_at();

CREATE TRIGGER update_hpc_analytics_updated_at
  BEFORE UPDATE ON public.hpc_analytics
  FOR EACH ROW EXECUTE FUNCTION update_hpc_updated_at();

CREATE TRIGGER update_hpc_templates_updated_at
  BEFORE UPDATE ON public.hpc_templates
  FOR EACH ROW EXECUTE FUNCTION update_hpc_updated_at();

CREATE TRIGGER update_hpc_student_goals_updated_at
  BEFORE UPDATE ON public.hpc_student_goals
  FOR EACH ROW EXECUTE FUNCTION update_hpc_updated_at();

-- Version control triggers
CREATE TRIGGER manage_hpc_evaluation_versions_trigger
  AFTER INSERT ON public.hpc_evaluations
  FOR EACH ROW EXECUTE FUNCTION manage_hpc_evaluation_versions();

-- Analytics triggers
CREATE TRIGGER update_hpc_analytics_trigger
  AFTER INSERT OR UPDATE ON public.hpc_evaluations
  FOR EACH ROW EXECUTE FUNCTION update_hpc_analytics();

-- =====================================================
-- SEED DATA FOR CBSE HPC PARAMETERS
-- =====================================================

-- Insert CBSE-compliant HPC parameters
INSERT INTO public.hpc_parameters (code, name, description, category, evaluation_type, min_score, max_score, weightage, evaluator_roles, grade_levels) VALUES

-- SCHOLASTIC PARAMETERS
('MATH_CONCEPTUAL', 'Mathematical Conceptual Understanding', 'Understanding of mathematical concepts and principles', 'scholastic', 'mixed', 1, 5, 1.0, ARRAY['subject_teacher'], ARRAY['6','7','8','9','10','11','12']),
('MATH_PROBLEM_SOLVING', 'Mathematical Problem Solving', 'Ability to solve mathematical problems systematically', 'scholastic', 'mixed', 1, 5, 1.0, ARRAY['subject_teacher'], ARRAY['6','7','8','9','10','11','12']),
('SCI_INQUIRY', 'Scientific Inquiry and Investigation', 'Scientific thinking and investigation skills', 'scholastic', 'mixed', 1, 5, 1.0, ARRAY['subject_teacher'], ARRAY['6','7','8','9','10','11','12']),
('LANG_COMMUNICATION', 'Language and Communication', 'Oral and written communication skills', 'scholastic', 'mixed', 1, 5, 1.0, ARRAY['subject_teacher'], ARRAY['6','7','8','9','10','11','12']),

-- CO-SCHOLASTIC PARAMETERS - ARTS
('VISUAL_ARTS', 'Visual Arts Expression', 'Creativity and skill in visual arts', 'co_scholastic_arts', 'mixed', 1, 5, 0.8, ARRAY['subject_teacher', 'class_teacher'], ARRAY['6','7','8','9','10','11','12']),
('PERFORMING_ARTS', 'Performing Arts', 'Music, dance, and dramatic expression', 'co_scholastic_arts', 'mixed', 1, 5, 0.8, ARRAY['subject_teacher', 'class_teacher'], ARRAY['6','7','8','9','10','11','12']),

-- CO-SCHOLASTIC PARAMETERS - SPORTS
('PHYSICAL_FITNESS', 'Physical Fitness and Health', 'Physical development and fitness levels', 'co_scholastic_sports', 'mixed', 1, 5, 0.8, ARRAY['coach', 'class_teacher'], ARRAY['6','7','8','9','10','11','12']),
('SPORTS_SKILLS', 'Sports Skills and Sportsmanship', 'Athletic abilities and sporting behavior', 'co_scholastic_sports', 'mixed', 1, 5, 0.8, ARRAY['coach', 'class_teacher'], ARRAY['6','7','8','9','10','11','12']),

-- CO-SCHOLASTIC PARAMETERS - HEALTH
('HEALTH_AWARENESS', 'Health and Hygiene Awareness', 'Understanding of health and hygiene practices', 'co_scholastic_health', 'mixed', 1, 5, 0.6, ARRAY['class_teacher', 'counselor'], ARRAY['6','7','8','9','10','11','12']),

-- CO-SCHOLASTIC PARAMETERS - WORK EDUCATION
('WORK_EDUCATION', 'Work Education and Vocational Skills', 'Practical skills and work readiness', 'co_scholastic_work', 'mixed', 1, 5, 0.8, ARRAY['subject_teacher', 'class_teacher'], ARRAY['6','7','8','9','10','11','12']),

-- LIFE SKILLS PARAMETERS
('TEAMWORK', 'Teamwork and Collaboration', 'Ability to work effectively in teams', 'life_skills', 'mixed', 1, 5, 1.0, ARRAY['class_teacher', 'subject_teacher', 'peer'], ARRAY['6','7','8','9','10','11','12']),
('LEADERSHIP', 'Leadership Qualities', 'Leadership potential and initiative', 'life_skills', 'mixed', 1, 5, 1.0, ARRAY['class_teacher', 'subject_teacher'], ARRAY['6','7','8','9','10','11','12']),
('CREATIVITY', 'Creativity and Innovation', 'Creative thinking and innovative approaches', 'life_skills', 'mixed', 1, 5, 1.0, ARRAY['class_teacher', 'subject_teacher'], ARRAY['6','7','8','9','10','11','12']),
('CRITICAL_THINKING', 'Critical Thinking', 'Analytical and critical thinking abilities', 'life_skills', 'mixed', 1, 5, 1.0, ARRAY['class_teacher', 'subject_teacher'], ARRAY['6','7','8','9','10','11','12']),
('EMPATHY', 'Empathy and Compassion', 'Understanding and caring for others', 'life_skills', 'mixed', 1, 5, 1.0, ARRAY['class_teacher', 'peer', 'counselor'], ARRAY['6','7','8','9','10','11','12']),
('RESILIENCE', 'Resilience and Adaptability', 'Ability to overcome challenges and adapt', 'life_skills', 'mixed', 1, 5, 1.0, ARRAY['class_teacher', 'counselor'], ARRAY['6','7','8','9','10','11','12']),

-- DISCIPLINE PARAMETERS
('PUNCTUALITY', 'Punctuality and Time Management', 'Timeliness and respect for schedules', 'discipline', 'mixed', 1, 5, 0.8, ARRAY['class_teacher', 'subject_teacher'], ARRAY['6','7','8','9','10','11','12']),
('RESPONSIBILITY', 'Responsibility and Accountability', 'Taking ownership of actions and commitments', 'discipline', 'mixed', 1, 5, 1.0, ARRAY['class_teacher', 'subject_teacher'], ARRAY['6','7','8','9','10','11','12']),
('RESPECT', 'Respect for Others', 'Respectful behavior towards peers and teachers', 'discipline', 'mixed', 1, 5, 1.0, ARRAY['class_teacher', 'subject_teacher', 'peer'], ARRAY['6','7','8','9','10','11','12']);

-- Insert sample rubrics for key parameters
INSERT INTO public.hpc_rubrics (parameter_id, level, descriptor, indicators, examples, version) VALUES

-- Teamwork rubrics
((SELECT id FROM public.hpc_parameters WHERE code = 'TEAMWORK'), 1, 'Needs Improvement: Rarely participates effectively in group activities', 
 ARRAY['Avoids group work', 'Does not contribute ideas', 'Conflicts with team members'], 
 ARRAY['Sits quietly during group discussions', 'Completes only individual portions'], '1.0'),

((SELECT id FROM public.hpc_parameters WHERE code = 'TEAMWORK'), 2, 'Developing: Sometimes participates in group activities with guidance', 
 ARRAY['Participates when encouraged', 'Shares some ideas', 'Generally cooperative'], 
 ARRAY['Contributes when directly asked', 'Follows team decisions'], '1.0'),

((SELECT id FROM public.hpc_parameters WHERE code = 'TEAMWORK'), 3, 'Proficient: Actively participates and contributes to team success', 
 ARRAY['Regularly shares ideas', 'Listens to others', 'Helps resolve conflicts'], 
 ARRAY['Takes initiative in group projects', 'Mediates disagreements'], '1.0'),

((SELECT id FROM public.hpc_parameters WHERE code = 'TEAMWORK'), 4, 'Advanced: Demonstrates strong collaborative leadership', 
 ARRAY['Facilitates group discussions', 'Builds on others ideas', 'Ensures everyone participates'], 
 ARRAY['Leads team meetings effectively', 'Mentors struggling team members'], '1.0'),

((SELECT id FROM public.hpc_parameters WHERE code = 'TEAMWORK'), 5, 'Outstanding: Exceptional collaborative leader who inspires others', 
 ARRAY['Creates inclusive team environment', 'Maximizes team potential', 'Models excellent teamwork'], 
 ARRAY['Transforms group dynamics positively', 'Achieves exceptional team results'], '1.0'),

-- Critical Thinking rubrics
((SELECT id FROM public.hpc_parameters WHERE code = 'CRITICAL_THINKING'), 1, 'Needs Improvement: Accepts information without questioning', 
 ARRAY['Takes information at face value', 'Does not ask probing questions', 'Struggles with analysis'], 
 ARRAY['Accepts first answer found', 'Does not verify sources'], '1.0'),

((SELECT id FROM public.hpc_parameters WHERE code = 'CRITICAL_THINKING'), 2, 'Developing: Beginning to question and analyze information', 
 ARRAY['Asks basic questions', 'Shows some skepticism', 'Attempts simple analysis'], 
 ARRAY['Questions obvious inconsistencies', 'Compares different sources'], '1.0'),

((SELECT id FROM public.hpc_parameters WHERE code = 'CRITICAL_THINKING'), 3, 'Proficient: Regularly analyzes and evaluates information', 
 ARRAY['Asks thoughtful questions', 'Identifies assumptions', 'Evaluates evidence'], 
 ARRAY['Challenges weak arguments', 'Seeks multiple perspectives'], '1.0'),

((SELECT id FROM public.hpc_parameters WHERE code = 'CRITICAL_THINKING'), 4, 'Advanced: Demonstrates sophisticated analytical thinking', 
 ARRAY['Synthesizes complex information', 'Identifies logical fallacies', 'Creates reasoned arguments'], 
 ARRAY['Develops original theories', 'Critiques expert opinions constructively'], '1.0'),

((SELECT id FROM public.hpc_parameters WHERE code = 'CRITICAL_THINKING'), 5, 'Outstanding: Exceptional analytical and evaluative thinking', 
 ARRAY['Demonstrates metacognitive awareness', 'Creates innovative solutions', 'Influences others thinking'], 
 ARRAY['Develops groundbreaking insights', 'Teaches critical thinking to peers'], '1.0');

-- Insert sample evaluation cycle
INSERT INTO public.hpc_evaluation_cycles (
  academic_term_id, 
  name, 
  cycle_type, 
  start_date, 
  end_date, 
  evaluation_deadline, 
  report_deadline,
  status,
  instructions
) VALUES (
  (SELECT id FROM public.academic_terms WHERE name LIKE '%2025%' LIMIT 1),
  'Term 1 Holistic Progress Assessment 2025',
  'term',
  '2025-01-15',
  '2025-04-30',
  '2025-04-15',
  '2025-04-25',
  'active',
  'Complete holistic evaluation of all students across scholastic and co-scholastic parameters. Focus on growth, development, and individual progress rather than comparison.'
);

-- Insert default HPC template
INSERT INTO public.hpc_templates (
  name,
  template_type,
  template_structure,
  is_default,
  active
) VALUES (
  'CBSE Standard HPC Report',
  'report_card',
  '{
    "sections": [
      {"id": "scholastic", "title": "Scholastic Areas", "weight": 0.6},
      {"id": "co_scholastic", "title": "Co-Scholastic Areas", "weight": 0.25},
      {"id": "life_skills", "title": "Life Skills", "weight": 0.15},
      {"id": "achievements", "title": "Achievements", "weight": 0.0},
      {"id": "reflections", "title": "Reflections", "weight": 0.0}
    ],
    "grading_scale": {
      "A+": {"min": 91, "max": 100, "descriptor": "Outstanding"},
      "A": {"min": 81, "max": 90, "descriptor": "Excellent"},
      "B+": {"min": 71, "max": 80, "descriptor": "Very Good"},
      "B": {"min": 61, "max": 70, "descriptor": "Good"},
      "C+": {"min": 51, "max": 60, "descriptor": "Satisfactory"},
      "C": {"min": 41, "max": 50, "descriptor": "Acceptable"},
      "D": {"min": 33, "max": 40, "descriptor": "Needs Improvement"},
      "E": {"min": 0, "max": 32, "descriptor": "Unsatisfactory"}
    }
  }'::jsonb,
  true,
  true
);

-- =====================================================
-- HELPER FUNCTIONS FOR HPC OPERATIONS
-- =====================================================

-- Function to calculate overall HPC score
CREATE OR REPLACE FUNCTION calculate_hpc_overall_score(
  p_student_id uuid,
  p_evaluation_cycle_id uuid
) RETURNS decimal AS $$
DECLARE
  total_weighted_score decimal := 0;
  total_weight decimal := 0;
  param_record RECORD;
BEGIN
  -- Calculate weighted average across all parameters
  FOR param_record IN
    SELECT 
      hp.weightage,
      AVG(he.score) as avg_score
    FROM public.hpc_parameters hp
    LEFT JOIN public.hpc_evaluations he ON he.parameter_id = hp.id
    WHERE he.student_id = p_student_id 
      AND he.evaluation_cycle_id = p_evaluation_cycle_id
      AND he.is_latest = true
      AND he.status = 'approved'
      AND hp.active = true
    GROUP BY hp.id, hp.weightage
  LOOP
    IF param_record.avg_score IS NOT NULL THEN
      total_weighted_score := total_weighted_score + (param_record.avg_score * param_record.weightage);
      total_weight := total_weight + param_record.weightage;
    END IF;
  END LOOP;
  
  -- Return weighted average or null if no evaluations
  IF total_weight > 0 THEN
    RETURN total_weighted_score / total_weight;
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get HPC grade from score
CREATE OR REPLACE FUNCTION get_hpc_grade(score decimal) RETURNS text AS $$
BEGIN
  IF score IS NULL THEN RETURN NULL; END IF;
  
  CASE 
    WHEN score >= 4.5 THEN RETURN 'A+';
    WHEN score >= 4.0 THEN RETURN 'A';
    WHEN score >= 3.5 THEN RETURN 'B+';
    WHEN score >= 3.0 THEN RETURN 'B';
    WHEN score >= 2.5 THEN RETURN 'C+';
    WHEN score >= 2.0 THEN RETURN 'C';
    WHEN score >= 1.5 THEN RETURN 'D';
    ELSE RETURN 'E';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate HPC report
CREATE OR REPLACE FUNCTION generate_hpc_report(
  p_student_id uuid,
  p_evaluation_cycle_id uuid
) RETURNS uuid AS $$
DECLARE
  report_id uuid;
  overall_score decimal;
  overall_grade text;
  term_id uuid;
  summary_data jsonb;
BEGIN
  -- Get academic term
  SELECT academic_term_id INTO term_id 
  FROM public.hpc_evaluation_cycles 
  WHERE id = p_evaluation_cycle_id;
  
  -- Calculate overall score
  SELECT calculate_hpc_overall_score(p_student_id, p_evaluation_cycle_id) INTO overall_score;
  SELECT get_hpc_grade(overall_score) INTO overall_grade;
  
  -- Build summary JSON
  SELECT jsonb_build_object(
    'scholastic', jsonb_agg(
      jsonb_build_object(
        'parameter', hp.name,
        'score', he.score,
        'remark', he.qualitative_remark
      )
    ) FILTER (WHERE hp.category = 'scholastic'),
    'co_scholastic', jsonb_agg(
      jsonb_build_object(
        'parameter', hp.name,
        'score', he.score,
        'remark', he.qualitative_remark
      )
    ) FILTER (WHERE hp.category LIKE 'co_scholastic%'),
    'life_skills', jsonb_agg(
      jsonb_build_object(
        'parameter', hp.name,
        'score', he.score,
        'remark', he.qualitative_remark
      )
    ) FILTER (WHERE hp.category = 'life_skills')
  ) INTO summary_data
  FROM public.hpc_evaluations he
  JOIN public.hpc_parameters hp ON hp.id = he.parameter_id
  WHERE he.student_id = p_student_id 
    AND he.evaluation_cycle_id = p_evaluation_cycle_id
    AND he.is_latest = true
    AND he.status = 'approved';
  
  -- Create or update report
  INSERT INTO public.hpc_reports (
    student_id,
    academic_term_id,
    evaluation_cycle_id,
    overall_grade,
    overall_percentage,
    summary_json,
    status,
    compiled_at,
    compiled_by
  ) VALUES (
    p_student_id,
    term_id,
    p_evaluation_cycle_id,
    overall_grade,
    (overall_score / 5.0) * 100,
    summary_data,
    'draft',
    now(),
    auth.uid()
  )
  ON CONFLICT (student_id, academic_term_id, evaluation_cycle_id, version)
  DO UPDATE SET
    overall_grade = EXCLUDED.overall_grade,
    overall_percentage = EXCLUDED.overall_percentage,
    summary_json = EXCLUDED.summary_json,
    compiled_at = now(),
    compiled_by = auth.uid()
  RETURNING id INTO report_id;
  
  RETURN report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for student HPC dashboard
CREATE OR REPLACE VIEW public.hpc_student_dashboard AS
SELECT 
  up.id as student_id,
  up.full_name as student_name,
  up.current_standard as grade,
  up.section,
  hr.academic_term_id,
  hr.overall_grade,
  hr.overall_percentage,
  hr.status as report_status,
  hr.published_at,
  
  -- Count of evaluations by status
  (SELECT COUNT(*) FROM public.hpc_evaluations he 
   WHERE he.student_id = up.id AND he.status = 'approved') as completed_evaluations,
  
  (SELECT COUNT(*) FROM public.hpc_evaluations he 
   WHERE he.student_id = up.id AND he.status = 'draft') as pending_evaluations,
   
  -- Recent achievements
  (SELECT COUNT(*) FROM public.hpc_achievements ha 
   WHERE ha.student_id = up.id AND ha.created_at > now() - interval '30 days') as recent_achievements

FROM public.user_profiles up
LEFT JOIN public.hpc_reports hr ON hr.student_id = up.id AND hr.is_latest = true
WHERE up.role = 'student' AND up.status = 'active';

-- View for teacher evaluation workload
CREATE OR REPLACE VIEW public.hpc_teacher_workload AS
SELECT 
  up.id as teacher_id,
  up.full_name as teacher_name,
  up.department,
  
  -- Assignment counts
  COUNT(DISTINCT hsa.student_id) as students_assigned,
  COUNT(DISTINCT hsa.evaluation_cycle_id) as active_cycles,
  
  -- Evaluation progress
  COUNT(CASE WHEN he.status = 'approved' THEN 1 END) as completed_evaluations,
  COUNT(CASE WHEN he.status IN ('draft', 'submitted') THEN 1 END) as pending_evaluations,
  
  -- Workload metrics
  ROUND(
    COUNT(CASE WHEN he.status = 'approved' THEN 1 END)::decimal / 
    NULLIF(COUNT(hsa.id), 0) * 100, 2
  ) as completion_percentage

FROM public.user_profiles up
LEFT JOIN public.hpc_stakeholder_assignments hsa ON hsa.evaluator_id = up.id
LEFT JOIN public.hpc_evaluations he ON he.evaluator_id = up.id AND he.is_latest = true
WHERE up.role = 'teacher' AND up.status = 'active'
GROUP BY up.id, up.full_name, up.department;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample evaluation cycle for current term
DO $$
DECLARE
  cycle_id uuid;
  term_id uuid;
BEGIN
  -- Get current academic term
  SELECT id INTO term_id FROM public.academic_terms 
  WHERE start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE
  LIMIT 1;
  
  IF term_id IS NOT NULL THEN
    -- Create evaluation cycle
    INSERT INTO public.hpc_evaluation_cycles (
      academic_term_id,
      name,
      cycle_type,
      start_date,
      end_date,
      evaluation_deadline,
      report_deadline,
      status
    ) VALUES (
      term_id,
      'Current Term HPC Assessment',
      'term',
      CURRENT_DATE - interval '30 days',
      CURRENT_DATE + interval '60 days',
      CURRENT_DATE + interval '45 days',
      CURRENT_DATE + interval '55 days',
      'active'
    ) RETURNING id INTO cycle_id;
    
    -- Create sample stakeholder assignments for demo students
    INSERT INTO public.hpc_stakeholder_assignments (
      evaluation_cycle_id,
      student_id,
      evaluator_id,
      evaluator_role,
      parameter_ids
    )
    SELECT 
      cycle_id,
      s.id,
      t.id,
      'class_teacher',
      ARRAY(SELECT id FROM public.hpc_parameters WHERE active = true LIMIT 5)
    FROM public.user_profiles s
    CROSS JOIN public.user_profiles t
    WHERE s.role = 'student' 
      AND t.role = 'teacher' 
      AND s.status = 'active' 
      AND t.status = 'active'
      AND s.current_standard IS NOT NULL
    LIMIT 20; -- Limit for demo purposes
    
  END IF;
END $$;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.hpc_parameters IS 'CBSE-compliant evaluation parameters for holistic student assessment';
COMMENT ON TABLE public.hpc_rubrics IS 'Detailed rubrics and performance descriptors for each evaluation parameter';
COMMENT ON TABLE public.hpc_evaluations IS 'Individual evaluation inputs from all stakeholders (teachers, peers, parents, self)';
COMMENT ON TABLE public.hpc_reports IS 'Compiled holistic progress reports for students per academic term';
COMMENT ON TABLE public.hpc_evaluation_cycles IS 'Evaluation periods with deadlines and configuration';
COMMENT ON TABLE public.hpc_stakeholder_assignments IS 'Assignment of evaluators to students for specific parameters';
COMMENT ON TABLE public.hpc_achievements IS 'Student achievements and recognitions across various domains';
COMMENT ON TABLE public.hpc_reflections IS 'Stakeholder reflections and qualitative feedback';
COMMENT ON TABLE public.hpc_analytics IS 'Aggregated analytics and AI-generated insights for student development';

COMMENT ON COLUMN public.hpc_parameters.category IS 'CBSE classification: scholastic, co_scholastic_*, life_skills, discipline, achievements';
COMMENT ON COLUMN public.hpc_parameters.evaluator_roles IS 'Array of roles authorized to evaluate this parameter';
COMMENT ON COLUMN public.hpc_evaluations.confidence_level IS 'Evaluator confidence in their assessment (1-5 scale)';
COMMENT ON COLUMN public.hpc_reports.summary_json IS 'Comprehensive JSON summary of all evaluations and analytics';
COMMENT ON COLUMN public.hpc_analytics.growth_trajectory IS 'JSON tracking student growth patterns over time';

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- =====================================================

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_student_cycle_latest 
  ON public.hpc_evaluations(student_id, evaluation_cycle_id) 
  WHERE is_latest = true;

CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_evaluator_status 
  ON public.hpc_evaluations(evaluator_id, status);

CREATE INDEX IF NOT EXISTS idx_hpc_reports_student_term_latest 
  ON public.hpc_reports(student_id, academic_term_id) 
  WHERE is_latest = true;

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_hpc_parameters_active_category 
  ON public.hpc_parameters(category) 
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_hpc_rubrics_active_parameter 
  ON public.hpc_rubrics(parameter_id) 
  WHERE active = true;

-- Full-text search index for qualitative content
CREATE INDEX IF NOT EXISTS idx_hpc_evaluations_text_search 
  ON public.hpc_evaluations 
  USING gin(to_tsvector('english', 
    coalesce(qualitative_remark, '') || ' ' || 
    coalesce(evidence_description, '') || ' ' || 
    coalesce(improvement_suggestions, '')
  ));

-- =====================================================
-- AUDIT AND COMPLIANCE
-- =====================================================

-- Extend existing audit_logs to include HPC operations
DO $$
BEGIN
  -- Add HPC-specific audit triggers
  CREATE OR REPLACE FUNCTION log_hpc_changes()
  RETURNS TRIGGER AS $audit$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.audit_logs (
        user_id, action, table_name, record_id, new_values, performed_by
      ) VALUES (
        COALESCE(NEW.student_id, NEW.evaluator_id, auth.uid()), 
        'create', 
        TG_TABLE_NAME, 
        NEW.id::text, 
        to_jsonb(NEW), 
        auth.uid()
      );
      RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
      INSERT INTO public.audit_logs (
        user_id, action, table_name, record_id, old_values, new_values, performed_by
      ) VALUES (
        COALESCE(NEW.student_id, NEW.evaluator_id, auth.uid()), 
        'update', 
        TG_TABLE_NAME, 
        NEW.id::text, 
        to_jsonb(OLD), 
        to_jsonb(NEW), 
        auth.uid()
      );
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      INSERT INTO public.audit_logs (
        user_id, action, table_name, record_id, old_values, performed_by
      ) VALUES (
        COALESCE(OLD.student_id, OLD.evaluator_id, auth.uid()), 
        'delete', 
        TG_TABLE_NAME, 
        OLD.id::text, 
        to_jsonb(OLD), 
        auth.uid()
      );
      RETURN OLD;
    END IF;
    RETURN NULL;
  END;
  $audit$ language 'plpgsql';

  -- Apply audit triggers to critical HPC tables
  CREATE TRIGGER audit_hpc_evaluations_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.hpc_evaluations
    FOR EACH ROW EXECUTE FUNCTION log_hpc_changes();

  CREATE TRIGGER audit_hpc_reports_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.hpc_reports
    FOR EACH ROW EXECUTE FUNCTION log_hpc_changes();

  CREATE TRIGGER audit_hpc_achievements_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.hpc_achievements
    FOR EACH ROW EXECUTE FUNCTION log_hpc_changes();
END $$;