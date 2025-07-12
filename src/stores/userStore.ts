import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  role: 'student' | 'teacher' | 'admin';
  firstName: string;
  lastName: string;
  email: string;
  admissionNumber?: string; // For students
  employeeId?: string; // For teachers
  department?: string;
  joiningDate: string;
  status: 'active' | 'inactive';
}

interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getUserByAdmissionNumber: (admissionNumber: string) => User | undefined;
  getStudents: () => User[];
  getTeachers: () => User[];
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (user) => {
        const newUser = {
          ...user,
          id: crypto.randomUUID(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },
      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },
      getUserById: (id) => {
        return get().users.find((user) => user.id === id);
      },
      getUserByAdmissionNumber: (admissionNumber) => {
        return get().users.find((user) => user.admissionNumber === admissionNumber);
      },
      getStudents: () => {
        return get().users.filter((user) => user.role === 'student');
      },
      getTeachers: () => {
        return get().users.filter((user) => user.role === 'teacher');
      },
    }),
    {
      name: 'user-store',
    }
  )
);