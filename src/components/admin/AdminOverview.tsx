import React from 'react';
import { LayoutDashboard, Users, School, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';

interface AdminOverviewProps {
  onNavigate?: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const handleNavigate = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Administrator Dashboard
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              School Performance Overview
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <button
          onClick={() => handleNavigate('settings')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Total Teachers</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">156</h3>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Users className="w-8 h-8 text-apple-blue-500" />
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+12% from last year</span>
          </div>
        </button>

        <button
          onClick={() => handleNavigate('departments')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Departments</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">8</h3>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <School className="w-8 h-8 text-purple-500" />
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-apple-gray-400 dark:text-apple-gray-300">
            <span className="text-sm">All performing well</span>
          </div>
        </button>

        <button
          onClick={() => handleNavigate('performance')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Average Performance</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">87.5%</h3>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+3.2% this semester</span>
          </div>
        </button>

        <button
          onClick={() => handleNavigate('reports')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Active Issues</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">5</h3>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-yellow-500">
            <span className="text-sm">2 require attention</span>
          </div>
        </button>
      </div>

      <div className="apple-card p-6">
        <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            {
              type: 'performance',
              message: 'Computer Science department shows 15% improvement in student outcomes',
              time: '2 hours ago',
              action: 'performance'
            },
            {
              type: 'alert',
              message: 'Mathematics department requires additional resources for advanced classes',
              time: '4 hours ago',
              action: 'departments'
            },
            {
              type: 'update',
              message: 'New teaching evaluation criteria implemented successfully',
              time: '1 day ago',
              action: 'settings'
            }
          ].map((activity, index) => (
            <button
              key={index}
              onClick={() => handleNavigate(activity.action)}
              className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-left group"
            >
              <div className="flex-1">
                <p className="text-apple-gray-600 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {activity.message}
                </p>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                  {activity.time}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {activity.type === 'performance' && (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                )}
                {activity.type === 'alert' && (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
                {activity.type === 'update' && (
                  <Users className="w-5 h-5 text-apple-blue-500" />
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
