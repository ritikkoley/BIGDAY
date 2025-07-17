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
  { id: 'student-1', name: 'Ritik Koley', type: 'student', identifier: 'S-123456', email: 'student@dpsb.edu' },
  { id: 'student-2', name: 'Alex Johnson', type: 'student', identifier: 'S-123457', email: 'alex.johnson@dpsb.edu' },
  { id: 'student-3', name: 'Sarah Williams', type: 'student', identifier: 'S-123458', email: 'sarah.williams@dpsb.edu' },
  { id: 'student-4', name: 'Raj Patel', type: 'student', identifier: 'S-123459', email: 'raj.patel@dpsb.edu' },
  { id: 'student-5', name: 'Priya Sharma', type: 'student', identifier: 'S-123460', email: 'priya.sharma@dpsb.edu' }
];

const mockTeachers: SearchResult[] = [
  { id: 'teacher-1', name: 'Jagdeep Singh Sokhey', type: 'teacher', identifier: 'T-001', email: 'teacher@dpsb.edu' },
  { id: 'teacher-2', name: 'Michael Zhang', type: 'teacher', identifier: 'T-002', email: 'michael.zhang@dpsb.edu' },
  { id: 'teacher-3', name: 'Emily Brown', type: 'teacher', identifier: 'T-003', email: 'emily.brown@dpsb.edu' }
];

const mockCourses: SearchResult[] = [
  { id: 'cs101', name: 'Computer Science Fundamentals', type: 'course', identifier: 'CS101', code: 'CS101' },
  { id: 'cs102', name: 'Advanced Programming', type: 'course', identifier: 'CS102', code: 'CS102' },
  { id: 'math101', name: 'Mathematics', type: 'course', identifier: 'MATH101', code: 'MATH101' },
  { id: 'math201', name: 'Advanced Mathematics', type: 'course', identifier: 'MATH201', code: 'MATH201' },
  { id: 'phy101', name: 'Physics', type: 'course', identifier: 'PHY101', code: 'PHY101' },
  { id: 'phy201', name: 'Advanced Physics', type: 'course', identifier: 'PHY201', code: 'PHY201' }
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