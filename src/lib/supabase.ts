import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// Database types
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
          admission_number: string | null;
          employee_id: string | null;
          department: string | null;
          joining_date: string;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'student' | 'teacher' | 'admin';
          group_id?: string | null;
          admission_number?: string | null;
          employee_id?: string | null;
          department?: string | null;
          joining_date?: string;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'student' | 'teacher' | 'admin';
          group_id?: string | null;
          admission_number?: string | null;
          employee_id?: string | null;
          department?: string | null;
          joining_date?: string;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          type: 'class' | 'department';
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'class' | 'department';
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'class' | 'department';
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          code: string;
          teacher_id: string;
          group_ids: string[];
          subtopics: any;
          type: 'theory' | 'lab';
          semester: number | null;
          academic_year: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          teacher_id: string;
          group_ids?: string[];
          subtopics?: any;
          type?: 'theory' | 'lab';
          semester?: number | null;
          academic_year?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          teacher_id?: string;
          group_ids?: string[];
          subtopics?: any;
          type?: 'theory' | 'lab';
          semester?: number | null;
          academic_year?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          type: 'quiz' | 'midterm' | 'final' | 'digital' | 'assignment';
          weightage: number;
          total_marks: number;
          subtopics_covered: any;
          due_date: string | null;
          instructions: string | null;
          status: 'draft' | 'published' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          name: string;
          type: 'quiz' | 'midterm' | 'final' | 'digital' | 'assignment';
          weightage: number;
          total_marks?: number;
          subtopics_covered?: any;
          due_date?: string | null;
          instructions?: string | null;
          status?: 'draft' | 'published' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          name?: string;
          type?: 'quiz' | 'midterm' | 'final' | 'digital' | 'assignment';
          weightage?: number;
          total_marks?: number;
          subtopics_covered?: any;
          due_date?: string | null;
          instructions?: string | null;
          status?: 'draft' | 'published' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: string;
      };
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
      is_teacher: {
        Args: { user_id: string };
        Returns: boolean;
      };
      get_user_courses: {
        Args: { user_id: string };
        Returns: {
          course_id: string;
          course_name: string;
          course_code: string;
          teacher_name: string;
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