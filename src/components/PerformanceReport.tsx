import React, { useState } from 'react';
import { Trophy, Target, Calendar, AlertTriangle, ChevronDown, ChevronUp, Zap, TrendingUp, CheckCircle2, XCircle as XCircle2, ArrowUp, BookOpen, Star, Brain, Clock, Lightbulb, GraduationCap, BookMarked, History } from 'lucide-react';
import { PerformanceMetrics, Grade } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { HistoricPerformance } from './performance/HistoricPerformance';

// Mock historic data
const mockHistoricData = {
  averageCGPA: 8.7,
  averagePercentile: 89.2,
  trend: 'improving' as const,
  yearlyData: [
    {
      id: '1',
      student_id: 'mock-id',
      year: 2020,
      percentile: 82.5,
      cgpa: 7.8,
      strengths: 'Strong problem-solving skills, Good grasp of fundamentals',
      weaknesses: 'Could improve presentation skills',
      created_at: '2020-12-31T00:00:00Z',
      updated_at: '2020-12-31T00:00:00Z'
    },
    {
      id: '2',
      student_id: 'mock-id',
      year: 2021,
      percentile: 85.8,
      cgpa: 8.2,
      strengths: 'Excellent analytical thinking, Strong project execution',
      weaknesses: 'Time management in exams needs attention',
      created_at: '2021-12-31T00:00:00Z',
      updated_at: '2021-12-31T00:00:00Z'
    },
    {
      id: '3',
      student_id: 'mock-id',
      year: 2022,
      percentile: 88.2,
      cgpa: 8.6,
      strengths: 'Outstanding research capabilities, Leadership in team projects',
      weaknesses: 'Can enhance documentation practices',
      created_at: '2022-12-31T00:00:00Z',
      updated_at: '2022-12-31T00:00:00Z'
    },
    {
      id: '4',
      student_id: 'mock-id',
      year: 2023,
      percentile: 90.5,
      cgpa: 9.0,
      strengths: 'Exceptional technical skills, Innovative approach to problem-solving',
      weaknesses: 'Consider exploring more advanced topics',
      created_at: '2023-12-31T00:00:00Z',
      updated_at: '2023-12-31T00:00:00Z'
    },
    {
      id: '5',
      student_id: 'mock-id',
      year: 2024,
      percentile: 92.5,
      cgpa: 9.1,
      strengths: 'Outstanding leadership, Excellent research contributions',
      weaknesses: 'Continue developing advanced technical skills',
      created_at: '2024-03-15T00:00:00Z',
      updated_at: '2024-03-15T00:00:00Z'
    }
  ]
};

