import React from 'react';
import { School, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const departments = [
    {
      name: 'Mathematics',
      head: 'Professor Jagdeep Singh Sokhey',
      teachers: 18,
      performance: 92,
      trend: 'up'
    },
    {
      name: 'Computer Science',
      head: 'Dr. Michael Zhang',
      teachers: 22,
      performance: 88,
      trend: 'stable'
    },
    {
      name: 'Physics',
      head: 'Dr. Emily Brown',
      teachers: 15,
      performance: 90,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <School className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Departments
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Departmental Performance Overview
            </p>
          </div>
        </div>
      </div>

      {/* Department List */}
      <div className="space-y-4">
        {departments.map((dept, index) => (
          <div key={index} className="apple-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <School className="w-8 h-8 text-apple-blue-500" />
                <div>
                  <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {dept.name}
                  </h2>
                  <p className="text-apple-gray-400 dark:text-apple-gray-300">
                    Head: {dept.head}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-apple-gray-400" />
                    <span className="text-lg font-medium text-apple-gray-600 dark:text-white">
                      {dept.teachers}
                    </span>
                  </div>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    Teachers
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-lg font-medium text-apple-gray-600 dark:text-white">
                      {dept.performance}%
                    </span>
                  </div>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    Performance
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Recent Performance
                </h3>
                <div className="flex items-center space-x-2">
                  {dept.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    {dept.trend === 'up' ? 'Improving' : 'Stable'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Student Satisfaction
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium text-apple-blue-500">4.5/5</span>
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    (92% positive)
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Resource Utilization
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium text-green-500">95%</span>
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    Efficiency
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};