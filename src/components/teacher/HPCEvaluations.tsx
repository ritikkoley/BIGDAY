import React, { useState, useEffect } from 'react';
import { Brain, Users, Star, FileText, Upload, CheckCircle2, Clock } from 'lucide-react';

export const HPCEvaluations: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [activeParameter, setActiveParameter] = useState<string | null>(null);
  const [evaluationProgress, setEvaluationProgress] = useState({
    completed: 8,
    total: 15,
    pending: 7
  });

  const demoStudents = [
    { id: '1', name: 'Aarav Sharma', grade: '5-A', progress: 4, total: 6 },
    { id: '2', name: 'Saanvi Patel', grade: '8-B', progress: 6, total: 6 },
    { id: '3', name: 'Arjun Verma', grade: '10-A', progress: 2, total: 6 }
  ];

  const demoParameters = [
    { id: '1', name: 'Mathematics', category: 'Scholastic', completed: true },
    { id: '2', name: 'Creativity & Innovation', category: 'Co-Scholastic', completed: false },
    { id: '3', name: 'Teamwork', category: 'Life Skills', completed: true },
    { id: '4', name: 'Empathy', category: 'Life Skills', completed: false },
    { id: '5', name: 'Physical Fitness', category: 'Co-Scholastic', completed: false },
    { id: '6', name: 'Discipline', category: 'Discipline', completed: true }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <Brain className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              HPC Evaluations
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Evaluate students across multiple dimensions
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Evaluation Progress
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              {evaluationProgress.completed} of {evaluationProgress.total} completed
            </div>
            <div className="w-32 h-2 bg-apple-gray-200 dark:bg-apple-gray-600 rounded-full">
              <div 
                className="h-full bg-apple-blue-500 rounded-full transition-all"
                style={{ width: `${(evaluationProgress.completed / evaluationProgress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Selection and Evaluation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="apple-card p-6">
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
            My Students
          </h3>
          <div className="space-y-3">
            {demoStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student.id)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedStudent === student.id
                    ? 'bg-apple-blue-50 dark:bg-apple-blue-900/20 border border-apple-blue-200 dark:border-apple-blue-800'
                    : 'bg-white dark:bg-gray-800 hover:bg-apple-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-apple-gray-600 dark:text-white">
                      {student.name}
                    </h4>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      {student.grade}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-apple-blue-500">
                      {student.progress}/{student.total}
                    </div>
                    <div className="w-16 h-1 bg-apple-gray-200 dark:bg-apple-gray-600 rounded-full mt-1">
                      <div 
                        className="h-full bg-apple-blue-500 rounded-full"
                        style={{ width: `${(student.progress / student.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Parameter List */}
        <div className="apple-card p-6">
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
            Evaluation Parameters
          </h3>
          <div className="space-y-3">
            {demoParameters.map((parameter) => (
              <button
                key={parameter.id}
                onClick={() => setActiveParameter(parameter.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeParameter === parameter.id
                    ? 'bg-apple-blue-50 dark:bg-apple-blue-900/20'
                    : 'bg-white dark:bg-gray-800 hover:bg-apple-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-apple-gray-600 dark:text-white">
                      {parameter.name}
                    </h4>
                    <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                      {parameter.category}
                    </p>
                  </div>
                  {parameter.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Evaluation Form */}
        <div className="apple-card p-6">
          {selectedStudent && activeParameter ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                  Evaluate: {demoParameters.find(p => p.id === activeParameter)?.name}
                </h3>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  Student: {demoStudents.find(s => s.id === selectedStudent)?.name}
                </p>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Performance Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="ml-4 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                    4.2/5 (Grade A)
                  </span>
                </div>
              </div>

              {/* Qualitative Remark */}
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Qualitative Remark
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
                  placeholder="Provide specific observations and examples..."
                />
                <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                  0/300 characters
                </div>
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Supporting Evidence
                </label>
                <div className="border-2 border-dashed border-apple-gray-300 dark:border-apple-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-apple-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                    Upload photos, documents, or other evidence
                  </p>
                  <button className="mt-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors">
                    Choose Files
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button className="flex-1 px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors">
                  Save Draft
                </button>
                <button className="flex-1 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors">
                  Submit Evaluation
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                Select Student & Parameter
              </h3>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                Choose a student and parameter to begin evaluation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};