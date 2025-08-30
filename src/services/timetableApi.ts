import { supabase } from '../lib/supabase';
import {
  AcademicTerm,
  Group,
  Course,
  GroupCourse,
  Timetable,
  TimetableSession,
  TimetableGenerationRequest,
  TimetableGenerationResult,
  TimetableGrid
} from '../types/timetable';

// Academic Terms API
export const academicTermsApi = {
  getAll: async (): Promise<AcademicTerm[]> => {
    const { data, error } = await supabase
      .from('academic_terms')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<AcademicTerm> => {
    const { data, error } = await supabase
      .from('academic_terms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (term: Omit<AcademicTerm, 'id' | 'created_at' | 'updated_at'>): Promise<AcademicTerm> => {
    const { data, error } = await supabase
      .from('academic_terms')
      .insert(term)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<AcademicTerm>): Promise<AcademicTerm> => {
    const { data, error } = await supabase
      .from('academic_terms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('academic_terms')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Groups API
export const groupsApi = {
  getAll: async (): Promise<Group[]> => {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        academic_term:academic_terms(*)
      `)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Group> => {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        academic_term:academic_terms(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (group: Omit<Group, 'id' | 'created_at' | 'updated_at'>): Promise<Group> => {
    const { data, error } = await supabase
      .from('groups')
      .insert(group)
      .select(`
        *,
        academic_term:academic_terms(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Group>): Promise<Group> => {
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        academic_term:academic_terms(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Courses API
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('active', true)
      .order('code');
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Course> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> => {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Course>): Promise<Course> => {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('courses')
      .update({ active: false })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Group Courses API
export const groupCoursesApi = {
  getByGroup: async (groupId: string): Promise<GroupCourse[]> => {
    const { data, error } = await supabase
      .from('group_courses')
      .select(`
        *,
        group:groups(*),
        course:courses(*),
        teacher:user_profiles(id, full_name, email)
      `)
      .eq('group_id', groupId)
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  create: async (groupCourse: Omit<GroupCourse, 'id' | 'created_at' | 'updated_at'>): Promise<GroupCourse> => {
    const { data, error } = await supabase
      .from('group_courses')
      .insert(groupCourse)
      .select(`
        *,
        group:groups(*),
        course:courses(*),
        teacher:user_profiles(id, full_name, email)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<GroupCourse>): Promise<GroupCourse> => {
    const { data, error } = await supabase
      .from('group_courses')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        group:groups(*),
        course:courses(*),
        teacher:user_profiles(id, full_name, email)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('group_courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Timetables API
export const timetablesApi = {
  getByGroup: async (groupId: string): Promise<Timetable[]> => {
    const { data, error } = await supabase
      .from('timetables')
      .select(`
        *,
        group:groups(*),
        academic_term:academic_terms(*)
      `)
      .eq('group_id', groupId)
      .order('version', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Timetable> => {
    const { data, error } = await supabase
      .from('timetables')
      .select(`
        *,
        group:groups(*),
        academic_term:academic_terms(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  getSessions: async (timetableId: string): Promise<TimetableSession[]> => {
    const { data, error } = await supabase
      .from('timetable_sessions')
      .select(`
        *,
        course:courses(*),
        teacher:user_profiles(id, full_name, email)
      `)
      .eq('timetable_id', timetableId)
      .order(['day_of_week', 'period_start_index']);
    
    if (error) throw error;
    return data || [];
  },

  generateTimetable: async (request: TimetableGenerationRequest): Promise<TimetableGenerationResult> => {
    const { data, error } = await supabase.functions.invoke('generate_timetable', {
      body: request
    });
    
    if (error) throw error;
    return data;
  },

  publishTimetable: async (timetableId: string): Promise<Timetable> => {
    const { data, error } = await supabase
      .from('timetables')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        published_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', timetableId)
      .select(`
        *,
        group:groups(*),
        academic_term:academic_terms(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  archiveTimetable: async (timetableId: string): Promise<Timetable> => {
    const { data, error } = await supabase
      .from('timetables')
      .update({ status: 'archived' })
      .eq('id', timetableId)
      .select(`
        *,
        group:groups(*),
        academic_term:academic_terms(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Timetable Sessions API
export const timetableSessionsApi = {
  updateSession: async (id: string, updates: Partial<TimetableSession>): Promise<TimetableSession> => {
    const { data, error } = await supabase
      .from('timetable_sessions')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        course:courses(*),
        teacher:user_profiles(id, full_name, email)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  lockSession: async (id: string): Promise<TimetableSession> => {
    return timetableSessionsApi.updateSession(id, { locked: true });
  },

  unlockSession: async (id: string): Promise<TimetableSession> => {
    return timetableSessionsApi.updateSession(id, { locked: false });
  },

  deleteSession: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('timetable_sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Utility functions
export const timetableUtils = {
  convertSessionsToGrid: (sessions: TimetableSession[], daysPerWeek: number, periodsPerDay: number): TimetableGrid => {
    const grid: TimetableGrid = {};
    
    // Initialize empty grid
    for (let day = 0; day < daysPerWeek; day++) {
      grid[day] = {};
      for (let period = 0; period < periodsPerDay; period++) {
        grid[day][period] = null;
      }
    }
    
    // Place sessions in grid
    sessions.forEach(session => {
      for (let i = 0; i < session.duration_periods; i++) {
        const period = session.period_start_index + i;
        if (period < periodsPerDay) {
          grid[session.day_of_week][period] = session;
        }
      }
    });
    
    return grid;
  },

  getDayName: (dayIndex: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] || 'Unknown';
  },

  getPeriodTime: (periodIndex: number, periodLength: number, startTime: string = '08:00'): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const totalMinutes = startHour * 60 + startMinute + (periodIndex * periodLength);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  },

  validateTimetableData: (sessions: TimetableSession[]): string[] => {
    const errors: string[] = [];
    const conflicts = new Map<string, TimetableSession[]>();
    
    sessions.forEach(session => {
      const key = `${session.day_of_week}-${session.period_start_index}`;
      if (!conflicts.has(key)) {
        conflicts.set(key, []);
      }
      conflicts.get(key)!.push(session);
    });
    
    conflicts.forEach((sessionList, timeSlot) => {
      if (sessionList.length > 1) {
        errors.push(`Time conflict at ${timeSlot}: ${sessionList.map(s => s.course?.title).join(', ')}`);
      }
    });
    
    return errors;
  }
};