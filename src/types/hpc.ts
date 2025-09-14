// Holistic Progress Card (HPC) System Types

export interface HPCParameter {
  id: string;
  name: string;
  category: 'scholastic' | 'co_scholastic' | 'life_skills' | 'discipline';
  sub_category: string;
  weightage: number;
  description: string;
  cbse_code: string;
  grade_applicability: string[];
  evaluation_frequency: 'continuous' | 'periodic' | 'annual';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HPCRubric {
  id: string;
  parameter_id: string;
  level: string; // A+, A, B, C, D
  grade_equivalent: 'outstanding' | 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
  descriptor: string;
  detailed_description: string;
  examples: string[];
  indicators: string[];
  version: number;
  active: boolean;
  created_at: string;
}

export interface HPCParameterAssignment {
  id: string;
  parameter_id: string;
  evaluator_role: 'teacher' | 'parent' | 'peer' | 'self' | 'counselor' | 'coach';
  is_required: boolean;
  weightage: number;
  evaluation_frequency: 'continuous' | 'periodic' | 'annual';
  created_at: string;
}

export interface HPCEvaluation {
  id: string;
  student_id: string;
  parameter_id: string;
  evaluator_id: string;
  evaluator_role: 'teacher' | 'parent' | 'peer' | 'self' | 'counselor' | 'coach';
  score: number; // 1-5 scale
  grade: string; // A+, A, B, C, D
  qualitative_remark: string;
  evidence_notes?: string;
  confidence_level: number; // 0-1 scale
  evaluation_date: string;
  term_id: string;
  cycle_id?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  version: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  parameter?: HPCParameter;
  evaluator?: {
    full_name: string;
    role: string;
  };
}

export interface HPCEvaluationCycle {
  id: string;
  name: string;
  term_id: string;
  cycle_type: 'continuous' | 'mid_term' | 'final' | 'annual';
  start_date: string;
  end_date: string;
  parameters: string[]; // Array of parameter IDs
  evaluator_roles: string[]; // Array of roles that should evaluate
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface HPCReport {
  id: string;
  student_id: string;
  term_id: string;
  cycle_id?: string;
  overall_grade: string;
  overall_score: number;
  summary_json: HPCReportSummary;
  status: 'draft' | 'under_review' | 'approved' | 'published';
  compiled_at: string;
  compiled_by: string;
  approved_at?: string;
  approved_by?: string;
  published_at?: string;
  version: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  student?: any;
  term?: any;
  workflow?: HPCApprovalWorkflow[];
}

export interface HPCReportSummary {
  student_info: {
    name: string;
    grade: string;
    section: string;
    admission_number: string;
    academic_year: string;
  };
  evaluation_summary: {
    overall_score: number;
    overall_grade: string;
    total_parameters_evaluated: number;
    evaluation_period: string;
  };
  parameter_breakdown: {
    [parameterId: string]: {
      parameter_name: string;
      category: string;
      weightage: number;
      score: number;
      grade: string;
      stakeholder_feedback: {
        [role: string]: {
          score: number;
          grade: string;
          evaluations: Array<{
            evaluator_name: string;
            score: number;
            remark: string;
            confidence: number;
            date: string;
          }>;
        };
      };
      evidence: string[];
      rubric_level: {
        level: string;
        descriptor: string;
        detailed_description: string;
        examples: string[];
      };
    };
  };
  stakeholder_summary: {
    teacher_feedback: Array<{
      parameter: string;
      grade: string;
      remarks: string[];
    }>;
    parent_feedback: Array<{
      parameter: string;
      grade: string;
      remarks: string[];
    }>;
    peer_feedback: Array<{
      parameter: string;
      grade: string;
      remarks: string[];
    }>;
    self_reflections: Array<{
      parameter: string;
      grade: string;
      remarks: string[];
    }>;
  };
  achievements: Array<{
    title: string;
    category: string;
    date: string;
    points: number;
  }>;
  student_reflections: Array<{
    type: string;
    content: string;
    goals: string[];
  }>;
  strengths_identified: string[];
  growth_areas: string[];
  recommendations: string[];
  next_steps: string[];
  compiled_metadata: {
    compilation_date: string;
    compiled_by: string;
    data_sources: {
      total_evaluations: number;
      by_role: Record<string, number>;
      evaluation_period: {
        start: string;
        end: string;
      };
    };
    quality_indicators: {
      average_confidence: number;
      completeness_percentage: number;
      multi_stakeholder_coverage: number;
      evidence_richness: number;
    };
  };
}

export interface HPCApprovalWorkflow {
  id: string;
  report_id: string;
  step_number: number;
  approver_role: 'class_teacher' | 'subject_teacher' | 'counselor' | 'principal' | 'vice_principal';
  approver_id?: string;
  status: 'waiting' | 'pending' | 'approved' | 'rejected' | 'needs_revision';
  assigned_at?: string;
  approved_at?: string;
  due_date: string;
  comments?: string;
  created_at: string;
}

export interface HPCAnalytics {
  id: string;
  student_id: string;
  parameter_id?: string;
  term_id: string;
  report_id?: string;
  class_percentile: number;
  grade_percentile: number;
  school_percentile: number;
  growth_trajectory: 'improving' | 'declining' | 'stable';
  predicted_next_score: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  strengths_identified: string[];
  improvement_areas: string[];
  risk_indicators: string[];
  created_at: string;
  updated_at: string;
}

export interface HPCAchievement {
  id: string;
  student_id: string;
  title: string;
  category: 'academic' | 'sports' | 'arts' | 'social' | 'leadership' | 'community';
  description: string;
  date_achieved: string;
  evidence_url?: string;
  verified_by: string;
  points_awarded: number;
  created_at: string;
}

export interface HPCReflection {
  id: string;
  student_id: string;
  term_id: string;
  reflection_type: 'self_assessment' | 'goal_setting' | 'learning_journal' | 'peer_feedback';
  content: string;
  goals_set: string[];
  created_at: string;
  updated_at: string;
}

// Processing Pipeline Types
export interface EvaluationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ParameterAggregationResult {
  aggregatedScore: number;
  aggregatedGrade: string;
  stakeholderBreakdown: Record<string, any>;
  evidenceCollection: string[];
}

export interface ReportCompilationResult {
  report: HPCReport;
  validationResults: EvaluationValidationResult[];
  aggregationResults: Record<string, ParameterAggregationResult>;
  qualityScore: number;
}

export interface BulkReportResult {
  successful: number;
  failed: number;
  errors: string[];
  reports: HPCReport[];
}

// Export and Presentation Types
export interface PDFExportOptions {
  language: 'english' | 'hindi';
  include_charts: boolean;
  include_signatures: boolean;
  include_evidence: boolean;
  watermark?: string;
}

export interface PDFExportResult {
  pdfUrl: string;
  filename: string;
  language: string;
  generated_at: string;
  file_size?: number;
}

// Analytics and Insights Types
export interface HPCInsights {
  student_id: string;
  term_id: string;
  overall_performance: {
    current_grade: string;
    percentile_rank: number;
    growth_trend: 'improving' | 'declining' | 'stable';
  };
  parameter_insights: Array<{
    parameter_name: string;
    current_score: number;
    trend: 'improving' | 'declining' | 'stable';
    peer_comparison: number;
    recommendations: string[];
  }>;
  stakeholder_consensus: {
    high_agreement: string[]; // Parameters where all stakeholders agree
    low_agreement: string[]; // Parameters with conflicting evaluations
    missing_input: string[]; // Parameters missing key stakeholder input
  };
  risk_indicators: Array<{
    type: 'academic' | 'behavioral' | 'social' | 'emotional';
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommended_intervention: string;
  }>;
  growth_opportunities: Array<{
    area: string;
    current_level: string;
    target_level: string;
    action_plan: string[];
    timeline: string;
  }>;
}

// Workflow and Process Types
export interface HPCWorkflowStep {
  step_name: string;
  description: string;
  required_roles: string[];
  estimated_duration: string;
  dependencies: string[];
  outputs: string[];
}

export interface HPCProcessPipeline {
  evaluation_collection: HPCWorkflowStep;
  data_validation: HPCWorkflowStep;
  aggregation: HPCWorkflowStep;
  report_compilation: HPCWorkflowStep;
  approval_workflow: HPCWorkflowStep;
  publication: HPCWorkflowStep;
  analytics_generation: HPCWorkflowStep;
  stakeholder_notification: HPCWorkflowStep;
}

// Configuration Types
export interface HPCSystemConfig {
  grading_scale: {
    [grade: string]: {
      min_score: number;
      max_score: number;
      description: string;
    };
  };
  weightage_rules: {
    scholastic_min: number;
    scholastic_max: number;
    co_scholastic_min: number;
    co_scholastic_max: number;
    life_skills_min: number;
    life_skills_max: number;
  };
  approval_rules: {
    required_approvers: string[];
    approval_timeout_days: number;
    auto_escalation: boolean;
  };
  export_settings: {
    supported_languages: string[];
    pdf_template_versions: string[];
    signature_requirements: boolean;
  };
}