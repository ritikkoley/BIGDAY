import React, { useState } from 'react';
import { HomeData } from '../types';
import { Clock, Calendar, BookOpen, GraduationCap, MessageSquare, Bell, AlertTriangle, CheckCircle2, ChevronRight, Microscope } from 'lucide-react';

interface HomePageProps {
  studentName: string;
  data: HomeData;
  onViewGrades: (subject: string) => void;
  onViewAttendance: (subject: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  studentName, 
  data, 
  onViewGrades,
  onViewAttendance
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'upcoming' | 'messages'>('schedule');
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority as keyof typeof colors];
  };

  const ViewButton: React.FC<{
    onClick: () => void;
    variant: 'primary' | 'secondary';
    children: React.ReactNode;
  }> = ({ onClick, variant, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        variant === 'primary'
          ? 'bg-apple-blue-500 hover:bg-apple-blue-600 text-white shadow-sm hover:shadow'
          : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 text-apple-gray-600 dark:text-apple-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              {getGreeting()}, {studentName}
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              {formatDate(new Date())}
            </p>
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-apple-blue-500" />
            {data.upcomingAssessments.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {data.upcomingAssessments.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === 'schedule'
              ? 'text-apple-blue-500'
              : 'text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          Today's Schedule
          {activeTab === 'schedule' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === 'upcoming'
              ? 'text-apple-blue-500'
              : 'text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          Upcoming
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === 'messages'
              ? 'text-apple-blue-500'
              : 'text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          Messages
          {activeTab === 'messages' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {data.classes.map((classItem, index) => (
              <div key={index} className="apple-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {classItem.type === 'theory' ? (
                      <BookOpen className="w-6 h-6 text-apple-blue-500" />
                    ) : (
                      <Microscope className="w-6 h-6 text-apple-blue-500" />
                    )}
                    <div>
                      <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                        {classItem.subject}
                      </h2>
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {classItem.startTime} - {classItem.endTime} • Room {classItem.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {classItem.hasQuiz && (
                      <div className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full text-sm font-medium animate-pulse">
                        Quiz Today
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <ViewButton
                        onClick={() => onViewAttendance(classItem.subject)}
                        variant="secondary"
                      >
                        View Attendance
                      </ViewButton>
                      <ViewButton
                        onClick={() => onViewGrades(classItem.subject)}
                        variant="primary"
                      >
                        View Grades
                      </ViewButton>
                    </div>
                  </div>
                </div>

                {classItem.attendanceRequired && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {classItem.requiredFor?.reason}
                        <span className="ml-1 font-medium">
                          ({classItem.requiredFor?.current}% → {classItem.requiredFor?.target}%)
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {classItem.attendanceTrend && (
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-apple-gray-50/50 dark:bg-apple-gray-600/30 rounded-lg">
                      <h4 className="text-sm font-medium text-apple-gray-500 dark:text-apple-gray-400 mb-2">
                        If you attend
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-green-600 dark:text-green-400">
                          {classItem.attendanceTrend.ifAttend.percentage}%
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          +{classItem.attendanceTrend.ifAttend.change}%
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-apple-gray-50/50 dark:bg-apple-gray-600/30 rounded-lg">
                      <h4 className="text-sm font-medium text-apple-gray-500 dark:text-apple-gray-400 mb-2">
                        If you miss
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-red-600 dark:text-red-400">
                          {classItem.attendanceTrend.ifMiss.percentage}%
                        </span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {classItem.attendanceTrend.ifMiss.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-apple-gray-500 dark:text-apple-gray-400">
                    Today's Agenda
                  </h3>
                  <ul className="space-y-2">
                    {classItem.agenda.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-apple-blue-500 mt-0.5" />
                        <span className="text-sm text-apple-gray-600 dark:text-apple-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {classItem.hasQuiz && classItem.quizTopic && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                    <h3 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                      Quiz Details
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Topic: {classItem.quizTopic}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {data.upcomingAssessments.map((assessment, index) => (
              <div key={index} className="apple-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {assessment.type === 'quiz' ? (
                      <Clock className="w-5 h-5 text-apple-blue-500" />
                    ) : (
                      <Calendar className="w-5 h-5 text-apple-blue-500" />
                    )}
                    <div>
                      <h3 className="font-medium text-apple-gray-600 dark:text-white">
                        {assessment.title}
                      </h3>
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {assessment.subject} • Due {assessment.dueDate}
                      </p>
                    </div>
                  </div>
                  {assessment.projectedGrade && (
                    <div className="text-sm font-medium text-apple-blue-500">
                      Projected: {assessment.projectedGrade}
                    </div>
                  )}
                </div>
                <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                  {assessment.description}
                </p>
                {assessment.weightage && (
                  <div className="mt-2 text-xs text-apple-gray-400 dark:text-apple-gray-300">
                    Weightage: {assessment.weightage}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {data.teacherMessages.map((message, index) => (
              <div key={index} className="apple-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-apple-blue-500" />
                    <div>
                      <h3 className="font-medium text-apple-gray-600 dark:text-white">
                        {message.professor}
                      </h3>
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {message.subject} • {message.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(message.priority)}`}>
                    {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)} Priority
                  </span>
                </div>
                <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                  {message.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};