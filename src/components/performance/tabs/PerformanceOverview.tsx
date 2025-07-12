import React from 'react';
import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../../../types/performance';
import { TrendingUp, TrendingDown, Minus, Brain, AlertTriangle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PerformanceOverviewProps {
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({
  metrics,
  analytics
}) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    const icons = {
      up: <TrendingUp className="w-4 h-4 text-green-500" />,
      down: <TrendingDown className="w-4 h-4 text-red-500" />,
      stable: <Minus className="w-4 h-4 text-yellow-500" />
    };
    return icons[trend];
  };

  const getMetricColor = (value: number) => {
    if (value >= 85) return 'text-green-500 dark:text-green-400';
    if (value >= 70) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-5 h-5 text-apple-blue-500" />
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            AI Performance Summary
          </h2>
        </div>
        <p className="text-apple-gray-500 dark:text-apple-gray-400">
          {metrics.overview.aiSummary}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.overview.recentTrends.map((trend, index) => (
          <div key={index} className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                {trend.metric}
              </span>
              {getTrendIcon(trend.trend)}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-medium ${getMetricColor(trend.percentage)}`}>
                {trend.percentage}%
              </span>
              <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                {trend.trend === 'up' ? '+' : ''}{trend.percentage - 100}% from last period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Trend */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Performance Trend
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Predicted Score:
            </span>
            <span className="text-lg font-medium text-apple-blue-500">
              {analytics.predictedScore}%
            </span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={metrics.valueScore.historicalTrend}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
              <Area
                type="monotone"
                dataKey="score"
                stroke="#0071e3"
                fill="#0071e3"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Risk Factors
          </h3>
        </div>
        <div className="space-y-4">
          {analytics.riskFactors.map((risk, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg"
            >
              <div>
                <p className="font-medium text-apple-gray-600 dark:text-white">
                  {risk.factor}
                </p>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  Trend: {risk.trend}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                risk.severity === 'high'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : risk.severity === 'medium'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};