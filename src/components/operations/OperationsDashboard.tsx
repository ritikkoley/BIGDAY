import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Home,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

interface OperationsDashboardProps {
  onNavigate?: (tab: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    leads: {
      total: 45,
      this_month: 12,
      conversion_rate: 65
    },
    fees: {
      total_pending: 2500000,
      total_collected_this_month: 4800000,
      defaulters_count: 23
    },
    tasks: {
      pending: 15,
      overdue: 3,
      completed_this_week: 28
    },
    library: {
      total_books: 15000,
      checked_out: 892,
      overdue: 45
    },
    hostel: {
      total_capacity: 500,
      occupied: 456,
      occupancy_rate: 91.2
    },
    infirmary: {
      visits_today: 8,
      serious_cases: 2,
      pending_alerts: 1
    }
  });

  const handleNavigate = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Operations Dashboard
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Comprehensive operations & systems management overview
            </p>
          </div>
        </div>
      </div>

      {/* Lead Management Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => handleNavigate('leads')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Total Active Leads</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">
                {stats.leads.total}
              </h3>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Users className="w-8 h-8 text-apple-blue-500" />
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">{stats.leads.this_month} new this month</span>
          </div>
        </button>

        <button
          onClick={() => handleNavigate('leads')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">
                {stats.leads.conversion_rate}%
              </h3>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4 text-apple-gray-400 dark:text-apple-gray-300">
            <span className="text-sm">Inquiry to admission pipeline</span>
          </div>
        </button>

        <button
          onClick={() => handleNavigate('fees')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Fee Defaulters</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">
                {stats.fees.defaulters_count}
              </h3>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4 text-apple-gray-400 dark:text-apple-gray-300">
            <span className="text-sm">Requires immediate attention</span>
          </div>
        </button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => handleNavigate('fees')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">Fee Collection</h3>
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">Collected This Month</p>
              <p className="text-xl font-bold text-green-500">
                {formatCurrency(stats.fees.total_collected_this_month)}
              </p>
            </div>
            <div>
              <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">Pending Collection</p>
              <p className="text-xl font-bold text-orange-500">
                {formatCurrency(stats.fees.total_pending)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => handleNavigate('tasks')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">Task Overview</h3>
            <CheckCircle2 className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">Pending</p>
              <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">
                {stats.tasks.pending}
              </p>
            </div>
            <div>
              <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">Overdue</p>
              <p className="text-2xl font-bold text-red-500">{stats.tasks.overdue}</p>
            </div>
            <div>
              <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">Done</p>
              <p className="text-2xl font-bold text-green-500">{stats.tasks.completed_this_week}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </button>
      </div>

      {/* Facility Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => handleNavigate('library')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
          </div>
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">Library</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Total Books</span>
              <span className="font-medium text-apple-gray-600 dark:text-white">
                {stats.library.total_books.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Checked Out</span>
              <span className="font-medium text-apple-gray-600 dark:text-white">
                {stats.library.checked_out}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Overdue</span>
              <span className="font-medium text-red-500">{stats.library.overdue}</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleNavigate('hostel')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Home className="w-8 h-8 text-blue-500" />
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">Hostel</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Capacity</span>
              <span className="font-medium text-apple-gray-600 dark:text-white">
                {stats.hostel.total_capacity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Occupied</span>
              <span className="font-medium text-apple-gray-600 dark:text-white">
                {stats.hostel.occupied}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Occupancy</span>
              <span className="font-medium text-green-500">{stats.hostel.occupancy_rate}%</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleNavigate('infirmary')}
          className="apple-card p-6 text-left hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Stethoscope className="w-8 h-8 text-red-500" />
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          </div>
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">Infirmary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Visits Today</span>
              <span className="font-medium text-apple-gray-600 dark:text-white">
                {stats.infirmary.visits_today}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Serious Cases</span>
              <span className="font-medium text-red-500">{stats.infirmary.serious_cases}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray-400 dark:text-apple-gray-300">Pending Alerts</span>
              <span className="font-medium text-orange-500">{stats.infirmary.pending_alerts}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="apple-card p-6">
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleNavigate('leads')}
            className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600 transition-colors text-center"
          >
            <Users className="w-6 h-6 text-apple-blue-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-apple-gray-600 dark:text-white">Add Lead</p>
          </button>
          <button
            onClick={() => handleNavigate('fees')}
            className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600 transition-colors text-center"
          >
            <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-apple-gray-600 dark:text-white">Record Payment</p>
          </button>
          <button
            onClick={() => handleNavigate('tasks')}
            className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600 transition-colors text-center"
          >
            <CheckCircle2 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-apple-gray-600 dark:text-white">Create Task</p>
          </button>
          <button
            onClick={() => handleNavigate('library')}
            className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600 transition-colors text-center"
          >
            <BookOpen className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-apple-gray-600 dark:text-white">Issue Book</p>
          </button>
        </div>
      </div>
    </div>
  );
};
