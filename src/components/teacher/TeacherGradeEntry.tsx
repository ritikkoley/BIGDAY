import React, { useState } from 'react';
import { Student } from '@/types/student';
import { Save, Search, AlertTriangle } from 'lucide-react';

interface TeacherGradeEntryProps {
  students: Student[];
  examName: string;
  maxMarks: number;
  onSave: (grades: { studentId: string; marks: number }[]) => Promise<void>;
}

export const TeacherGradeEntry: React.FC<TeacherGradeEntryProps> = ({
  students,
  examName,
  maxMarks,
  onSave
}) => {
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [marks, setMarks] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddGrade = () => {
    const student = students.find(s => s.studentId === admissionNumber);
    if (!student) {
      setError('Student not found');
      return;
    }

    const numericMarks = parseFloat(marks);
    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > maxMarks) {
      setError(`Marks must be between 0 and ${maxMarks}`);
      return;
    }

    setGrades(prev => ({
      ...prev,
      [student.id]: numericMarks
    }));
    setAdmissionNumber('');
    setMarks('');
    setError(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const gradeData = Object.entries(grades).map(([studentId, marks]) => ({
        studentId,
        marks
      }));
      
      await onSave(gradeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save grades');
    } finally {
      setIsSaving(false);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getAdmissionNumber = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.studentId : 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Grade Entry Form */}
      <div className="apple-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Admission Number
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
              <input
                type="text"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                placeholder="Enter admission number"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Marks (out of {maxMarks})
            </label>
            <input
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              min="0"
              max={maxMarks}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              placeholder={`Enter marks (0-${maxMarks})`}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddGrade}
              className="w-full px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors"
            >
              Add Grade
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center space-x-2 text-red-500 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Grades Table */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            {examName} - Grades Summary
          </h3>
          <button
            onClick={handleSave}
            disabled={isSaving || Object.keys(grades).length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Grades'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-apple-gray-200 dark:border-apple-gray-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Admission Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-200 dark:divide-apple-gray-700">
              {Object.entries(grades).map(([studentId, studentMarks]) => (
                <tr key={studentId}>
                  <td className="px-6 py-4 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                    {getAdmissionNumber(studentId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                    {getStudentName(studentId)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-apple-gray-600 dark:text-white">
                    {studentMarks} / {maxMarks}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-apple-gray-600 dark:text-white">
                    {((studentMarks / maxMarks) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              {Object.keys(grades).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-apple-gray-400 dark:text-apple-gray-300">
                    No grades entered yet. Start by entering a student's admission number and marks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};