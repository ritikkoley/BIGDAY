import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleGrades, sampleAttendance, sampleHomeData, sampleStudyVaultData } from '../data/sampleData';

// Mock types for the store
type Grade = typeof sampleGrades[0];
type Attendance = typeof sampleAttendance[0];
type Message = {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  subject: string;
  content: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  sender: {
    name: string;
    role: string;
  };
};
type Resource = {
  id: string;
  title: string;
  type: string;
  subject: string;
  uploadDate: string;
  visibility: string;
  downloads: number;
  submissions?: number;
};
type Course = {
  id: string;
  name: string;
  code: string;
  teacher_id: string;
  teacher: {
    name: string;
    email: string;
  };
};
type Assessment = {
  id: string;
  course_id: string;
  name: string;
  type: string;
  due_date: string;
  total_marks: number;
  weightage: number;
  status: string;
};

interface DataState {
  // Data
  grades: Grade[];
  attendance: Attendance[];
  messages: Message[];
  resources: Resource[];
  courses: Course[];
  assessments: Assessment[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGrades: (studentId: string, courseId?: string) => Promise<void>;
  fetchAttendance: (studentId: string, courseId?: string) => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
  fetchResources: (courseId: string) => Promise<void>;
  fetchCourses: (userId: string) => Promise<void>;
  fetchAssessments: (courseId: string) => Promise<void>;
  
  // CRUD operations
  createGrade: (grade: any) => Promise<void>;
  updateGrade: (id: string, updates: any) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  
  createAttendance: (attendance: any) => Promise<void>;
  updateAttendance: (id: string, updates: any) => Promise<void>;
  
  sendMessage: (message: any) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  
  uploadResource: (resource: any, file?: File) => Promise<void>;
  downloadResource: (resourceId: string) => Promise<string>;
  
  // Bulk operations
  bulkUploadGrades: (assessmentId: string, grades: { student_id: string; score: number }[]) => Promise<void>;
  bulkUploadAttendance: (courseId: string, date: string, records: { student_id: string; status: string }[]) => Promise<void>;
  
  // Analytics
  getAttendanceSummary: (studentId: string, courseId?: string) => Promise<any>;
  getGradeSummary: (studentId: string, courseId?: string) => Promise<any>;
  getCourseAnalytics: (courseId: string) => Promise<any>;
  
  // Realtime subscriptions
  subscribeToGrades: (studentId: string) => () => void;
  subscribeToMessages: (userId: string) => () => void;
  
  // Clear data
  clearData: () => void;
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: 'm1',
    sender_id: 'teacher-1',
    recipient_id: 'student-1',
    subject: 'Upcoming Quiz',
    content: 'Please be prepared for the upcoming quiz on neural networks. Focus on activation functions and gradient descent.',
    priority: 'high',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sender: {
      name: 'Professor Jagdeep Singh Sokhey',
      role: 'teacher'
    }
  },
  {
    id: 'm2',
    sender_id: 'teacher-1',
    recipient_id: 'student-1',
    subject: 'Office Hours',
    content: 'Office hours extended today until 5 PM for Linear Algebra consultation.',
    priority: 'medium',
    is_read: true,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    sender: {
      name: 'Professor Jagdeep Singh Sokhey',
      role: 'teacher'
    }
  }
];

// Mock resources
const mockResources: Resource[] = [
  {
    id: 'r1',
    title: 'Neural Networks Lecture Notes',
    type: 'document',
    subject: 'Computer Science',
    uploadDate: '2024-03-15',
    visibility: 'visible',
    downloads: 98
  },
  {
    id: 'r2',
    title: 'Binary Trees Implementation Assignment',
    type: 'assignment',
    subject: 'Data Structures',
    uploadDate: '2024-03-18',
    visibility: 'visible',
    downloads: 112,
    submissions: 95
  }
];

