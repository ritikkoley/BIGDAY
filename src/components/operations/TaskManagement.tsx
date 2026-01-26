import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';

export const TaskManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <CheckSquare className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Task Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Assign, track, and complete institutional tasks
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending</p>
          <p className="text-2xl font-bold text-orange-500">15</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">In Progress</p>
          <p className="text-2xl font-bold text-blue-500">8</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Completed</p>
          <p className="text-2xl font-bold text-green-500">28</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Overdue</p>
          <p className="text-2xl font-bold text-red-500">3</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Task Management System</p>
          <p className="text-sm mt-2">Assign to individuals or roles, track progress with deadlines</p>
        </div>
      </div>
    </div>
  );
};
