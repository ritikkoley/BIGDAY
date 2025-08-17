// Demo data for the application
import { format } from 'date-fns';

// Helper function to get dates relative to today
const getRelativeDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Demo Users
export const demoUsers = [
  {
    id: 'student-1',
    name: 'Ritik Koley',
    email: 'student@dpsb.edu',
    role: 'student',
    group_id: 'class-10a',
    status: 'active'
  },
  {
    id: 'student-2',
    name: 'Alex Johnson',
    email: 'alex.johnson@dpsb.edu',
    role: 'student',
    group_id: 'class-10a',
    status: 'active'
  },
  {
    id: 'student-3',
    name: 'Sarah Williams',
    email: 'sarah.williams@dpsb.edu',
    role: 'student',
    group_id: 'class-10a',
    status: 'active'
  },
  {
    id: 'teacher-1',
    name: 'Anil Kumar Jangir',
    email: 'teacher@dpsb.edu',
    role: 'teacher',
    department: 'Computer Science',
    status: 'active'
  },
  {
    id: 'teacher-2',
    name: 'Michael Zhang',
    email: 'michael.zhang@dpsb.edu',
    role: 'teacher',
    department: 'Mathematics',
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

// Demo Courses
export const demoCourses = [
  {
    id: 'course-1',
    name: 'Computer Science',
    code: 'CS101',
    teacher_id: 'teacher-1',
    group_ids: ['class-10a'],
    subtopics: [
      { name: 'Neural Networks', weight: 0.2 },
      { name: 'Data Structures', weight: 0.3 },
      { name: 'Algorithms', weight: 0.3 },
      { name: 'Object-Oriented Programming', weight: 0.2 }
    ],
    timetable: [
      { day: 'monday', time: '10:30 AM - 11:45 AM', room: 'CS-301' },
      { day: 'wednesday', time: '10:30 AM - 11:45 AM', room: 'CS-301' }
    ],
    type: 'theory',
    semester: 1,
    academic_year: '2024-25'
  },
  {
    id: 'course-2',
    name: 'Data Structures',
    code: 'CS102',
    teacher_id: 'teacher-1',
    group_ids: ['class-10a'],
    subtopics: [
      { name: 'Arrays', weight: 0.2 },
      { name: 'Linked Lists', weight: 0.2 },
      { name: 'Trees', weight: 0.3 },
      { name: 'Graphs', weight: 0.3 }
    ],
    timetable: [
      { day: 'tuesday', time: '2:00 PM - 3:15 PM', room: 'CS-302' },
      { day: 'thursday', time: '2:00 PM - 3:15 PM', room: 'CS-302' }
    ],
    type: 'theory',
    semester: 1,
    academic_year: '2024-25'
  },
  {
    id: 'course-3',
    name: 'Mathematics',
    code: 'MATH101',
    teacher_id: 'teacher-2',
    group_ids: ['class-10a'],
    subtopics: [
      { name: 'Calculus', weight: 0.3 },
      { name: 'Linear Algebra', weight: 0.3 },
      { name: 'Probability', weight: 0.2 },
      { name: 'Statistics', weight: 0.2 }
    ],
    timetable: [
      { day: 'monday', time: '1:00 PM - 2:15 PM', room: 'M-201' },
      { day: 'wednesday', time: '1:00 PM - 2:15 PM', room: 'M-201' }
    ],
    type: 'theory',
    semester: 1,
    academic_year: '2024-25'
  }
];

// Demo Assessments
export const demoAssessments = [
  {
    id: 'assessment-1',
    course_id: 'course-1',
    name: 'Neural Networks Quiz',
    type: 'quiz',
    total_marks: 20,
    weightage: 0.1,
    due_date: getRelativeDate(2),
    subtopics_covered: ['Neural Networks'],
    status: 'published'
  },
  {
    id: 'assessment-2',
    course_id: 'course-1',
    name: 'Data Structures Assignment',
    type: 'assignment',
    total_marks: 50,
    weightage: 0.2,
    due_date: getRelativeDate(5),
    subtopics_covered: ['Data Structures'],
    status: 'published'
  },
  {
    id: 'assessment-3',
    course_id: 'course-2',
    name: 'Binary Trees Assignment',
    type: 'assignment',
    total_marks: 50,
    weightage: 0.2,
    due_date: getRelativeDate(7),
    subtopics_covered: ['Trees'],
    status: 'published'
  },
  {
    id: 'assessment-4',
    course_id: 'course-3',
    name: 'Calculus Midterm',
    type: 'midterm',
    total_marks: 100,
    weightage: 0.3,
    due_date: getRelativeDate(10),
    subtopics_covered: ['Calculus'],
    status: 'published'
  }
];

// Demo Grades
export const demoGrades = [
  {
    id: 'grade-1',
    student_id: 'student-1',
    assessment_id: 'assessment-1',
    score: 18,
    max_score: 20,
    percentile: 95,
    feedback: 'Excellent work on neural network concepts!',
    graded_at: getRelativeDate(-5)
  },
  {
    id: 'grade-2',
    student_id: 'student-2',
    assessment_id: 'assessment-1',
    score: 16,
    max_score: 20,
    percentile: 85,
    feedback: 'Good understanding of neural networks.',
    graded_at: getRelativeDate(-5)
  },
  {
    id: 'grade-3',
    student_id: 'student-3',
    assessment_id: 'assessment-1',
    score: 19,
    max_score: 20,
    percentile: 98,
    feedback: 'Outstanding work!',
    graded_at: getRelativeDate(-5)
  }
];

// Demo Attendance
export const demoAttendance = [
  {
    id: 'attendance-1',
    student_id: 'student-1',
    course_id: 'course-1',
    date: getRelativeDate(-7),
    status: 'present',
    marked_by: 'teacher-1'
  },
  {
    id: 'attendance-2',
    student_id: 'student-1',
    course_id: 'course-1',
    date: getRelativeDate(-5),
    status: 'present',
    marked_by: 'teacher-1'
  },
  {
    id: 'attendance-3',
    student_id: 'student-1',
    course_id: 'course-1',
    date: getRelativeDate(-3),
    status: 'absent',
    marked_by: 'teacher-1'
  },
  {
    id: 'attendance-4',
    student_id: 'student-2',
    course_id: 'course-1',
    date: getRelativeDate(-7),
    status: 'present',
    marked_by: 'teacher-1'
  },
  {
    id: 'attendance-5',
    student_id: 'student-2',
    course_id: 'course-1',
    date: getRelativeDate(-5),
    status: 'present',
    marked_by: 'teacher-1'
  },
  {
    id: 'attendance-6',
    student_id: 'student-2',
    course_id: 'course-1',
    date: getRelativeDate(-3),
    status: 'present',
    marked_by: 'teacher-1'
  },
  {
    id: 'attendance-7',
    student_id: 'student-3',
    course_id: 'course-1',
    date: getRelativeDate(-7),
    status: 'present',
    marked_by: 'teacher-1'
  },
  {
    id: 'attendance-8',
    student_id: 'student-3',
    course_id: 'course-1',
    date: getRelativeDate(-5),
    status: 'present',
    marked_by: 'teacher-1'
  },
  {
    id: 'attendance-9',
    student_id: 'student-3',
    course_id: 'course-1',
    date: getRelativeDate(-3),
    status: 'present',
    marked_by: 'teacher-1'
  }
];

// Demo Messages
export const demoMessages = [
  {
    id: 'message-1',
    sender_id: 'teacher-1',
    recipient_id: 'student-1',
    subject: 'Upcoming Quiz',
    content: 'Please be prepared for the upcoming quiz on neural networks. Focus on activation functions and gradient descent.',
    priority: 'high',
    is_read: false,
    message_type: 'direct',
    created_at: getRelativeDate(-2),
    sender: {
      name: 'Professor Jagdeep Singh Sokhey',
      role: 'teacher'
    }
  },
  {
    id: 'message-2',
    sender_id: 'teacher-1',
    recipient_id: 'student-1',
    subject: 'Office Hours',
    content: 'Office hours extended today until 5 PM for Linear Algebra consultation.',
    priority: 'medium',
    is_read: true,
    message_type: 'direct',
    created_at: getRelativeDate(-4),
    sender: {
      name: 'Professor Jagdeep Singh Sokhey',
      role: 'teacher'
    }
  },
  {
    id: 'message-3',
    sender_id: 'teacher-2',
    recipient_id: 'student-1',
    subject: 'Mathematics Assignment',
    content: 'Your recent mathematics assignment showed excellent problem-solving skills. Keep up the good work!',
    priority: 'normal',
    is_read: false,
    message_type: 'direct',
    created_at: getRelativeDate(-1),
    sender: {
      name: 'Dr. Michael Zhang',
      role: 'teacher'
    }
  }
];

// Demo Resources
export const demoResources = [
  {
    id: 'resource-1',
    course_id: 'course-1',
    name: 'Neural Networks Lecture Notes',
    description: 'Comprehensive notes on neural network architectures and applications',
    file_path: '/resources/neural_networks_notes.pdf',
    file_size: 2500000,
    file_type: 'application/pdf',
    resource_type: 'material',
    uploaded_by: 'teacher-1',
    is_public: true,
    download_count: 45,
    created_at: getRelativeDate(-10)
  },
  {
    id: 'resource-2',
    course_id: 'course-1',
    name: 'Data Structures Implementation Guide',
    description: 'Guide for implementing various data structures in Java',
    file_path: '/resources/data_structures_guide.pdf',
    file_size: 1800000,
    file_type: 'application/pdf',
    resource_type: 'material',
    uploaded_by: 'teacher-1',
    is_public: true,
    download_count: 38,
    created_at: getRelativeDate(-8)
  },
  {
    id: 'resource-3',
    course_id: 'course-2',
    name: 'Binary Trees Assignment',
    description: 'Assignment on implementing binary search trees',
    file_path: '/resources/binary_trees_assignment.pdf',
    file_size: 1200000,
    file_type: 'application/pdf',
    resource_type: 'assignment',
    uploaded_by: 'teacher-1',
    is_public: true,
    download_count: 52,
    created_at: getRelativeDate(-5)
  }
];

// Demo Upcoming Items for Student Home
export const demoUpcoming = [
  {
    id: 'upcoming-1',
    assessment: 'Neural Networks Quiz',
    due_date: getRelativeDate(2),
    course: 'Computer Science'
  },
  {
    id: 'upcoming-2',
    assessment: 'Data Structures Assignment',
    due_date: getRelativeDate(5),
    course: 'Computer Science'
  },
  {
    id: 'upcoming-3',
    assessment: 'Binary Trees Assignment',
    due_date: getRelativeDate(7),
    course: 'Data Structures'
  },
  {
    id: 'upcoming-4',
    assessment: 'Calculus Midterm',
    due_date: getRelativeDate(10),
    course: 'Mathematics'
  }
];

// Demo Timetable for Student Home
export const demoTimetable = [
  {
    day: 'Monday',
    time: '10:30 AM - 11:45 AM',
    subject: 'Computer Science',
    room: 'CS-301'
  },
  {
    day: 'Monday',
    time: '1:00 PM - 2:15 PM',
    subject: 'Mathematics',
    room: 'M-201'
  },
  {
    day: 'Tuesday',
    time: '2:00 PM - 3:15 PM',
    subject: 'Data Structures',
    room: 'CS-302'
  },
  {
    day: 'Wednesday',
    time: '10:30 AM - 11:45 AM',
    subject: 'Computer Science',
    room: 'CS-301'
  },
  {
    day: 'Wednesday',
    time: '1:00 PM - 2:15 PM',
    subject: 'Mathematics',
    room: 'M-201'
  },
  {
    day: 'Thursday',
    time: '2:00 PM - 3:15 PM',
    subject: 'Data Structures',
    room: 'CS-302'
  }
];

// Demo data for student performance
export const demoStudentPerformance = {
  'student-1': {
    currentGrade: 'A',
    averageScore: 92.5,
    attendanceRate: 85.4,
    classRank: 2,
    subjects: [
      { name: 'Computer Science', score: 95, grade: 'A' },
      { name: 'Data Structures', score: 92, grade: 'A' },
      { name: 'Mathematics', score: 88, grade: 'B+' }
    ],
    historicData: [
      { year: 2022, avg: 88 },
      { year: 2023, avg: 90 },
      { year: 2024, avg: 92.5 }
    ]
  },
  'student-2': {
    currentGrade: 'B+',
    averageScore: 85.8,
    attendanceRate: 90.2,
    classRank: 5,
    subjects: [
      { name: 'Computer Science', score: 82, grade: 'B' },
      { name: 'Data Structures', score: 85, grade: 'B+' },
      { name: 'Mathematics', score: 90, grade: 'A-' }
    ],
    historicData: [
      { year: 2022, avg: 82 },
      { year: 2023, avg: 84 },
      { year: 2024, avg: 85.8 }
    ]
  },
  'student-3': {
    currentGrade: 'A+',
    averageScore: 96.2,
    attendanceRate: 95.0,
    classRank: 1,
    subjects: [
      { name: 'Computer Science', score: 98, grade: 'A+' },
      { name: 'Data Structures', score: 95, grade: 'A' },
      { name: 'Mathematics', score: 96, grade: 'A' }
    ],
    historicData: [
      { year: 2022, avg: 94 },
      { year: 2023, avg: 95 },
      { year: 2024, avg: 96.2 }
    ]
  }
};

// Demo data for teacher performance
export const demoTeacherPerformance = {
  'teacher-1': {
    overallScore: 92,
    classAverages: [
      { subject: 'Computer Science', average: 87.5 },
      { subject: 'Data Structures', average: 85.2 }
    ],
    studentSuccess: {
      passRate: 95.0,
      retentionRate: 98.0
    },
    feedback: {
      overall: 4.8,
      studentScore: 4.7,
      parentScore: 4.9
    },
    historicData: [
      { month: 'Jan', score: 88 },
      { month: 'Feb', score: 90 },
      { month: 'Mar', score: 92 },
      { month: 'Apr', score: 91 },
      { month: 'May', score: 93 },
      { month: 'Jun', score: 92 }
    ]
  },
  'teacher-2': {
    overallScore: 90,
    classAverages: [
      { subject: 'Mathematics', average: 86.0 }
    ],
    studentSuccess: {
      passRate: 93.0,
      retentionRate: 97.0
    },
    feedback: {
      overall: 4.6,
      studentScore: 4.5,
      parentScore: 4.8
    },
    historicData: [
      { month: 'Jan', score: 87 },
      { month: 'Feb', score: 88 },
      { month: 'Mar', score: 89 },
      { month: 'Apr', score: 90 },
      { month: 'May', score: 91 },
      { month: 'Jun', score: 90 }
    ]
  }
};