// Mock courses
const mockCourses: Course[] = [
  {
    id: 'c1',
    name: 'Computer Science',
    code: 'CS101',
    teacher_id: 'teacher-1',
    teacher: {
      name: 'Professor Jagdeep Singh Sokhey',
      email: 'teacher@dpsb.edu'
    }
  },
  {
    id: 'c2',
    name: 'Data Structures',
    code: 'CS102',
    teacher_id: 'teacher-1',
    teacher: {
      name: 'Professor Jagdeep Singh Sokhey',
      email: 'teacher@dpsb.edu'
    }
  }
];

// Mock assessments
const mockAssessments: Assessment[] = [
  {
    id: 'a1',
    course_id: 'c1',
    name: 'Neural Networks Quiz',
    type: 'quiz',
    due_date: '2024-03-25',
    total_marks: 20,
    weightage: 0.1,
    status: 'published'
  },
  {
    id: 'a2',
    course_id: 'c2',
    name: 'Binary Trees Assignment',
    type: 'assignment',
    due_date: '2024-03-26',
    total_marks: 50,
    weightage: 0.2,
    status: 'published'
  }
];

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Initial state
      grades: sampleGrades,
      attendance: sampleAttendance,
      messages: mockMessages,
      resources: mockResources,
      courses: mockCourses,
      assessments: mockAssessments,
      isLoading: false,
      error: null,

      // Fetch operations
      fetchGrades: async (studentId: string, courseId?: string) => {
        try {
          set({ isLoading: true, error: null });
          // Using sample data instead of fetching from Supabase
          set({ grades: sampleGrades, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch grades', isLoading: false });
        }
      },

      fetchAttendance: async (studentId: string, courseId?: string) => {
        try {
          set({ isLoading: true, error: null });
          // Using sample data instead of fetching from Supabase
          set({ attendance: sampleAttendance, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch attendance', isLoading: false });
        }
      },

      fetchMessages: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          // Using mock data instead of fetching from Supabase
          set({ messages: mockMessages, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch messages', isLoading: false });
        }
      },

      fetchResources: async (courseId: string) => {
        try {
          set({ isLoading: true, error: null });
          // Using mock data instead of fetching from Supabase
          set({ resources: mockResources, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch resources', isLoading: false });
        }
      },

      fetchCourses: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          // Using mock data instead of fetching from Supabase
          set({ courses: mockCourses, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch courses', isLoading: false });
        }
      },

      fetchAssessments: async (courseId: string) => {
        try {
          set({ isLoading: true, error: null });
          // Using mock data instead of fetching from Supabase
          const filteredAssessments = mockAssessments.filter(a => a.course_id === courseId);
          set({ assessments: filteredAssessments, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch assessments', isLoading: false });
        }
      },

      // CRUD operations
      createGrade: async (grade) => {
        try {
          // Mock implementation
          const newGrade = { ...grade, id: `grade-${Date.now()}` };
          set(state => ({ grades: [...state.grades, newGrade] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create grade' });
        }
      },

      updateGrade: async (id, updates) => {
        try {
          // Mock implementation
          set(state => ({
            grades: state.grades.map(grade => 
              grade.id === id ? { ...grade, ...updates } : grade
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update grade' });
        }
      },

      deleteGrade: async (id) => {
        try {
          // Mock implementation
          set(state => ({
            grades: state.grades.filter(grade => grade.id !== id)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete grade' });
        }
      },

      createAttendance: async (attendance) => {
        try {
          // Mock implementation
          const newAttendance = { ...attendance, id: `attendance-${Date.now()}` };
          set(state => ({ attendance: [...state.attendance, newAttendance] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create attendance record' });
        }
      },

      updateAttendance: async (id, updates) => {
        try {
          // Mock implementation
          set(state => ({
            attendance: state.attendance.map(record => 
              record.id === id ? { ...record, ...updates } : record
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update attendance' });
        }
      },

      sendMessage: async (message) => {
        try {
          // Mock implementation
          const newMessage = { 
            ...message, 
            id: `message-${Date.now()}`,
            created_at: new Date().toISOString(),
            sender: {
              name: 'Current User',
              role: 'student'
            }
          };
          set(state => ({ messages: [newMessage, ...state.messages] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to send message' });
        }
      },

      markMessageAsRead: async (messageId) => {
        try {
          // Mock implementation
          set(state => ({
            messages: state.messages.map(msg => 
              msg.id === messageId ? { ...msg, is_read: true } : msg
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to mark message as read' });
        }
      },

      uploadResource: async (resource, file) => {
        try {
          // Mock implementation
          const newResource = {
            ...resource,
            id: `resource-${Date.now()}`,
            uploadDate: new Date().toISOString(),
            downloads: 0
          };
          set(state => ({ resources: [newResource, ...state.resources] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to upload resource' });
        }
      },

      downloadResource: async (resourceId) => {
        try {
          // Mock implementation
          const resource = get().resources.find(r => r.id === resourceId);
          if (!resource) {
            throw new Error('Resource not found');
          }
          
          // Increment download count
          set(state => ({
            resources: state.resources.map(r => 
              r.id === resourceId ? { ...r, downloads: r.downloads + 1 } : r
            )
          }));
          
          return `https://example.com/mock-download/${resourceId}`;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to download resource' });
          throw error;
        }
      },

      // Bulk operations
      bulkUploadGrades: async (assessmentId, grades) => {
        try {
          // Mock implementation
          console.log(`Bulk uploading ${grades.length} grades for assessment ${assessmentId}`);
          // In a real implementation, this would update the grades in the database
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to bulk upload grades' });
        }
      },

      bulkUploadAttendance: async (courseId, date, records) => {
        try {
          // Mock implementation
          console.log(`Bulk uploading ${records.length} attendance records for course ${courseId} on ${date}`);
          // In a real implementation, this would update the attendance records in the database
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to bulk upload attendance' });
        }
      },

      // Analytics
      getAttendanceSummary: async (studentId, courseId) => {
        try {
          // Mock implementation
          return sampleAttendance.map(record => ({
            subject: record.subject,
            attendance_rate: record.attendedClasses / record.totalClasses,
            total_classes: record.totalClasses,
            attended_classes: record.attendedClasses,
            missed_classes: record.missedClasses
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to get attendance summary' });
          return [];
        }
      },

      getGradeSummary: async (studentId, courseId) => {
        try {
          // Mock implementation
          return sampleGrades.map(grade => ({
            subject: grade.subject,
            average_score: grade.exams.reduce((sum, exam) => sum + exam.score, 0) / grade.exams.length,
            exam_count: grade.exams.length,
            highest_score: Math.max(...grade.exams.map(exam => exam.score)),
            lowest_score: Math.min(...grade.exams.map(exam => exam.score))
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to get grade summary' });
          return [];
        }
      },

      getCourseAnalytics: async (courseId) => {
        try {
          // Mock implementation
          return {
            average_score: 85,
            attendance_rate: 0.92,
            at_risk_students: 5,
            top_performers: 15,
            grade_distribution: {
              A: 20,
              B: 35,
              C: 25,
              D: 15,
              F: 5
            }
          };
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to get course analytics' });
          return {};
        }
      },

      // Realtime subscriptions
      subscribeToGrades: (studentId) => {
        // Mock implementation
        console.log(`Subscribed to grades for student ${studentId}`);
        return () => console.log(`Unsubscribed from grades for student ${studentId}`);
      },

      subscribeToMessages: (userId) => {
        // Mock implementation
        console.log(`Subscribed to messages for user ${userId}`);
        return () => console.log(`Unsubscribed from messages for user ${userId}`);
      },

      clearData: () => {
        set({
          grades: [],
          attendance: [],
          messages: [],
          resources: [],
          courses: [],
          assessments: [],
          error: null
        });
      }
    }),
    {
      name: 'data-store',
      partialize: (state) => ({
        // Only persist non-sensitive data
        courses: state.courses,
        assessments: state.assessments
      })
    }
  )
);