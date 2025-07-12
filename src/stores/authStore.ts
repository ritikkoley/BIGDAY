import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AuthState {
  user: User | null;
  role: 'student' | 'teacher' | 'admin' | null;
  isLoading: boolean;
  loginAttempts: number;
  lockoutUntil: number | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: User) => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
}

// Demo accounts
const demoAccounts = {
  'student@dpsb.edu': {
    password: 'student123',
    user: {
      id: '1',
      email: 'student@dpsb.edu',
      name: 'Ritik Koley',
      role: 'student' as const
    }
  },
  'teacher@dpsb.edu': {
    password: 'teacher123',
    user: {
      id: '2',
      email: 'teacher@dpsb.edu',
      name: 'Jagdeep Singh Sokhey',
      role: 'teacher' as const
    }
  },
  'admin@dpsb.edu': {
    password: 'admin123',
    user: {
      id: '3',
      email: 'admin@dpsb.edu',
      name: 'Dr. Priya Sharma',
      role: 'admin' as const
    }
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isLoading: false,
      loginAttempts: 0,
      lockoutUntil: null,

      setUser: (user) => set({ user, role: user.role, isLoading: false }),

      incrementLoginAttempts: () => {
        const { loginAttempts } = get();
        const newAttempts = loginAttempts + 1;
        
        if (newAttempts >= 5) {
          set({
            loginAttempts: newAttempts,
            lockoutUntil: Date.now() + 15 * 60 * 1000 // 15 minutes
          });
        } else {
          set({ loginAttempts: newAttempts });
        }
      },

      resetLoginAttempts: () => set({ loginAttempts: 0, lockoutUntil: null }),

      signIn: async (email: string, password: string) => {
        const { lockoutUntil } = get();

        if (lockoutUntil && Date.now() < lockoutUntil) {
          throw new Error('Too many login attempts. Please try again later.');
        }

        set({ isLoading: true });

        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          const account = demoAccounts[email as keyof typeof demoAccounts];
          
          if (account && account.password === password) {
            set({
              user: account.user,
              role: account.user.role,
              isLoading: false,
            });
            get().resetLoginAttempts();
          } else {
            get().incrementLoginAttempts();
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          set({ isLoading: false });
          if (error instanceof Error && error.message !== 'Too many login attempts. Please try again later.') {
            get().incrementLoginAttempts();
          }
          throw error;
        }
      },

      signInWithOAuth: async (provider: 'google' | 'apple') => {
        set({ isLoading: true });
        
        try {
          // Simulate OAuth flow
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // For demo purposes, sign in as student
          const demoUser = demoAccounts['student@dpsb.edu'].user;
          set({
            user: demoUser,
            role: demoUser.role,
            isLoading: false,
          });
          get().resetLoginAttempts();
        } catch (error) {
          set({ isLoading: false });
          throw new Error(`Failed to sign in with ${provider}`);
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ user: null, role: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Failed to sign out');
        }
      },

      resetPassword: async (email: string) => {
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Password reset email sent to:', email);
        } catch (error) {
          throw new Error('Failed to send reset email');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        role: state.role,
        loginAttempts: state.loginAttempts,
        lockoutUntil: state.lockoutUntil
      }),
    }
  )
);