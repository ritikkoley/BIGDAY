// Type definitions for the application
export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  enrollmentYear: number;
  courses?: Course[];
  attendance?: AttendanceRecord[];
  grades?: GradeRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  specialization?: string;
  courses?: Course[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  courseCode: string;
  name: string;
  department: string;
  credits: number;
  teacherId: string;
  semester: number;
  year: number;
  students?: Student[];
  attendance?: AttendanceRecord[];
  grades?: GradeRecord[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  duration: number;
  notes?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  courseId: string;
  type: 'assignment' | 'quiz' | 'midterm' | 'final';
  score: number;
  maxScore: number;
  weight: number;
  date: Date;
  feedback?: string;
}

export interface SearchFilters {
  studentId?: string;
  courseCode?: string;
  teacherId?: string;
  department?: string;
  year?: number;
  semester?: number;
}

export interface SearchPermissions {
  student: string[];
  teacher: string[];
  admin: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}