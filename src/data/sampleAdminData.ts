import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../types/performance';

export const sampleTeacherPerformanceMetrics: TeacherPerformanceMetrics = {
  id: "t-001",
  name: "Professor Anil Kumar Jangir",
  department: "Computer Science",
  role: "Professor",
  yearsOfExperience: 8,
  overview: {
    overallScore: 92,
    percentileRank: 95,
    aiSummary: "Dr. Chen demonstrates exceptional teaching performance with consistent high scores across all metrics. Notable strengths include innovative teaching methods and strong student engagement. Recent improvements in student performance metrics indicate effective adaptation of teaching strategies.",
    recentTrends: [
      {
        metric: "Student Performance",
        trend: "up",
        percentage: 94
      },
      {
        metric: "Teaching Quality",
        trend: "up",
        percentage: 96
      },
      {
        metric: "Student Satisfaction",
        trend: "stable",
        percentage: 92
      }
    ]
  },
  academicPerformance: {
    classAverages: [
      {
        subject: "Advanced Programming",
        teacherAvg: 87.5,
        schoolAvg: 82.0,
        improvement: 5.5
      },
      {
        subject: "Data Structures",
        teacherAvg: 85.2,
        schoolAvg: 81.5,
        improvement: 3.7
      }
    ],
    studentPerformance: {
      improvementRate: 0.15,
      dropoutRate: 0.02,
      failureRate: 0.05,
      attendanceCorrelation: 0.85
    },
    zScores: [
      {
        subject: "Advanced Programming",
        score: 1.8
      },
      {
        subject: "Data Structures",
        score: 1.5
      }
    ]
  },
  feedback: {
    overall: 4.8,
    sentiment: {
      positive: 0.85,
      neutral: 0.12,
      negative: 0.03
    },
    studentScore: 4.7,
    parentScore: 4.9,
    recentComments: [
      {
        source: "student",
        comment: "Dr. Chen's teaching style makes complex concepts easy to understand",
        sentiment: "positive",
        date: "2024-03-15"
      },
      {
        source: "parent",
        comment: "Very impressed with the progress my child has made",
        sentiment: "positive",
        date: "2024-03-10"
      }
    ]
  },
  peerBenchmarking: {
    subjectRank: 1,
    departmentRank: 2,
    schoolRank: 5,
    metrics: [
      {
        metric: "Teaching Effectiveness",
        score: 95,
        average: 85,
        percentile: 92
      },
      {
        metric: "Student Engagement",
        score: 92,
        average: 82,
        percentile: 88
      }
    ],
    heatmapData: [
      { metric: "Teaching Quality", score: 95 },
      { metric: "Student Engagement", score: 92 },
      { metric: "Content Delivery", score: 88 },
      { metric: "Assessment Quality", score: 90 },
      { metric: "Innovation", score: 94 }
    ]
  },
  extracurricular: {
    initiatives: [
      {
        name: "Coding Club",
        role: "Mentor",
        impact: 85,
        students: 45
      },
      {
        name: "Tech Symposium",
        role: "Organizer",
        impact: 90,
        students: 120
      }
    ],
    events: [
      {
        name: "Annual Science Fair",
        contribution: "Judge",
        date: "2024-02-15",
        impact: 85
      }
    ],
    mentorship: {
      programs: 3,
      studentsReached: 75,
      successRate: 0.92
    },
    contributionScore: 88
  },
  disciplinary: {
    complaints: {
      total: 2,
      resolved: 2,
      pending: 0,
      byType: [
        { type: "Grading", count: 1 },
        { type: "Communication", count: 1 }
      ]
    },
    compliance: {
      policyAdherence: 98,
      gradingPunctuality: 95,
      attendanceRate: 97,
      documentationScore: 94
    },
    incidents: [
      {
        date: "2024-01-15",
        type: "Grading Dispute",
        severity: "low",
        status: "resolved",
        description: "Student contested project grade, resolved through review"
      }
    ]
  },
  valueScore: {
    overall: 92,
    components: [
      { metric: "Teaching Quality", score: 95, weight: 0.4 },
      { metric: "Student Success", score: 88, weight: 0.3 },
      { metric: "Innovation", score: 92, weight: 0.3 }
    ],
    historicalTrend: [
      { month: "Jan", score: 88 },
      { month: "Feb", score: 90 },
      { month: "Mar", score: 92 },
      { month: "Apr", score: 91 },
      { month: "May", score: 93 },
      { month: "Jun", score: 92 }
    ],
    predictiveMetrics: [
      {
        metric: "Teaching Quality",
        current: 95,
        predicted: 96,
        confidence: 0.85
      }
    ]
  }
};

export const samplePerformanceAnalytics: PerformanceAnalytics = {
  currentTrend: "improving",
  predictedScore: 94,
  confidenceInterval: {
    lower: 91,
    upper: 97
  },
  recommendedActions: [
    {
      priority: "high",
      action: "Implement peer learning sessions",
      impact: 85,
      timeframe: "1 month"
    },
    {
      priority: "medium",
      action: "Enhance digital learning resources",
      impact: 75,
      timeframe: "2 months"
    }
  ],
  riskFactors: [
    {
      factor: "Student Workload Balance",
      severity: "medium",
      trend: "stable"
    },
    {
      factor: "Assessment Frequency",
      severity: "low",
      trend: "decreasing"
    }
  ]
};