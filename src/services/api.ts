// Mock API service to replace Supabase

// Mock data types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  group_id?: string;
  department?: string;
  status?: 'active' | 'inactive';
};

type Group = {
  id: string;
  name: string;
  type: 'class' | 'department';
  description?: string;
};

type Course = {
  id: string;
  name: string;
  code: string;
  teacher_id: string;
  group_ids: string[];
  subtopics?: any[];
  type: 'theory' | 'lab';
  semester?: number;
  academic_year?: string;
};

type Assessment = {
  id: string;
  course_id: string;
  name: string;
  type: 'quiz' | 'midterm' | 'final' | 'digital' | 'assignment';
  weightage: number;
  total_marks: number;
  subtopics_covered?: any[];
  due_date?: string;
  instructions?: string;
  status: 'draft' | 'published' | 'completed';
};

type Grade = {
  id: string;
  student_id: string;
  assessment_id: string;
  score: number;
  max_score: number;
  percentile?: number;
  subtopic_performance?: any;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
};

type Attendance = {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  marked_by?: string;
};

type Message = {
  id: string;
  sender_id: string;
  recipient_id?: string;
  group_id?: string;
  course_id?: string;
  subject: string;
  content: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  read_at?: string;
  reply_to?: string;
  attachments?: any[];
  thread_id?: string;
  is_read: boolean;
  message_type?: 'direct' | 'announcement' | 'reminder' | 'alert';
};

type Resource = {
  id: string;
  course_id: string;
  name: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  resource_type?: 'material' | 'assignment' | 'reference' | 'video' | 'link';
  uploaded_by?: string;
  is_public: boolean;
  download_count: number;
  tags?: any[];
};

// Mock data
import { sampleGrades, sampleAttendance } from '../data/sampleData';
import { sampleTeacherProfile, sampleDashboardData, sampleQuizzes, sampleResources, sampleMessageTemplates, sampleStudentRecords, sampleAttendanceSessions, sampleGradingSessions } from '../data/sampleTeacherData';

// User Management API
export const userApi = {
  // Get all users (admin only)
  getAll: async (): Promise<User[]> => {
    return [
      {
        id: 'student-1',
        name: 'Ritik Koley',
        email: 'student@dpsb.edu',
        role: 'student',
        group_id: 'class-10a',
        status: 'active'
      },
      {
        id: 'teacher-1',
        name: 'Jagdeep Singh Sokhey',
        email: 'teacher@dpsb.edu',
        role: 'teacher',
        department: 'Computer Science',
        status: 'active'
      },
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@dpsb.edu',
        role: 'admin',
        status: 'active'
      }
    ];
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const users = await userApi.getAll();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  // Create new user (admin only)
  create: async (userData: any): Promise<User> => {
    console.log('Creating user:', userData);
    return {
      id: `user-${Date.now()}`,
      ...userData
    };
  },

  // Update user
  update: async (id: string, updates: any): Promise<User> => {
    console.log('Updating user:', id, updates);
    const user = await userApi.getById(id);
    return { ...user, ...updates };
  },

  // Delete user (admin only)
  delete: async (id: string): Promise<void> => {
    console.log('Deleting user:', id);
  },

  // Get students by group
  getStudentsByGroup: async (groupId: string): Promise<User[]> => {
    const users = await userApi.getAll();
    return users.filter(u => u.role === 'student' && u.group_id === groupId);
  },

  // Get teachers by department
  getTeachersByDepartment: async (department: string): Promise<User[]> => {
    const users = await userApi.getAll();
    return users.filter(u => u.role === 'teacher' && u.department === department);
  }
};

// Group Management API
export const groupApi = {
  // Get all groups
  getAll: async (): Promise<Group[]> => {
    return [
      {
        id: 'class-10a',
        name: 'Class 10-A',
        type: 'class',
        description: 'Section A of 10th grade'
      },
      {
        id: 'dept-cs',
        name: 'Computer Science Department',
        type: 'department',
        description: 'Department of Computer Science and Engineering'
      }
    ];
  },

  // Get group by ID
  getById: async (id: string): Promise<Group> => {
    const groups = await groupApi.getAll();
    const group = groups.find(g => g.id === id);
    if (!group) throw new Error('Group not found');
    return group;
  },

  // Create new group
  create: async (groupData: any): Promise<Group> => {
    console.log('Creating group:', groupData);
    return {
      id: `group-${Date.now()}`,
      ...groupData
    };
  },

  // Update group
  update: async (id: string, updates: any): Promise<Group> => {
    console.log('Updating group:', id, updates);
    const group = await groupApi.getById(id);
    return { ...group, ...updates };
  },

  // Delete group
  delete: async (id: string): Promise<void> => {
    console.log('Deleting group:', id);
  },

  // Get groups by type
  getByType: async (type: 'class' | 'department'): Promise<Group[]> => {
    const groups = await groupApi.getAll();
    return groups.filter(g => g.type === type);
  }
};

