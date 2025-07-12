export interface CourseDocument {
  id: string;
  title: string;
  subject: string;
  type: 'assignment' | 'material';
  uploadedBy: 'teacher' | 'student';
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  deadline?: string;
  marks?: number;
  status?: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

export interface StudyVaultData {
  subjects: {
    name: string;
    materials: CourseDocument[];
    assignments: CourseDocument[];
  }[];
}

export interface Grade {
  subject: string;
  term: string;
  exams: {
    title: string;
    date: string;
    grade: string;
    score: number;
    type: 'assignment' | 'quiz' | 'midterm';
    marksObtained: number;
    totalMarks: number;
    classAverage: number;
    percentile: number;
    distribution: number[];  // Array of 10 numbers representing student count in each decile (0-10, 11-20, etc.)
    modules: string[];
  }[];
  projections?: {
    monteCarlo: {
      best: number;
      expected: number;
      worst: number;
      confidence: number;
    };
  };
}

export interface AttendanceRecord {
  subject: string;
  type: 'theory' | 'lab';
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  upcomingClasses: number;
  lastUpdated: string;
}

export interface Subject {
  name: string;
  pillars: {
    name: string;
    progress: number;
    modules: string[];
  }[];
}

export interface HomeData {
  classes: {
    subject: string;
    type: 'theory' | 'lab';
    startTime: string;
    endTime: string;
    room: string;
    professor: string;
    agenda: string[];
    hasQuiz: boolean;
    quizTopic?: string;
    attendanceRequired: boolean;
    requiredFor?: {
      current: number;
      target: number;
      reason: string;
    };
    attendanceTrend?: {
      ifAttend: { percentage: number; change: number };
      ifMiss: { percentage: number; change: number };
    };
  }[];
  upcomingAssessments: {
    type: 'quiz' | 'assignment';
    subject: string;
    dueDate: string;
    title: string;
    description: string;
    projectedGrade?: string;
    weightage?: number;
  }[];
  teacherMessages: {
    professor: string;
    subject: string;
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export interface PerformanceMetrics {
  currentGrade: string;
  nextGrade: string;
  requiredScores: {
    midterm: number;
    final: number;
  };
  attendanceRequirements: {
    subject: string;
    classesNeeded: number;
    currentPercentage: number;
    isAtRisk: boolean;
  }[];
  overallPerformance: {
    currentPercentile: number;
    projectedRank: number;
    totalStudents: number;
    strengths: string[];
    areasForImprovement: string[];
  };
  aiInsights?: {
    personalizedPlan: {
      recommendedHours: number;
      focusAreas: string[];
      studyTechniques: string[];
      breakSchedule: {
        duration: number;
        frequency: number;
      };
    };
    behavioralInsights: {
      studyPatterns: {
        optimal: string[];
        suboptimal: string[];
      };
      concentration: {
        peakHours: string[];
        distractions: string[];
      };
    };
    nlpFeedback: {
      strengths: string[];
      weaknesses: string[];
      conceptConnections: {
        topic: string;
        masteryLevel: number;
        relatedConcepts: string[];
      }[];
    };
  };
}