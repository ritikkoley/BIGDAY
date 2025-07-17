import React, { useState } from 'react';
import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../../types/performance';
import { PerformanceOverview } from './tabs/PerformanceOverview';
import { AcademicPerformance } from './tabs/AcademicPerformance';
import { FeedbackAnalysis } from './tabs/FeedbackAnalysis';
import { PeerBenchmarking } from './tabs/PeerBenchmarking';
import { ExtracurricularContributions } from './tabs/ExtracurricularContributions';
import { DisciplinaryMarkers } from './tabs/DisciplinaryMarkers';
import { ValueScore } from './tabs/ValueScore';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Users,
  Award,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface TeacherPerformanceViewProps {
  teacherId: string;
  studentId?: string | null;
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

type TabType = 'overview' | 'academic' | 'feedback' | 'peer' | 'extracurricular' | 'disciplinary' | 'value';

export const TeacherPerformanceView: React.FC<TeacherPerformanceViewProps> = ({
  teacherId,
  studentId,
  metrics,
  analytics
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [realMetrics, setRealMetrics] = useState<TeacherPerformanceMetrics | null>(null);
  const [realAnalytics, setRealAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (studentId) {
      // If a studentId is provided, we're viewing a student's performance
      // In a real implementation, we would fetch student data here
      setIsLoading(false);
    } else {
      // Otherwise, fetch teacher performance data
      fetchPerformanceData();
    }
  }, [teacherId, studentId]);

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, we would fetch this data from Supabase
      // For now, we'll use the sample data passed as props
      
      // Simulate API call with timeout
      setTimeout(() => {
        setRealMetrics(metrics);
        setRealAnalytics(analytics);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
      console.error('Error fetching performance data:', err);
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      component: PerformanceOverview
    },
    {
      id: 'academic',
      label: 'Academic',
      icon: GraduationCap,
      component: AcademicPerformance
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
      component: FeedbackAnalysis
    },
    {
      id: 'peer',
      label: 'Peer Comparison',
      icon: Users,
      component: PeerBenchmarking
    },
    {
      id: 'extracurricular',
      label: 'Extracurricular',
      icon: Award,
      component: ExtracurricularContributions
    },
    {
      id: 'disciplinary',
      label: 'Disciplinary',
      icon: AlertTriangle,
      component: DisciplinaryMarkers
    },
    {
      id: 'value',
      label: 'Value Score',
      icon: TrendingUp,
      component: ValueScore
    }
  ];

  const TabContent = tabs.find(tab => tab.id === activeTab)?.component;
  
  // Use real data if available, otherwise fall back to sample data
  const displayMetrics = realMetrics || metrics;
  const displayAnalytics = realAnalytics || analytics;
  
  // If viewing a student's performance, render the student performance component
  if (studentId) {
    // Import and use the appropriate student performance component
    // For now, we'll just show a placeholder
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="apple-card p-6">
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Student Performance: {studentId === 'student-1' ? 'Ritik Koley' : 
                                   studentId === 'student-2' ? 'Alex Johnson' : 
                                   studentId === 'student-3' ? 'Sarah Williams' : 'Student'}
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-2">
              Viewing detailed performance metrics for this student
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-apple-gray-600 dark:text-white mb-2">Overall Grade</h3>
                <p className="text-3xl font-bold text-apple-blue-500">
                  {studentId === 'student-1' ? '92%' : 
                   studentId === 'student-2' ? '85%' : 
                   studentId === 'student-3' ? '96%' : '88%'}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-apple-gray-600 dark:text-white mb-2">Attendance</h3>
                <p className="text-3xl font-bold text-green-500">
                  {studentId === 'student-1' ? '85%' : 
                   studentId === 'student-2' ? '90%' : 
                   studentId === 'student-3' ? '95%' : '88%'}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-apple-gray-600 dark:text-white mb-2">Class Rank</h3>
                <p className="text-3xl font-bold text-purple-500">
                  {studentId === 'student-1' ? '#2' : 
                   studentId === 'student-2' ? '#5' : 
                   studentId === 'student-3' ? '#1' : '#3'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium text-apple-gray-600 dark:text-white mb-4">Subject Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-apple-gray-600 dark:text-white">Computer Science</span>
                    <span className="font-medium text-apple-blue-500">
                      {studentId === 'student-1' ? '95%' : 
                       studentId === 'student-2' ? '82%' : 
                       studentId === 'student-3' ? '98%' : '85%'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-apple-blue-500 rounded-full" 
                      style={{ 
                        width: studentId === 'student-1' ? '95%' : 
                               studentId === 'student-2' ? '82%' : 
                               studentId === 'student-3' ? '98%' : '85%' 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-apple-gray-600 dark:text-white">Mathematics</span>
                    <span className="font-medium text-apple-blue-500">
                      {studentId === 'student-1' ? '88%' : 
                       studentId === 'student-2' ? '75%' : 
                       studentId === 'student-3' ? '92%' : '80%'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-apple-blue-500 rounded-full" 
                      style={{ 
                        width: studentId === 'student-1' ? '88%' : 
                               studentId === 'student-2' ? '75%' : 
                               studentId === 'student-3' ? '92%' : '80%' 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-apple-gray-600 dark:text-white">Physics</span>
                    <span className="font-medium text-apple-blue-500">
                      {studentId === 'student-1' ? '78%' : 
                       studentId === 'student-2' ? '90%' : 
                       studentId === 'student-3' ? '85%' : '82%'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-apple-blue-500 rounded-full" 
                      style={{ 
                        width: studentId === 'student-1' ? '78%' : 
                               studentId === 'student-2' ? '90%' : 
                               studentId === 'student-3' ? '85%' : '82%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="apple-card p-6 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue-500"></div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <GraduationCap className="w-6 h-6 text-apple-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                  {displayMetrics.name}'s Performance Review
                </h1>
                <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                  {displayMetrics.department} • {displayMetrics.role}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full">
                <span className="text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300">
                  Overall Score: {displayMetrics.overview.overallScore}%
                </span>
              </div>
              <div className="px-4 py-2 bg-apple-blue-500 text-white rounded-full">
                <span className="text-sm font-medium">
                  Rank: {displayMetrics.overview.percentileRank}th percentile
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {TabContent && !isLoading && (
          <TabContent
            metrics={displayMetrics}
            analytics={displayAnalytics}
          />
        )}

        {error && (
          <div className="apple-card p-6">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <span>Error: {error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};