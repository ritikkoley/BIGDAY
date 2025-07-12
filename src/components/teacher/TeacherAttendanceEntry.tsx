import React, { useState } from 'react';
import { Student } from '@/types/student';
import { Save, Calendar, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface TeacherAttendanceEntryProps {
  students: Student[];
  date: Date;
  onSave: (attendance: { studentId: string; status: 'present' | 'absent' }[]) => Promise<void>;
}

export const TeacherAttendanceEntry: React.FC<TeacherAttendanceEntryProps> = ({
  students,
  date,
  onSave
}) => {
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));
      
      await onSave(attendanceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-apple-blue-500" />
            <div>
              <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                Attendance Entry
              </h2>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Attendance Entry Table */}
      <div className="apple-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
                <th className="px-6 py-4 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Admission Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-200/50 dark:divide-apple-gray-500/20">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                          attendance[student.id] === 'present'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-apple-gray-100 text-apple-gray-600 dark:bg-apple-gray-700/50 dark:text-apple-gray-300'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>Present</span>
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                          attendance[student.id] === 'absent'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-apple-gray-100 text-apple-gray-600 dark:bg-apple-gray-700/50 dark:text-apple-gray-300'
                        }`}
                      >
                        <X className="w-4 h-4" />
                        <span>Absent</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};