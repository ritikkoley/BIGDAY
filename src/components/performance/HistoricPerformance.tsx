import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Award, Brain } from 'lucide-react';

interface HistoricData {
  id: string;
  year: number;
  percentile: number;
  cgpa: number;
  strengths: string | null;
  weaknesses: string | null;
}

interface HistoricDataSummary {
  averageCGPA: number;
  averagePercentile: number;
  trend: 'improving' | 'declining' | 'stable';
  yearlyData: HistoricData[];
}

interface HistoricPerformanceProps {
  data: HistoricDataSummary;
}

export const HistoricPerformance: React.FC<HistoricPerformanceProps> = ({ data }) => {
  const chartData = data.yearlyData.map(entry => ({
    year: entry.year,
    CGPA: entry.cgpa,
    Percentile: entry.percentile
  }));

  const getTrendColor = (trend: 'improving' | 'declining' | 'stable') => {
    const colors = {
      improving: 'text-green-500 dark:text-green-400',
      declining: 'text-red-500 dark:text-red-400',
      stable: 'text-yellow-500 dark:text-yellow-400'
    };
    return colors[trend];
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Average CGPA
            </h3>
          </div>
          <div className="text-3xl font-bold text-apple-gray-600 dark:text-white">
            {data.averageCGPA.toFixed(2)}
          </div>
          <div className={`flex items-center space-x-2 mt-2 ${getTrendColor(data.trend)}`}>
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{data.trend}</span>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Average Percentile
            </h3>
          </div>
          <div className="text-3xl font-bold text-apple-gray-600 dark:text-white">
            {data.averagePercentile.toFixed(1)}
          </div>
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-2">
            Class Standing
          </p>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Performance Analysis
            </h3>
          </div>
          <div className="space-y-2">
            {data.yearlyData.slice(-1)[0]?.strengths && (
              <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300">
                <span className="font-medium">Strengths:</span> {data.yearlyData.slice(-1)[0].strengths}
              </div>
            )}
            {data.yearlyData.slice(-1)[0]?.weaknesses && (
              <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300">
                <span className="font-medium">Areas for Improvement:</span> {data.yearlyData.slice(-1)[0].weaknesses}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CGPA Trend */}
      <div className="apple-card p-6">
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-6">
          CGPA Trend
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="year"
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="CGPA"
                stroke="#0071e3"
                strokeWidth={2}
                dot={{ fill: '#0071e3' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Percentile Comparison */}
      <div className="apple-card p-6">
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-6">
          Percentile Comparison
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
              <Legend />
              <Bar
                dataKey="Percentile"
                fill="#0071e3"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="apple-card p-6">
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Yearly Analysis
        </h3>
        <div className="space-y-4">
          {data.yearlyData.map((entry) => (
            <div
              key={entry.year}
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-apple-gray-600 dark:text-white">
                  Year {entry.year}
                </h4>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-apple-gray-400 dark:text-apple-gray-300">CGPA: </span>
                    <span className="font-medium text-apple-gray-600 dark:text-white">{entry.cgpa.toFixed(2)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-apple-gray-400 dark:text-apple-gray-300">Percentile: </span>
                    <span className="font-medium text-apple-gray-600 dark:text-white">{entry.percentile.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              {(entry.strengths || entry.weaknesses) && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {entry.strengths && (
                    <p className="text-sm text-apple-gray-600 dark:text-apple-gray-300">
                      <span className="font-medium">Strengths:</span> {entry.strengths}
                    </p>
                  )}
                  {entry.weaknesses && (
                    <p className="text-sm text-apple-gray-600 dark:text-apple-gray-300 mt-1">
                      <span className="font-medium">Areas for Improvement:</span> {entry.weaknesses}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};