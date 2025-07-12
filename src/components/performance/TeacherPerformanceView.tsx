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
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

type TabType = 'overview' | 'academic' | 'feedback' | 'peer' | 'extracurricular' | 'disciplinary' | 'value';

export const TeacherPerformanceView: React.FC<TeacherPerformanceViewProps> = ({
  teacherId,
  metrics,
  analytics
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <GraduationCap className="w-6 h-6 text-apple-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                  {metrics.name}'s Performance Review
                </h1>
                <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                  {metrics.department} • {metrics.role}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full">
                <span className="text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300">
                  Overall Score: {metrics.overview.overallScore}%
                </span>
              </div>
              <div className="px-4 py-2 bg-apple-blue-500 text-white rounded-full">
                <span className="text-sm font-medium">
                  Rank: {metrics.overview.percentileRank}th percentile
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
        {TabContent && (
          <TabContent
            metrics={metrics}
            analytics={analytics}
          />
        )}
      </div>
    </div>
  );
};