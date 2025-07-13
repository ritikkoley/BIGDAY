import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Type aliases for convenience
type User = Database['public']['Tables']['users']['Row'];
type Group = Database['public']['Tables']['groups']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];
type Assessment = Database['public']['Tables']['assessments']['Row'];

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