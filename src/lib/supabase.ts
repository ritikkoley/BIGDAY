import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Supabase not configured - using demo mode');
  // Create a mock client for demo purposes
  supabase = {
    auth: {
      signInWithPassword: async () => ({ data: null, error: new Error('Demo mode - Supabase not configured') }),
      signUp: async () => ({ data: null, error: new Error('Demo mode - Supabase not configured') }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: new Error('Demo mode - Supabase not configured') }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error('Demo mode - Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    functions: {
      invoke: async () => ({ data: null, error: new Error('Demo mode - Supabase not configured') })
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({}) })
    }),
    removeChannel: () => {}
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
}

export { supabase };

// Database types for new entities
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          role: 'student' | 'teacher' | 'admin';
          identifier: string;
          email: string;
          profile_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          role: 'student' | 'teacher' | 'admin';
          identifier: string;
          email: string;
          profile_data?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: 'student' | 'teacher' | 'admin';
          identifier?: string;
          email?: string;
          profile_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          semester: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          semester: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          semester?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string | null;
          course_id: string | null;
          enrollment_date: string | null;
          status: 'active' | 'completed' | 'dropped' | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          course_id?: string | null;
          enrollment_date?: string | null;
          status?: 'active' | 'completed' | 'dropped' | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          course_id?: string | null;
          enrollment_date?: string | null;
          status?: 'active' | 'completed' | 'dropped' | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      grades: {
        Row: {
          id: string;
          student_id: string | null;
          course_id: string | null;
          type: 'assignment' | 'quiz' | 'midterm' | 'final';
          score: number;
          max_score: number;
          weight: number;
          date: string;
          feedback: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          course_id?: string | null;
          type: 'assignment' | 'quiz' | 'midterm' | 'final';
          score: number;
          max_score: number;
          weight: number;
          date: string;
          feedback?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          course_id?: string | null;
          type?: 'assignment' | 'quiz' | 'midterm' | 'final';
          score?: number;
          max_score?: number;
          weight?: number;
          date?: string;
          feedback?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string | null;
          course_id: string | null;
          date: string;
          status: 'present' | 'absent' | 'late';
          duration: number;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          course_id?: string | null;
          date: string;
          status?: 'present' | 'absent' | 'late';
          duration: number;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          course_id?: string | null;
          date?: string;
          status?: 'present' | 'absent' | 'late';
          duration?: number;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          from_id: string | null;
          to_id: string | null;
          course_id: string | null;
          comment: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          from_id?: string | null;
          to_id?: string | null;
          course_id?: string | null;
          comment: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          from_id?: string | null;
          to_id?: string | null;
          course_id?: string | null;
          comment?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      student_historic_data: {
        Row: {
          id: string;
          student_id: string | null;
          year: number;
          percentile: number;
          cgpa: number;
          strengths: string | null;
          weaknesses: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          year: number;
          percentile: number;
          cgpa: number;
          strengths?: string | null;
          weaknesses?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          year?: number;
          percentile?: number;
          cgpa?: number;
          strengths?: string | null;
          weaknesses?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          response: string | null;
          bot_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          response?: string | null;
          bot_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          response?: string | null;
          bot_type?: string;
          created_at?: string;
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
          resource_type: string | null;
          uploaded_by: string | null;
          is_public: boolean;
          download_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          name: string;
          description?: string | null;
          file_path?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          resource_type?: string | null;
          uploaded_by?: string | null;
          is_public?: boolean;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          name?: string;
          description?: string | null;
          file_path?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          resource_type?: string | null;
          uploaded_by?: string | null;
          is_public?: boolean;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
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
          priority: string | null;
          message_type: string | null;
          is_read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id?: string | null;
          group_id?: string | null;
          course_id?: string | null;
          subject: string;
          content: string;
          priority?: string | null;
          message_type?: string | null;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string | null;
          group_id?: string | null;
          course_id?: string | null;
          subject?: string;
          content?: string;
          priority?: string | null;
          message_type?: string | null;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          description: string | null;
          type: string;
          due_date: string | null;
          total_marks: number;
          weightage: number;
          status: string;
          subtopics_covered: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          name: string;
          description?: string | null;
          type: string;
          due_date?: string | null;
          total_marks: number;
          weightage: number;
          status?: string;
          subtopics_covered?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          name?: string;
          description?: string | null;
          type?: string;
          due_date?: string | null;
          total_marks?: number;
          weightage?: number;
          status?: string;
          subtopics_covered?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      calculate_current_grade: {
        Args: { stud_id: string; crs_id: string };
        Returns: {
          current_grade: number;
          completed_assessments: number;
          total_weightage: number;
        }[];
      };
      project_future_grade: {
        Args: { stud_id: string; crs_id: string; assumed_performance?: number };
        Returns: {
          current_grade: number;
          projected_grade: number;
          remaining_weightage: number;
          confidence_level: string;
        }[];
      };
      get_attendance_warnings: {
        Args: { stud_id: string; threshold?: number };
        Returns: {
          course_id: string;
          course_name: string;
          total_classes: number;
          attended_classes: number;
          attendance_rate: number;
          classes_needed: number;
          is_at_risk: boolean;
        }[];
      };
      get_subtopic_performance: {
        Args: { stud_id: string; crs_id: string };
        Returns: {
          subtopic_name: string;
          average_score: number;
          assessment_count: number;
          trend: string;
        }[];
      };
      get_pending_tasks: {
        Args: { teacher_uuid: string };
        Returns: {
          task_type: string;
          course_id: string;
          course_name: string;
          title: string;
          due_date: string;
          priority: string;
        }[];
      };
      get_recent_submissions: {
        Args: { teacher_uuid: string };
        Returns: {
          student_id: string;
          student_name: string;
          course_id: string;
          course_name: string;
          assessment_id: string;
          assessment_name: string;
          submitted_at: string;
          status: string;
        }[];
      };
      get_class_performance: {
        Args: { teacher_uuid: string };
        Returns: {
          course_id: string;
          course_name: string;
          average_score: number;
          attendance_rate: number;
          risk_students: number;
          top_performers: number;
        }[];
      };
    };
    Views: {
      student_timetable: {
        Row: {
          course_id: string;
          course_name: string;
          teacher_id: string;
          teacher_name: string;
          assessment_id: string | null;
          assessment_name: string | null;
          assessment_type: string | null;
          due_date: string | null;
          weightage: number | null;
          urgency_status: 'overdue' | 'upcoming' | 'future';
        };
      };
    };
  };
}

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data?.role;
};

// File upload helpers
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
};

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

// Realtime subscriptions
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
  filter?: { column: string; value: string }
) => {
  let subscription = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
      },
      callback
    );

  return subscription.subscribe();
};