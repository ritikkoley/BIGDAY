import { create } from 'zustand';

type SearchResult = any; // Replace with your data types

interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  
  search: (query: string, role?: 'student' | 'teacher' | 'admin') => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
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
      // Mock search - replace with your backend API call
      const mockResults = [
        { id: '1', name: 'John Doe', type: 'student', identifier: 'S-123456' },
        { id: '2', name: 'Jane Smith', type: 'student', identifier: 'S-123457' },
        { id: '3', name: 'Computer Science 101', type: 'course', identifier: 'C-1001' },
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.identifier.toLowerCase().includes(query.toLowerCase())
      );

      set({ 
        results: mockResults,
        isLoading: false 
      });
    } catch (error) {
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