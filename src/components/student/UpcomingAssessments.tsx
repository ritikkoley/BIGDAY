import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, BookOpen, User, GraduationCap, FileText, Microscope, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

interface UpcomingItem {
  id: string;
  type: 'quiz' | 'assignment' | 'exam' | 'project' | 'class' | 'meeting' | 'deadline';
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
          id: '0',
          type: 'class',
          title: 'Neural Networks Lecture',
          course: 'Computer Science',
          teacher: 'Professor Jagdeep Singh Sokhey',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          urgency: 'medium',
          description: 'Introduction to neural network architectures and applications',
        },
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
        ,
        {
          id: '5',
          type: 'meeting',
          title: 'Office Hours - Linear Algebra',
          course: 'Mathematics',
          teacher: 'Dr. Michael Zhang',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          urgency: 'low',
          description: 'Optional office hours for Linear Algebra questions'
        },
        {
          id: '6',
          type: 'deadline',
          title: 'Course Registration',
          course: 'Administration',
          teacher: 'Academic Office',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          urgency: 'high',
          description: 'Deadline for next semester course registration'
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
        return <CheckSquare className="w-5 h-5 text-blue-500" />;
      case 'exam':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'project':
        return <Microscope className="w-5 h-5 text-green-500" />;
      case 'class':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'meeting':
        return <User className="w-5 h-5 text-orange-500" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-apple-blue-500" />
          <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
            Upcoming Assessments
          </h2>
          </div>
          <div className="flex space-x-2">
            <select className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
              <option value="all">All Types</option>
              <option value="quiz">Quizzes</option>
              <option value="assignment">Assignments</option>
              <option value="exam">Exams</option>
              <option value="class">Classes</option>
            </select>
            <select className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
              <option value="all">All Courses</option>
              <option value="cs">Computer Science</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics</option>
            </select>
          </div>
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
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      {getTypeIcon(item.type)}
                    </div>
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
                  <div className="flex items-center space-x-1">
                    {item.type === 'quiz' || item.type === 'assignment' || item.type === 'exam' ? (
                    <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                      {item.weightage ? `Weight: ${item.weightage}%` : ''}
                    </div>
                    ) : (
                      <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs uppercase">
                        {item.type}
                      </div>
                    )}
                  </div>
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
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No upcoming assessments</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
              Showing {upcomingItems.length} upcoming items
            </div>
            <button className="text-sm text-apple-blue-500 hover:text-apple-blue-600 transition-colors">
              View Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};