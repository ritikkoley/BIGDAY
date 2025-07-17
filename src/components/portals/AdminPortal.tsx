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
  LogOut
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const { fetchUserProfile, profile } = useDataStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);

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
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Logo />
                <span className="ml-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  Administrator Portal
                </span>
              </div>

              {/* Search Bar */}
              <div className="hidden md:block flex-1 max-w-2xl mx-4">
                <SearchBar
                  onSearch={handleSearch}
                  permissions={searchPermissions}
                  role="admin"
                />
              </div>

              {/* Navigation Tabs */}
              <div className="hidden md:flex space-x-1">
                <button
                  onClick={() => handleTabChange('overview')}
                  className={`apple-nav-button ${
                    activeTab === 'overview' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleTabChange('performance')}
                  className={`apple-nav-button ${
                    activeTab === 'performance' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Performance
                </button>
                <button
                  onClick={() => handleTabChange('departments')}
                  className={`apple-nav-button ${
                    activeTab === 'departments' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Departments
                </button>
                <button
                  onClick={() => handleTabChange('reports')}
                  className={`apple-nav-button ${
                    activeTab === 'reports' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Reports
                </button>
                <button
                  onClick={() => handleTabChange('settings')}
                  className={`apple-nav-button ${
                    activeTab === 'settings' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Settings
                </button>
              </div>

              <div className="flex items-center space-x-2 md:space-x-4">
                <ThemeToggle />
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-1.5 md:p-2 rounded-md text-apple-gray-600 dark:text-apple-gray-300 hover:text-apple-gray-900 dark:hover:text-white focus:outline-none md:hidden"
                >
                  {isMenuOpen ? (
                    <X className="block h-5 w-5 md:h-6 md:w-6" />
                  ) : (
                    <Menu className="block h-5 w-5 md:h-6 md:w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
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
                  { key: 'settings', label: 'Settings' }
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
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'performance' && <PerformanceView />}
          {activeTab === 'departments' && <DepartmentsView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-apple-gray-600/80 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20 backdrop-blur-apple">
        <div className="grid grid-cols-5 h-14">
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
            onClick={() => handleTabChange('settings')}
            className={`mobile-nav-item ${
              activeTab === 'settings'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <Settings className="mobile-nav-icon" />
            <span className="mobile-nav-text">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};