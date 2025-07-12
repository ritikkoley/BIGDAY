import React from 'react';
import { TeacherProfile, TeacherDashboardData } from '../../types/teacher';
import { 
  LayoutDashboard, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { format } from 'date-fns';

interface TeacherDashboardProps {
  profile: TeacherProfile;
  dashboardData: TeacherDashboardData;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  profile,
  dashboardData
}) => {
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    const colors = {
      low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority];
  };

  const getTaskIcon = (type: 'grading' | 'attendance' | 'quiz' | 'message') => {
    const icons = {
      grading: <GraduationCap className="w-5 h-5" />,
      attendance: <Users className="w-5 h-5" />,
      quiz: <BookOpen className="w-5 h-5" />,
      message: <AlertTriangle className="w-5 h-5" />
    };
    return icons[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Welcome back, {profile.name.split(' ')[0]}
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Here's what's happening today
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="apple-card p-6">
        <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Upcoming Classes
        </h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {dashboardData.upcomingClasses.map((classItem, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-apple-blue-500" />
                <div>
                  <h3 className="font-medium text-apple-gray-600 dark:text-white">
                    {classItem.subject}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-apple-gray-400" />
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      {classItem.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="w-4 h-4 text-apple-gray-400" />
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    {classItem.studentsCount} students
                  </span>
                </div>
                {classItem.hasQuiz && (
                  <span className="px-2 py-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                    Quiz Today
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks and Performance */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Pending Tasks */}
        <div className="lg:col-span-1">
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              Pending Tasks
            </h2>
            <div className="space-y-4">
              {dashboardData.pendingTasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                        {getTaskIcon(task.type)}
                      </div>
                      <h3 className="font-medium text-apple-gray-600 dark:text-white">
                        {task.title}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>Due {format(new Date(task.deadline), 'MMM d')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="lg:col-span-1">
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              Recent Submissions
            </h2>
            <div className="space-y-4">
              {dashboardData.recentSubmissions.map((submission, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-apple-gray-600 dark:text-white">
                      {submission.student}
                    </h3>
                    {submission.status === 'graded' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">
                    {submission.assignment}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(submission.submittedAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Class Performance */}
        <div className="lg:col-span-1">
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              Class Performance
            </h2>
            <div className="space-y-4">
              {dashboardData.classPerformance.map((performance, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-apple-gray-600 dark:text-white">
                      {performance.subject}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 font-medium">
                        {performance.averageScore}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-lg">
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-1">
                        At Risk
                      </p>
                      <p className="text-lg font-medium text-red-500">
                        {performance.riskStudents}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-lg">
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-1">
                        Top Performers
                      </p>
                      <p className="text-lg font-medium text-green-500">
                        {performance.topPerformers}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};