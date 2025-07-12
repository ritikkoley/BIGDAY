import { Grade, AttendanceRecord, Subject, HomeData, StudyVaultData, PerformanceMetrics } from '../types';

// Sample grade data with realistic distribution
export const sampleGrades: Grade[] = [
  {
    subject: "Mathematics",
    term: "Spring 2024",
    exams: [
      {
        title: "Digital Assignment 1",
        date: "January 15, 2024",
        grade: "A",
        score: 92,
        type: "assignment",
        marksObtained: 9.2,
        totalMarks: 10,
        classAverage: 8.5,
        percentile: 95,
        // Bell curve with slight right skew
        distribution: [3, 8, 15, 28, 45, 38, 25, 18, 12, 8],
        modules: ["Calculus", "Integration", "Differential Equations"]
      },
      {
        title: "Digital Assignment 2",
        date: "January 30, 2024",
        grade: "A",
        score: 94,
        type: "assignment",
        marksObtained: 9.4,
        totalMarks: 10,
        classAverage: 8.7,
        percentile: 96,
        // More challenging assignment - left skewed
        distribution: [5, 12, 22, 35, 42, 38, 20, 12, 6, 3],
        modules: ["Linear Algebra", "Matrices", "Vector Spaces"]
      },
      {
        title: "Quiz 1",
        date: "February 10, 2024",
        grade: "A",
        score: 88,
        type: "quiz",
        marksObtained: 8.8,
        totalMarks: 10,
        classAverage: 8.2,
        percentile: 92,
        // Normal distribution
        distribution: [4, 12, 25, 42, 48, 45, 28, 15, 8, 3],
        modules: ["Complex Numbers", "Trigonometry", "Functions"]
      },
      {
        title: "Midterm Examination",
        date: "February 15, 2024",
        grade: "A",
        score: 95,
        type: "midterm",
        marksObtained: 47.5,
        totalMarks: 50,
        classAverage: 42,
        percentile: 95,
        // Bimodal distribution showing two performance groups
        distribution: [5, 15, 32, 28, 18, 22, 35, 25, 12, 8],
        modules: [
          "Linear Equations",
          "Quadratic Functions",
          "Matrices",
          "Vector Calculus"
        ]
      }
    ]
  },
  {
    subject: "Computer Science",
    term: "Spring 2024",
    exams: [
      {
        title: "Programming Assignment 1",
        date: "January 20, 2024",
        grade: "A",
        score: 96,
        type: "assignment",
        marksObtained: 9.6,
        totalMarks: 10,
        classAverage: 8.8,
        percentile: 97,
        // Right-skewed distribution (many high performers)
        distribution: [2, 5, 8, 15, 25, 35, 42, 38, 22, 8],
        modules: ["Data Structures", "Algorithms", "Time Complexity"]
      },
      {
        title: "Programming Assignment 2",
        date: "February 5, 2024",
        grade: "A",
        score: 95,
        type: "assignment",
        marksObtained: 9.5,
        totalMarks: 10,
        classAverage: 8.6,
        percentile: 96,
        // Challenging assignment - more spread out
        distribution: [8, 15, 25, 35, 42, 32, 22, 12, 6, 3],
        modules: ["Object-Oriented Programming", "Design Patterns", "SOLID Principles"]
      },
      {
        title: "Theory Quiz",
        date: "February 12, 2024",
        grade: "A",
        score: 90,
        type: "quiz",
        marksObtained: 9.0,
        totalMarks: 10,
        classAverage: 8.4,
        percentile: 93,
        // Normal distribution with slight left skew
        distribution: [3, 8, 18, 35, 45, 38, 25, 15, 8, 5],
        modules: ["Computer Architecture", "Operating Systems", "Memory Management"]
      },
      {
        title: "Programming Fundamentals",
        date: "February 20, 2024",
        grade: "A",
        score: 98,
        type: "midterm",
        marksObtained: 49,
        totalMarks: 50,
        classAverage: 44,
        percentile: 96,
        // Bimodal distribution - showing skill gap
        distribution: [4, 8, 28, 15, 12, 18, 38, 45, 22, 10],
        modules: [
          "Data Structures",
          "Algorithms",
          "Object-Oriented Programming"
        ]
      }
    ]
  }
];

// First, let's define the attendance data
export const sampleAttendance: AttendanceRecord[] = [
  {
    subject: "Mathematics",
    type: "theory",
    totalClasses: 96,
    attendedClasses: 82,
    missedClasses: 14,
    upcomingClasses: 96,
    lastUpdated: "March 20, 2024"
  },
  {
    subject: "Computer Science",
    type: "theory",
    totalClasses: 96,
    attendedClasses: 88,
    missedClasses: 8,
    upcomingClasses: 96,
    lastUpdated: "March 20, 2024"
  },
  {
    subject: "Physics",
    type: "theory",
    totalClasses: 96,
    attendedClasses: 70,
    missedClasses: 26,
    upcomingClasses: 96,
    lastUpdated: "March 20, 2024"
  }
];

