import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { AlertTriangle, Calendar, CheckCircle2, Clock, School, XCircle, BookOpen } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  course_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

interface CourseAttendance {
  course_id: string;
  course_name: string;
  total_classes: number;
  attended_classes: number;
  missed_classes: number;
  attendance_rate: number;
  upcoming_classes: number;
  projected_rate: number;
  is_at_risk: boolean;
  classes_needed: number;
}

export const Attendance: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchCourses, courses, fetchAttendance, attendance } = useDataStore();
  const [attendanceData, setAttendanceData] = useState<CourseAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCourses(user.id, 'student');
      fetchAttendance(user.id);
    }
  }, [user, fetchCourses]);

  useEffect(() => {
    if (courses.length > 0 && attendance.length > 0) {
      processAttendanceData();
    }
  }, [courses, attendance]);

  const processAttendanceData = async () => {
    try {
      setIsLoading(true);
      
      // Process attendance data for each course
      const attendanceResults = courses.map(course => {
        // Filter attendance records for this course
        const courseAttendance = attendance.filter(record => record.course_id === course.id);
        
        // Calculate attendance statistics
        const totalClasses = courseAttendance.length || 0;
        const attendedClasses = courseAttendance.filter(r => 
          r.status === 'present' || r.status === 'late'
        ).length || 0;
        const missedClasses = totalClasses - attendedClasses;
        const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
        
        // Estimate upcoming classes (assume 2 per week for 15 weeks = 30 per semester)
        const upcomingClasses = 30 - totalClasses;
        
        // Project future attendance (assume 90% attendance for remaining classes)
        const projectedAttended = attendedClasses + (upcomingClasses * 0.9);
        const projectedTotal = totalClasses + upcomingClasses;
        const projectedRate = projectedTotal > 0 ? (projectedAttended / projectedTotal) * 100 : 0;
        
        // Check if at risk (below 75% attendance)
        const isAtRisk = projectedRate < 75;
        
        // Calculate classes needed to reach 75%
        const classesNeeded = isAtRisk 
          ? Math.ceil((0.75 * projectedTotal - attendedClasses) / 0.9)
          : 0;
        
        const result: CourseAttendance = {
          course_id: course.id,
          course_name: course.name,
          total_classes: totalClasses,
          attended_classes: attendedClasses,
          missed_classes: missedClasses,
          attendance_rate: attendanceRate,
          upcoming_classes: upcomingClasses,
          projected_rate: projectedRate,
          is_at_risk: isAtRisk,
          classes_needed: classesNeeded
        };
        return result;
      });
      
      // Set the processed attendance data
      setAttendanceData(attendanceResults);
      
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apple-card p-6">
        <div className="flex items-center space-x-2 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <School className="w-12 h-12 text-apple-blue-500" />
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Attendance Record
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Track your class attendance
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {attendanceData.map((record) => {
          const currentPercentage = record.attendance_rate;
          const projectedPercentage = record.projected_rate;

          return (
            <div
              key={record.course_id}
              className={`rounded-xl shadow-lg overflow-hidden ${getBackgroundGradient(currentPercentage)}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <BookOpen className="w-6 h-6 text-apple-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {record.course_name}
                      </h2>
                    </div>
                  </div>
                  {record.is_at_risk && (
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
                            {record.attended_classes}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Attended</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                          <span className="text-2xl font-bold text-gray-800 dark:text-white">
                            {record.missed_classes}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Missed</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                          <span className="text-2xl font-bold text-gray-800 dark:text-white">
                            {record.total_classes}
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
                          {currentPercentage.toFixed(1)}%
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
                        {record.upcoming_classes} classes remaining
                      </span>
                    </div>
                    <div className="relative pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Projected Attendance
                        </span>
                        <span className={`text-lg font-bold ${getStatusColor(projectedPercentage)}`}>
                          {projectedPercentage.toFixed(1)}%
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
                      {record.is_at_risk && (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            ⚠️ At this rate, you won't meet the minimum 75% attendance requirement.
                            You need to attend at least {record.classes_needed} more classes than projected.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {attendanceData.length === 0 && (
          <div className="apple-card p-6 text-center">
            <School className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
              No Attendance Records
            </h3>
            <p className="text-apple-gray-400 dark:text-apple-gray-300">
              Your attendance records will appear here once classes begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;