import { Grade, AttendanceRecord, CourseDocument } from '../types';

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: TeacherSubject[];
  role: 'professor' | 'assistant' | 'lab-instructor';
}

export interface TeacherSubject {
  id: string;
  name: string;
  code: string;
  type: 'theory' | 'lab';
  semester: number;
  students: number;
  schedule: ClassSchedule[];
}

export interface ClassSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  room: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  attendance: AttendanceRecord[];
  grades: Grade[];
  submissions: CourseDocument[];
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface Quiz {
  id: string;
  subject: string;
  title: string;
  date: string;
  duration: number;
  totalMarks: number;
  topics: string[];
  status: 'draft' | 'scheduled' | 'ongoing' | 'completed';
}

export interface Resource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'assignment';
  subject: string;
  uploadDate: string;
  deadline?: string;
  visibility: 'visible' | 'hidden';
  downloads: number;
  submissions?: number;
}

export interface TeacherDashboardData {
  upcomingClasses: {
    subject: string;
    time: string;
    room: string;
    studentsCount: number;
    hasQuiz: boolean;
    attendanceRate: number;
  }[];
  pendingTasks: {
    type: 'grading' | 'attendance' | 'quiz' | 'message';
    subject: string;
    title: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  recentSubmissions: {
    student: string;
    subject: string;
    assignment: string;
    submittedAt: string;
    status: 'pending' | 'graded';
  }[];
  classPerformance: {
    subject: string;
    averageScore: number;
    attendanceRate: number;
    riskStudents: number;
    topPerformers: number;
  }[];
}

export interface AttendanceSession {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  totalStudents: number;
  presentStudents: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  records: {
    studentId: string;
    studentName: string;
    status: 'present' | 'absent' | 'late';
    timestamp?: string;
  }[];
}

export interface GradingSession {
  id: string;
  subject: string;
  assignmentTitle: string;
  dueDate: string;
  totalSubmissions: number;
  gradedSubmissions: number;
  averageScore: number;
  submissions: {
    studentId: string;
    studentName: string;
    submissionDate: string;
    status: 'pending' | 'graded';
    score?: number;
    feedback?: string;
  }[];
}