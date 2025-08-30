import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  group_id?: string;
  department?: string;
  profile_data?: any;
  status?: 'active' | 'inactive';
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  role: 'student' | 'teacher' | 'admin' | null;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'teacher' | 'admin') => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

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
          
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              set({
                user: session.user,
                profile,
                role: profile.role,
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

          // Real authentication for non-demo accounts
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });

          if (error) {
            console.error('Auth Error:', error.message);
            throw error;
          }

          if (data.user) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profile) {
              set({
                user: data.user,
                profile,
                role: profile.role,
                isLoading: false
              });

              // Role-based redirect
              if (profile.role === 'student') {
                window.location.href = '/student/home';
              } else if (profile.role === 'teacher') {
                window.location.href = '/teacher/dashboard';
              } else if (profile.role === 'admin') {
                window.location.href = '/admin/performance';
              }
            }
          }
        } catch (error) {
          console.error('Fetch Error:', error);
          set({ isLoading: false });
          throw new Error(error instanceof Error ? 
            error.message : 
            'Network issue - check Supabase URL/key or CORS settings');
        }
      },

      signUp: async (email: string, password: string, name: string, role: 'student' | 'teacher' | 'admin') => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role
              }
            }
          });

          if (error) throw error;

          if (data.user) {
            // Create profile
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                id: data.user.id,
                name,
                role,
                profile_data: { baseline: 0, strengths: [], psycho_test: {} }
              });

            if (profileError) throw profileError;
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signInWithOAuth: async (provider: 'google' | 'apple') => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
          });

          if (error) throw error;
          
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.signOut();
          if (error) throw error;

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
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
          });
          if (error) throw error;
        } catch (error) {
          throw error;
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        try {
          const { profile } = get();
          if (!profile) throw new Error('No user logged in');

          const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', profile.id)
            .select()
            .single();

          if (error) throw error;

          set({ profile: data });
          return data;
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

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT' || !session) {
    useAuthStore.setState({
      user: null,
      profile: null,
      role: null
    });
  } else if (event === 'SIGNED_IN' && session) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      useAuthStore.setState({
        user: session.user,
        profile,
        role: profile.role
      });
    }
  }
});