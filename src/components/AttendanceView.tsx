import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { AttendanceRecord } from '../types';
import { AlertTriangle, Calendar, CheckCircle2, Clock, School, XCircle, BookOpen, Microscope, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';

interface AttendanceViewProps {
  studentName: string;
  attendance: AttendanceRecord[];
  selectedSubject: string | null;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  studentName,
  attendance,
  selectedSubject
}) => {
  const { user } = useAuthStore();
  const { fetchAttendance } = useDataStore();
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const subjectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (user) {
      fetchAttendance(user.id, selectedSubject || undefined);
    }
  }, [user, selectedSubject, fetchAttendance]);

  useEffect(() => {
    if (selectedSubject && subjectRefs.current[selectedSubject]) {
      subjectRefs.current[selectedSubject]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [selectedSubject]);

  const getPresenceHistory = (record: AttendanceRecord) => {
    const history = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    for (let i = 0; i < record.totalClasses; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      history.push({
        date: date.toLocaleDateString(),
        status: Math.random() > (record.missedClasses / record.totalClasses) ? 'present' : 'absent',
        topic: `Lecture ${i + 1}`,
        duration: '1.5 hours'
      });
    }
    return history;
  };

  const calculateProjection = (record: AttendanceRecord) => {
    const totalPossibleClasses = record.totalClasses + record.upcomingClasses;
    const projectedAttendance = (record.attendedClasses / record.totalClasses) * totalPossibleClasses;
    return Math.round((projectedAttendance / totalPossibleClasses) * 100);
  };

  const getCurrentPercentage = (record: AttendanceRecord) => {
    return Math.round((record.attendedClasses / record.totalClasses) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-500 dark:text-green-400';
    if (percentage >= 75) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getBackgroundGradient = (percentage: number) => {
    if (percentage >= 85) return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-900/30';
    if (percentage >= 75) return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-900/30';
    return 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-900/30';
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4">
            <School className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {studentName}'s Attendance Record
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Spring Semester 2024
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {attendance.map((record, index) => {
            const currentPercentage = getCurrentPercentage(record);
            const projectedPercentage = calculateProjection(record);
            const isLowAttendance = currentPercentage < 75;
            const presenceHistory = getPresenceHistory(record);

            return (
              <div
                key={index}
                ref={el => subjectRefs.current[record.subject] = el}
                className={`rounded-xl shadow-lg overflow-hidden ${getBackgroundGradient(currentPercentage)}`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        {record.type === 'theory' ? (
                          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Microscope className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                          {record.subject}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {record.type} Classes
                        </p>
                      </div>
                    </div>
                    {isLowAttendance && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Low Attendance</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                        Current Status
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">
                              {record.attendedClasses}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Attended</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">
                              {record.missedClasses}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Missed</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">
                              {record.totalClasses}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Current Attendance
                          </span>
                          <span className={`text-lg font-bold ${getStatusColor(currentPercentage)}`}>
                            {currentPercentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              currentPercentage >= 85
                                ? 'bg-green-500 dark:bg-green-400'
                                : currentPercentage >= 75
                                ? 'bg-yellow-500 dark:bg-yellow-400'
                                : 'bg-red-500 dark:bg-red-400'
                            }`}
                            style={{ width: `${currentPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                        Future Projection
                      </h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {record.upcomingClasses} classes remaining
                        </span>
                      </div>
                      <div className="relative pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Projected Attendance
                          </span>
                          <span className={`text-lg font-bold ${getStatusColor(projectedPercentage)}`}>
                            {projectedPercentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              projectedPercentage >= 85
                                ? 'bg-green-500 dark:bg-green-400'
                                : projectedPercentage >= 75
                                ? 'bg-yellow-500 dark:bg-yellow-400'
                                : 'bg-red-500 dark:bg-red-400'
                            }`}
                            style={{ width: `${projectedPercentage}%` }}
                          />
                        </div>
                        {projectedPercentage < 75 && (
                          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-300">
                              ⚠️ At this rate, you won't meet the minimum 75% attendance requirement.
                              Consider improving your attendance.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {record.lastUpdated}</span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={() => setExpandedHistory(expandedHistory === record.subject ? null : record.subject)}
                    className="w-full mt-4 px-4 py-2 bg-white/90 dark:bg-gray-800/90 rounded-lg flex items-center justify-between hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-4 h-4 text-apple-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show presence history
                      </span>
                    </div>
                    {expandedHistory === record.subject ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {expandedHistory === record.subject && (
                    <div className="mt-4 space-y-4 animate-fadeIn">
                      <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4">
                        <div className="space-y-3">
                          {presenceHistory.map((entry, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                {entry.status === 'present' ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {entry.date}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {entry.topic} • {entry.duration}
                                  </p>
                                </div>
                              </div>
                              <span className={`text-sm font-medium ${
                                entry.status === 'present'
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};