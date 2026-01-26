import React from 'react';
import { UserCheck, Plus, Calendar } from 'lucide-react';

export const SubstitutionManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Teacher Substitution
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Smart allocation for absent teachers
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Mark Absence</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Absences Today</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">5</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Substitutes Assigned</p>
          <p className="text-2xl font-bold text-green-500">5</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending Assignment</p>
          <p className="text-2xl font-bold text-orange-500">0</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Teacher Substitution System</p>
          <p className="text-sm mt-2">Auto-suggest substitutes based on free periods</p>
        </div>
      </div>
    </div>
  );
};