// Define the subjects data
export const sampleSubjects: Subject[] = [
  {
    name: "Mathematics",
    pillars: [
      { name: "Algebra", progress: 85, modules: [] },
      { name: "Calculus", progress: 70, modules: [] },
      { name: "Statistics", progress: 90, modules: [] },
      { name: "Geometry", progress: 75, modules: [] },
      { name: "Trigonometry", progress: 82, modules: [] },
      { name: "Linear Algebra", progress: 88, modules: [] },
      { name: "Complex Analysis", progress: 78, modules: [] },
      { name: "Number Theory", progress: 85, modules: [] }
    ]
  },
  {
    name: "Computer Science",
    pillars: [
      { name: "Programming", progress: 95, modules: [] },
      { name: "Algorithms", progress: 80, modules: [] },
      { name: "Databases", progress: 65, modules: [] },
      { name: "Web Dev", progress: 88, modules: [] },
      { name: "Data Structures", progress: 92, modules: [] },
      { name: "System Design", progress: 75, modules: [] },
      { name: "Software Engineering", progress: 85, modules: [] },
      { name: "Computer Networks", progress: 78, modules: [] }
    ]
  },
  {
    name: "Physics",
    pillars: [
      { name: "Mechanics", progress: 78, modules: [] },
      { name: "Electricity", progress: 82, modules: [] },
      { name: "Waves", progress: 70, modules: [] },
      { name: "Quantum", progress: 60, modules: [] },
      { name: "Thermodynamics", progress: 75, modules: [] },
      { name: "Optics", progress: 85, modules: [] },
      { name: "Nuclear Physics", progress: 68, modules: [] },
      { name: "Relativity", progress: 72, modules: [] }
    ]
  }
];

// Define the home data
export const sampleHomeData: HomeData = {
  classes: [
    {
      subject: "Mathematics",
      type: "theory",
      startTime: "10:30 AM",
      endTime: "11:45 AM",
      room: "CS-301",
      professor: "Professor Jagdeep Singh Sokhey",
      agenda: [
        "Application of Integrals",
        "Matrices",
        "Permutations and Combinations",
        "Quiz on Previous Topics"
      ],
      hasQuiz: true,
      quizTopic: "Machine Learning Fundamentals",
      attendanceRequired: true,
      requiredFor: {
        current: 72,
        target: 75,
        reason: "Attendance below threshold"
      },
      attendanceTrend: {
        ifAttend: { percentage: 74, change: 2 },
        ifMiss: { percentage: 70, change: -2 }
      }
    },
    {
      subject: "Mathematics",
      type: "theory",
      startTime: "12:00 PM",
      endTime: "1:15 PM",
      room: "M-201",
      professor: "Dr. Michael Zhang",
      agenda: [
        "Linear Algebra Review",
        "Eigenvalues and Eigenvectors",
        "Matrix Transformations",
        "Practice Problems"
      ],
      hasQuiz: false,
      attendanceRequired: false,
      attendanceTrend: {
        ifAttend: { percentage: 82, change: 1.5 },
        ifMiss: { percentage: 79, change: -1.5 }
      }
    }
  ],
  upcomingAssessments: [
    {
      type: "quiz",
      subject: "Mathematics",
      dueDate: "Tomorrow, 2:30 PM",
      title: "Linear Algebra Quiz",
      description: "Covering eigenvalues, eigenvectors, and matrix transformations",
      projectedGrade: "A",
      weightage: 15
    },
    {
      type: "assignment",
      subject: "Physics",
      dueDate: "Friday, 11:59 PM",
      title: "Quantum Mechanics Problem Set",
      description: "Problems on wave functions and Schrödinger equation",
      projectedGrade: "A-",
      weightage: 20
    }
  ],
  teacherMessages: [
    {
      professor: "Professor Jagdeep Singh Sokhey",
      subject: "Computer Science",
      message: "Please review the neural network architectures before tomorrow's quiz. Focus on activation functions and gradient descent.",
      timestamp: "2 hours ago",
      priority: "high"
    },
    {
      professor: "Professor Jagdeep Singh Sokhey",
      subject: "Mathematics",
      message: "Office hours extended today until 5 PM for Linear Algebra consultation.",
      timestamp: "4 hours ago",
      priority: "medium"
    }
  ]
};

