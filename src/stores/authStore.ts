import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, getCurrentUser, getUserProfile, getUserRole } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

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
          
          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            set({ isLoading: false, isInitialized: true });
            return;
          }

          if (session?.user) {
            // Get user profile and role
            const [profile, role] = await Promise.all([
              getUserProfile(session.user.id),
              getUserRole(session.user.id)
            ]);

            set({
              user: session.user,
              profile,
              role: role as 'student' | 'teacher' | 'admin',
              isLoading: false,
              isInitialized: true
            });
          } else {
            set({ 
              user: null, 
              profile: null, 
              role: null, 
              isLoading: false, 
              isInitialized: true 
            });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const [profile, role] = await Promise.all([
                getUserProfile(session.user.id),
                getUserRole(session.user.id)
              ]);

              set({
                user: session.user,
                profile,
                role: role as 'student' | 'teacher' | 'admin'
              });
            } else if (event === 'SIGNED_OUT') {
              set({ 
                user: null, 
                profile: null, 
                role: null 
              });
            }
          });

        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ isLoading: false, isInitialized: true });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;

          if (data.user) {
            const [profile, role] = await Promise.all([
              getUserProfile(data.user.id),
              getUserRole(data.user.id)
            ]);

            set({
              user: data.user,
              profile,
              role: role as 'student' | 'teacher' | 'admin',
              isLoading: false
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name
              }
            }
          });

          if (error) throw error;

          // User profile will be created automatically by the trigger
          set({ isLoading: false });

          // Note: User will need to verify email before they can sign in
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signInWithOAuth: async (provider: 'google' | 'apple') => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
          });

          if (error) throw error;

          // OAuth flow will redirect, so we don't need to handle the response here
          return data;
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
          const { user, profile } = get();
          if (!user || !profile) throw new Error('No user logged in');

          const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id)
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