// Course Management API
export const courseApi = {
  // Get all courses (filtered by user permissions)
  getAll: async (): Promise<Course[]> => {
    return [
      {
        id: 'c1',
        name: 'Computer Science',
        code: 'CS101',
        teacher_id: 'teacher-1',
        group_ids: ['class-10a'],
        type: 'theory',
        semester: 1,
        academic_year: '2024-25'
      },
      {
        id: 'c2',
        name: 'Data Structures',
        code: 'CS102',
        teacher_id: 'teacher-1',
        group_ids: ['class-10a'],
        type: 'theory',
        semester: 1,
        academic_year: '2024-25'
      }
    ];
  },

  // Get course by ID
  getById: async (id: string): Promise<Course> => {
    const courses = await courseApi.getAll();
    const course = courses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return course;
  },

  // Create new course
  create: async (courseData: any): Promise<Course> => {
    console.log('Creating course:', courseData);
    return {
      id: `course-${Date.now()}`,
      ...courseData
    };
  },

  // Update course
  update: async (id: string, updates: any): Promise<Course> => {
    console.log('Updating course:', id, updates);
    const course = await courseApi.getById(id);
    return { ...course, ...updates };
  },

  // Delete course
  delete: async (id: string): Promise<void> => {
    console.log('Deleting course:', id);
  },

  // Get courses by teacher
  getByTeacher: async (teacherId: string): Promise<Course[]> => {
    const courses = await courseApi.getAll();
    return courses.filter(c => c.teacher_id === teacherId);
  },

  // Get courses by group
  getByGroup: async (groupId: string): Promise<Course[]> => {
    const courses = await courseApi.getAll();
    return courses.filter(c => c.group_ids.includes(groupId));
  }
};

// Assessment Management API
export const assessmentApi = {
  // Get all assessments for a course
  getByCourse: async (courseId: string): Promise<Assessment[]> => {
    return [
      {
        id: 'a1',
        course_id: courseId,
        name: 'Neural Networks Quiz',
        type: 'quiz',
        weightage: 0.1,
        total_marks: 20,
        due_date: '2024-03-25',
        status: 'published'
      },
      {
        id: 'a2',
        course_id: courseId,
        name: 'Binary Trees Assignment',
        type: 'assignment',
        weightage: 0.2,
        total_marks: 50,
        due_date: '2024-03-26',
        status: 'published'
      }
    ];
  },

  // Get assessment by ID
  getById: async (id: string): Promise<Assessment> => {
    const assessments = await assessmentApi.getByCourse('c1');
    const assessment = assessments.find(a => a.id === id);
    if (!assessment) throw new Error('Assessment not found');
    return assessment;
  },

  // Create new assessment
  create: async (assessmentData: any): Promise<Assessment> => {
    console.log('Creating assessment:', assessmentData);
    return {
      id: `assessment-${Date.now()}`,
      ...assessmentData
    };
  },

  // Update assessment
  update: async (id: string, updates: any): Promise<Assessment> => {
    console.log('Updating assessment:', id, updates);
    const assessment = await assessmentApi.getById(id);
    return { ...assessment, ...updates };
  },

  // Delete assessment
  delete: async (id: string): Promise<void> => {
    console.log('Deleting assessment:', id);
  },

  // Get upcoming assessments for a user
  getUpcoming: async (userId: string): Promise<Assessment[]> => {
    const assessments = await assessmentApi.getByCourse('c1');
    return assessments.filter(a => new Date(a.due_date!) > new Date());
  }
};

