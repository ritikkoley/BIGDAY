import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TrendingUp, Users } from 'lucide-react';
import { TeacherPerformanceView } from '../performance/TeacherPerformanceView';
import { PerformanceReport } from '../PerformanceReport';
import { sampleTeacherPerformanceMetrics, samplePerformanceAnalytics } from '../../data/sampleAdminData';
import { sampleGrades, performanceMetrics } from '../../data/sampleData';

export const PerformanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('teacher-1');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-1');
  const location = useLocation();
  
  useEffect(() => {
    // Check URL parameters for teacherId or studentId
    const params = new URLSearchParams(location.search);
    const teacherId = params.get('teacherId');
    const studentId = params.get('studentId');
    
    if (teacherId) {
      setSelectedTeacherId(teacherId);
      setActiveTab('teachers');
    } else if (studentId) {
      setSelectedStudentId(studentId);
      setActiveTab('students');
    }
  }, [location]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <TrendingUp className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Performance Overview
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Monitor and analyze performance metrics
            </p>
          </div>
        </div>
      </div>

      {/* Performance Tabs */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            activeTab === 'teachers'
              ? 'bg-apple-blue-500 text-white'
              : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Teacher Performance</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            activeTab === 'students'
              ? 'bg-apple-blue-500 text-white'
              : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Performance</span>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'teachers' ? (
          <TeacherPerformanceView
            teacherId={selectedTeacherId}
            metrics={sampleTeacherPerformanceMetrics}
            analytics={samplePerformanceAnalytics}
          />
        ) : (
          <PerformanceReport
            studentName={selectedStudentId === 'student-1' ? 'Ritik Koley' : 
                         selectedStudentId === 'student-2' ? 'Alex Johnson' : 
                         selectedStudentId === 'student-3' ? 'Sarah Williams' : 'Student'}
            metrics={performanceMetrics}
            grades={sampleGrades}
          />
        )}
      </div>
    </div>
  );
};