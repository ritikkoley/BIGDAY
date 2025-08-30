// Timetable and Course Management Types

export interface AcademicTerm {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  frozen: boolean;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  academic_term_id: string;
  period_length_minutes: number;
  days_per_week: number;
  periods_per_day: number;
  max_daily_periods: number;
  lab_block_size: number;
  business_hours: Record<string, number[]>;
  holiday_calendar: string[];
  created_at: string;
  updated_at: string;
  academic_term?: AcademicTerm;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  weekly_theory_periods: number;
  weekly_lab_periods: number;
  lab_block_size: number;
  constraints: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupCourse {
  id: string;
  group_id: string;
  course_id: string;
  teacher_id?: string;
  weekly_theory_periods?: number;
  weekly_lab_periods?: number;
  lab_block_size?: number;
  priority: number;
  effective_from: string;
  effective_to?: string;
  created_at: string;
  updated_at: string;
  group?: Group;
  course?: Course;
  teacher?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface Timetable {
  id: string;
  group_id: string;
  academic_term_id: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  generated_at: string;
  published_at?: string;
  published_by?: string;
  created_at: string;
  updated_at: string;
  group?: Group;
  academic_term?: AcademicTerm;
}

export interface TimetableSession {
  id: string;
  timetable_id: string;
  group_id: string;
  course_id: string;
  teacher_id?: string;
  day_of_week: number;
  period_start_index: number;
  duration_periods: number;
  type: 'theory' | 'lab';
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

export interface TimetableGrid {
  [day: number]: {
    [period: number]: TimetableSession | null;
  };
}

export interface TimetableGenerationRequest {
  group_id: string;
  academic_term_id: string;
  force_regenerate?: boolean;
  preserve_locked?: boolean;
}

export interface TimetableGenerationResult {
  success: boolean;
  timetable_id?: string;
  conflicts?: TimetableConflict[];
  warnings?: string[];
  sessions_created: number;
}

export interface TimetableConflict {
  type: 'teacher_conflict' | 'room_conflict' | 'constraint_violation';
  description: string;
  affected_sessions: string[];
  suggestions?: string[];
}

export interface SchedulingConstraint {
  type: 'no_consecutive' | 'preferred_time' | 'avoid_time' | 'max_daily';
  course_id?: string;
  teacher_id?: string;
  parameters: Record<string, any>;
}

export interface TeacherAvailability {
  teacher_id: string;
  day_of_week: number;
  available_periods: number[];
  preferred_periods?: number[];
  unavailable_periods?: number[];
}

export interface TimetableStats {
  total_sessions: number;
  theory_sessions: number;
  lab_sessions: number;
  teacher_utilization: Record<string, number>;
  period_utilization: number[];
  conflicts_resolved: number;
  generation_time_ms: number;
}