import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ChevronLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  BookOpen,
  Calendar
} from 'lucide-react';
import { ProfileLink } from '../common/ProfileLink';

interface Student {
  id: string;
  name: string;
  admission_number: string;
  grade_average: number;
  attendance_percentage: number;
  last_assessment_score?: number;
  status: 'excellent' | 'good' | 'needs_attention' | 'at_risk';
  recent_trend: 'up' | 'down' | 'stable';
}

interface ClassStudentsViewProps {
  className: string;
  subject: string;
  onBack: () => void;
}

export const ClassStudentsView: React.FC<ClassStudentsViewProps> = ({
  className,
  subject,
  onBack
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const mockStudents: Student[] = [
    {
      id: 'student-1',
      name: 'Aarav Sharma',
      admission_number: 'ADM0125',
      grade_average: 92.5,
      attendance_percentage: 95,
      last_assessment_score: 89,
      status: 'excellent',
      recent_trend: 'up'
    },
    {
      id: 'student-2',
      name: 'Diya Patel',
      admission_number: 'ADM0132',
      grade_average: 88.3,
      attendance_percentage: 92,
      last_assessment_score: 91,
      status: 'excellent',
      recent_trend: 'up'
    },
    {
      id: 'student-3',
      name: 'Vivaan Kumar',
      admission_number: 'ADM0145',
      grade_average: 76.8,
      attendance_percentage: 88,
      last_assessment_score: 72,
      status: 'good',
      recent_trend: 'stable'
    },
    {
      id: 'student-4',
      name: 'Ananya Singh',
      admission_number: 'ADM0158',
      grade_average: 65.2,
      attendance_percentage: 78,
      last_assessment_score: 68,
      status: 'needs_attention',
      recent_trend: 'down'
    },
    {
      id: 'student-5',
      name: 'Arjun Mehta',
      admission_number: 'ADM0167',
      grade_average: 52.4,
      attendance_percentage: 65,
      last_assessment_score: 48,
      status: 'at_risk',
      recent_trend: 'down'
    },
    {
      id: 'student-6',
      name: 'Saanvi Reddy',
      admission_number: 'ADM0174',
      grade_average: 94.7,
      attendance_percentage: 98,
      last_assessment_score: 96,
      status: 'excellent',
      recent_trend: 'up'
    },
    {
      id: 'student-7',
      name: 'Kabir Joshi',
      admission_number: 'ADM0189',
      grade_average: 81.5,
      attendance_percentage: 90,
      last_assessment_score: 85,
      status: 'good',
      recent_trend: 'up'
    },
    {
      id: 'student-8',
      name: 'Ishita Gupta',
      admission_number: 'ADM0195',
      grade_average: 71.2,
      attendance_percentage: 82,
      last_assessment_score: 74,
      status: 'good',
      recent_trend: 'stable'
    }
  ];

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'at_risk':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const getStatusLabel = (status: Student['status']) => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'needs_attention':
        return 'Needs Attention';
      case 'at_risk':
        return 'At Risk';
    }
  };

  const getTrendIcon = (trend: Student['recent_trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <div className="w-4 h-0.5 bg-gray-400" />;
    }
  };

  const classStats = {
    total: mockStudents.length,
    excellent: mockStudents.filter(s => s.status === 'excellent').length,
    good: mockStudents.filter(s => s.status === 'good').length,
    needsAttention: mockStudents.filter(s => s.status === 'needs_attention').length,
    atRisk: mockStudents.filter(s => s.status === 'at_risk').length,
    averageGrade: (mockStudents.reduce((sum, s) => sum + s.grade_average, 0) / mockStudents.length).toFixed(1),
    averageAttendance: (mockStudents.reduce((sum, s) => sum + s.attendance_percentage, 0) / mockStudents.length).toFixed(1)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {className} - {subject}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {classStats.total} Students
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Excellent</span>
            <Award className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{classStats.excellent}</p>
        </div>

        <div className="apple-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Good</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{classStats.good}</p>
        </div>

        <div className="apple-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Needs Attention</span>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{classStats.needsAttention}</p>
        </div>

        <div className="apple-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">At Risk</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{classStats.atRisk}</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Student
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Admission No.
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Grade Average
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Attendance
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Last Assessment
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Trend
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/profile/student/${student.id}`)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <ProfileLink
                        userId={student.id}
                        userName={student.name}
                        userRole="student"
                        className="font-medium text-gray-900 dark:text-white"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {student.admission_number}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {student.grade_average.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {student.attendance_percentage}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {student.last_assessment_score && (
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.last_assessment_score}%
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      {getTrendIcon(student.recent_trend)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {getStatusLabel(student.status)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No students found</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="apple-card p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Class Average Grade
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {classStats.averageGrade}%
          </p>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${classStats.averageGrade}%` }}
            />
          </div>
        </div>

        <div className="apple-card p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Class Average Attendance
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {classStats.averageAttendance}%
          </p>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${classStats.averageAttendance}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassStudentsView;
