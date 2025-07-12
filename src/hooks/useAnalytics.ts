import { useState, useEffect } from 'react';
import { Grade, AttendanceRecord, Subject } from '../types';

export function useAnalytics(
  grades: Grade[],
  attendance: AttendanceRecord[],
  subjects: Subject[]
) {
  const [insights, setInsights] = useState({
    retention: {},
    velocity: {},
    projections: {},
    attendance: {
      correlation: 0,
      impact: 0,
      recommendation: ''
    },
    studyPlan: {
      recommendedHours: 0,
      focusAreas: [],
      probability: 0
    }
  });

  useEffect(() => {
    // Calculate retention scores
    const retentionScores = subjects.reduce((acc, subject) => ({
      ...acc,
      [subject.name]: calculateRetentionScore(grades, subject.name)
    }), {});

    // Calculate learning velocity
    const velocityScores = subjects.reduce((acc, subject) => ({
      ...acc,
      [subject.name]: calculateLearningVelocity(grades, subject.name)
    }), {});

    // Project future grades
    const gradeProjections = subjects.reduce((acc, subject) => ({
      ...acc,
      [subject.name]: projectGrades(grades, subject.name)
    }), {});

    // Analyze attendance impact
    const attendanceImpact = analyzeAttendanceImpact(attendance, grades);

    // Generate optimized study plan
    const studyPlan = generateStudyPlan(grades, attendance, 90); // Target grade of 90

    setInsights({
      retention: retentionScores,
      velocity: velocityScores,
      projections: gradeProjections,
      attendance: attendanceImpact,
      studyPlan
    });
  }, [grades, attendance, subjects]);

  return insights;
}

// Helper functions for analytics calculations
function calculateRetentionScore(grades: Grade[], subject: string): number {
  const subjectGrades = grades.find(g => g.subject === subject);
  if (!subjectGrades) return 0;

  const examScores = subjectGrades.exams.map(exam => exam.score);
  return average(examScores);
}

function calculateLearningVelocity(grades: Grade[], subject: string): number {
  const subjectGrades = grades.find(g => g.subject === subject);
  if (!subjectGrades) return 0;

  const scores = subjectGrades.exams.map(exam => exam.score);
  if (scores.length < 2) return 0;

  const velocities = [];
  for (let i = 1; i < scores.length; i++) {
    velocities.push(scores[i] - scores[i - 1]);
  }

  return average(velocities);
}

function projectGrades(grades: Grade[], subject: string): {
  expected: number;
  best: number;
  worst: number;
} {
  const subjectGrades = grades.find(g => g.subject === subject);
  if (!subjectGrades) return { expected: 0, best: 0, worst: 0 };

  const scores = subjectGrades.exams.map(exam => exam.score);
  const avg = average(scores);
  const std = standardDeviation(scores);

  return {
    expected: avg,
    best: avg + std,
    worst: avg - std
  };
}

function analyzeAttendanceImpact(
  attendance: AttendanceRecord[],
  grades: Grade[]
): {
  correlation: number;
  impact: number;
  recommendation: string;
} {
  const attendanceRates = attendance.map(
    record => record.attendedClasses / record.totalClasses
  );
  const gradeAverages = grades.map(
    grade => average(grade.exams.map(exam => exam.score))
  );

  const correlation = calculateCorrelation(attendanceRates, gradeAverages);
  const impact = correlation * 100;

  return {
    correlation,
    impact,
    recommendation: getAttendanceRecommendation(correlation)
  };
}

function generateStudyPlan(
  grades: Grade[],
  attendance: AttendanceRecord[],
  targetGrade: number
): {
  recommendedHours: number;
  focusAreas: string[];
  probability: number;
} {
  const weakSubjects = grades
    .map(grade => ({
      subject: grade.subject,
      average: average(grade.exams.map(exam => exam.score))
    }))
    .filter(subject => subject.average < targetGrade)
    .map(subject => subject.subject);

  const averagePerformance = average(
    grades.map(grade => average(grade.exams.map(exam => exam.score)))
  );

  const gap = targetGrade - averagePerformance;
  const recommendedHours = Math.max(2, Math.ceil(gap * 0.2));
  const probability = Math.max(0, 1 - gap / 100);

  return {
    recommendedHours,
    focusAreas: weakSubjects,
    probability
  };
}

// Utility functions
function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function standardDeviation(numbers: number[]): number {
  const avg = average(numbers);
  const squareDiffs = numbers.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  const xMean = average(x);
  const yMean = average(y);
  
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }
  
  return numerator / Math.sqrt(xDenominator * yDenominator);
}

function getAttendanceRecommendation(correlation: number): string {
  if (correlation > 0.7) {
    return "Strong correlation with performance. Maintain high attendance.";
  } else if (correlation > 0.4) {
    return "Moderate correlation. Consider increasing attendance.";
  } else {
    return "Weak correlation. Focus on engagement quality.";
  }
}