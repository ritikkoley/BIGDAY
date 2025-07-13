import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

type SearchResult = {
  id: string;
  name: string;
  type: 'student' | 'teacher' | 'course';
  identifier: string;
  email?: string;
  code?: string;
};

interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  
  search: (query: string, role?: 'student' | 'teacher' | 'admin') => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isLoading: false,
  error: null,

  search: async (query: string, role?: 'student' | 'teacher' | 'admin') => {
    if (!query.trim()) {
      set({ results: [], query: '' });
      return;
    }

    set({ isLoading: true, error: null, query });

    try {
      const results: SearchResult[] = [];

      // Search users based on role permissions
      if (role === 'admin') {
        // Admins can search all users
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, name, email, role, admission_number, employee_id')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%,admission_number.ilike.%${query}%,employee_id.ilike.%${query}%`)
          .limit(10);

        if (usersError) throw usersError;

        users?.forEach(user => {
          results.push({
            id: user.id,
            name: user.name,
            type: user.role as 'student' | 'teacher',
            identifier: user.role === 'student' 
              ? user.admission_number || 'No ID' 
              : user.employee_id || 'No ID',
            email: user.email
          });
        });
      } else if (role === 'teacher') {
        // Teachers can search students in their groups
        const { data: students, error: studentsError } = await supabase
          .from('users')
          .select('id, name, email, admission_number, group_id')
          .eq('role', 'student')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%,admission_number.ilike.%${query}%`)
          .limit(10);

        if (studentsError) throw studentsError;

        students?.forEach(student => {
          results.push({
            id: student.id,
            name: student.name,
            type: 'student',
            identifier: student.admission_number || 'No ID',
            email: student.email
          });
        });
      }

      // Search courses (all roles can search courses they have access to)
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, name, code')
        .or(`name.ilike.%${query}%,code.ilike.%${query}%`)
        .limit(10);

      if (coursesError) throw coursesError;

      courses?.forEach(course => {
        results.push({
          id: course.id,
          name: course.name,
          type: 'course',
          identifier: course.code,
          code: course.code
        });
      });

      set({ 
        results,
        isLoading: false 
      });
    } catch (error) {
      console.error('Search error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false 
      });
    }
  },

  clearSearch: () => set({ 
    query: '', 
    results: [], 
    error: null 
  })
}));