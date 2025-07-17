import { create } from 'zustand';
import { demoUsers, demoCourses } from '../data/demoData';

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

// Mock search results
const mockStudents: SearchResult[] = [
  ...demoUsers
    .filter(user => user.role === 'student')
    .map(user => ({
      id: user.id,
      name: user.name,
      type: 'student' as const,
      identifier: user.id.replace('student-', 'S-'),
      email: user.email
    }))
];

const mockTeachers: SearchResult[] = [
  ...demoUsers
    .filter(user => user.role === 'teacher')
    .map(user => ({
      id: user.id,
      name: user.name,
      type: 'teacher' as const,
      identifier: user.id.replace('teacher-', 'T-'),
      email: user.email
    }))
];

const mockCourses: SearchResult[] = [
  ...demoCourses.map(course => ({
    id: course.id,
    name: course.name,
    type: 'course' as const,
    identifier: course.code,
    code: course.code
  }))
];

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const searchQuery = query.toLowerCase();
      let results: SearchResult[] = [];

      // Filter based on role and query
      if (role === 'admin') {
        // Admins can search all users and courses
        results = [
          ...mockStudents.filter(s => 
            s.name.toLowerCase().includes(searchQuery) || 
            s.identifier.toLowerCase().includes(searchQuery) ||
            s.email?.toLowerCase().includes(searchQuery)
          ),
          ...mockTeachers.filter(t => 
            t.name.toLowerCase().includes(searchQuery) || 
            t.identifier.toLowerCase().includes(searchQuery) ||
            t.email?.toLowerCase().includes(searchQuery)
          ),
          ...mockCourses.filter(c => 
            c.name.toLowerCase().includes(searchQuery) || 
            c.identifier.toLowerCase().includes(searchQuery)
          )
        ];
      } else if (role === 'teacher') {
        // Teachers can search students and courses
        results = [
          ...mockStudents.filter(s => 
            s.name.toLowerCase().includes(searchQuery) || 
            s.identifier.toLowerCase().includes(searchQuery) ||
            s.email?.toLowerCase().includes(searchQuery)
          ),
          ...mockCourses.filter(c => 
            c.name.toLowerCase().includes(searchQuery) || 
            c.identifier.toLowerCase().includes(searchQuery)
          )
        ];
      } else {
        // Students can only search courses
        results = mockCourses.filter(c => 
          c.name.toLowerCase().includes(searchQuery) || 
          c.identifier.toLowerCase().includes(searchQuery)
        );
      }

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