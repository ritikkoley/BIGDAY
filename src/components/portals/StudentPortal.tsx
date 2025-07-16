import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// Student Components
import { HomePage } from '../HomePage'; 
import { ProgressDashboard } from '../ProgressDashboard';
import GradesView from '../GradesView';
import { AttendanceView } from '../AttendanceView';
import { PerformanceReport } from '../PerformanceReport';
import { StudyVault } from '../StudyVault';
import { StudentProgress } from '../student/StudentProgress';
import { StudentMessages } from '../student/StudentMessages';
import { StudentTimetable } from '../student/StudentTimetable';
import { FloatingIcons } from '../FloatingIcons';
import { SearchBar } from '../search/SearchBar';
import { ThemeToggle } from '../ThemeToggle';
import { Logo } from '../Logo';

import { 
  Menu, 
  X, 
  Home, 
  TrendingUp, 
  GraduationCap, 
  Calendar, 
  Activity, 
  BookOpen,
  LogOut
} from 'lucide-react';

// Sample Data Imports
import { 
  sampleGrades, 
  sampleAttendance, 
  sampleSubjects, 
  sampleHomeData, 
  sampleStudyVaultData,
  performanceMetrics 
} from '../../data/sampleData';

export const StudentPortal: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (query: string, filters: any) => {
    console.log('Searching:', query, filters);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    setSelectedSubject(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewGrades = (subject: string) => {
    setSelectedSubject(subject);
    setActiveTab('grades');
  };

  const handleViewAttendance = (subject: string) => {
    setSelectedSubject(subject);
    setActiveTab('attendance');
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
      <FloatingIcons scrollY={scrollY} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-black/20 dark:to-transparent pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-apple bg-white/70 dark:bg-apple-gray-600/70 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Logo />
                <span className="ml-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  Student Portal
                </span>
              </div>

              {/* Search Bar */}
              <div className="hidden md:block flex-1 max-w-2xl mx-4">
                <SearchBar
                  onSearch={handleSearch}
                  permissions={searchPermissions}
                  role="student"
                />
              </div>

              {/* Navigation Tabs */}
              <div className="hidden md:flex space-x-1">
                <button
                  onClick={() => handleTabChange('home')}
                  className={`apple-nav-button ${
                    activeTab === 'home' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleTabChange('progress')}
                  className={`apple-nav-button ${
                    activeTab === 'progress' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Progress
                </button>
                <button
                  onClick={() => handleTabChange('study-vault')}
                  className={`apple-nav-button ${
                    activeTab === 'study-vault' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Study Vault
                </button>
                <button
                  onClick={() => handleTabChange('grades')}
                  className={`apple-nav-button ${
                    activeTab === 'grades' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Grades
                </button>
                <button
                  onClick={() => handleTabChange('attendance')}
                  className={`apple-nav-button ${
                    activeTab === 'attendance' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Attendance
                </button>
                <button
                  onClick={() => handleTabChange('performance')}
                  className={`apple-nav-button ${
                    activeTab === 'performance' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Performance
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
                  role="student"
                />
              </div>
              
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => handleTabChange('home')}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                >
                  Home
                </button>
                <button
                  onClick={() => handleTabChange('progress')}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                >
                  Progress
                </button>
                <button
                  onClick={() => handleTabChange('study-vault')}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                >
                  Study Vault
                </button>
                <button
                  onClick={() => handleTabChange('grades')}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                >
                  Grades
                </button>
                <button
                  onClick={() => handleTabChange('attendance')}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                >
                  Attendance
                </button>
                <button
                  onClick={() => handleTabChange('performance')}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                >
                  Performance
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen pt-16">
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
          {activeTab === 'home' && (
            <HomePage
              studentName="Ritik Koley"
              onViewGrades={handleViewGrades}
              onViewAttendance={handleViewAttendance}
            />
          )}
          {activeTab === 'progress' && (
            <StudentProgress />
          )}
          {activeTab === 'study-vault' && (
            <StudyVault
              studentName="Ritik Koley"
              data={sampleStudyVaultData}
              onUploadAssignment={async () => {}}
              onDownloadMaterial={async () => {}}
            />
          )}
          {activeTab === 'grades' && (
            <GradesView
              studentName="Ritik Koley"
              grades={sampleGrades}
              selectedSubject={selectedSubject}
            />
          )}
          {activeTab === 'attendance' && (
            <AttendanceView
              studentName="Ritik Koley"
              attendance={sampleAttendance}
              selectedSubject={selectedSubject}
            />
          )}
          {activeTab === 'performance' && (
            <StudentMessages />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-apple-gray-600/80 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20 backdrop-blur-apple">
        <div className="grid grid-cols-6 h-14">
          <button
            onClick={() => handleTabChange('home')}
            className={`mobile-nav-item ${
              activeTab === 'home'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <Home className="mobile-nav-icon" />
            <span className="mobile-nav-text">Home</span>
          </button>
          <button
            onClick={() => handleTabChange('progress')}
            className={`mobile-nav-item ${
              activeTab === 'progress'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <TrendingUp className="mobile-nav-icon" />
            <span className="mobile-nav-text">Progress</span>
          </button>
          <button
            onClick={() => handleTabChange('study-vault')}
            className={`mobile-nav-item ${
              activeTab === 'study-vault'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <BookOpen className="mobile-nav-icon" />
            <span className="mobile-nav-text">Study</span>
          </button>
          <button
            onClick={() => handleTabChange('grades')}
            className={`mobile-nav-item ${
              activeTab === 'grades'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <GraduationCap className="mobile-nav-icon" />
            <span className="mobile-nav-text">Grades</span>
          </button>
          <button
            onClick={() => handleTabChange('attendance')}
            className={`mobile-nav-item ${
              activeTab === 'attendance'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <Calendar className="mobile-nav-icon" />
            <span className="mobile-nav-text">Present</span>
          </button>
          <button
            onClick={() => handleTabChange('performance')}
            className={`mobile-nav-item ${
              activeTab === 'performance'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <Activity className="mobile-nav-icon" />
            <span className="mobile-nav-text">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
};