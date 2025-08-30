import { create } from 'zustand';

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
  { id: 's1', name: 'Ritik Koley', type: 'student', identifier: 'S-123456', email: 'ritik.koley@example.com' },
  { id: 's2', name: 'Alex Johnson', type: 'student', identifier: 'S-123457', email: 'alex.johnson@example.com' },
  { id: 's3', name: 'Sarah Williams', type: 'student', identifier: 'S-123458', email: 'sarah.williams@example.com' }
];

const mockTeachers: SearchResult[] = [
  { id: 't1', name: 'Jagdeep Singh Sokhey', type: 'teacher', identifier: 'T-001', email: 'jagdeep.singh@example.com' },
  { id: 't2', name: 'Michael Zhang', type: 'teacher', identifier: 'T-002', email: 'michael.zhang@example.com' },
  { id: 't3', name: 'Emily Brown', type: 'teacher', identifier: 'T-003', email: 'emily.brown@example.com' }
];

const mockCourses: SearchResult[] = [
  { id: 'c1', name: 'Computer Science', type: 'course', identifier: 'CS101', code: 'CS101' },
  { id: 'c2', name: 'Data Structures', type: 'course', identifier: 'CS102', code: 'CS102' },
  { id: 'c3', name: 'Physics', type: 'course', identifier: 'PHY101', code: 'PHY101' }
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