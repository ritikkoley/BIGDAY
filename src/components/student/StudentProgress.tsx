import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { TrendingUp, Target, Award, AlertTriangle, BookOpen } from 'lucide-react';
import { CircularProgress } from '../CircularProgress';

interface ProgressData {
  course_id: string;
  course_name: string;
  subtopics: any[];
  total_assessments: number;
  average_score: number;
  average_percentile: number;
  weighted_score: number;
  assessment_history: any[];
}

interface SubtopicPerformance {
  subtopic_name: string;
  average_score: number;
  assessment_count: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface GradeProjection {
  current_performance: {
    score: number;
    letter: string;
    completed_assessments: number;
  };
  projection: {
    score: number;
    letter: string;
    confidence_level: string;
    scenario: string;
  };
  grade_improvement: {
    next_grade_threshold: number;
    score_needed_on_remaining: number;
    is_achievable: boolean;
    remaining_weightage: number;
  };
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
}

export const StudentProgress: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchCourses, courses, subscribeToGrades, unsubscribeAll } = useDataStore();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [subtopicData, setSubtopicData] = useState<SubtopicPerformance[]>([]);
  const [projection, setProjection] = useState<GradeProjection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCourses(user.id, 'student');
      
      // Return cleanup function
      return () => {
        // Clean up any subscriptions when component unmounts
        unsubscribeAll();
      };
      fetchProgressData();
    }
  }, [user, fetchCourses, unsubscribeAll]);

  useEffect(() => {
    if (selectedCourse) {
      fetchSubtopicData(selectedCourse);
      fetchGradeProjection(selectedCourse); 
      
      if (user) {
        // Subscribe to real-time grade updates
        subscribeToGrades(user.id);
      }
    }
  }, [selectedCourse, user, subscribeToGrades]);

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      // Mock data instead of fetching from Supabase
      const mockProgressData: ProgressData[] = [
        {
          course_id: 'c1',
          course_name: 'Computer Science',
          subtopics: [],
          total_assessments: 4,
          average_score: 92.5,
          average_percentile: 95,
          weighted_score: 91.2,
          assessment_history: []
        },
        {
          course_id: 'c2',
          course_name: 'Data Structures',
          subtopics: [],
          total_assessments: 3,
          average_score: 88.7,
          average_percentile: 92,
          weighted_score: 87.5,
          assessment_history: []
        }
      ];
      
      setProgressData(mockProgressData);
      
      if (mockProgressData.length > 0 && !selectedCourse) {
        setSelectedCourse(mockProgressData[0].course_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubtopicData = async (courseId: string) => {
    try {
      // Mock data instead of fetching from Supabase
      const mockSubtopicData: SubtopicPerformance[] = [
        {
          subtopic_name: 'Neural Networks',
          average_score: 92,
          assessment_count: 2,
          trend: 'improving'
        },
        {
          subtopic_name: 'Data Structures',
          average_score: 85,
          assessment_count: 3,
          trend: 'stable'
        },
        {
          subtopic_name: 'Algorithms',
          average_score: 78,
          assessment_count: 1,
          trend: 'improving'
        }
      ];
      setSubtopicData(mockSubtopicData);
    } catch (err) {
      console.error('Error fetching subtopic data:', err);
    }
  };

  const fetchGradeProjection = async (courseId: string) => {
    try {
      // Mock data instead of fetching from Supabase
      const mockProjection: GradeProjection = {
        current_performance: {
          score: 87.5,
          letter: 'B+',
          completed_assessments: 3
        },
        projection: {
          score: 91.2,
          letter: 'A-',
          confidence_level: 'medium',
          scenario: 'realistic'
        },
        grade_improvement: {
          next_grade_threshold: 92,
          score_needed_on_remaining: 95,
          is_achievable: true,
          remaining_weightage: 0.3
        },
        scenarios: {
          optimistic: 94.5,
          realistic: 91.2,
          pessimistic: 88.0
        }
      };
      setProjection(mockProjection);
    } catch (err) {
      console.error('Error fetching grade projection:', err);
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-500 dark:text-green-400';
      case 'declining':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-yellow-500 dark:text-yellow-400';
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-500 dark:text-green-400';
    if (score >= 80) return 'text-blue-500 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apple-card p-6">
        <div className="flex items-center space-x-2 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <span>Error loading progress: {error}</span>
        </div>
      </div>
    );
  }

  const selectedCourseData = progressData.find(course => course.course_id === selectedCourse);

  return (
    <div className="space-y-6">
      {/* Course Selection */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-apple-blue-500" />
          <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
            Academic Progress
          </h2>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {progressData.map((course) => (
            <button
              key={course.course_id}
              onClick={() => setSelectedCourse(course.course_id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCourse === course.course_id
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {course.course_name}
            </button>
          ))}
          {courses.map((course) => (
            <button
              key={course.course_id}
              onClick={() => setSelectedCourse(course.course_id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCourse === course.course_id
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {course.course_name}
            </button>
          ))}
        </div>
      </div>

      {selectedCourseData && (
        <>
          {/* Overall Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="apple-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-5 h-5 text-apple-blue-500" />
                <h3 className="font-medium text-apple-gray-600 dark:text-white">
                  Current Grade
                </h3>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getGradeColor(selectedCourseData.weighted_score || 0)}`}>
                  {selectedCourseData.weighted_score ? selectedCourseData.weighted_score.toFixed(1) : 'N/A'}%
                </div>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                  {selectedCourseData.total_assessments} assessments
                </p>
              </div>
            </div>

            <div className="apple-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-5 h-5 text-apple-blue-500" />
                <h3 className="font-medium text-apple-gray-600 dark:text-white">
                  Class Rank
                </h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-apple-blue-500">
                  {selectedCourseData.average_percentile ? `${selectedCourseData.average_percentile.toFixed(0)}th` : 'N/A'}
                </div>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                  Percentile
                </p>
              </div>
            </div>

            {projection && (
              <div className="apple-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-apple-blue-500" />
                  <h3 className="font-medium text-apple-gray-600 dark:text-white">
                    Projected Grade
                  </h3>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getGradeColor(projection.projection.score)}`}>
                    {projection.projection.score.toFixed(1)}%
                  </div>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                    {projection.projection.confidence_level} confidence
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Subtopic Performance */}
          {subtopicData.length > 0 && (
            <div className="apple-card p-6">
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-6">
                Subtopic Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subtopicData.map((subtopic, index) => (
                  <div key={index} className="text-center">
                    <CircularProgress progress={subtopic.average_score}>
                      <div className="text-center">
                        <span className={`text-lg font-bold ${getGradeColor(subtopic.average_score)}`}>
                          {subtopic.average_score.toFixed(0)}%
                        </span>
                      </div>
                    </CircularProgress>
                    <h4 className="font-medium text-apple-gray-600 dark:text-white mt-3">
                      {subtopic.subtopic_name}
                    </h4>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <span className={`text-sm font-medium ${getTrendColor(subtopic.trend)}`}>
                        {subtopic.trend}
                      </span>
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        ({subtopic.assessment_count} tests)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grade Projection Details */}
          {projection && (
            <div className="apple-card p-6">
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-6">
                Grade Projection Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                    Optimistic
                  </h4>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {projection.scenarios.optimistic.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                    Realistic
                  </h4>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {projection.scenarios.realistic.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                    Conservative
                  </h4>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {projection.scenarios.pessimistic.toFixed(1)}%
                  </div>
                </div>
              </div>

              {projection.grade_improvement.is_achievable && (
                <div className="mt-6 p-4 bg-apple-blue-50 dark:bg-apple-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-apple-blue-700 dark:text-apple-blue-300 mb-2">
                    Path to Next Grade
                  </h4>
                  <p className="text-sm text-apple-blue-600 dark:text-apple-blue-400">
                    Score {projection.grade_improvement.score_needed_on_remaining.toFixed(1)}% 
                    on remaining assessments to reach {projection.grade_improvement.next_grade_threshold}%
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};