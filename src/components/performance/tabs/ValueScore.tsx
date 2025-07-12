import React from 'react';
import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../../../types/performance';
import { TrendingUp, Brain, Star } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ValueScoreProps {
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

export const ValueScore: React.FC<ValueScoreProps> = ({
  metrics,
  analytics
}) => {
  return (
    <div className="space-y-6">
      {/* Overall Value Score */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Star className="w-5 h-5 text-apple-blue-500" />
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Overall Value Score
          </h2>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-apple-blue-500">
            {metrics.valueScore.overall}
          </div>
          <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-2">
            Composite Score
          </div>
        </div>
      </div>

      {/* Score Components */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-5 h-5 text-apple-blue-500" />
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Score Components
          </h3>
        </div>
        <div className="space-y-4">
          {metrics.valueScore.components.map((component, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-apple-gray-600 dark:text-white font-medium">
                    {component.metric}
                  </span>
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300 ml-2">
                    (Weight: {(component.weight * 100).toFixed(0)}%)
                  </span>
                </div>
                <span className="text-lg font-medium text-apple-blue-500">
                  {component.score}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-apple-blue-500 rounded-full transition-all"
                  style={{ width: `${component.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Trend */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Historical Trend
            </h3>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metrics.valueScore.historicalTrend}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
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
                dataKey="score"
                stroke="#0071e3"
                strokeWidth={2}
                dot={{ fill: '#0071e3' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-5 h-5 text-apple-blue-500" />
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Predictive Analytics
          </h3>
        </div>
        <div className="space-y-4">
          {metrics.valueScore.predictiveMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-apple-gray-600 dark:text-white font-medium">
                  {metric.metric}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    Confidence:
                  </span>
                  <span className="text-apple-blue-500 font-medium">
                    {(metric.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    Current
                  </div>
                  <div className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {metric.current}
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div className="flex-1 text-right">
                  <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    Predicted
                  </div>
                  <div className="text-lg font-medium text-green-500">
                    {metric.predicted}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};