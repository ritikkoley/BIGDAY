import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { SearchBar } from '../search/SearchBar';
import { ThemeToggle } from '../ThemeToggle';
import { Logo } from '../Logo';

// Operations Components (to be created)
import { OperationsDashboard } from '../operations/OperationsDashboard';
import { LeadManagement } from '../operations/LeadManagement';
import { FeeManagement } from '../operations/FeeManagement';
import { SalaryManagement } from '../operations/SalaryManagement';
import { SubstitutionManagement } from '../operations/SubstitutionManagement';
import { TaskManagement } from '../operations/TaskManagement';
import { LibraryManagement } from '../operations/LibraryManagement';
import { HostelManagement } from '../operations/HostelManagement';
import { InfirmaryManagement } from '../operations/InfirmaryManagement';

import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  DollarSign,
  Wallet,
  UserCheck,
  CheckSquare,
  BookOpen,
  Home,
  Stethoscope,
  LogOut
} from 'lucide-react';

export const OperationsPortal: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    student: ['universal'],
    teacher: ['universal'],
    admin: ['universal']
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'salary', label: 'Payroll', icon: Wallet },
    { id: 'substitution', label: 'Substitution', icon: UserCheck },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'hostel', label: 'Hostel', icon: Home },
    { id: 'infirmary', label: 'Infirmary', icon: Stethoscope }
  ];

  return (
    <div className="min-h-screen apple-gradient transition-colors duration-300 relative">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-apple bg-white/70 dark:bg-apple-gray-600/70 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center space-x-3">
                <Logo />
                <span className="hidden sm:inline text-xs text-apple-gray-400 dark:text-apple-gray-300">
                  Operations Portal
                </span>
              </div>

              {/* Search Bar */}
              <div className="hidden lg:block flex-1 max-w-xl mx-3">
                <SearchBar
                  onSearch={handleSearch}
                  permissions={searchPermissions}
                  role="operations"
                />
              </div>

              {/* Desktop Navigation Tabs */}
              <div className="hidden lg:flex space-x-0.5">
                {tabs.slice(0, 6).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      activeTab === tab.id && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                    } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                  >
                    {tab.label}
                  </button>
                ))}

                {/* More Menu for additional tabs */}
                <div className="relative group">
                  <button
                    className="px-2 py-1.5 text-xs font-medium rounded-md transition-colors text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50"
                  >
                    More
                  </button>
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-apple-gray-600 rounded-lg shadow-lg border border-apple-gray-200 dark:border-apple-gray-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {tabs.slice(6).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className="w-full px-4 py-2 text-sm text-left text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700 flex items-center space-x-2"
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Icons */}
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <button
                  onClick={handleSignOut}
                  className="p-2 text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50 rounded-lg transition-colors"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-apple-gray-600/95 backdrop-blur-apple border-b border-apple-gray-200 dark:border-apple-gray-500 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-apple-blue-500 text-white'
                      : 'text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16 pb-6 px-4 max-w-7xl mx-auto">
        <div className="mt-2">
          {activeTab === 'dashboard' && <OperationsDashboard onNavigate={handleTabChange} />}
          {activeTab === 'leads' && <LeadManagement />}
          {activeTab === 'fees' && <FeeManagement />}
          {activeTab === 'salary' && <SalaryManagement />}
          {activeTab === 'substitution' && <SubstitutionManagement />}
          {activeTab === 'tasks' && <TaskManagement />}
          {activeTab === 'library' && <LibraryManagement />}
          {activeTab === 'hostel' && <HostelManagement />}
          {activeTab === 'infirmary' && <InfirmaryManagement />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-apple-gray-600/95 backdrop-blur-apple border-t border-apple-gray-200 dark:border-apple-gray-500 safe-area-pb">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {tabs.slice(0, 5).map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-apple-blue-500'
                  : 'text-apple-gray-400 dark:text-apple-gray-400'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
