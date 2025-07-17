import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { TeacherProfile, StudentRecord, AttendanceSession } from '../../types/teacher';
import { UserCheck, Users, Clock, Calendar, CheckCircle2, XCircle, AlertTriangle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { TeacherAttendanceEntry } from './TeacherAttendanceEntry';

interface TeacherAttendanceProps {
  profile: TeacherProfile;
  attendanceSessions: AttendanceSession[];
  studentRecords: StudentRecord[];
}

export const TeacherAttendance: React.FC<TeacherAttendanceProps> = ({
  profile,
  attendanceSessions,
  studentRecords
}) => {
  const { user } = useAuthStore();
  const { fetchAttendance, attendance } = useDataStore();
  const [selectedSubject, setSelectedSubject] = useState(profile.subjects[0]?.id);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [showAttendanceEntry, setShowAttendanceEntry] = useState(false);
  const [realAttendanceSessions, setRealAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [realStudentRecords, setRealStudentRecords] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSubject) {
      fetchAttendanceSessions(selectedSubject);
      fetchStudentRecords(selectedSubject);
      if (user) fetchAttendance(user.id, selectedSubject);
    }
  }, [selectedSubject]);

  const fetchAttendanceSessions = async (subjectId: string) => {
    try {
      setIsLoading(true);
      // Use the sample data directly instead of fetching from Supabase
      setRealAttendanceSessions(attendanceSessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance sessions');
      console.error('Error fetching attendance sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentRecords = async (subjectId: string) => {
    try {
      // Use the sample data directly instead of fetching from Supabase
      setRealStudentRecords(studentRecords);
    } catch (err) {
      console.error('Error fetching student records:', err);
    }
  };

  const handleSaveAttendance = async (attendance: { studentId: string; status: 'present' | 'absent' }[]) => {
    try {
      setIsLoading(true);
      // Mock saving attendance
      console.log('Saving attendance:', attendance);
      
      // Refresh attendance sessions
      fetchAttendanceSessions(selectedSubject);
      setShowAttendanceEntry(false);
    } catch (err) {
      console.error('Error saving attendance:', err);
      setError(err instanceof Error ? err.message : 'Failed to save attendance');
    } finally {
      setIsLoading(false);
    }
  };

  const getAttendanceRate = (session: AttendanceSession) => {
    return (session.presentStudents / session.totalStudents) * 100;
  };

  const getStatusColor = (status: 'present' | 'absent' | 'late') => {
    const colors = {
      present: 'text-green-500 dark:text-green-400',
      absent: 'text-red-500 dark:text-red-400',
      late: 'text-yellow-500 dark:text-yellow-400'
    };
    return colors[status];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <UserCheck className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Attendance Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Track and manage student attendance
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAttendanceEntry(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Take Attendance</span>
          </button>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="apple-card p-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {profile.subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedSubject === subject.id
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {showAttendanceEntry ? (
        <TeacherAttendanceEntry
          students={realStudentRecords.length > 0 ? realStudentRecords : studentRecords}
          date={new Date()}
          onSave={handleSaveAttendance}
        />
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 lg:col-span-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue-500"></div>
            </div>
          )}
          
          <div className="lg:col-span-1 space-y-4">
            {(realAttendanceSessions.length > 0 ? realAttendanceSessions : attendanceSessions).map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`w-full text-left apple-card p-4 transition-all ${
                  selectedSession?.id === session.id
                    ? 'ring-2 ring-apple-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-apple-blue-500" />
                    <span className="font-medium text-apple-gray-600 dark:text-white">
                      {format(new Date(session.date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{session.startTime} - {session.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{session.presentStudents}/{session.totalStudents}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-apple-blue-500 rounded-full transition-all"
                      style={{ width: `${getAttendanceRate(session)}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Session Details */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="apple-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    Session Details
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Attendance Rate:
                    </span>
                    <span className="text-lg font-medium text-apple-blue-500">
                      {getAttendanceRate(selectedSession).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Student List */}
                <div className="space-y-4">
                  {selectedSession.records.map((record) => (
                    <div
                      key={record.studentId}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {record.status === 'present' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        {record.status === 'absent' && <XCircle className="w-5 h-5 text-red-500" />}
                        {record.status === 'late' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                        <div>
                          <p className="font-medium text-apple-gray-600 dark:text-white">
                            {record.studentName}
                          </p>
                          {record.timestamp && (
                            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                              {format(new Date(record.timestamp), 'hh:mm a')}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        getStatusColor(record.status)
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="apple-card p-6 text-center">
                <UserCheck className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                  No Session Selected
                </h3>
                <p className="text-apple-gray-400 dark:text-apple-gray-300">
                  Select a session from the list to view attendance details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="apple-card p-6 mt-6">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  );
};