interface PerformanceReportProps {
  studentName: string;
  metrics: PerformanceMetrics;
  grades: Grade[];
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({
  studentName,
  metrics,
  grades
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'historic'>('current');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Generate personalized study plan based on weak areas
  const generateStudyPlan = () => {
    const weakAreas = metrics.aiInsights?.personalizedPlan.focusAreas || [];
    const studyTechniques = metrics.aiInsights?.personalizedPlan.studyTechniques || [];
    const peakHours = metrics.aiInsights?.behavioralInsights.studyPatterns.optimal || [];
    
    return {
      weakAreas,
      studyTechniques,
      peakHours,
      dailySchedule: [
        {
          subject: 'Physics',
          topics: ['Quantum Mechanics', 'Wave Functions'],
          duration: '2 hours',
          time: '9:00 AM - 11:00 AM',
          approach: 'Focus on theoretical concepts and problem-solving'
        },
        {
          subject: 'Mathematics',
          topics: ['Complex Analysis', 'Integration'],
          duration: '1.5 hours',
          time: '2:00 PM - 3:30 PM',
          approach: 'Practice numerical problems and derivations'
        },
        {
          subject: 'Computer Science',
          topics: ['Data Structures', 'Algorithm Analysis'],
          duration: '2 hours',
          time: '4:00 PM - 6:00 PM',
          approach: 'Implement algorithms and analyze complexity'
        }
      ]
    };
  };

  const studyPlan = generateStudyPlan();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Trophy className="w-12 h-12 text-apple-blue-500" />
              <div className="absolute -top-2 -right-2 bg-apple-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {metrics.overallPerformance.projectedRank}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Performance Report
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Current Percentile: {metrics.overallPerformance.currentPercentile}th
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
          <History className="w-4 h-4" />
          <span>Historic Performance</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'current' ? (
          <>
            {/* Personalized Study Plan */}
            <div className="apple-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="w-5 h-5 text-apple-blue-500" />
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                  Personalized Study Plan
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Focus Areas */}
                <div className="space-y-4">
                  <h4 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span>Focus Areas</span>
                  </h4>
                  <div className="space-y-2">
                    {studyPlan.weakAreas.map((area, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center space-x-2"
                      >
                        <BookOpen className="w-4 h-4 text-apple-blue-500" />
                        <span className="text-apple-gray-600 dark:text-white">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimal Study Times */}
                <div className="space-y-4">
                  <h4 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>Peak Study Hours</span>
                  </h4>
                  <div className="space-y-2">
                    {studyPlan.peakHours.map((hour, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center space-x-2"
                      >
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-apple-gray-600 dark:text-white">{hour}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Schedule */}
              <div className="mt-6">
                <h4 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2 mb-4">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>Recommended Daily Schedule</span>
                </h4>
                <div className="space-y-4">
                  {studyPlan.dailySchedule.map((session, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4 text-apple-blue-500" />
                          <span className="font-medium text-apple-gray-600 dark:text-white">
                            {session.subject}
                          </span>
                        </div>
                        <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                          {session.time}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                          <BookMarked className="w-4 h-4" />
                          <span>Topics: {session.topics.join(', ')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {session.duration}</span>
                        </div>
                        <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                          <p className="mt-1">{session.approach}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Techniques */}
              <div className="mt-6">
                <h4 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2 mb-4">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  <span>Recommended Study Techniques</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyPlan.studyTechniques.map((technique, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-apple-gray-600 dark:text-white">{technique}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="apple-card p-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                    <Target className="w-4 h-4" />
                    <span>Required Scores</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-apple-gray-400 dark:text-apple-gray-300">Midterm</span>
                        <span className="font-medium text-apple-gray-600 dark:text-white">
                          {metrics.requiredScores.midterm}%
                        </span>
                      </div>
                      <div className="h-2 bg-apple-gray-100 dark:bg-apple-gray-600 rounded-full">
                        <div
                          className="h-full bg-apple-blue-500 rounded-full"
                          style={{ width: `${metrics.requiredScores.midterm}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-apple-gray-400 dark:text-apple-gray-300">Final</span>
                        <span className="font-medium text-apple-gray-600 dark:text-white">
                          {metrics.requiredScores.final}%
                        </span>
                      </div>
                      <div className="h-2 bg-apple-gray-100 dark:bg-apple-gray-600 rounded-full">
                        <div
                          className="h-full bg-apple-blue-500 rounded-full"
                          style={{ width: `${metrics.requiredScores.final}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="apple-card p-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                    <GraduationCap className="w-4 h-4" />
                    <span>Current Standing</span>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-apple-gray-600 dark:text-white mb-2">
                      {metrics.currentGrade}
                    </div>
                    <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Next Grade: {metrics.nextGrade}
                    </div>
                  </div>
                </div>
              </div>

              <div className="apple-card p-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Attendance Status</span>
                  </div>
                  <div className="space-y-3">
                    {metrics.attendanceRequirements.map((req, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-apple-gray-400 dark:text-apple-gray-300">
                            {req.subject}
                          </span>
                          <span className={`font-medium ${
                            req.isAtRisk ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {req.currentPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-apple-gray-100 dark:bg-apple-gray-600 rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              req.isAtRisk ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${req.currentPercentage}%` }}
                          />
                        </div>
                        {req.isAtRisk && (
                          <div className="flex items-center space-x-1 mt-1">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-500">
                              Need {req.classesNeeded} more classes
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <HistoricPerformance data={mockHistoricData} />
        )}
      </div>
    </div>
  );
};