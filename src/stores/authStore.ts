import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  group_id?: string;
  department?: string;
  status?: 'active' | 'inactive';
};

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  role: 'student' | 'teacher' | 'admin' | null;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// Mock data for demo purposes
const MOCK_USERS = [
  {
    id: 'student-1',
    email: 'student@dpsb.edu',
    password: 'student123',
    name: 'Ritik Koley',
    role: 'student',
    group_id: 'class-10a',
    status: 'active'
  },
  {
    id: 'teacher-1',
    email: 'teacher@dpsb.edu',
    password: 'teacher123',
    name: 'Jagdeep Singh Sokhey',
    role: 'teacher',
    department: 'Computer Science',
    status: 'active'
  },
  {
    id: 'admin-1',
    email: 'admin@dpsb.edu',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    status: 'active'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      role: null,
      isLoading: false,
      isInitialized: false,

      initialize: async () => {
        try {
          set({ isLoading: true });
          
          // Check if there's a stored session
          const storedAuth = localStorage.getItem('auth-storage');
          if (storedAuth) {
            const { state } = JSON.parse(storedAuth);
            if (state.user && state.profile && state.role) {
              set({
                user: state.user,
                profile: state.profile,
                role: state.role,
                isLoading: false,
                isInitialized: true
              });
              return;
            }
          }
          
          set({ 
            user: null, 
            profile: null, 
            role: null, 
            isLoading: false, 
            isInitialized: true 
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ isLoading: false, isInitialized: true });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          // Find user in mock data
          const mockUser = MOCK_USERS.find(
            user => user.email === email && user.password === password
          );

          if (!mockUser) {
            throw new Error('Invalid login credentials');
          }

          const user = {
            id: mockUser.id,
            email: mockUser.email,
            user_metadata: {
              name: mockUser.name
            }
          } as unknown as User;

          const profile = {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role as 'student' | 'teacher' | 'admin',
            group_id: mockUser.group_id,
            department: mockUser.department,
            status: mockUser.status as 'active' | 'inactive'
          };

          set({
            user,
            profile,
            role: mockUser.role as 'student' | 'teacher' | 'admin',
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true });

          // In a real app, this would create a new user
          // For demo, just simulate success
          console.log('Sign up successful for:', email, name);
          
          set({ isLoading: false });
          return { user: null, session: null };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signInWithOAuth: async (provider: 'google' | 'apple') => {
        try {
          set({ isLoading: true });

          // In a real app, this would redirect to OAuth
          // For demo, just simulate success
          console.log('OAuth sign in with:', provider);
          
          set({ isLoading: false });
          return { url: null, provider: null };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });

          set({
            user: null,
            profile: null,
            role: null,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        try {
          // In a real app, this would send a reset email
          // For demo, just simulate success
          console.log('Password reset email sent to:', email);
        } catch (error) {
          throw error;
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        try {
          const { profile } = get();
          if (!profile) throw new Error('No user logged in');

          const updatedProfile = { ...profile, ...updates };
          set({ profile: updatedProfile });
          return updatedProfile;
        } catch (error) {
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        role: state.role
      })
    }
  )
);

// Initialize auth on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}