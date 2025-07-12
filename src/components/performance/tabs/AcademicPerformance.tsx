import React from 'react';
import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../../../types/performance';
import { TrendingUp, Users, AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AcademicPerformanceProps {
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

export const AcademicPerformance: React.FC<AcademicPerformanceProps> = ({
  metrics,
  analytics
}) => {
  const classAverageData = metrics.academicPerformance.classAverages.map(avg => ({
    subject: avg.subject,
    'Teacher Average': avg.teacherAvg,
    'School Average': avg.schoolAvg,
    Improvement: avg.improvement
  }));

  return (
    <div className="space-y-6">
      {/* Class Performance */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-apple-blue-500" />
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Class Performance
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Overall Improvement:
            </span>
            <span className="text-lg font-medium text-green-500">
              {metrics.academicPerformance.studentPerformance.improvementRate * 100}%
            </span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classAverageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="subject"
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
              <Bar dataKey="Teacher Average" fill="#0071e3" />
              <Bar dataKey="School Average" fill="#6B7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Student Success
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  Pass Rate
                </span>
                <span className="text-lg font-medium text-green-500">
                  {((1 - metrics.academicPerformance.studentPerformance.failureRate) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(1 - metrics.academicPerformance.studentPerformance.failureRate) * 100}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  Retention Rate
                </span>
                <span className="text-lg font-medium text-blue-500">
                  {((1 - metrics.academicPerformance.studentPerformance.dropoutRate) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${(1 - metrics.academicPerformance.studentPerformance.dropoutRate) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Performance Correlation
            </h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-medium text-apple-blue-500 mb-2">
              {(metrics.academicPerformance.studentPerformance.attendanceCorrelation * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Attendance-Performance Correlation
            </p>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Risk Analysis
            </h3>
          </div>
          <div className="space-y-4">
            {analytics.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  {risk.factor}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.severity === 'high'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : risk.severity === 'medium'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                  {risk.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};