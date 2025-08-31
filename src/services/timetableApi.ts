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
    try {
      console.warn('Academic terms table not found, returning empty array');
      return [];
    } catch (error) {
      console.warn('Academic terms API error:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<AcademicTerm> => {
    throw new Error('Academic terms table not available yet');
  },

  create: async (term: Omit<AcademicTerm, 'id' | 'created_at' | 'updated_at'>): Promise<AcademicTerm> => {
    throw new Error('Academic terms table not available yet');
  },

  update: async (id: string, updates: Partial<AcademicTerm>): Promise<AcademicTerm> => {
    throw new Error('Academic terms table not available yet');
  },

  delete: async (id: string): Promise<void> => {
    throw new Error('Academic terms table not available yet');
  }
};

// Groups API
export const groupsApi = {
  getAll: async (): Promise<Group[]> => {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select('*')
        .order('name');
      
      if (error) {
        console.warn('Groups table not found, returning empty array');
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Groups API error:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Group> => {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Group not found');
    }
  },

  create: async (group: Omit<Group, 'id' | 'created_at' | 'updated_at'>): Promise<Group> => {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .insert(group)
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Failed to create group');
    }
  },

  update: async (id: string, updates: Partial<Group>): Promise<Group> => {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Failed to update group');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error('Failed to delete group');
    }
  }
};

// Courses API
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    try {
      // Return empty array until courses table is created
      console.warn('Courses table not found, returning empty array');
      return [];
    } catch (error) {
      console.warn('Courses API error:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Course> => {
    throw new Error('Courses table not available yet');
  },

  create: async (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> => {
    throw new Error('Courses table not available yet');
  },

  update: async (id: string, updates: Partial<Course>): Promise<Course> => {
    throw new Error('Courses table not available yet');
  },

  delete: async (id: string): Promise<void> => {
    throw new Error('Courses table not available yet');
  }
};

// Group Courses API
export const groupCoursesApi = {
  getByGroup: async (groupId: string): Promise<GroupCourse[]> => {
    try {
      console.warn('Group courses table not found, returning empty array');
      return [];
    } catch (error) {
      console.warn('Group courses API error:', error);
      return [];
    }
  },

  create: async (groupCourse: Omit<GroupCourse, 'id' | 'created_at' | 'updated_at'>): Promise<GroupCourse> => {
    throw new Error('Group courses table not available yet');
  },

  update: async (id: string, updates: Partial<GroupCourse>): Promise<GroupCourse> => {
    throw new Error('Group courses table not available yet');
  },

  delete: async (id: string): Promise<void> => {
    throw new Error('Group courses table not available yet');
  }
};

// Timetables API
export const timetablesApi = {
  getByGroup: async (groupId: string): Promise<Timetable[]> => {
    try {
      console.warn('Timetables table not found, returning empty array');
      return [];
    } catch (error) {
      console.warn('Timetables API error:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Timetable> => {
    throw new Error('Timetables table not available yet');
  },

  getSessions: async (timetableId: string): Promise<TimetableSession[]> => {
    try {
      console.warn('Timetable sessions table not found, returning empty array');
      return [];
    } catch (error) {
      console.warn('Timetable sessions API error:', error);
      return [];
    }
  },

  generateTimetable: async (request: TimetableGenerationRequest): Promise<TimetableGenerationResult> => {
    throw new Error('Timetable generation not available yet - database schema required');
  },

  publishTimetable: async (timetableId: string): Promise<Timetable> => {
    throw new Error('Timetables table not available yet');
  },

  archiveTimetable: async (timetableId: string): Promise<Timetable> => {
    throw new Error('Timetables table not available yet');
  }
};

// Timetable Sessions API
export const timetableSessionsApi = {
  updateSession: async (id: string, updates: Partial<TimetableSession>): Promise<TimetableSession> => {
    throw new Error('Timetable sessions table not available yet');
  },

  lockSession: async (id: string): Promise<TimetableSession> => {
    throw new Error('Timetable sessions table not available yet');
  },

  unlockSession: async (id: string): Promise<TimetableSession> => {
    throw new Error('Timetable sessions table not available yet');
  },

  deleteSession: async (id: string): Promise<void> => {
    throw new Error('Timetable sessions table not available yet');
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