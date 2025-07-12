import React, { useMemo } from 'react';
import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../../../types/performance';
import { Users, Award, TrendingUp } from 'lucide-react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { HeatmapRect } from '@visx/heatmap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PeerBenchmarkingProps {
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

export const PeerBenchmarking: React.FC<PeerBenchmarkingProps> = ({
  metrics,
  analytics
}) => {
  const metricData = metrics.peerBenchmarking.metrics.map(metric => ({
    name: metric.metric,
    score: metric.score,
    average: metric.average,
    percentile: metric.percentile
  }));

  // Transform data for heatmap
  const heatmapData = useMemo(() => {
    const maxScore = Math.max(...metrics.peerBenchmarking.heatmapData.map(d => d.score));
    const data = metrics.peerBenchmarking.heatmapData.map((d, i) => ({
      bin: i,
      bins: [{ bin: 0, count: d.score / maxScore }]
    }));
    return [data]; // Wrap in array for HeatmapRect
  }, [metrics.peerBenchmarking.heatmapData]);

  return (
    <div className="space-y-6">
      {/* Rankings Overview */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-5 h-5 text-apple-blue-500" />
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Performance Rankings
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-apple-blue-500">
              #{metrics.peerBenchmarking.subjectRank}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Subject Rank
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">
              #{metrics.peerBenchmarking.departmentRank}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Department Rank
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">
              #{metrics.peerBenchmarking.schoolRank}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              School Rank
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-5 h-5 text-apple-blue-500" />
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Performance Metrics
          </h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metricData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
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
              <Bar dataKey="score" fill="#0071e3" name="Your Score" />
              <Bar dataKey="average" fill="#6B7280" name="Peer Average" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Percentile Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Percentile Rankings
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.peerBenchmarking.metrics.map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    {metric.metric}
                  </span>
                  <span className="text-sm font-medium text-apple-blue-500">
                    {metric.percentile}th
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-apple-blue-500 rounded-full"
                    style={{ width: `${metric.percentile}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Performance Distribution
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.peerBenchmarking.heatmapData.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    {data.metric}
                  </span>
                  <span className="text-sm font-medium text-apple-blue-500">
                    {data.score}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-apple-blue-500 rounded-full"
                    style={{ width: `${data.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};