// File Management API
export const fileApi = {
  // Upload file to storage
  upload: async (bucket: string, path: string, file: File): Promise<string> => {
    console.log(`Uploading file ${file.name} to ${bucket}/${path}`);
    return `https://example.com/mock-storage/${bucket}/${path}`;
  },

  // Get file URL
  getUrl: (bucket: string, path: string): string => {
    return `https://example.com/mock-storage/${bucket}/${path}`;
  },

  // Delete file
  delete: async (bucket: string, path: string): Promise<void> => {
    console.log(`Deleting file from ${bucket}/${path}`);
  },

  // List files in a folder
  list: async (bucket: string, folder: string = '') => {
    console.log(`Listing files in ${bucket}/${folder}`);
    return [
      { name: 'file1.pdf', size: 1024 * 1024, created_at: new Date().toISOString() },
      { name: 'file2.docx', size: 512 * 1024, created_at: new Date().toISOString() }
    ];
  }
};

// Grade Management API
export const gradeApi = {
  // Get grades for a student
  getByStudent: async (studentId: string, courseId?: string): Promise<Grade[]> => {
    return sampleGrades.flatMap(grade => 
      grade.exams.map(exam => ({
        id: `grade-${exam.title.replace(/\s+/g, '-').toLowerCase()}`,
        student_id: studentId,
        assessment_id: `a-${exam.title.replace(/\s+/g, '-').toLowerCase()}`,
        score: exam.score,
        max_score: 100,
        percentile: exam.percentile,
        feedback: 'Good work!',
        graded_by: 'teacher-1',
        graded_at: exam.date
      }))
    );
  },

  // Get grades for an assessment
  getByAssessment: async (assessmentId: string): Promise<Grade[]> => {
    return sampleStudentRecords.map(student => ({
      id: `grade-${student.id}-${assessmentId}`,
      student_id: student.id,
      assessment_id: assessmentId,
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      max_score: 100,
      percentile: Math.floor(Math.random() * 30) + 70, // Random percentile between 70-100
      feedback: 'Good work!',
      graded_by: 'teacher-1',
      graded_at: new Date().toISOString()
    }));
  },

  // Create grade
  create: async (gradeData: any): Promise<Grade> => {
    console.log('Creating grade:', gradeData);
    return {
      id: `grade-${Date.now()}`,
      ...gradeData
    };
  },

  // Update grade
  update: async (id: string, updates: any): Promise<Grade> => {
    console.log('Updating grade:', id, updates);
    const grades = await gradeApi.getByStudent('student-1');
    const grade = grades.find(g => g.id === id);
    if (!grade) throw new Error('Grade not found');
    return { ...grade, ...updates };
  },

  // Delete grade
  delete: async (id: string): Promise<void> => {
    console.log('Deleting grade:', id);
  },

  // Bulk upload grades
  bulkUpload: async (assessmentId: string, grades: { student_id: string; score: number }[]): Promise<any> => {
    console.log(`Bulk uploading ${grades.length} grades for assessment ${assessmentId}`);
    return { success: true, count: grades.length };
  }
};

// Attendance Management API
export const attendanceApi = {
  // Get attendance for a student
  getByStudent: async (studentId: string, courseId?: string): Promise<Attendance[]> => {
    return sampleAttendance.map(record => ({
      id: `attendance-${record.subject.replace(/\s+/g, '-').toLowerCase()}`,
      student_id: studentId,
      course_id: courseId || `course-${record.subject.replace(/\s+/g, '-').toLowerCase()}`,
      date: new Date().toISOString().split('T')[0],
      status: record.attendedClasses > record.missedClasses ? 'present' : 'absent',
      notes: 'Regular attendance'
    }));
  },

  // Get attendance for a course
  getByCourse: async (courseId: string, date?: string): Promise<Attendance[]> => {
    return sampleStudentRecords.map(student => ({
      id: `attendance-${student.id}-${courseId}-${date || new Date().toISOString().split('T')[0]}`,
      student_id: student.id,
      course_id: courseId,
      date: date || new Date().toISOString().split('T')[0],
      status: Math.random() > 0.2 ? 'present' : 'absent', // 80% chance of being present
      notes: ''
    }));
  },

  // Create attendance record
  create: async (attendanceData: any): Promise<Attendance> => {
    console.log('Creating attendance record:', attendanceData);
    return {
      id: `attendance-${Date.now()}`,
      ...attendanceData
    };
  },

  // Update attendance record
  update: async (id: string, updates: any): Promise<Attendance> => {
    console.log('Updating attendance record:', id, updates);
    const attendance = await attendanceApi.getByStudent('student-1');
    const record = attendance.find(a => a.id === id);
    if (!record) throw new Error('Attendance record not found');
    return { ...record, ...updates };
  },

  // Bulk upload attendance
  bulkUpload: async (courseId: string, date: string, records: { student_id: string; status: string }[]): Promise<any> => {
    console.log(`Bulk uploading ${records.length} attendance records for course ${courseId} on ${date}`);
    return { success: true, count: records.length };
  },

  // Get attendance summary
  getSummary: async (studentId: string, courseId?: string): Promise<any> => {
    return sampleAttendance.map(record => ({
      subject: record.subject,
      type: record.type,
      total_classes: record.totalClasses,
      attended_classes: record.attendedClasses,
      missed_classes: record.missedClasses,
      attendance_rate: record.attendedClasses / record.totalClasses
    }));
  }
};

