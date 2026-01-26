import React from 'react';
import { Stethoscope, Plus, AlertTriangle } from 'lucide-react';

export const InfirmaryManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Stethoscope className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Infirmary Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Health visits, medical records & parent alerts
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Log Visit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Visits Today</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">8</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Serious Cases</p>
          <p className="text-2xl font-bold text-red-500">2</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending Alerts</p>
          <p className="text-2xl font-bold text-orange-500">1</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Followups</p>
          <p className="text-2xl font-bold text-blue-500">5</p>
        </div>
      </div>

      <div className="apple-card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-600 dark:text-red-400 mb-1">Critical Alert System</h3>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">
              Auto-notify parents for serious cases. All medical data is secured and accessible only to authorized staff.
            </p>
          </div>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Infirmary Management System</p>
          <p className="text-sm mt-2">Visit logs, medical records, inventory, automatic parent notifications</p>
        </div>
      </div>
    </div>
  );
};
