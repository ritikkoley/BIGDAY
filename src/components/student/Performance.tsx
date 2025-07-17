import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore'; 
import { Trophy, Target, Calendar, TrendingUp, ChevronDown, ChevronUp, Brain, Lightbulb, Clock, BookOpen, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ProjectedGrade {
  current: number;
  needed: number;
  target: number;
  remaining_weight: number;
}

interface StudyPlan {
  weak_areas: string[];
  specific_recommendations: {
    subtopic: string;
    recommendation: string;
    priority: string;
    estimated_hours: number;
  }[];
  general_tips: string[];
  total_recommended_hours: number;
}

interface HistoricGrade {
  year: number;
  avg: number;
}

const CurrentTab: React.FC<{
  projected: number;
  needed: ProjectedGrade;
  plan: StudyPlan;
}> = ({ projected, needed, plan }) => (
  <div className="space-y-6">
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
            {plan.weak_areas.map((area, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4 text-apple-blue-500" />
                <span className="text-apple-gray-600 dark:text-white">{area}</span>
              </div>
            ))}
            {plan.weak_areas.length === 0 && (
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                No weak areas identified. Keep up the good work!
              </p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h4 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>Study Recommendations</span>
          </h4>
          <div className="space-y-2">
            {plan.general_tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center space-x-2"
              >
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-apple-gray-600 dark:text-white">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specific Recommendations */}
      {plan.specific_recommendations.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2 mb-4">
            <Calendar className="w-4 h-4 text-green-500" />
            <span>Specific Recommendations</span>
          </h4>
          <div className="space-y-4">
            {plan.specific_recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-apple-blue-500" />
                    <span className="font-medium text-apple-gray-600 dark:text-white">
                      {rec.subtopic}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rec.priority === 'high' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {rec.priority} priority
                  </span>
                </div>
                <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mb-2">
                  {rec.recommendation}
                </p>
                <div className="flex items-center space-x-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Estimated time: {rec.estimated_hours} hours daily</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Performance Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="apple-card p-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
            <Target className="w-4 h-4" />
            <span>Current Projection</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-apple-gray-600 dark:text-white">
              {projected.toFixed(1)}%
            </div>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Based on current performance
            </p>
          </div>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
            <TrendingUp className="w-4 h-4" />
            <span>Target Score</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-apple-blue-500">
              {needed.target.toFixed(0)}%
            </div>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Your goal
            </p>
          </div>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Score Needed</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">
              {needed.needed.toFixed(1)}%
            </div>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              On remaining assessments
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HistoricTab: React.FC<{
  historic: HistoricGrade[];
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
  const [coursesData, setCoursesData] = useState<{ id: string; name: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [projected, setProjected] = useState<number>(0);
  const [needed, setNeeded] = useState<ProjectedGrade>({ current: 0, needed: 0, target: 90, remaining_weight: 0 });
  const [plan, setPlan] = useState<StudyPlan>({ 
    weak_areas: [], 
    specific_recommendations: [],
    general_tips: [],
    total_recommended_hours: 0
  });
  const [historic, setHistoric] = useState<HistoricGrade[]>([]);
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
    if (courses.length > 0) {
      processCoursesIntoProgressData();
    }
  }, [courses]);

  useEffect(() => {
    if (user) {
      processCoursesIntoProgressData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      fetchPerformanceData();
    }
  }, [selectedCourse]);

  const processCoursesIntoProgressData = async () => {
    try {
      setIsLoading(true);
      
      // Check if user ID is a mock ID (not a valid UUID)
      if (user?.id && (user.id.startsWith('student-') || user.id.startsWith('teacher-') || user.id.startsWith('admin-'))) {
        // Use mock data for demo accounts
        const mockCourses = [
          { id: 'course-1', name: 'Mathematics' },
          { id: 'course-2', name: 'Physics' },
          { id: 'course-3', name: 'Chemistry' }
        ];
        
        setCoursesData(mockCourses);
        
        if (!selectedCourse) {
          setSelectedCourse(mockCourses[0].id);
        }
        
        setIsLoading(false);
        return;
      }
      
      // Get user's group_id
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('group_id')
        .eq('id', user?.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Get courses for the user's group
      const { data, error: coursesError } = await supabase
        .from('courses')
        .select('id, name')
        .contains('group_ids', [profile?.group_id]);
      
      if (coursesError) throw coursesError;
      
      setCoursesData(data || []);
      
      if (data && data.length > 0 && !selectedCourse) {
        setSelectedCourse(data[0].id);
      }
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true);
      
      // Check if user ID is a mock ID (not a valid UUID)
      if (user?.id && (user.id.startsWith('student-') || user.id.startsWith('teacher-') || user.id.startsWith('admin-'))) {
        // Use mock data for demo accounts
        setProjected(85.5);
        setNeeded({ current: 82, needed: 88, target: 90, remaining_weight: 0.4 });
        setPlan({
          weak_areas: ['Calculus', 'Trigonometry'],
          specific_recommendations: [
            {
              subtopic: 'Derivatives',
              recommendation: 'Practice more chain rule problems',
              priority: 'high',
              estimated_hours: 2
            }
          ],
          general_tips: ['Review notes daily', 'Practice past papers'],
          total_recommended_hours: 8
        });
        
        // Mock historic data
        const mockHistoric = [
          { year: 2022, avg: 78 },
          { year: 2023, avg: 82 },
          { year: 2024, avg: 85 }
        ];
        setHistoric(mockHistoric);
        
        setIsLoading(false);
        return;
      }
      
      // Get projected grade
      const { data: projectedData, error: projectedError } = await supabase
        .rpc('calculate_projected_grade', {
          stud_id: user?.id,
          crs_id: selectedCourse
        });
      
      if (projectedError) throw projectedError;
      setProjected(projectedData || 0);
      
      // Get marks needed
      const { data: neededData, error: neededError } = await supabase.functions.invoke('marks_needed', {
        body: { 
          student_id: user?.id, 
          course_id: selectedCourse, 
          target: 90 
        }
      });
      
      if (neededError) throw neededError;
      setNeeded(neededData || { current: 0, needed: 0, target: 90, remaining_weight: 0 });
      
      // Get study plan
      const { data: planData, error: planError } = await supabase.functions.invoke('basic_study_plan', {
        body: { 
          student_id: user?.id, 
          course_id: selectedCourse
        }
      });
      
      if (planError) throw planError;
      setPlan(planData || { 
        weak_areas: [], 
        specific_recommendations: [],
        general_tips: [],
        total_recommended_hours: 0
      });
      
      // Get historic grades
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select(`
          score,
          graded_at,
          assessments!inner(course_id)
        `)
        .eq('student_id', user?.id)
        .eq('assessments.course_id', selectedCourse);
      
      if (gradesError) throw gradesError;
      
      // Group by year
      const groupedByYear: Record<number, number[]> = {};
      gradesData?.forEach(grade => {
        const year = new Date(grade.graded_at).getFullYear();
        if (!groupedByYear[year]) {
          groupedByYear[year] = [];
        }
        groupedByYear[year].push(grade.score);
      });
      
      const historicData = Object.entries(groupedByYear).map(([year, scores]) => ({
        year: parseInt(year),
        avg: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }));
      
      setHistoric(historicData);
      
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  if (error && courses.length === 0) {
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
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Performance Report
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Track your academic progress
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Selection */}
      <div className="apple-card p-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCourse === course.id
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {course.name}
            </button>
          ))}
          {coursesData.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCourse === course.id
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {course.name}
            </button>
          ))}
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
        {activeTab === 'current' ? (
          <CurrentTab 
            projected={projected} 
            needed={needed} 
            plan={plan} 
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