// Message Management API
export const messageApi = {
  // Get messages for a user
  getByUser: async (userId: string, limit = 50): Promise<any[]> => {
    return [
      {
        id: 'm1',
        sender_id: 'teacher-1',
        recipient_id: userId,
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
        recipient_id: userId,
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
  },

  // Send message
  send: async (messageData: any): Promise<Message> => {
    console.log('Sending message:', messageData);
    return {
      id: `message-${Date.now()}`,
      ...messageData,
      is_read: false,
      created_at: new Date().toISOString()
    };
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<void> => {
    console.log('Marking message as read:', messageId);
  },

  // Get conversation
  getConversation: async (userId1: string, userId2: string): Promise<Message[]> => {
    return [
      {
        id: 'm1',
        sender_id: userId1,
        recipient_id: userId2,
        subject: 'Question about assignment',
        content: 'I have a question about the recent assignment. Can you clarify the requirements?',
        priority: 'normal',
        is_read: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        sender: {
          name: 'Ritik Koley',
          role: 'student'
        }
      },
      {
        id: 'm2',
        sender_id: userId2,
        recipient_id: userId1,
        subject: 'Re: Question about assignment',
        content: 'Sure, the assignment requires you to implement a binary search tree with the following operations: insert, delete, search, and traversal.',
        priority: 'normal',
        is_read: true,
        created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        sender: {
          name: 'Professor Jagdeep Singh Sokhey',
          role: 'teacher'
        }
      }
    ];
  }
};

// Resource Management API
export const resourceApi = {
  // Get resources for a course
  getByCourse: async (courseId: string): Promise<Resource[]> => {
    return sampleResources;
  },

  // Upload resource
  upload: async (resourceData: any, file?: File): Promise<Resource> => {
    console.log('Uploading resource:', resourceData, file?.name);
    return {
      id: `resource-${Date.now()}`,
      ...resourceData,
      file_path: file ? `${resourceData.course_id}/${file.name}` : null,
      file_size: file?.size || null,
      file_type: file?.type || null,
      is_public: true,
      download_count: 0
    };
  },

  // Download resource
  download: async (resourceId: string): Promise<string> => {
    console.log('Downloading resource:', resourceId);
    return `https://example.com/mock-download/${resourceId}`;
  },

  // Delete resource
  delete: async (id: string): Promise<void> => {
    console.log('Deleting resource:', id);
  }
};

// Analytics API
export const analyticsApi = {
  // Get course analytics
  getCourseAnalytics: async (courseId: string): Promise<any> => {
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
  },

  // Get student performance summary
  getStudentSummary: async (studentId: string): Promise<any> => {
    return {
      grades: sampleGrades.map(grade => ({
        subject: grade.subject,
        average_score: grade.exams.reduce((sum, exam) => sum + exam.score, 0) / grade.exams.length,
        exam_count: grade.exams.length,
        highest_score: Math.max(...grade.exams.map(exam => exam.score)),
        lowest_score: Math.min(...grade.exams.map(exam => exam.score))
      })),
      attendance: sampleAttendance.map(record => ({
        subject: record.subject,
        attendance_rate: record.attendedClasses / record.totalClasses,
        total_classes: record.totalClasses,
        attended_classes: record.attendedClasses,
        missed_classes: record.missedClasses
      }))
    };
  }
};

// Realtime subscriptions
export const realtimeApi = {
  // Subscribe to table changes
  subscribeToTable: (
    table: string,
    callback: (payload: any) => void,
    filter?: { column: string; value: string }
  ) => {
    console.log(`Subscribed to ${table} changes`);
    // Return a mock unsubscribe function
    return { unsubscribe: () => console.log(`Unsubscribed from ${table} changes`) };
  },

  // Unsubscribe from channel
  unsubscribe: (channel: any) => {
    console.log('Unsubscribed from channel');
  }
};