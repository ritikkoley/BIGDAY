import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

export const LibraryManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Library Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Catalog, circulation, fines & reservations
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Total Books</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">15,000</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Checked Out</p>
          <p className="text-2xl font-bold text-blue-500">892</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Overdue</p>
          <p className="text-2xl font-bold text-red-500">45</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Reserved</p>
          <p className="text-2xl font-bold text-orange-500">23</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Library Management System</p>
          <p className="text-sm mt-2">ISBN/Barcode tracking, check-in/out, auto fines, reservations</p>
        </div>
      </div>
    </div>
  );
};
