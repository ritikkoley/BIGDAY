// Allocation System Types

export interface Institution {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface AcademicTerm {
  id: string;
  institution_id: string;
  name: string;
  start_date: string;
  end_date: string;
  frozen: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cohort {
  id: string;
  institution_id: string;
  academic_term_id: string;
  stream: string;
  grade: string;
  boarding_type: 'hosteller' | 'day_scholar';
  periods_per_day: number;
  days_per_week: number;
  created_at: string;
  updated_at: string;
  academic_term?: AcademicTerm;
  sections?: Section[];
}

export interface Section {
  id: string;
  cohort_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  cohort?: Cohort;
  students?: SectionStudent[];
  courses?: SectionCourse[];
}

export interface SectionStudent {
  id: string;
  section_id: string;
  student_id: string;
  created_at: string;
  student?: {
    id: string;
    full_name: string;
    email: string;
    admission_number?: string;
  };
}

export interface Course {
  id: string;
  institution_id: string;
  code: string;
  title: string;
  subject_type: 'theory' | 'lab' | 'mixed';
  weekly_theory_periods: number;
  weekly_lab_periods: number;
  lab_block_size: number;
  constraints: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionCourse {
  id: string;
  section_id: string;
  course_id: string;
  teacher_id: string;
  weekly_theory_periods?: number;
  weekly_lab_periods?: number;
  lab_block_size?: number;
  priority: number;
  created_at: string;
  updated_at: string;
  course?: Course;
  teacher?: {
    id: string;
    full_name: string;
    email: string;
  };
  section?: Section;
}

export interface TeacherSubjectEligibility {
  id: string;
  teacher_id: string;
  course_id: string;
  created_at: string;
  course?: Course;
}

export interface TeacherGradeEligibility {
  id: string;
  teacher_id: string;
  grade: string;
  created_at: string;
}

export interface TeacherLoadRules {
  id: string;
  teacher_id: string;
  max_periods_per_day?: number;
  max_periods_per_week?: number;
  availability?: Record<string, number[]>;
  created_at: string;
  updated_at: string;
}

export interface SlotTemplate {
  id: string;
  institution_id: string;
  name: string;
  days_per_week: number;
  periods_per_day: number;
  bells?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface SlotTemplateAssignment {
  id: string;
  slot_template_id: string;
  cohort_id?: string;
  section_id?: string;
  created_at: string;
  slot_template?: SlotTemplate;
  cohort?: Cohort;
  section?: Section;
}

export interface Timetable {
  id: string;
  section_id: string;
  academic_term_id: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  generated_at: string;
  created_at: string;
  updated_at: string;
  section?: Section;
  academic_term?: AcademicTerm;
  sessions?: TimetableSession[];
}

export interface TimetableSession {
  id: string;
  timetable_id: string;
  section_id: string;
  course_id: string;
  teacher_id?: string;
  day_of_week: number;
  period_index: number;
  duration_periods: number;
  session_type: 'theory' | 'lab';
  locked: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
  teacher?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface TimetableConflict {
  id: string;
  run_id?: string;
  section_id?: string;
  teacher_id?: string;
  course_id?: string;
  day_of_week?: number;
  period_index?: number;
  conflict_type: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface AllocationSettings {
  id: string;
  institution_id: string;
  teacher_max_periods_per_day: number;
  class_periods_per_day: number;
  days_per_week: number;
  created_at: string;
  updated_at: string;
}

// Generation Request Types
export interface TimetableGenerationRequest {
  academic_term_id: string;
  section_ids: string[];
  use_slot_template?: string;
  constraints?: {
    teacher_max_per_day_default?: number;
    enforce_lab_blocks?: boolean;
    spread_course_days?: boolean;
  };
}

export interface TimetableGenerationResult {
  status: 'ok' | 'error';
  section_results: {
    section_id: string;
    placed: number;
    required: number;
    conflicts: number;
  }[];
  conflicts: TimetableConflict[];
  suggestions?: string[];
}

// UI Helper Types
export interface TimetableGrid {
  [day: number]: {
    [period: number]: TimetableSession | null;
  };
}

export interface TeacherEligibilityMatrix {
  teacher_id: string;
  teacher_name: string;
  subjects: {
    course_id: string;
    course_title: string;
    eligible: boolean;
  }[];
  grades: {
    grade: string;
    eligible: boolean;
  }[];
  load_rules?: TeacherLoadRules;
}

export interface SectionTimetableView {
  section: Section;
  timetable?: Timetable;
  grid: TimetableGrid;
  conflicts: TimetableConflict[];
  stats: {
    total_periods: number;
    scheduled_periods: number;
    teacher_overloads: number;
  };
}