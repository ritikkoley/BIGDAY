import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Type aliases for convenience
type Grade = Database['public']['Tables']['grades']['Row'];
type Attendance = Database['public']['Tables']['attendance']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type Resource = Database['public']['Tables']['resources']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];
type Assessment = Database['public']['Tables']['assessments']['Row'];

interface DataState {
  // Data
  grades: Grade[];
  attendance: Attendance[];
  messages: Message[];
  resources: Resource[];
  courses: Course[];
  assessments: Assessment[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGrades: (studentId: string, courseId?: string) => Promise<void>;
  fetchAttendance: (studentId: string, courseId?: string) => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
  fetchResources: (courseId: string) => Promise<void>;
  fetchCourses: (userId: string) => Promise<void>;
  fetchAssessments: (courseId: string) => Promise<void>;
  
  // CRUD operations
  createGrade: (grade: Database['public']['Tables']['grades']['Insert']) => Promise<void>;
  updateGrade: (id: string, updates: Database['public']['Tables']['grades']['Update']) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  
  createAttendance: (attendance: Database['public']['Tables']['attendance']['Insert']) => Promise<void>;
  updateAttendance: (id: string, updates: Database['public']['Tables']['attendance']['Update']) => Promise<void>;
  
  sendMessage: (message: Database['public']['Tables']['messages']['Insert']) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  
  uploadResource: (resource: Database['public']['Tables']['resources']['Insert'], file?: File) => Promise<void>;
  downloadResource: (resourceId: string) => Promise<string>;
  
  // Bulk operations
  bulkUploadGrades: (assessmentId: string, grades: { student_id: string; score: number }[]) => Promise<void>;
  bulkUploadAttendance: (courseId: string, date: string, records: { student_id: string; status: string }[]) => Promise<void>;
  
  // Analytics
  getAttendanceSummary: (studentId: string, courseId?: string) => Promise<any>;
  getGradeSummary: (studentId: string, courseId?: string) => Promise<any>;
  getCourseAnalytics: (courseId: string) => Promise<any>;
  
  // Realtime subscriptions
  subscribeToGrades: (studentId: string) => () => void;
  subscribeToMessages: (userId: string) => () => void;
  
  // Clear data
  clearData: () => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Initial state
      grades: [],
      attendance: [],
      messages: [],
      resources: [],
      courses: [],
      assessments: [],
      isLoading: false,
      error: null,

      // Fetch operations
      fetchGrades: async (studentId: string, courseId?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          let query = supabase
            .from('grades')
            .select(`
              *,
              assessment:assessments(
                name,
                type,
                due_date,
                course:courses(name)
              )
            `)
            .eq('student_id', studentId);
          
          if (courseId) {
            query = query.eq('assessment.course_id', courseId);
          }
          
          const { data, error } = await query.order('created_at', { ascending: false });
          
          if (error) throw error;
          
          set({ grades: data || [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch grades', isLoading: false });
        }
      },

      fetchAttendance: async (studentId: string, courseId?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          let query = supabase
            .from('attendance')
            .select(`
              *,
              course:courses(name)
            `)
            .eq('student_id', studentId);
          
          if (courseId) {
            query = query.eq('course_id', courseId);
          }
          
          const { data, error } = await query.order('date', { ascending: false });
          
          if (error) throw error;
          
          set({ attendance: data || [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch attendance', isLoading: false });
        }
      },

      fetchMessages: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase
            .rpc('get_recent_messages', { user_uuid: userId, limit_count: 50 });
          
          if (error) throw error;
          
          set({ messages: data || [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch messages', isLoading: false });
        }
      },

      fetchResources: async (courseId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase
            .from('resources')
            .select(`
              *,
              uploader:users!resources_uploaded_by_fkey(name)
            `)
            .eq('course_id', courseId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          set({ resources: data || [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch resources', isLoading: false });
        }
      },

      fetchCourses: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase
            .from('courses')
            .select(`
              *,
              teacher:users!courses_teacher_id_fkey(name, email)
            `)
            .order('name');
          
          if (error) throw error;
          
          set({ courses: data || [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch courses', isLoading: false });
        }
      },

      fetchAssessments: async (courseId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase
            .from('assessments')
            .select('*')
            .eq('course_id', courseId)
            .order('due_date', { ascending: true });
          
          if (error) throw error;
          
          set({ assessments: data || [], isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch assessments', isLoading: false });
        }
      },

      // CRUD operations
      createGrade: async (grade) => {
        try {
          const { data, error } = await supabase
            .from('grades')
            .insert(grade)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({ grades: [data, ...state.grades] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create grade' });
        }
      },

      updateGrade: async (id, updates) => {
        try {
          const { data, error } = await supabase
            .from('grades')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            grades: state.grades.map(grade => grade.id === id ? data : grade)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update grade' });
        }
      },

      deleteGrade: async (id) => {
        try {
          const { error } = await supabase
            .from('grades')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            grades: state.grades.filter(grade => grade.id !== id)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete grade' });
        }
      },

      createAttendance: async (attendance) => {
        try {
          const { data, error } = await supabase
            .from('attendance')
            .insert(attendance)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({ attendance: [data, ...state.attendance] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create attendance record' });
        }
      },

      updateAttendance: async (id, updates) => {
        try {
          const { data, error } = await supabase
            .from('attendance')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            attendance: state.attendance.map(record => record.id === id ? data : record)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update attendance' });
        }
      },

      sendMessage: async (message) => {
        try {
          const { data, error } = await supabase
            .from('messages')
            .insert(message)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({ messages: [data, ...state.messages] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to send message' });
        }
      },

      markMessageAsRead: async (messageId) => {
        try {
          const { error } = await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('id', messageId);
          
          if (error) throw error;
          
          set(state => ({
            messages: state.messages.map(msg => 
              msg.id === messageId ? { ...msg, read_at: new Date().toISOString() } : msg
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to mark message as read' });
        }
      },

      uploadResource: async (resource, file) => {
        try {
          let filePath = null;
          
          if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            filePath = `${resource.course_id}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('study-materials')
              .upload(filePath, file);
            
            if (uploadError) throw uploadError;
          }
          
          const { data, error } = await supabase
            .from('resources')
            .insert({
              ...resource,
              file_path: filePath,
              file_size: file?.size || null,
              file_type: file?.type || null,
            })
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({ resources: [data, ...state.resources] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to upload resource' });
        }
      },

      downloadResource: async (resourceId) => {
        try {
          const { data: resource, error } = await supabase
            .from('resources')
            .select('file_path')
            .eq('id', resourceId)
            .single();
          
          if (error) throw error;
          
          if (!resource.file_path) {
            throw new Error('No file associated with this resource');
          }
          
          const { data } = supabase.storage
            .from('study-materials')
            .getPublicUrl(resource.file_path);
          
          // Increment download count
          await supabase
            .from('resources')
            .update({ download_count: supabase.sql`download_count + 1` })
            .eq('id', resourceId);
          
          return data.publicUrl;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to download resource' });
          throw error;
        }
      },

      // Bulk operations
      bulkUploadGrades: async (assessmentId, grades) => {
        try {
          const { data, error } = await supabase.functions.invoke('bulk-upload-grades', {
            body: { assessment_id: assessmentId, grades }
          });
          
          if (error) throw error;
          
          // Refresh grades
          const currentUser = await supabase.auth.getUser();
          if (currentUser.data.user) {
            await get().fetchGrades(currentUser.data.user.id);
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to bulk upload grades' });
        }
      },

      bulkUploadAttendance: async (courseId, date, records) => {
        try {
          const { data, error } = await supabase.functions.invoke('bulk-upload-attendance', {
            body: { course_id: courseId, date, attendance_records: records }
          });
          
          if (error) throw error;
          
          // Refresh attendance
          const currentUser = await supabase.auth.getUser();
          if (currentUser.data.user) {
            await get().fetchAttendance(currentUser.data.user.id);
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to bulk upload attendance' });
        }
      },

      // Analytics
      getAttendanceSummary: async (studentId, courseId) => {
        try {
          const { data, error } = await supabase
            .rpc('get_attendance_summary', { student_uuid: studentId, course_uuid: courseId });
          
          if (error) throw error;
          return data;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to get attendance summary' });
          return [];
        }
      },

      getGradeSummary: async (studentId, courseId) => {
        try {
          const { data, error } = await supabase
            .rpc('get_grade_summary', { student_uuid: studentId, course_uuid: courseId });
          
          if (error) throw error;
          return data;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to get grade summary' });
          return [];
        }
      },

      getCourseAnalytics: async (courseId) => {
        try {
          const { data, error } = await supabase
            .rpc('get_course_analytics', { course_uuid: courseId });
          
          if (error) throw error;
          return data[0] || {};
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to get course analytics' });
          return {};
        }
      },

      // Realtime subscriptions
      subscribeToGrades: (studentId) => {
        const channel = supabase
          .channel('grades_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'grades',
              filter: `student_id=eq.${studentId}`
            },
            (payload) => {
              console.log('Grade change received:', payload);
              // Refresh grades
              get().fetchGrades(studentId);
            }
          )
          .subscribe();

        return () => supabase.removeChannel(channel);
      },

      subscribeToMessages: (userId) => {
        const channel = supabase
          .channel('messages_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages',
              filter: `recipient_id=eq.${userId}`
            },
            (payload) => {
              console.log('Message change received:', payload);
              // Refresh messages
              get().fetchMessages(userId);
            }
          )
          .subscribe();

        return () => supabase.removeChannel(channel);
      },

      clearData: () => {
        set({
          grades: [],
          attendance: [],
          messages: [],
          resources: [],
          courses: [],
          assessments: [],
          error: null
        });
      }
    }),
    {
      name: 'data-store',
      partialize: (state) => ({
        // Only persist non-sensitive data
        courses: state.courses,
        assessments: state.assessments
      })
    }
  )
);