import React, { useState } from 'react';
import { StudentTimetable } from './student/StudentTimetable';
import { AttendanceWarnings } from './student/AttendanceWarnings';
import { UpcomingAssessments } from './student/UpcomingAssessments';
import { StudentMessages } from './student/StudentMessages';
import { Clock, Calendar, BookOpen, GraduationCap, MessageSquare, Bell, AlertTriangle, CheckCircle2, ChevronRight, Microscope, FileText } from 'lucide-react';

interface HomePageProps {
  studentName: string;
  onViewGrades: (subject: string) => void;
  onViewAttendance: (subject: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  studentName, 
  onViewGrades,
  onViewAttendance
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'timetable' | 'attendance' | 'messages'>('upcoming');
  
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
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center space-x-2 ${
            activeTab === 'upcoming'
              ? 'text-apple-blue-500'
              : 'text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Upcoming</span>
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center space-x-2 ${
            activeTab === 'timetable'
              ? 'text-apple-blue-500'
              : 'text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Timetable</span>
          {activeTab === 'timetable' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center space-x-2 ${
            activeTab === 'attendance'
              ? 'text-apple-blue-500'
              : 'text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Attendance</span>
          {activeTab === 'attendance' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center space-x-2 ${
            activeTab === 'messages'
              ? 'text-apple-blue-500'
              : 'text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages</span>
          {activeTab === 'messages' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-blue-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'upcoming' && (
          <UpcomingAssessments />
        )}

        {activeTab === 'timetable' && (
          <StudentTimetable />
        )}

        {activeTab === 'attendance' && (
          <AttendanceWarnings />
        )}
        
        {activeTab === 'messages' && (
          <StudentMessages />
        )}
      </div>
    </div>
  );
};