import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];
type UserProfile = Tables['user_profiles']['Row'];
type Course = Tables['courses']['Row'];
type Assessment = Tables['assessments']['Row'];
type Grade = Tables['grades']['Row'];
type Attendance = Tables['attendance']['Row'];
type Message = Tables['messages']['Row'];
type Resource = Tables['resources']['Row'];

interface DataState {
  // Data
  profile: UserProfile | null;
  courses: Course[];
  assessments: Assessment[];
  grades: Grade[];
  attendance: Attendance[];
  messages: Message[];
  resources: Resource[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserProfile: (userId: string) => Promise<void>;
  fetchCourses: (userId: string, role: string) => Promise<void>;
  fetchAssessments: (courseId: string) => Promise<void>;
  fetchGrades: (studentId: string, courseId?: string) => Promise<void>;
  fetchAttendance: (studentId: string, courseId?: string) => Promise<void>;
  fetchMessages: (userId: string, groupId?: string) => Promise<void>;
  fetchResources: (courseId: string) => Promise<void>;
  
  // CRUD operations
  createGrade: (grade: Tables['grades']['Insert']) => Promise<void>;
  updateGrade: (id: string, updates: Tables['grades']['Update']) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  
  createAttendance: (attendance: Tables['attendance']['Insert']) => Promise<void>;
  updateAttendance: (id: string, updates: Tables['attendance']['Update']) => Promise<void>;
  
  sendMessage: (message: Tables['messages']['Insert']) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  
  uploadResource: (resource: Tables['resources']['Insert'], file?: File) => Promise<void>;
  
  // Bulk operations
  bulkUploadGrades: (assessmentId: string, grades: { student_id: string; score: number }[]) => Promise<void>;
  bulkUploadAttendance: (courseId: string, date: string, records: { student_id: string; status: string }[]) => Promise<void>;
  
  // Analytics
  getProjectedGrade: (studentId: string, courseId: string) => Promise<number>;
  getAtRiskStudents: (courseId: string) => Promise<any[]>;
  getTopPerformers: (courseId: string) => Promise<any[]>;
  getCourseAverage: (courseId: string) => Promise<number>;
  
  // Clear data
  clearData: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  profile: null,
  courses: [],
  assessments: [],
  grades: [],
  attendance: [],
  messages: [],
  resources: [],
  isLoading: false,
  error: null,

  // Fetch operations
  fetchUserProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      set({ profile: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile', 
        isLoading: false 
      });
    }
  },

  fetchCourses: async (userId: string, role: string) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase.from('courses').select('*');
      
      if (role === 'teacher') {
        query = query.eq('teacher_id', userId);
      } else if (role === 'student') {
        // Get user's group_id first
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('group_id')
          .eq('id', userId)
          .single();
        
        if (profile?.group_id) {
          query = query.contains('group_ids', [profile.group_id]);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      set({ courses: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch courses', 
        isLoading: false 
      });
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
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch assessments', 
        isLoading: false 
      });
    }
  },

  fetchGrades: async (studentId: string, courseId?: string) => {
    try {
      set({ isLoading: true, error: null });

      let query = supabase
        .from('grades')
        .select(`
          *,
          assessments!inner(
            name,
            course_id,
            type,
            total_marks
          )
        `)
        .eq('student_id', studentId);

      if (courseId) {
        query = query.eq('assessments.course_id', courseId);
      } else {
        // If no courseId is provided, get all grades for the student
        query = query.order('graded_at', { ascending: false });
      }
      
      const { data, error } = await query.limit(50);
      if (error) throw error;
      
      set({ grades: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch grades', 
        isLoading: false 
      });
    }
  },

  fetchAttendance: async (studentId: string, courseId?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId);

      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      query = query.order('date', { ascending: false });
      
      const { data, error } = await query.limit(50);
      if (error) throw error;
      
      set({ attendance: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch attendance', 
        isLoading: false 
      });
    }
  },

  fetchMessages: async (userId: string, groupId?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(name, role)
        `);

      if (groupId) {
        query = query.or(`recipient_id.eq.${userId},group_id.eq.${groupId}`);
      } else {
        query = query.eq('recipient_id', userId);
      }
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query.limit(20);
      if (error) throw error;
      
      set({ messages: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },

  fetchResources: async (courseId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const query = supabase
        .from('resources')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_public', true);

      const { data, error: resourceError } = await query.order('created_at', { ascending: false }).limit(20);
      if (resourceError) throw resourceError;
      
      set({ resources: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch resources', 
        isLoading: false 
      });
    }
  },

  // CRUD operations
  createGrade: async (grade) => {
    try {
      const { error } = await supabase
        .from('grades')
        .insert(grade);

      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create grade' });
    }
  },

  updateGrade: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('grades')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
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
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete grade' });
    }
  },

  createAttendance: async (attendance) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .insert(attendance);

      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create attendance record' });
    }
  },

  updateAttendance: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update attendance' });
    }
  },

  sendMessage: async (message) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert(message);

      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send message' });
    }
  },

  markMessageAsRead: async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
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
        filePath = `resources/${resource.course_id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
      }

      const { error } = await supabase
        .from('resources')
        .insert({
          ...resource,
          file_path: filePath,
          file_size: file?.size || null,
          file_type: file?.type || null
        });

      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to upload resource' });
    }
  },

  // Bulk operations
  bulkUploadGrades: async (assessmentId, grades) => {
    try {
      const gradeInserts = grades.map(g => ({
        student_id: g.student_id,
        assessment_id: assessmentId,
        score: g.score,
        max_score: 100
      }));

      const { error } = await supabase
        .from('grades')
        .insert(gradeInserts);

      if (error) throw error;

      // Update percentiles
      await supabase.rpc('update_percentiles', { assess_id: assessmentId });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to bulk upload grades' });
    }
  },

  bulkUploadAttendance: async (courseId, date, records) => {
    try {
      const attendanceInserts = records.map(r => ({
        student_id: r.student_id,
        course_id: courseId,
        date,
        status: r.status as 'present' | 'absent' | 'late' | 'excused'
      }));

      const { error } = await supabase
        .from('attendance')
        .insert(attendanceInserts);

      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to bulk upload attendance' });
    }
  },

  // Analytics
  getProjectedGrade: async (studentId: string, courseId: string) => {
    try {
      // Get all grades for the student in this course
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select(`
          score,
          max_score,
          assessments!inner(
            weightage,
            course_id
          )
        `)
        .eq('student_id', studentId)
        .eq('assessments.course_id', courseId);

      if (gradesError) throw gradesError;
      
      if (!grades || grades.length === 0) return 0;
      
      // Calculate weighted average
      let totalWeightedScore = 0;
      let totalWeight = 0;
      
      grades.forEach(grade => {
        const weightage = grade.assessments.weightage || 0;
        const normalizedScore = (grade.score / grade.max_score) * 100;
        totalWeightedScore += normalizedScore * weightage;
        totalWeight += weightage;
      });
      
      // If no weights, use simple average
      if (totalWeight === 0) {
        const avgScore = grades.reduce((sum, grade) => sum + (grade.score / grade.max_score) * 100, 0) / grades.length;
        return avgScore;
      }
      
      return totalWeightedScore / totalWeight;

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get projected grade' });
      return 0;
    }
  },

  getAtRiskStudents: async (courseId: string) => {
    try {
      // Get all students in the course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('group_ids')
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      
      if (!courseData || !courseData.group_ids || courseData.group_ids.length === 0) {
        return [];
      }
      
      // Get all students in these groups
      const { data: students, error: studentsError } = await supabase
        .from('user_profiles')
        .select('id, name')
        .eq('role', 'student')
        .in('group_id', courseData.group_ids);
      
      if (studentsError) throw studentsError;
      
      if (!students || students.length === 0) {
        return [];
      }
      
      // For each student, get their average score in this course
      const atRiskStudents = [];
      
      for (const student of students) {
        const avgScore = await get().getProjectedGrade(student.id, courseId);
        
        // Consider students with score < 70 as at risk
        if (avgScore < 70) {
          atRiskStudents.push({
            student_id: student.id,
            avg_score: avgScore
          });
        }
      }
      
      return atRiskStudents;

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get at-risk students' });
      return [];
    }
  },

  getTopPerformers: async (courseId: string) => {
    try {
      // Get all students in the course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('group_ids')
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      
      if (!courseData || !courseData.group_ids || courseData.group_ids.length === 0) {
        return [];
      }
      
      // Get all students in these groups
      const { data: students, error: studentsError } = await supabase
        .from('user_profiles')
        .select('id, name')
        .eq('role', 'student')
        .in('group_id', courseData.group_ids);
      
      if (studentsError) throw studentsError;
      
      if (!students || students.length === 0) {
        return [];
      }
      
      // For each student, get their average score in this course
      const studentScores = [];
      
      for (const student of students) {
        const avgScore = await get().getProjectedGrade(student.id, courseId);
        studentScores.push({
          student_id: student.id,
          avg_score: avgScore
        });
      }
      
      // Sort by score and take top 20%
      studentScores.sort((a, b) => b.avg_score - a.avg_score);
      const topCount = Math.max(1, Math.ceil(studentScores.length * 0.2));
      
      return studentScores.slice(0, topCount);

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get top performers' });
      return [];
    }
  },

  getCourseAverage: async (courseId: string) => {
    try {
      // Get all grades for this course
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessments')
        .select('id')
        .eq('course_id', courseId);
      
      if (assessmentsError) throw assessmentsError;
      
      if (!assessments || assessments.length === 0) {
        return 0;
      }
      
      const assessmentIds = assessments.map(a => a.id);
      
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('score, max_score')
        .in('assessment_id', assessmentIds);
      
      if (gradesError) throw gradesError;
      
      if (!grades || grades.length === 0) {
        return 0;
      }
      
      // Calculate average as percentage
      const totalPercentage = grades.reduce((sum, grade) => {
        return sum + (grade.score / grade.max_score) * 100;
      }, 0);
      
      return totalPercentage / grades.length;

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get course average' });
      return 0;
    }
  },

  clearData: () => {
    set({
      profile: null,
      courses: [],
      assessments: [],
      grades: [],
      attendance: [],
      messages: [],
      resources: [],
      error: null
    });
  }
}));