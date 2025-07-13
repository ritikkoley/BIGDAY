import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

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
    }
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
          name: string;
          email: string;
          role: 'student' | 'teacher' | 'admin';
          group_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'student' | 'teacher' | 'admin';
          group_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'student' | 'teacher' | 'admin';
          group_id?: string | null;
          created_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          type: 'class' | 'department';
        };
        Insert: {
          id?: string;
          name: string;
          type: 'class' | 'department';
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'class' | 'department';
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          teacher_id: string;
          group_ids: string[];
          subtopics: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          teacher_id: string;
          group_ids?: string[];
          subtopics?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          teacher_id?: string;
          group_ids?: string[];
          subtopics?: any;
          created_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          type: 'quiz' | 'midterm' | 'final' | 'digital';
          weightage: number;
          subtopics_covered: any;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          name: string;
          type: 'quiz' | 'midterm' | 'final' | 'digital';
          weightage: number;
          subtopics_covered?: any;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          name?: string;
          type?: 'quiz' | 'midterm' | 'final' | 'digital';
          weightage?: number;
          subtopics_covered?: any;
          due_date?: string | null;
          created_at?: string;
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
          subtopic_performance: any;
          feedback: string | null;
          graded_by: string | null;
          graded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          assessment_id: string;
          score: number;
          max_score?: number;
          percentile?: number | null;
          subtopic_performance?: any;
          feedback?: string | null;
          graded_by?: string | null;
          graded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          assessment_id?: string;
          score?: number;
          max_score?: number;
          percentile?: number | null;
          subtopic_performance?: any;
          feedback?: string | null;
          graded_by?: string | null;
          graded_at?: string | null;
          created_at?: string;
          updated_at?: string;
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'excused';
          notes?: string | null;
          marked_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late' | 'excused';
          notes?: string | null;
          marked_by?: string | null;
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
          priority: 'low' | 'normal' | 'high' | 'urgent';
          read_at: string | null;
          reply_to: string | null;
          attachments: any;
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
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          read_at?: string | null;
          reply_to?: string | null;
          attachments?: any;
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
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          read_at?: string | null;
          reply_to?: string | null;
          attachments?: any;
          created_at?: string;
          updated_at?: string;
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
          uploaded_by: string | null;
          is_public: boolean;
          download_count: number;
          tags: any;
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
          resource_type?: 'material' | 'assignment' | 'reference' | 'video' | 'link';
          uploaded_by?: string | null;
          is_public?: boolean;
          download_count?: number;
          tags?: any;
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
          resource_type?: 'material' | 'assignment' | 'reference' | 'video' | 'link';
          uploaded_by?: string | null;
          is_public?: boolean;
          download_count?: number;
          tags?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      calculate_percentiles: {
        Args: { assess_id: string };
        Returns: void;
      };
      get_attendance_summary: {
        Args: { student_uuid: string; course_uuid?: string };
        Returns: {
          course_id: string;
          course_name: string;
          total_classes: number;
          present_count: number;
          absent_count: number;
          late_count: number;
          attendance_rate: number;
        }[];
      };
      get_grade_summary: {
        Args: { student_uuid: string; course_uuid?: string };
        Returns: {
          course_id: string;
          course_name: string;
          total_assessments: number;
          average_score: number;
          average_percentile: number;
          weighted_score: number;
        }[];
      };
      get_course_analytics: {
        Args: { course_uuid: string };
        Returns: {
          total_students: number;
          average_attendance_rate: number;
          average_grade: number;
          grade_distribution: any;
          at_risk_students: number;
        }[];
      };
      get_recent_messages: {
        Args: { user_uuid: string; limit_count?: number };
        Returns: {
          id: string;
          sender_name: string;
          subject: string;
          content: string;
          priority: string;
          read_at: string | null;
          created_at: string;
          is_group_message: boolean;
        }[];
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
    .rpc('get_user_role', { user_id: userId });
  
  if (error) throw error;
  return data;
};

export const isAdmin = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('is_admin', { user_id: userId });
  
  if (error) throw error;
  return data;
};

export const isTeacher = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('is_teacher', { user_id: userId });
  
  if (error) throw error;
  return data;
};

export const getUserCourses = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('get_user_courses', { user_id: userId });
  
  if (error) throw error;
  return data;
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