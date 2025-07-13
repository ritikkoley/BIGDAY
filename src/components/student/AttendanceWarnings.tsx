import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, TrendingDown, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AttendanceWarning {
  course_id: string;
  course_name: string;
  total_classes: number;
  attended_classes: number;
  attendance_rate: number;
  classes_needed: number;
  is_at_risk: boolean;
}

export const AttendanceWarnings: React.FC = () => {
  const [warnings, setWarnings] = useState<AttendanceWarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceWarnings();
  }, []);

  const fetchAttendanceWarnings = async () => {
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .rpc('get_attendance_warnings', {
          stud_id: user.user.id,
          threshold: 0.75 // 75% threshold
        });

      if (error) throw error;
      setWarnings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance warnings');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (isAtRisk: boolean, rate: number) => {
    if (isAtRisk) return 'text-red-500 dark:text-red-400';
    if (rate < 0.85) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  const getStatusIcon = (isAtRisk: boolean, rate: number) => {
    if (isAtRisk) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (rate < 0.85) return <TrendingDown className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusMessage = (warning: AttendanceWarning) => {
    if (warning.is_at_risk) {
      return `Need ${warning.classes_needed} more classes to reach 75%`;
    }
    if (warning.attendance_rate < 0.85) {
      return 'Attendance could be improved';
    }
    return 'Good attendance record';
  };

  if (isLoading) {
    return (
      <div className="apple-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
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
          <span>Error loading attendance warnings: {error}</span>
        </div>
      </div>
    );
  }

  const atRiskCourses = warnings.filter(w => w.is_at_risk);
  const warningCourses = warnings.filter(w => !w.is_at_risk && w.attendance_rate < 0.85);
  const goodCourses = warnings.filter(w => !w.is_at_risk && w.attendance_rate >= 0.85);

  return (
    <div className="apple-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-6 h-6 text-apple-blue-500" />
        <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
          Attendance Overview
        </h2>
      </div>

      <div className="space-y-6">
        {/* At Risk Courses */}
        {atRiskCourses.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Requires Immediate Attention</span>
            </h3>
            <div className="space-y-3">
              {atRiskCourses.map((warning) => (
                <div
                  key={warning.course_id}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(warning.is_at_risk, warning.attendance_rate)}
                      <div>
                        <h4 className="font-medium text-apple-gray-600 dark:text-white">
                          {warning.course_name}
                        </h4>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {getStatusMessage(warning)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {(warning.attendance_rate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {warning.attended_classes}/{warning.total_classes} classes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Courses */}
        {warningCourses.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-yellow-600 dark:text-yellow-400 mb-4 flex items-center space-x-2">
              <TrendingDown className="w-5 h-5" />
              <span>Needs Improvement</span>
            </h3>
            <div className="space-y-3">
              {warningCourses.map((warning) => (
                <div
                  key={warning.course_id}
                  className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(warning.is_at_risk, warning.attendance_rate)}
                      <div>
                        <h4 className="font-medium text-apple-gray-600 dark:text-white">
                          {warning.course_name}
                        </h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          {getStatusMessage(warning)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {(warning.attendance_rate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {warning.attended_classes}/{warning.total_classes} classes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Good Courses */}
        {goodCourses.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-green-600 dark:text-green-400 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Good Standing</span>
            </h3>
            <div className="space-y-3">
              {goodCourses.map((warning) => (
                <div
                  key={warning.course_id}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(warning.is_at_risk, warning.attendance_rate)}
                      <div>
                        <h4 className="font-medium text-apple-gray-600 dark:text-white">
                          {warning.course_name}
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {getStatusMessage(warning)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {(warning.attendance_rate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {warning.attended_classes}/{warning.total_classes} classes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {warnings.length === 0 && (
          <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No attendance data available</p>
          </div>
        )}
      </div>
    </div>
  );
};