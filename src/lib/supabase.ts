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
          name: string;
          role: 'student' | 'teacher' | 'admin';
          group_id: string | null;
          department: string | null;
          profile_data: any;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role: 'student' | 'teacher' | 'admin';
          group_id?: string | null;
          department?: string | null;
          profile_data?: any;
          status?: 'active' | 'inactive';
        };
        Update: {
          name?: string;
          role?: 'student' | 'teacher' | 'admin';
          group_id?: string | null;
          department?: string | null;
          profile_data?: any;
          status?: 'active' | 'inactive';
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          type: 'class' | 'department';
          description: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          type: 'class' | 'department';
          description?: string | null;
        };
        Update: {
          name?: string;
          type?: 'class' | 'department';
          description?: string | null;
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          code: string;
          teacher_id: string;
          group_ids: string[];
          subtopics: any[];
          timetable: any[];
          holidays: any[];
          type: 'theory' | 'lab';
          semester: number | null;
          academic_year: string | null;
          allow_quizzes: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          code: string;
          teacher_id: string;
          group_ids?: string[];
          subtopics?: any[];
          timetable?: any[];
          holidays?: any[];
          type?: 'theory' | 'lab';
          semester?: number | null;
          academic_year?: string | null;
          allow_quizzes?: boolean;
        };
        Update: {
          name?: string;
          code?: string;
          teacher_id?: string;
          group_ids?: string[];
          subtopics?: any[];
          timetable?: any[];
          holidays?: any[];
          type?: 'theory' | 'lab';
          semester?: number | null;
          academic_year?: string | null;
          allow_quizzes?: boolean;
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