// Study vault data
export const sampleStudyVaultData: StudyVaultData = {
  subjects: [
    {
      name: "Mathematics",
      materials: [
        {
          id: "math-material-1",
          title: "Calculus Fundamentals",
          subject: "Mathematics",
          type: "material",
          uploadedBy: "teacher",
          fileUrl: "/materials/calculus-fundamentals.pdf",
          fileName: "calculus-fundamentals.pdf",
          uploadDate: "2024-03-15"
        }
      ],
      assignments: [
        {
          id: "math-assignment-1",
          title: "Integration Practice Set",
          subject: "Mathematics",
          type: "assignment",
          uploadedBy: "teacher",
          fileUrl: "/assignments/integration-practice.pdf",
          fileName: "integration-practice.pdf",
          uploadDate: "2024-03-18",
          deadline: "2024-03-25",
          marks: 10,
          status: "pending"
        }
      ]
    },
    {
      name: "Computer Science",
      materials: [
        {
          id: "cs-material-1",
          title: "Data Structures Guide",
          subject: "Computer Science",
          type: "material",
          uploadedBy: "teacher",
          fileUrl: "/materials/data-structures.pdf",
          fileName: "data-structures.pdf",
          uploadDate: "2024-03-16"
        }
      ],
      assignments: [
        {
          id: "cs-assignment-1",
          title: "Algorithm Implementation",
          subject: "Computer Science",
          type: "assignment",
          uploadedBy: "teacher",
          fileUrl: "/assignments/algorithm-impl.pdf",
          fileName: "algorithm-impl.pdf",
          uploadDate: "2024-03-17",
          deadline: "2024-03-24",
          marks: 10,
          status: "submitted"
        }
      ]
    }
  ]
};

// Performance metrics
export const performanceMetrics: PerformanceMetrics = {
  currentGrade: "A",
  nextGrade: "S",
  requiredScores: {
    midterm: 92,
    final: 94
  },
  attendanceRequirements: [
    {
      subject: "Mathematics",
      classesNeeded: 12,
      currentPercentage: 85.4,
      isAtRisk: false
    },
    {
      subject: "Computer Science",
      classesNeeded: 8,
      currentPercentage: 91.7,
      isAtRisk: false
    },
    {
      subject: "Physics",
      classesNeeded: 18,
      currentPercentage: 72.9,
      isAtRisk: true
    }
  ],
  overallPerformance: {
    currentPercentile: 92,
    projectedRank: 15,
    totalStudents: 240,
    strengths: [
      "Consistent performance in Computer Science",
      "High test scores in Mathematics",
      "Strong practical skills in lab work"
    ],
    areasForImprovement: [
      "Physics attendance needs attention",
      "Midterm preparation strategy",
      "Time management in exams"
    ]
  },
  aiInsights: {
    personalizedPlan: {
      recommendedHours: 6.5,
      focusAreas: [
        "Quantum Mechanics Fundamentals",
        "Advanced Calculus Problems",
        "Data Structures Implementation",
        "Algorithm Complexity Analysis"
      ],
      studyTechniques: [
        "Pomodoro Technique (25/5 split)",
        "Active Recall Practice",
        "Feynman Technique for Physics",
        "Mind Mapping for Complex Topics"
      ],
      breakSchedule: {
        duration: 15,
        frequency: 4
      }
    },
    behavioralInsights: {
      studyPatterns: {
        optimal: [
          "Early Morning (6 AM - 9 AM)",
          "Late Evening (7 PM - 10 PM)",
          "Weekend Afternoons"
        ],
        suboptimal: [
          "Post-Lunch Hours",
          "Late Night Sessions"
        ]
      },
      concentration: {
        peakHours: [
          "6:00 AM - 8:00 AM",
          "4:00 PM - 6:00 PM"
        ],
        distractions: [
          "Social Media Notifications",
          "Irregular Meal Times",
          "Background Music with Lyrics"
        ]
      }
    },
    nlpFeedback: {
      strengths: [
        "Excellent problem-solving approach",
        "Strong analytical thinking",
        "Good at connecting concepts",
        "Effective note-taking"
      ],
      weaknesses: [
        "Need more practice with theoretical physics",
        "Could improve exam time management",
        "Occasional gaps in prerequisite knowledge"
      ],
      conceptConnections: [
        {
          topic: "Calculus",
          masteryLevel: 85,
          relatedConcepts: [
            "Differential Equations",
            "Vector Analysis",
            "Integration Techniques"
          ]
        },
        {
          topic: "Data Structures",
          masteryLevel: 92,
          relatedConcepts: [
            "Algorithm Analysis",
            "Memory Management",
            "Tree Traversal"
          ]
        },
        {
          topic: "Quantum Physics",
          masteryLevel: 78,
          relatedConcepts: [
            "Wave Functions",
            "Uncertainty Principle",
            "Quantum States"
          ]
        }
      ]
    }
  }
};