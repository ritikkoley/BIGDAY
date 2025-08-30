import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { demoStudentPerformance } from '../../data/demoData';
import { sampleGrades, sampleSubjects } from '../../data/sampleData';
import { Trophy, Target, Calendar, TrendingUp, ChevronDown, ChevronUp, Brain, Lightbulb, Clock, BookOpen, Star, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface GradeAnalysis {
  currentGrade: string;
  currentPercentage: number;
  nextGrade: string;
  nextGradeThreshold: number;
  pointsNeeded: number;
  subjectBreakdown: {
    subject: string;
    currentAverage: number;
    grade: string;
    weakTopics: string[];
    strongTopics: string[];
  }[];
}

interface ExamRequirements {
  midterm: {
    required: number;
    weight: number;
  };
  final: {
    required: number;
    weight: number;
  };
  quizzes: {
    required: number;
    weight: number;
  };
}

interface StudyPlan {
  totalHoursRecommended: number;
  weakSubjects: string[];
  focusAreas: {
    subject: string;
    topics: string[];
    hoursPerWeek: number;
    priority: 'high' | 'medium' | 'low';
    studyTechniques: string[];
  }[];
  dailySchedule: {
    subject: string;
    topic: string;
    duration: string;
    timeSlot: string;
    technique: string;
  }[];
}

const CurrentTab: React.FC<{
  gradeAnalysis: GradeAnalysis;
  examRequirements: ExamRequirements;
  studyPlan: StudyPlan;
}> = ({ gradeAnalysis, examRequirements, studyPlan }) => (
  <div className="space-y-6">
    {/* Current Performance Overview */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="apple-card p-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300 mb-2">
            <Trophy className="w-4 h-4" />
            <span>Current Grade</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-apple-blue-500 mb-2">
              {gradeAnalysis.currentGrade}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              {gradeAnalysis.currentPercentage.toFixed(1)}% Overall
            </div>
          </div>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300 mb-2">
            <Target className="w-4 h-4" />
            <span>Next Grade Target</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">
              {gradeAnalysis.nextGrade}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Need {gradeAnalysis.pointsNeeded.toFixed(1)} more points
            </div>
          </div>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Target Threshold</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-500 mb-2">
              {gradeAnalysis.nextGradeThreshold}%
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Required for {gradeAnalysis.nextGrade}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Required Scores for Upcoming Exams */}
    <div className="apple-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-5 h-5 text-apple-blue-500" />
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
          Required Scores for Next Grade
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-apple-gray-600 dark:text-white">Quizzes</h4>
            <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Weight: {(examRequirements.quizzes.weight * 100).toFixed(0)}%
            </span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-apple-blue-500 mb-2">
              {examRequirements.quizzes.required.toFixed(1)}%
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Average needed
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-apple-blue-500 rounded-full"
              style={{ width: `${Math.min(100, examRequirements.quizzes.required)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-apple-gray-600 dark:text-white">Midterm</h4>
            <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Weight: {(examRequirements.midterm.weight * 100).toFixed(0)}%
            </span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 mb-2">
              {examRequirements.midterm.required.toFixed(1)}%
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Score needed
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${Math.min(100, examRequirements.midterm.required)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-apple-gray-600 dark:text-white">Final Exam</h4>
            <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Weight: {(examRequirements.final.weight * 100).toFixed(0)}%
            </span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500 mb-2">
              {examRequirements.final.required.toFixed(1)}%
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Score needed
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${Math.min(100, examRequirements.final.required)}%` }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Subject Breakdown */}
    <div className="apple-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-5 h-5 text-apple-blue-500" />
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
          Subject Performance Breakdown
        </h3>
      </div>
      
      <div className="space-y-4">
        {gradeAnalysis.subjectBreakdown.map((subject, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  subject.currentAverage >= 85 ? 'bg-green-500' :
                  subject.currentAverage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <h4 className="font-medium text-apple-gray-600 dark:text-white">
                  {subject.subject}
                </h4>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-apple-blue-500">
                  {subject.currentAverage.toFixed(1)}%
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subject.grade === 'A' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  subject.grade === 'B' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  Grade {subject.grade}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strong Topics</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  {subject.strongTopics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Needs Improvement</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  {subject.weakTopics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Personalized Study Plan */}
    <div className="apple-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-5 h-5 text-apple-blue-500" />
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
          Personalized Study Plan
        </h3>
        <span className="px-3 py-1 bg-apple-blue-50 text-apple-blue-700 dark:bg-apple-blue-900/30 dark:text-apple-blue-300 rounded-full text-sm">
          {studyPlan.totalHoursRecommended} hours/week
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Areas */}
        <div className="space-y-4">
          <h4 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span>Priority Focus Areas</span>
          </h4>
          <div className="space-y-3">
            {studyPlan.focusAreas.map((area, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 ${
                  area.priority === 'high' ? 'border-red-500' :
                  area.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-apple-gray-600 dark:text-white">
                    {area.subject}
                  </h5>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      area.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      area.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {area.priority} priority
                    </span>
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      {area.hoursPerWeek}h/week
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h6 className="text-sm font-medium text-apple-gray-500 dark:text-apple-gray-400 mb-2">
                    Focus Topics:
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {area.topics.map((topic, i) => (
                      <span key={i} className="px-2 py-1 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full text-xs text-apple-gray-600 dark:text-apple-gray-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-apple-gray-500 dark:text-apple-gray-400 mb-2">
                    Recommended Techniques:
                  </h6>
                  <div className="space-y-1">
                    {area.studyTechniques.map((technique, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{technique}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Study Schedule */}
        <div className="space-y-4">
          <h4 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>Recommended Daily Schedule</span>
          </h4>
          <div className="space-y-3">
            {studyPlan.dailySchedule.map((session, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-apple-blue-500" />
                    <span className="font-medium text-apple-gray-600 dark:text-white">
                      {session.subject}
                    </span>
                  </div>
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    {session.timeSlot}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                    <Target className="w-4 h-4" />
                    <span>Topic: {session.topic}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {session.duration}</span>
                  </div>
                  <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                    <span className="font-medium">Technique:</span> {session.technique}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HistoricTab: React.FC<{
  historic: { year: number; avg: number }[];
}> = ({ historic }) => (
  <div className="space-y-6">
    <div className="apple-card p-6">
      <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-6">
        Performance History
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historic}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="year"
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
            />
            <Line
              type="monotone"
              dataKey="avg"
              name="Average Score"
              stroke="#0071e3"
              strokeWidth={2}
              dot={{ fill: '#0071e3' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="apple-card p-6">
      <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-6">
        Year-by-Year Comparison
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historic}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="year"
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
            />
            <Bar
              dataKey="avg"
              name="Average Score"
              fill="#0071e3"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export const Performance: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchCourses, courses, subscribeToGrades, unsubscribeAll } = useDataStore();
  const [activeTab, setActiveTab] = useState<'current' | 'historic'>('current');
  const [gradeAnalysis, setGradeAnalysis] = useState<GradeAnalysis | null>(null);
  const [examRequirements, setExamRequirements] = useState<ExamRequirements | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [historic, setHistoric] = useState<{ year: number; avg: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCourses(user.id, 'student');
      
      // Subscribe to real-time grade updates
      subscribeToGrades(user.id);
      
      // Cleanup subscription on unmount
      return () => {
        unsubscribeAll();
      };
    }
  }, [user, fetchCourses, subscribeToGrades, unsubscribeAll]);

  useEffect(() => {
      // Calculate current performance based on sample grades
      const subjectAverages = sampleGrades.map(grade => {
        const average = grade.exams.reduce((sum, exam) => sum + exam.score, 0) / grade.exams.length;
        return {
          subject: grade.subject,
          average,
          exams: grade.exams
        };
      });
      
      const overallAverage = subjectAverages.reduce((sum, subject) => sum + subject.average, 0) / subjectAverages.length;
      
      // Determine current and next grade
      const getGradeFromPercentage = (percentage: number) => {
        if (percentage >= 95) return 'A+';
        if (percentage >= 90) return 'A';
        if (percentage >= 85) return 'B+';
        if (percentage >= 80) return 'B';
        if (percentage >= 75) return 'C+';
        if (percentage >= 70) return 'C';
        if (percentage >= 65) return 'D+';
        if (percentage >= 60) return 'D';
        return 'F';
      };
      
      const getNextGradeThreshold = (currentPercentage: number) => {
        if (currentPercentage >= 95) return 100;
        if (currentPercentage >= 90) return 95;
        if (currentPercentage >= 85) return 90;
        if (currentPercentage >= 80) return 85;
        if (currentPercentage >= 75) return 80;
        if (currentPercentage >= 70) return 75;
        if (currentPercentage >= 65) return 70;
        if (currentPercentage >= 60) return 65;
        return 60;
      };
      
      const currentGrade = getGradeFromPercentage(overallAverage);
      const nextGradeThreshold = getNextGradeThreshold(overallAverage);
      const nextGrade = getGradeFromPercentage(nextGradeThreshold);
      const pointsNeeded = nextGradeThreshold - overallAverage;
      
      // Analyze each subject's performance
      const subjectBreakdown = subjectAverages.map(subject => {
        const subjectData = sampleSubjects.find(s => s.name === subject.subject);
        const weakTopics = subjectData?.pillars.filter(p => p.progress < 75).map(p => p.name) || [];
        const strongTopics = subjectData?.pillars.filter(p => p.progress >= 85).map(p => p.name) || [];
        
        return {
          subject: subject.subject,
          currentAverage: subject.average,
          grade: getGradeFromPercentage(subject.average),
          weakTopics,
          strongTopics
        };
      });
      
      setGradeAnalysis({
        currentGrade,
        currentPercentage: overallAverage,
        nextGrade,
        nextGradeThreshold,
        pointsNeeded,
        subjectBreakdown
      });
      
      // Calculate required scores for upcoming exams
      // Assuming: Quizzes 20%, Midterm 30%, Final 50%
      const currentWeightedScore = overallAverage * 0.5; // Assume 50% of course completed
      const remainingWeight = 0.5;
      const targetScore = nextGradeThreshold;
      const neededFromRemaining = (targetScore - currentWeightedScore) / remainingWeight;
      
      setExamRequirements({
        quizzes: {
          required: Math.max(0, Math.min(100, neededFromRemaining * 0.8)), // Slightly lower for quizzes
          weight: 0.2
        },
        midterm: {
          required: Math.max(0, Math.min(100, neededFromRemaining)),
          weight: 0.3
        },
        final: {
          required: Math.max(0, Math.min(100, neededFromRemaining * 1.1)), // Slightly higher for final
          weight: 0.5
        }
      });
      
      // Generate study plan based on weak areas
      const weakSubjects = subjectBreakdown.filter(s => s.currentAverage < 80).map(s => s.subject);
      const focusAreas = subjectBreakdown.map(subject => {
        const priority = subject.currentAverage < 70 ? 'high' : 
                        subject.currentAverage < 80 ? 'medium' : 'low';
        const hoursPerWeek = priority === 'high' ? 8 : priority === 'medium' ? 5 : 3;
        
        return {
          subject: subject.subject,
          topics: subject.weakTopics,
          hoursPerWeek,
          priority,
          studyTechniques: [
            'Active recall practice',
            'Spaced repetition',
            'Practice problems',
            'Concept mapping'
          ].slice(0, priority === 'high' ? 4 : 2)
        };
      }).filter(area => area.priority !== 'low');
      
      const dailySchedule = [
        {
          subject: 'Physics',
          topic: 'Quantum Mechanics',
          duration: '1 hour',
          timeSlot: '6:00 AM - 7:00 AM',
          technique: 'Review concepts and solve practice problems'
        },
        {
          subject: 'Mathematics',
          topic: 'Calculus Integration',
          duration: '1 hour',
          timeSlot: '4:00 PM - 5:00 PM',
          technique: 'Work through example problems step by step'
        },
        {
          subject: 'Computer Science',
          topic: 'Data Structures',
          duration: '1 hour',
          timeSlot: '7:00 PM - 8:00 PM',
          technique: 'Code implementation and algorithm analysis'
        }
      ];
      
      setStudyPlan({
        totalHoursRecommended: focusAreas.reduce((sum, area) => sum + area.hoursPerWeek, 0),
        weakSubjects,
        focusAreas,
        dailySchedule
      });
      
      // Mock historic data
      const studentData = demoStudentPerformance[user?.id as keyof typeof demoStudentPerformance] || demoStudentPerformance['student-1'];
      setHistoric(studentData.historicData);
      
    } catch (err) {
      console.error('Error analyzing performance:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze performance');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-red-500">
          <TrendingUp className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Trophy className="w-12 h-12 text-apple-blue-500" />
              <div className="absolute -top-2 -right-2 bg-apple-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {gradeAnalysis?.currentGrade}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Performance Analysis
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Current Grade: {gradeAnalysis?.currentGrade} • Target: {gradeAnalysis?.nextGrade}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tabs */}
      <div className="flex space-x-4 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20 pb-4">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            activeTab === 'current'
              ? 'bg-apple-blue-500 text-white'
              : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Current Performance</span>
        </button>
        <button
          onClick={() => setActiveTab('historic')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            activeTab === 'historic'
              ? 'bg-apple-blue-500 text-white'
              : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Historic Performance</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'current' && gradeAnalysis && examRequirements && studyPlan ? (
          <CurrentTab 
            gradeAnalysis={gradeAnalysis}
            examRequirements={examRequirements}
            studyPlan={studyPlan}
          />
        ) : (
          <HistoricTab 
            historic={historic} 
          />
        )}
      </div>
    </div>
  );
};

export default Performance;