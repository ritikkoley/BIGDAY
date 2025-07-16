import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, BookOpen, User } from 'lucide-react';
import { format } from 'date-fns';

interface UpcomingItem {
  id: string;
  type: 'quiz' | 'assignment' | 'exam' | 'project';
  title: string;
  course: string;
  teacher: string;
  dueDate: string;
  urgency: 'high' | 'medium' | 'low';
  description?: string;
  weightage?: number;
}

export const UpcomingAssessments: React.FC = () => {
  const [upcomingItems, setUpcomingItems] = useState<UpcomingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpcomingItems();
  }, []);

  const fetchUpcomingItems = async () => {
    try {
      setIsLoading(true);
      // Mock data instead of fetching from Supabase
      const mockItems: UpcomingItem[] = [
        {
          id: '1',
          type: 'quiz',
          title: 'Neural Networks Quiz',
          course: 'Computer Science',
          teacher: 'Professor Jagdeep Singh Sokhey',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          urgency: 'high',
          description: 'Covering activation functions, backpropagation, and gradient descent',
          weightage: 10
        },
        {
          id: '2',
          type: 'assignment',
          title: 'Binary Trees Implementation',
          course: 'Data Structures',
          teacher: 'Professor Jagdeep Singh Sokhey',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          urgency: 'medium',
          description: 'Implement a binary search tree with insert, delete, and search operations',
          weightage: 15
        },
        {
          id: '3',
          type: 'exam',
          title: 'Midterm Examination',
          course: 'Mathematics',
          teacher: 'Dr. Michael Zhang',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          urgency: 'low',
          description: 'Covering all topics from weeks 1-6',
          weightage: 30
        },
        {
          id: '4',
          type: 'project',
          title: 'Physics Lab Report',
          course: 'Physics',
          teacher: 'Dr. Emily Brown',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          urgency: 'medium',
          description: 'Analysis of pendulum motion experiment',
          weightage: 20
        }
      ];
      setUpcomingItems(mockItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming items');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return '📝';
      case 'exam':
        return '🎯';
      case 'project':
        return '🔬';
      default:
        return '📚';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  if (isLoading) {
    return (
      <div className="apple-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <span>Error loading upcoming assessments: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-6 h-6 text-apple-blue-500" />
          <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
            Upcoming Assessments
          </h2>
        </div>

        <div className="space-y-4">
          {upcomingItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${getUrgencyColor(item.urgency)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" role="img" aria-label={item.type}>
                    {getTypeIcon(item.type)}
                  </span>
                  <div>
                    <h3 className="font-medium text-apple-gray-600 dark:text-white text-lg">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      <BookOpen className="w-4 h-4" />
                      <span>{item.course}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-apple-blue-500">
                    {formatDate(item.dueDate)}
                  </div>
                  {item.weightage && (
                    <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                      Weight: {item.weightage}%
                    </div>
                  )}
                </div>
              </div>
              
              {item.description && (
                <p className="mt-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                  {item.description}
                </p>
              )}
              
              <div className="mt-3 flex items-center space-x-2 text-xs text-apple-gray-400 dark:text-apple-gray-300">
                <User className="w-3 h-3" />
                <span>{item.teacher}</span>
              </div>
            </div>
          ))}

          {upcomingItems.length === 0 && (
            <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming assessments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};