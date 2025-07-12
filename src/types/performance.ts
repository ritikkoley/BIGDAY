export interface TeacherPerformanceMetrics {
  id: string;
  name: string;
  department: string;
  role: string;
  yearsOfExperience: number;
  overview: {
    overallScore: number;
    percentileRank: number;
    aiSummary: string;
    recentTrends: {
      metric: string;
      trend: 'up' | 'down' | 'stable';
      percentage: number;
    }[];
  };
  academicPerformance: {
    classAverages: {
      subject: string;
      teacherAvg: number;
      schoolAvg: number;
      improvement: number;
    }[];
    studentPerformance: {
      improvementRate: number;
      dropoutRate: number;
      failureRate: number;
      attendanceCorrelation: number;
    };
    zScores: {
      subject: string;
      score: number;
    }[];
  };
  feedback: {
    overall: number;
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
    studentScore: number;
    parentScore: number;
    recentComments: {
      source: 'student' | 'parent';
      comment: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      date: string;
    }[];
  };
  peerBenchmarking: {
    subjectRank: number;
    departmentRank: number;
    schoolRank: number;
    metrics: {
      metric: string;
      score: number;
      average: number;
      percentile: number;
    }[];
    heatmapData: {
      metric: string;
      score: number;
    }[];
  };
  extracurricular: {
    initiatives: {
      name: string;
      role: string;
      impact: number;
      students: number;
    }[];
    events: {
      name: string;
      contribution: string;
      date: string;
      impact: number;
    }[];
    mentorship: {
      programs: number;
      studentsReached: number;
      successRate: number;
    };
    contributionScore: number;
  };
  disciplinary: {
    complaints: {
      total: number;
      resolved: number;
      pending: number;
      byType: {
        type: string;
        count: number;
      }[];
    };
    compliance: {
      policyAdherence: number;
      gradingPunctuality: number;
      attendanceRate: number;
      documentationScore: number;
    };
    incidents: {
      date: string;
      type: string;
      severity: 'low' | 'medium' | 'high';
      status: 'resolved' | 'pending';
      description: string;
    }[];
  };
  valueScore: {
    overall: number;
    components: {
      metric: string;
      score: number;
      weight: number;
    }[];
    historicalTrend: {
      month: string;
      score: number;
    }[];
    predictiveMetrics: {
      metric: string;
      current: number;
      predicted: number;
      confidence: number;
    }[];
  };
}

export interface PerformanceAnalytics {
  currentTrend: 'improving' | 'declining' | 'stable';
  predictedScore: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  recommendedActions: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: number;
    timeframe: string;
  }[];
  riskFactors: {
    factor: string;
    severity: 'high' | 'medium' | 'low';
    trend: 'increasing' | 'decreasing' | 'stable';
  }[];
}