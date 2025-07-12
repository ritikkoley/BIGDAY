import React from 'react';
import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../../../types/performance';
import { MessageSquare, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface FeedbackAnalysisProps {
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

export const FeedbackAnalysis: React.FC<FeedbackAnalysisProps> = ({
  metrics,
  analytics
}) => {
  const sentimentData = [
    {
      name: 'Positive',
      value: metrics.feedback.sentiment.positive * 100,
      color: '#10B981'
    },
    {
      name: 'Neutral',
      value: metrics.feedback.sentiment.neutral * 100,
      color: '#6B7280'
    },
    {
      name: 'Negative',
      value: metrics.feedback.sentiment.negative * 100,
      color: '#EF4444'
    }
  ];

  const getSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
    const icons = {
      positive: <ThumbsUp className="w-4 h-4 text-green-500" />,
      neutral: <Minus className="w-4 h-4 text-gray-500" />,
      negative: <ThumbsDown className="w-4 h-4 text-red-500" />
    };
    return icons[sentiment];
  };

  return (
    <div className="space-y-6">
      {/* Overall Feedback Score */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MessageSquare className="w-5 h-5 text-apple-blue-500" />
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Feedback Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-apple-blue-500">
              {metrics.feedback.overall.toFixed(1)}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Overall Rating
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">
              {metrics.feedback.studentScore.toFixed(1)}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Student Score
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">
              {metrics.feedback.parentScore.toFixed(1)}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Parent Score
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-6">
            Sentiment Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="apple-card p-6">
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
            Recent Comments
          </h3>
          <div className="space-y-4">
            {metrics.feedback.recentComments.map((comment, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300 capitalize">
                    {comment.source}
                  </span>
                  {getSentimentIcon(comment.sentiment)}
                </div>
                <p className="text-apple-gray-600 dark:text-white">
                  {comment.comment}
                </p>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-2">
                  {new Date(comment.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};