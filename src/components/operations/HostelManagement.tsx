import React from 'react';
import { Home, Plus } from 'lucide-react';

export const HostelManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Home className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Hostel Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Room allocation, inventory & mess tracking
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Allocate Room</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Total Capacity</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">500</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Occupied</p>
          <p className="text-2xl font-bold text-green-500">456</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Available</p>
          <p className="text-2xl font-bold text-blue-500">44</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Occupancy Rate</p>
          <p className="text-2xl font-bold text-green-500">91.2%</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Hostel Management System</p>
          <p className="text-sm mt-2">Buildings, rooms, beds, inventory, mess records</p>
        </div>
      </div>
    </div>
  );
};
