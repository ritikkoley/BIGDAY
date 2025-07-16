import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, BookOpen, User } from 'lucide-react';

interface TimetableItem {
  course_id: string;
  course_name: string;
  teacher_id: string;
  teacher_name: string;
  assessment_id: string | null;
  assessment_name: string | null;
  assessment_type: string | null;
  due_date: string | null;
  weightage: number | null;
  urgency_status: 'overdue' | 'upcoming' | 'future';
}

interface StudentTimetableProps {
  onViewGrades: (subject: string) => void;
  onViewAttendance: (subject: string) => void;
}

export const StudentTimetable: React.FC<StudentTimetableProps> = ({
  onViewGrades,
  onViewAttendance
}) => {
  const [timetable, setTimetable] = useState<TimetableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setIsLoading(true);
      // Mock data instead of fetching from Supabase
      const mockTimetable: TimetableItem[] = [
        {
          course_id: 'c1',
          course_name: 'Computer Science',
          teacher_id: 't1',
          teacher_name: 'Professor Jagdeep Singh Sokhey',
          assessment_id: 'a1',
          assessment_name: 'Neural Networks Quiz',
          assessment_type: 'quiz',
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          weightage: 0.1,
          urgency_status: 'upcoming'
        },
        {
          course_id: 'c2',
          course_name: 'Data Structures',
          teacher_id: 't1',
          teacher_name: 'Professor Jagdeep Singh Sokhey',
          assessment_id: 'a2',
          assessment_name: 'Binary Trees Assignment',
          assessment_type: 'assignment',
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          weightage: 0.2,
          urgency_status: 'future'
        }
      ];
      setTimetable(mockTimetable);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timetable');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'upcoming':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
    }
  };

  const getTypeIcon = (type: string | null) => {
    switch (type) {
      case 'quiz':
        return '📝';
      case 'midterm':
        return '📊';
      case 'final':
        return '🎯';
      case 'digital':
        return '💻';
      default:
        return '📚';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
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
            {[...Array(5)].map((_, i) => (
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
          <span>Error loading timetable: {error}</span>
        </div>
      </div>
    );
  }

  // Group by courses
  const courseGroups = timetable.reduce((acc, item) => {
    if (!acc[item.course_id]) {
      acc[item.course_id] = {
        course_name: item.course_name,
        teacher_name: item.teacher_name,
        assessments: []
      };
    }
    if (item.assessment_id) {
      acc[item.course_id].assessments.push(item);
    }
    return acc;
  }, {} as Record<string, { course_name: string; teacher_name: string; assessments: TimetableItem[] }>);

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-6 h-6 text-apple-blue-500" />
          <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
            My Timetable
          </h2>
        </div>

        <div className="space-y-6">
          {Object.entries(courseGroups).map(([courseId, course]) => (
            <div key={courseId} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-apple-blue-500" />
                  <div>
                    <h3 className="font-medium text-apple-gray-600 dark:text-white">
                      {course.course_name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      <User className="w-4 h-4" />
                      <span>{course.teacher_name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {course.assessments.length > 0 ? (
                <div className="space-y-3">
                  {course.assessments.map((assessment) => (
                    <div
                      key={assessment.assessment_id}
                      className={`p-3 rounded-lg border ${getUrgencyColor(assessment.urgency_status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">
                            {getTypeIcon(assessment.assessment_type)}
                          </span>
                          <div>
                            <h4 className="font-medium">
                              {assessment.assessment_name}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(assessment.due_date)}</span>
                              </div>
                              {assessment.weightage && (
                                <span>
                                  Weight: {(assessment.weightage * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium uppercase tracking-wide">
                            {assessment.assessment_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-apple-gray-400 dark:text-apple-gray-300">
                  No upcoming assessments
                </div>
              )}
            </div>
          ))}

          {Object.keys(courseGroups).length === 0 && (
            <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses found in your timetable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};