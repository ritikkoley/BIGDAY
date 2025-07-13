import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Enhanced type aliases for all entities
type User = Database['public']['Tables']['users']['Row'];
type Group = Database['public']['Tables']['groups']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];
type Assessment = Database['public']['Tables']['assessments']['Row'];
type Grade = Database['public']['Tables']['grades']['Row'];
type Attendance = Database['public']['Tables']['attendance']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type Resource = Database['public']['Tables']['resources']['Row'];

// User Management API
export const userApi = {
  // Get all users (admin only)
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new user (admin only)
  create: async (userData: Database['public']['Tables']['users']['Insert']): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user
  update: async (id: string, updates: Database['public']['Tables']['users']['Update']): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete user (admin only)
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get students by group
  getStudentsByGroup: async (groupId: string): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .eq('group_id', groupId)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get teachers by department
  getTeachersByDepartment: async (department: string): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'teacher')
      .eq('department', department)
      .order('name');
    
    if (error) throw error;
    return data;
  }
};

// Group Management API
export const groupApi = {
  // Get all groups
  getAll: async (): Promise<Group[]> => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get group by ID
  getById: async (id: string): Promise<Group> => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new group
  create: async (groupData: Database['public']['Tables']['groups']['Insert']): Promise<Group> => {
    const { data, error } = await supabase
      .from('groups')
      .insert(groupData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update group
  update: async (id: string, updates: Database['public']['Tables']['groups']['Update']): Promise<Group> => {
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete group
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get groups by type
  getByType: async (type: 'class' | 'department'): Promise<Group[]> => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('type', type)
      .order('name');
    
    if (error) throw error;
    return data;
  }
};

// Course Management API
export const courseApi = {
  // Get all courses (filtered by user permissions)
  getAll: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        teacher:users!courses_teacher_id_fkey(name, email)
      `)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get course by ID
  getById: async (id: string): Promise<Course> => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        teacher:users!courses_teacher_id_fkey(name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new course
  create: async (courseData: Database['public']['Tables']['courses']['Insert']): Promise<Course> => {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update course
  update: async (id: string, updates: Database['public']['Tables']['courses']['Update']): Promise<Course> => {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete course
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get courses by teacher
  getByTeacher: async (teacherId: string): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get courses by group
  getByGroup: async (groupId: string): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .contains('group_ids', [groupId])
      .order('name');
    
    if (error) throw error;
    return data;
  }
};

// Assessment Management API
export const assessmentApi = {
  // Get all assessments for a course
  getByCourse: async (courseId: string): Promise<Assessment[]> => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('course_id', courseId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get assessment by ID
  getById: async (id: string): Promise<Assessment> => {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        course:courses(name, code, teacher:users!courses_teacher_id_fkey(name))
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new assessment
  create: async (assessmentData: Database['public']['Tables']['assessments']['Insert']): Promise<Assessment> => {
    const { data, error } = await supabase
      .from('assessments')
      .insert(assessmentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update assessment
  update: async (id: string, updates: Database['public']['Tables']['assessments']['Update']): Promise<Assessment> => {
    const { data, error } = await supabase
      .from('assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete assessment
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get upcoming assessments for a user
  getUpcoming: async (userId: string): Promise<Assessment[]> => {
    const { data, error } = await supabase
      .rpc('get_user_courses', { user_id: userId });
    
    if (error) throw error;

    const courseIds = data.map(course => course.course_id);
    
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select(`
        *,
        course:courses(name, code)
      `)
      .in('course_id', courseIds)
      .gte('due_date', new Date().toISOString())
      .eq('status', 'published')
      .order('due_date', { ascending: true })
      .limit(10);
    
    if (assessmentsError) throw assessmentsError;
    return assessments;
  }
};

// File Management API
export const fileApi = {
  // Upload file to storage
  upload: async (bucket: string, path: string, file: File): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    // Return public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return urlData.publicUrl;
  },

  // Get file URL
  getUrl: (bucket: string, path: string): string => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  // Delete file
  delete: async (bucket: string, path: string): Promise<void> => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  },

  // List files in a folder
  list: async (bucket: string, folder: string = '') => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) throw error;
    return data;
  }
};

// Grade Management API
export const gradeApi = {
  // Get grades for a student
  getByStudent: async (studentId: string, courseId?: string): Promise<Grade[]> => {
    let query = supabase
      .from('grades')
      .select(`
        *,
        assessment:assessments(
          name,
          type,
          due_date,
          total_marks,
          course:courses(name)
        )
      `)
      .eq('student_id', studentId);
    
    if (courseId) {
      query = query.eq('assessment.course_id', courseId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get grades for an assessment
  getByAssessment: async (assessmentId: string): Promise<Grade[]> => {
    const { data, error } = await supabase
      .from('grades')
      .select(`
        *,
        student:users!grades_student_id_fkey(name, email)
      `)
      .eq('assessment_id', assessmentId)
      .order('score', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create grade
  create: async (gradeData: Database['public']['Tables']['grades']['Insert']): Promise<Grade> => {
    const { data, error } = await supabase
      .from('grades')
      .insert(gradeData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update grade
  update: async (id: string, updates: Database['public']['Tables']['grades']['Update']): Promise<Grade> => {
    const { data, error } = await supabase
      .from('grades')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete grade
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Bulk upload grades
  bulkUpload: async (assessmentId: string, grades: { student_id: string; score: number }[]): Promise<any> => {
    const { data, error } = await supabase.functions.invoke('bulk-upload-grades', {
      body: { assessment_id: assessmentId, grades }
    });
    
    if (error) throw error;
    return data;
  }
};

// Attendance Management API
export const attendanceApi = {
  // Get attendance for a student
  getByStudent: async (studentId: string, courseId?: string): Promise<Attendance[]> => {
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
    return data;
  },

  // Get attendance for a course
  getByCourse: async (courseId: string, date?: string): Promise<Attendance[]> => {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        student:users!attendance_student_id_fkey(name, email)
      `)
      .eq('course_id', courseId);
    
    if (date) {
      query = query.eq('date', date);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create attendance record
  create: async (attendanceData: Database['public']['Tables']['attendance']['Insert']): Promise<Attendance> => {
    const { data, error } = await supabase
      .from('attendance')
      .insert(attendanceData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update attendance record
  update: async (id: string, updates: Database['public']['Tables']['attendance']['Update']): Promise<Attendance> => {
    const { data, error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Bulk upload attendance
  bulkUpload: async (courseId: string, date: string, records: { student_id: string; status: string }[]): Promise<any> => {
    const { data, error } = await supabase.functions.invoke('bulk-upload-attendance', {
      body: { course_id: courseId, date, attendance_records: records }
    });
    
    if (error) throw error;
    return data;
  },

  // Get attendance summary
  getSummary: async (studentId: string, courseId?: string): Promise<any> => {
    const { data, error } = await supabase
      .rpc('get_attendance_summary', { student_uuid: studentId, course_uuid: courseId });
    
    if (error) throw error;
    return data;
  }
};

// Message Management API
export const messageApi = {
  // Get messages for a user
  getByUser: async (userId: string, limit = 50): Promise<any[]> => {
    const { data, error } = await supabase
      .rpc('get_recent_messages', { user_uuid: userId, limit_count: limit });
    
    if (error) throw error;
    return data;
  },

  // Send message
  send: async (messageData: Database['public']['Tables']['messages']['Insert']): Promise<Message> => {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<void> => {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId);
    
    if (error) throw error;
  },

  // Get conversation
  getConversation: async (userId1: string, userId2: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(name)
      `)
      .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Resource Management API
export const resourceApi = {
  // Get resources for a course
  getByCourse: async (courseId: string): Promise<Resource[]> => {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        uploader:users!resources_uploaded_by_fkey(name)
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Upload resource
  upload: async (resourceData: Database['public']['Tables']['resources']['Insert'], file?: File): Promise<Resource> => {
    let filePath = null;
    
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      filePath = `${resourceData.course_id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
    }
    
    const { data, error } = await supabase
      .from('resources')
      .insert({
        ...resourceData,
        file_path: filePath,
        file_size: file?.size || null,
        file_type: file?.type || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Download resource
  download: async (resourceId: string): Promise<string> => {
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
  },

  // Delete resource
  delete: async (id: string): Promise<void> => {
    // Get file path first
    const { data: resource } = await supabase
      .from('resources')
      .select('file_path')
      .eq('id', id)
      .single();
    
    // Delete from storage if file exists
    if (resource?.file_path) {
      await supabase.storage
        .from('study-materials')
        .remove([resource.file_path]);
    }
    
    // Delete from database
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Analytics API
export const analyticsApi = {
  // Get course analytics
  getCourseAnalytics: async (courseId: string): Promise<any> => {
    const { data, error } = await supabase
      .rpc('get_course_analytics', { course_uuid: courseId });
    
    if (error) throw error;
    return data[0] || {};
  },

  // Get student performance summary
  getStudentSummary: async (studentId: string): Promise<any> => {
    const [gradeData, attendanceData] = await Promise.all([
      supabase.rpc('get_grade_summary', { student_uuid: studentId }),
      supabase.rpc('get_attendance_summary', { student_uuid: studentId })
    ]);
    
    if (gradeData.error) throw gradeData.error;
    if (attendanceData.error) throw attendanceData.error;
    
    return {
      grades: gradeData.data || [],
      attendance: attendanceData.data || []
    };
  }
};

// Realtime subscriptions
export const realtimeApi = {
  // Subscribe to table changes
  subscribeToTable: (
    table: string,
    callback: (payload: any) => void,
    filter?: { column: string; value: string }
  ) => {
    const channel = supabase
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

    return channel.subscribe();
  },

  // Unsubscribe from channel
  unsubscribe: (channel: any) => {
    return supabase.removeChannel(channel);
  }
};