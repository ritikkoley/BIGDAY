import { 
  TeacherProfile, 
  TeacherDashboardData, 
  Quiz, 
  Resource,
  MessageTemplate,
  StudentRecord,
  AttendanceSession,
  GradingSession
} from '../types/teacher';

export const sampleTeacherProfile: TeacherProfile = {
  id: "t-001",
  name: "Anil Kumar Jangir",
  email: "sarah.chen@university.edu",
  department: "Computer Science",
  role: "professor",
  subjects: [
    {
      id: "cs-101",
      name: "Computer Science",
      code: "CS101",
      type: "theory",
      semester: 1,
      students: 120,
      schedule: [
        {
          day: "monday",
          startTime: "10:30",
          endTime: "11:45",
          room: "CS-301"
        },
        {
          day: "wednesday",
          startTime: "10:30",
          endTime: "11:45",
          room: "CS-301"
        }
      ]
    },
    {
      id: "cs-102",
      name: "Data Structures",
      code: "CS102",
      type: "theory",
      semester: 1,
      students: 115,
      schedule: [
        {
          day: "tuesday",
          startTime: "14:00",
          endTime: "15:15",
          room: "CS-302"
        },
        {
          day: "thursday",
          startTime: "14:00",
          endTime: "15:15",
          room: "CS-302"
        }
      ]
    }
  ]
};

export const sampleDashboardData: TeacherDashboardData = {
  upcomingClasses: [
    {
      subject: "Computer Science",
      time: "10:30 AM - 11:45 AM",
      room: "CS-301",
      studentsCount: 120,
      hasQuiz: true,
      attendanceRate: 92
    },
    {
      subject: "Data Structures",
      time: "2:00 PM - 3:15 PM",
      room: "CS-302",
      studentsCount: 115,
      hasQuiz: false,
      attendanceRate: 88
    }
  ],
  pendingTasks: [
    {
      type: "grading",
      subject: "Computer Science",
      title: "Assignment 3: Neural Networks",
      deadline: "2024-03-25",
      priority: "high"
    },
    {
      type: "quiz",
      subject: "Data Structures",
      title: "Quiz: Binary Trees",
      deadline: "2024-03-26",
      priority: "medium"
    }
  ],
  recentSubmissions: [
    {
      student: "Ritik Koley",
      subject: "Computer Science",
      assignment: "Neural Networks Implementation",
      submittedAt: "2024-03-20T14:30:00",
      status: "pending"
    },
    {
      student: "Alex Johnson",
      subject: "Data Structures",
      assignment: "Binary Tree Implementation",
      submittedAt: "2024-03-20T13:15:00",
      status: "graded"
    }
  ],
  classPerformance: [
    {
      subject: "Computer Science",
      averageScore: 87.5,
      attendanceRate: 92,
      riskStudents: 5,
      topPerformers: 25
    },
    {
      subject: "Data Structures",
      averageScore: 84.2,
      attendanceRate: 88,
      riskStudents: 8,
      topPerformers: 20
    }
  ]
};

export const sampleQuizzes: Quiz[] = [
  {
    id: "q-001",
    subject: "Computer Science",
    title: "Neural Networks Fundamentals",
    date: "2024-03-25",
    duration: 45,
    totalMarks: 20,
    topics: [
      "Perceptrons",
      "Activation Functions",
      "Backpropagation",
      "Gradient Descent"
    ],
    status: "scheduled"
  },
  {
    id: "q-002",
    subject: "Data Structures",
    title: "Binary Trees and BST",
    date: "2024-03-26",
    duration: 30,
    totalMarks: 15,
    topics: [
      "Binary Tree Traversal",
      "BST Operations",
      "Tree Height",
      "Balancing"
    ],
    status: "draft"
  }
];

export const sampleResources: Resource[] = [
  {
    id: "r-001",
    title: "Neural Networks Lecture Notes",
    type: "document",
    subject: "Computer Science",
    uploadDate: "2024-03-15",
    visibility: "visible",
    downloads: 98
  },
  {
    id: "r-002",
    title: "Binary Trees Implementation Assignment",
    type: "assignment",
    subject: "Data Structures",
    uploadDate: "2024-03-18",
    deadline: "2024-03-25",
    visibility: "visible",
    downloads: 112,
    submissions: 95
  }
];

export const sampleMessageTemplates: MessageTemplate[] = [
  {
    id: "m-001",
    title: "Quiz Announcement",
    content: "Please be prepared for the upcoming quiz on {topic}. The quiz will cover {topics}. Duration: {duration} minutes.",
    priority: "high",
    tags: ["quiz", "announcement"]
  },
  {
    id: "m-002",
    title: "Assignment Reminder",
    content: "This is a reminder that the assignment on {topic} is due on {date}. Please ensure timely submission.",
    priority: "medium",
    tags: ["assignment", "reminder"]
  }
];

export const sampleStudentRecords: StudentRecord[] = [
  {
    id: "s-001",
    name: "Ritik Koley",
    rollNumber: "CS2024001",
    email: "ritik.koley@university.edu",
    attendance: [
      {
        subject: "Computer Science",
        type: "theory",
        totalClasses: 24,
        attendedClasses: 22,
        missedClasses: 2,
        upcomingClasses: 12,
        lastUpdated: "2024-03-20"
      }
    ],
    grades: [
      {
        subject: "Computer Science",
        term: "Spring 2024",
        exams: [
          {
            title: "Neural Networks Quiz",
            date: "2024-03-15",
            grade: "A",
            score: 92,
            type: "quiz",
            marksObtained: 18.4,
            totalMarks: 20,
            classAverage: 16.8,
            percentile: 95,
            distribution: [2, 5, 8, 15, 25, 35, 42, 38, 22, 8],
            modules: ["Neural Networks", "Deep Learning"]
          }
        ]
      }
    ],
    submissions: []
  }
];

export const sampleAttendanceSessions: AttendanceSession[] = [
  {
    id: "a-001",
    subject: "Computer Science",
    date: "2024-03-20",
    startTime: "10:30",
    endTime: "11:45",
    totalStudents: 120,
    presentStudents: 112,
    status: "completed",
    records: [
      {
        studentId: "s-001",
        studentName: "Ritik Koley",
        status: "present",
        timestamp: "2024-03-20T10:28:00"
      }
    ]
  }
];

export const sampleGradingSessions: GradingSession[] = [
  {
    id: "g-001",
    subject: "Computer Science",
    assignmentTitle: "Neural Networks Implementation",
    dueDate: "2024-03-20",
    totalSubmissions: 118,
    gradedSubmissions: 95,
    averageScore: 85.5,
    submissions: [
      {
        studentId: "s-001",
        studentName: "Ritik Koley",
        submissionDate: "2024-03-20T14:30:00",
        status: "pending"
      }
    ]
  }
];