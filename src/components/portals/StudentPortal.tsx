import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';

// Student Components 
import { Home } from '../student/Home';
import { StudentProgress } from '../student/StudentProgress';
import { StudyVault } from '../StudyVault';
import { GradesView } from '../GradesView';
import { AttendanceView } from '../AttendanceView';
import { Performance } from '../student/Performance';
import { HPCSelfAssessment } from '../student/HPCSelfAssessment';
import { SchoolFeed } from '../feed/SchoolFeed';
import { FloatingIcons } from '../FloatingIcons';
import { SearchBar } from '../search/SearchBar';
import { ThemeToggle } from '../ThemeToggle';
import { Logo } from '../Logo';

import { 
  Menu, 
  X, 
  Home as HomeIcon, 
  TrendingUp, 
  GraduationCap, 
  Calendar, 
  Activity, 
  BookOpen,
  Brain,
  Megaphone,
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
  const { 
    fetchUserProfile, 
    profile, 
    fetchCourses, 
    courses, 
    unsubscribeAll 
  } = useDataStore();
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
      fetchCourses(user.id, 'student');
      
      // Cleanup all subscriptions when component unmounts
      return () => {
        unsubscribeAll();
      };
    }
  }, [user, fetchUserProfile, fetchCourses, unsubscribeAll]);

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
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center space-x-3">
                <Logo />
                <span className="hidden sm:inline text-xs text-apple-gray-400 dark:text-apple-gray-300">
                  Student Portal
                </span>
              </div>

              {/* Search Bar */}
              <div className="hidden lg:block flex-1 max-w-xl mx-3">
                <SearchBar
                  onSearch={handleSearch}
                  permissions={searchPermissions}
                  role="student"
                />
              </div>

              {/* Navigation Tabs */}
              <div className="hidden lg:flex space-x-0.5">
                <button
                  onClick={() => handleTabChange('home')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'home' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Home
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
                  onClick={() => handleTabChange('progress')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'progress' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Progress
                </button>
                <button
                  onClick={() => handleTabChange('study-vault')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'study-vault' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Study
                </button>
                <button
                  onClick={() => handleTabChange('grades')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'grades' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Grades
                </button>
                <button
                  onClick={() => handleTabChange('attendance')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'attendance' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  Attendance
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
                  onClick={() => handleTabChange('hpc')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'hpc' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  } text-apple-gray-500 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600/50`}
                >
                  HPC
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
                  onClick={() => handleTabChange('feed')}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                >
                  Feed
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
                <button
                  onClick={() => handleTabChange('hpc')}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-apple-gray-700 dark:text-apple-gray-200 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600"
                >
                  HPC
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen pt-16">
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
          {activeTab === 'home' && (
            <Home />
          )}
          {activeTab === 'feed' && (
            <SchoolFeed userRole="student" showManagement={false} />
          )}
          {activeTab === 'progress' && (
            <StudentProgress />
          )}
          {activeTab === 'study-vault' && (
            <StudyVault
              studentName={profile?.name || "Student"}
              data={sampleStudyVaultData}
              onUploadAssignment={async () => {}}
              onDownloadMaterial={async () => {}}
            />
          )}
          {activeTab === 'grades' && (
            <GradesView
              studentName={profile?.name || "Student"}
              grades={sampleGrades}
              selectedSubject={selectedSubject}
            />
          )}
          {activeTab === 'attendance' && (
            <AttendanceView
              studentName={profile?.name || "Student"}
              attendance={sampleAttendance} 
              selectedSubject={selectedSubject}
            />
          )}
          {activeTab === 'performance' && (
            <Performance />
          )}
          {activeTab === 'hpc' && (
            <HPCSelfAssessment />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-apple-gray-600/80 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20 backdrop-blur-apple">
        <div className="grid grid-cols-7 h-14">
          <button
            onClick={() => handleTabChange('home')}
            className={`mobile-nav-item ${
              activeTab === 'home'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <HomeIcon className="mobile-nav-icon" />
            <span className="mobile-nav-text">Home</span>
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
          <button
            onClick={() => handleTabChange('hpc')}
            className={`mobile-nav-item ${
              activeTab === 'hpc'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <Brain className="mobile-nav-icon" />
            <span className="mobile-nav-text">HPC</span>
          </button>
        </div>
      </nav>
    </div>
  );
};