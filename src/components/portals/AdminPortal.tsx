import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore'; 

// Administrator Components
import { AdminOverview } from '../admin/AdminOverview';
import { PerformanceView } from '../admin/PerformanceView';
import { DepartmentsView } from '../admin/DepartmentsView';
import { ReportsView } from '../admin/ReportsView';
import { SettingsView } from '../admin/SettingsView';
import { HPCManagement } from '../admin/HPCManagement';
import QGenView from '../admin/QGenView';
import { SchoolFeed } from '../feed/SchoolFeed';
import { FeedManagement } from '../feed/FeedManagement';

import { SearchBar } from '../search/SearchBar';
import { ThemeToggle } from '../ThemeToggle';
import { Logo } from '../Logo';

import {
  Menu,
  X,
  LayoutDashboard,
  TrendingUp,
  School,
  FileText,
  Settings,
  Brain,
  Megaphone,
  LogOut,
  FileQuestion
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();
  const { fetchUserProfile, profile, unsubscribeAll } = useDataStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
      
      // Cleanup all subscriptions when component unmounts
      return () => {
        unsubscribeAll();
      };
    }
  }, [user, fetchUserProfile, unsubscribeAll]);

  const handleSearch = async (query: string, filters: any) => {
    console.log('Searching:', query, filters);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const searchPermissions = {
    student: ['courses'],
    teacher: ['studentId', 'courseCode'],
    admin: ['universal']
  };

  return (
    <div className="min-h-screen apple-gradient transition-colors duration-300 relative">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-apple bg-white/70 dark:bg-apple-gray-600/70 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center space-x-3">
                <Logo />
                <span className="hidden sm:inline text-xs text-apple-gray-400 dark:text-apple-gray-300">
                  Administrator Portal
                </span>
              </div>

              {/* Search Bar */}
              <div className="hidden lg:block flex-1 max-w-xl mx-3">
                <SearchBar
                  onSearch={handleSearch}
                  permissions={searchPermissions}
                  role="admin"
                />
              </div>

              {/* Navigation Tabs */}
              <div className="hidden lg:flex space-x-0.5">
                <button
                  onClick={() => handleTabChange('overview')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'overview' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleTabChange('performance')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'performance' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Performance
                </button>
                <button
                  onClick={() => handleTabChange('departments')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'departments' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Departments
                </button>
                <button
                  onClick={() => handleTabChange('reports')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'reports' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Reports
                </button>
                <button
                  onClick={() => handleTabChange('settings')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'settings' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Settings
                </button>
                <button
                  onClick={() => handleTabChange('feed')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'feed' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Feed
                </button>
                <button
                  onClick={() => handleTabChange('hpc')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'hpc' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  HPC System
                </button>
                <button
                  onClick={() => handleTabChange('qgen')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'qgen' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Q-Gen
                </button>
              </div>

              <div className="flex items-center space-x-1">
                <ThemeToggle />
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-2 py-1.5 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline text-xs">Out</span>
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-1.5 rounded-md text-apple-gray-600 dark:text-apple-gray-300 hover:text-apple-gray-900 dark:hover:text-white focus:outline-none lg:hidden"
                >
                  {isMenuOpen ? (
                    <X className="block h-4 w-4" />
                  ) : (
                    <Menu className="block h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="px-4 py-2">
                <SearchBar
                  onSearch={handleSearch}
                  permissions={searchPermissions}
                  role="admin"
                />
              </div>
              
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'performance', label: 'Performance' },
                  { key: 'departments', label: 'Departments' },
                  { key: 'reports', label: 'Reports' },
                  { key: 'settings', label: 'Settings' },
                  { key: 'feed', label: 'School Feed' },
                  { key: 'hpc', label: 'HPC System' },
                  { key: 'qgen', label: 'Q-Gen' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen pt-16">
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
          {activeTab === 'overview' && <AdminOverview onNavigate={handleTabChange} />}
          {activeTab === 'performance' && <PerformanceView />}
          {activeTab === 'departments' && <DepartmentsView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'feed' && (
            <FeedManagement userRole="admin" userName="Dr. Rajesh Kumar" />
          )}
          {activeTab === 'hpc' && <HPCManagement />}
          {activeTab === 'qgen' && <QGenView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-apple-gray-600/80 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20 backdrop-blur-apple">
        <div className="grid grid-cols-6 h-14">
          <button
            onClick={() => handleTabChange('overview')}
            className={`mobile-nav-item ${
              activeTab === 'overview'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <LayoutDashboard className="mobile-nav-icon" />
            <span className="mobile-nav-text">Overview</span>
          </button>
          <button
            onClick={() => handleTabChange('performance')}
            className={`mobile-nav-item ${
              activeTab === 'performance'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <TrendingUp className="mobile-nav-icon" />
            <span className="mobile-nav-text">Performance</span>
          </button>
          <button
            onClick={() => handleTabChange('departments')}
            className={`mobile-nav-item ${
              activeTab === 'departments'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <School className="mobile-nav-icon" />
            <span className="mobile-nav-text">Departments</span>
          </button>
          <button
            onClick={() => handleTabChange('reports')}
            className={`mobile-nav-item ${
              activeTab === 'reports'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <FileText className="mobile-nav-icon" />
            <span className="mobile-nav-text">Reports</span>
          </button>
          <button
            onClick={() => handleTabChange('qgen')}
            className={`mobile-nav-item ${
              activeTab === 'qgen'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <FileQuestion className="mobile-nav-icon" />
            <span className="mobile-nav-text">Q-Gen</span>
          </button>
          <button
            onClick={() => handleTabChange('feed')}
            className={`mobile-nav-item ${
              activeTab === 'feed'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <Megaphone className="mobile-nav-icon" />
            <span className="mobile-nav-text">Feed</span>
          </button>
        </div>
      </nav>
    </div>
  );
};