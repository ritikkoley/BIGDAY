import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'include'
      });
    }
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'student' | 'teacher' | 'admin';
          group_id: string | null;
          class_teacher_of: string | null;
          timezone: string;
          max_daily_periods: number | null;
          availability_pref: any;
          department: string | null;
          profile_data: any;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role: 'student' | 'teacher' | 'admin';
          group_id?: string | null;
          class_teacher_of?: string | null;
          timezone?: string;
          max_daily_periods?: number | null;
          availability_pref?: any;
          department?: string | null;
          profile_data?: any;
          status?: 'active' | 'inactive';
        };
        Update: {
          full_name?: string;
          role?: 'student' | 'teacher' | 'admin';
          group_id?: string | null;
          class_teacher_of?: string | null;
          timezone?: string;
          max_daily_periods?: number | null;
          availability_pref?: any;
          department?: string | null;
          profile_data?: any;
          status?: 'active' | 'inactive';
        };
      };
      academic_terms: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          end_date: string;
          frozen: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          start_date: string;
          end_date: string;
          frozen?: boolean;
        };
        Update: {
          name?: string;
          start_date?: string;
          end_date?: string;
          frozen?: boolean;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          academic_term_id: string;
          period_length_minutes: number;
          days_per_week: number;
          periods_per_day: number;
          max_daily_periods: number;
          lab_block_size: number;
          business_hours: any;
          holiday_calendar: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          academic_term_id: string;
          period_length_minutes?: number;
          days_per_week?: number;
          periods_per_day?: number;
          max_daily_periods?: number;
          lab_block_size?: number;
          business_hours?: any;
          holiday_calendar?: any;
        };
        Update: {
          name?: string;
          academic_term_id?: string;
          period_length_minutes?: number;
          days_per_week?: number;
          periods_per_day?: number;
          max_daily_periods?: number;
          lab_block_size?: number;
          business_hours?: any;
          holiday_calendar?: any;
        };
      };
      courses: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string | null;
          weekly_theory_periods: number;
          weekly_lab_periods: number;
          lab_block_size: number;
          constraints: any;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          title: string;
          description?: string | null;
          weekly_theory_periods?: number;
          weekly_lab_periods?: number;
          lab_block_size?: number;
          constraints?: any;
          active?: boolean;
        };
        Update: {
          code?: string;
          title?: string;
          description?: string | null;
          weekly_theory_periods?: number;
          weekly_lab_periods?: number;
          lab_block_size?: number;
          constraints?: any;
          active?: boolean;
        };
      };
      group_courses: {
        Row: {
          id: string;
          group_id: string;
          course_id: string;
          teacher_id: string | null;
          weekly_theory_periods: number | null;
          weekly_lab_periods: number | null;
          lab_block_size: number | null;
          priority: number;
          effective_from: string;
          effective_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          group_id: string;
          course_id: string;
          teacher_id?: string | null;
          weekly_theory_periods?: number | null;
          weekly_lab_periods?: number | null;
          lab_block_size?: number | null;
          priority?: number;
          effective_from?: string;
          effective_to?: string | null;
        };
        Update: {
          teacher_id?: string | null;
          weekly_theory_periods?: number | null;
          weekly_lab_periods?: number | null;
          lab_block_size?: number | null;
          priority?: number;
          effective_from?: string;
          effective_to?: string | null;
        };
      };
      timetables: {
        Row: {
          id: string;
          group_id: string;
          academic_term_id: string;
          status: 'draft' | 'published' | 'archived';
          version: number;
          generated_at: string;
          published_at: string | null;
          published_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          group_id: string;
          academic_term_id: string;
          status?: 'draft' | 'published' | 'archived';
          version?: number;
        };
        Update: {
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          published_by?: string | null;
        };
      };
      timetable_sessions: {
        Row: {
          id: string;
          timetable_id: string;
          group_id: string;
          course_id: string;
          teacher_id: string | null;
          day_of_week: number;
          period_start_index: number;
          duration_periods: number;
          type: 'theory' | 'lab';
          locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          timetable_id: string;
          group_id: string;
          course_id: string;
          teacher_id?: string | null;
          day_of_week: number;
          period_start_index: number;
          duration_periods?: number;
          type?: 'theory' | 'lab';
          locked?: boolean;
        };
        Update: {
          teacher_id?: string | null;
          day_of_week?: number;
          period_start_index?: number;
          duration_periods?: number;
          type?: 'theory' | 'lab';
          locked?: boolean;
        };
      };
      assessments: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          type: 'quiz' | 'midterm' | 'final' | 'assignment';
          total_marks: number;
          weightage: number;
          due_date: string | null;
          subtopics_covered: any[];
          status: 'draft' | 'published' | 'completed';
          created_at: string;
        };
        Insert: {
          course_id: string;
          name: string;
          type: 'quiz' | 'midterm' | 'final' | 'assignment';
          total_marks: number;
          weightage?: number;
          due_date?: string | null;
          subtopics_covered?: any[];
          status?: 'draft' | 'published' | 'completed';
        };
        Update: {
          name?: string;
          type?: 'quiz' | 'midterm' | 'final' | 'assignment';
          total_marks?: number;
          weightage?: number;
          due_date?: string | null;
          subtopics_covered?: any[];
          status?: 'draft' | 'published' | 'completed';
        };
      };
      grades: {
        Row: {
          id: string;
          student_id: string;
          assessment_id: string;
          score: number;
          max_score: number;
          percentile: number | null;
          subtopic_performance: any | null;
          feedback: string | null;
          graded_at: string;
        };
        Insert: {
          student_id: string;
          assessment_id: string;
          score: number;
          max_score: number;
          percentile?: number | null;
          subtopic_performance?: any | null;
          feedback?: string | null;
        };
        Update: {
          score?: number;
          max_score?: number;
          percentile?: number | null;
          subtopic_performance?: any | null;
          feedback?: string | null;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'excused';
          notes: string | null;
          marked_by: string | null;
          created_at: string;
        };
        Insert: {
          student_id: string;
          course_id: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'excused';
          notes?: string | null;
          marked_by?: string | null;
        };
        Update: {
          status?: 'present' | 'absent' | 'late' | 'excused';
          notes?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string | null;
          group_id: string | null;
          course_id: string | null;
          subject: string;
          content: string;
          priority: 'low' | 'normal' | 'high' | 'urgent';
          message_type: 'direct' | 'announcement' | 'reminder' | 'alert';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          sender_id: string;
          recipient_id?: string | null;
          group_id?: string | null;
          course_id?: string | null;
          subject: string;
          content: string;
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          message_type?: 'direct' | 'announcement' | 'reminder' | 'alert';
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
      };
      resources: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          description: string | null;
          file_path: string | null;
          file_size: number | null;
          file_type: string | null;
          resource_type: 'material' | 'assignment' | 'reference' | 'video' | 'link';
          uploaded_by: string;
          is_public: boolean;
          download_count: number;
          created_at: string;
        };
        Insert: {
          course_id: string;
          name: string;
          description?: string | null;
          file_path?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          resource_type?: 'material' | 'assignment' | 'reference' | 'video' | 'link';
          uploaded_by: string;
          is_public?: boolean;
          download_count?: number;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_public?: boolean;
        };
      };
      extracurricular: {
        Row: {
          id: string;
          user_id: string;
          type: 'extracurricular' | 'disciplinary';
          description: string;
          date: string;
          impact: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'extracurricular' | 'disciplinary';
          description: string;
          date: string;
          impact: number;
        };
        Update: {
          description?: string;
          date?: string;
          impact?: number;
        };
      };
      academic_terms: {
        Row: {
          id: string;
          institution_id: string;
          name: string;
          start_date: string;
          end_date: string;
          frozen: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          institution_id: string;
          name: string;
          start_date: string;
          end_date: string;
          frozen?: boolean;
        };
        Update: {
          name?: string;
          start_date?: string;
          end_date?: string;
          frozen?: boolean;
        };
      };
      cohorts: {
        Row: {
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
        };
        Insert: {
          institution_id: string;
          academic_term_id: string;
          stream: string;
          grade: string;
          boarding_type: 'hosteller' | 'day_scholar';
          periods_per_day?: number;
          days_per_week?: number;
        };
        Update: {
          stream?: string;
          grade?: string;
          boarding_type?: 'hosteller' | 'day_scholar';
          periods_per_day?: number;
          days_per_week?: number;
        };
      };
      sections: {
        Row: {
          id: string;
          cohort_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cohort_id: string;
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          institution_id: string;
          code: string;
          title: string;
          subject_type: 'theory' | 'lab' | 'mixed';
          weekly_theory_periods: number;
          weekly_lab_periods: number;
          lab_block_size: number;
          constraints: any;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          institution_id: string;
          code: string;
          title: string;
          subject_type: 'theory' | 'lab' | 'mixed';
          weekly_theory_periods?: number;
          weekly_lab_periods?: number;
          lab_block_size?: number;
          constraints?: any;
          active?: boolean;
        };
        Update: {
          code?: string;
          title?: string;
          subject_type?: 'theory' | 'lab' | 'mixed';
          weekly_theory_periods?: number;
          weekly_lab_periods?: number;
          lab_block_size?: number;
          constraints?: any;
          active?: boolean;
        };
      };
      timetables: {
        Row: {
          id: string;
          section_id: string;
          academic_term_id: string;
          status: 'draft' | 'published' | 'archived';
          version: number;
          generated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          section_id: string;
          academic_term_id: string;
          status?: 'draft' | 'published' | 'archived';
          version?: number;
        };
        Update: {
          status?: 'draft' | 'published' | 'archived';
          version?: number;
        };
      };
      timetable_sessions: {
        Row: {
          id: string;
          timetable_id: string;
          section_id: string;
          course_id: string;
          teacher_id: string | null;
          day_of_week: number;
          period_index: number;
          duration_periods: number;
          session_type: 'theory' | 'lab';
          locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          timetable_id: string;
          section_id: string;
          course_id: string;
          teacher_id?: string | null;
          day_of_week: number;
          period_index: number;
          duration_periods?: number;
          session_type?: 'theory' | 'lab';
          locked?: boolean;
        };
        Update: {
          teacher_id?: string | null;
          day_of_week?: number;
          period_index?: number;
          duration_periods?: number;
          session_type?: 'theory' | 'lab';
          locked?: boolean;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          response: string;
          timestamp: string;
        };
        Insert: {
          user_id: string;
          message: string;
          response: string;
        };
        Update: {
          response?: string;
        };
      };
    };
    Views: {
      student_upcoming: {
        Row: {
          id: string;
          assessment: string;
          due_date: string;
          course: string;
        };
      };
    };
    Functions: {
      calculate_projected_grade: {
        Args: {
          stud_id: string;
          crs_id: string;
        };
        Returns: number;
      };
      get_at_risk: {
        Args: {
          crs_id: string;
        };
        Returns: {
          student_id: string;
          avg_score: number;
        }[];
      };
      get_top_performers: {
        Args: {
          crs_id: string;
        };
        Returns: {
          student_id: string;
          avg_score: number;
        }[];
      };
      calculate_course_avg: {
        Args: {
          crs_id: string;
        };
        Returns: number;
      };
      calculate_trends: {
        Args: {
          grp_id: string;
        };
        Returns: any;
      };
      update_percentiles: {
        Args: {
          assess_id: string;
        };
        Returns: void;
      };
    };
  };
}