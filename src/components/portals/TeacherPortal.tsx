import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';

// Teacher Components
import { TeacherDashboard } from '../teacher/TeacherDashboard';
import { TeacherAttendance } from '../teacher/TeacherAttendance';
import { TeacherGrading } from '../teacher/TeacherGrading';
import { TeacherResources } from '../teacher/TeacherResources';
import { TeacherMessages } from '../teacher/TeacherMessages';
import { TeacherQuizzes } from '../teacher/TeacherQuizzes';
import { TeacherProfile } from '../teacher/TeacherProfile';
import { TeacherPerformanceView } from '../performance/TeacherPerformanceView';

import { SearchBar } from '../search/SearchBar';
import { ThemeToggle } from '../ThemeToggle';
import { Logo } from '../Logo';

import {
  Menu,
  X,
  LayoutDashboard,
  UserCheck,
  MessageSquare,
  BrainCircuit,
  User,
  BookOpen,
  GraduationCap,
  TrendingUp,
  LogOut
} from 'lucide-react';

// Sample Data
import {
  sampleTeacherProfile,
  sampleDashboardData,
  sampleQuizzes,
  sampleResources,
  sampleMessageTemplates,
  sampleStudentRecords,
  sampleAttendanceSessions,
  sampleGradingSessions
} from '../../data/sampleTeacherData';

import {
  sampleTeacherPerformanceMetrics,
  samplePerformanceAnalytics
} from '../../data/sampleAdminData';

export const TeacherPortal: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      setIsLoading(true);
      // Use the sample data directly instead of fetching from Supabase
      setTeacherProfile(sampleTeacherProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teacher profile');
      console.error('Error fetching teacher profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Use real profile if available, otherwise fall back to sample data
  const displayProfile = teacherProfile || sampleTeacherProfile;

  return (
    <div className="min-h-screen apple-gradient transition-colors duration-300 relative">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-apple bg-white/70 dark:bg-apple-gray-600/70 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Logo />
                <span className="ml-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  Teacher Portal
                </span>
              </div>

              {/* Search Bar */}
              <div className="hidden md:block flex-1 max-w-2xl mx-4">
                <SearchBar
                  onSearch={handleSearch}
                  permissions={searchPermissions}
                  role="teacher"
                />
              </div>

              {/* Navigation Tabs */}
              <div className="hidden md:flex space-x-1">
                <button
                  onClick={() => handleTabChange('dashboard')}
                  className={`apple-nav-button ${
                    activeTab === 'dashboard' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Dashboard
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
                  onClick={() => handleTabChange('grading')}
                  className={`apple-nav-button ${
                    activeTab === 'grading' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Grading
                </button>
                <button
                  onClick={() => handleTabChange('resources')}
                  className={`apple-nav-button ${
                    activeTab === 'resources' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Resources
                </button>
                <button
                  onClick={() => handleTabChange('messages')}
                  className={`apple-nav-button ${
                    activeTab === 'messages' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Messages
                </button>
                <button
                  onClick={() => handleTabChange('quizzes')}
                  className={`apple-nav-button ${
                    activeTab === 'quizzes' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Quizzes
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
                  onClick={() => handleTabChange('profile')}
                  className={`apple-nav-button ${
                    activeTab === 'profile' && 'bg-apple-gray-100 dark:bg-apple-gray-600/50'
                  }`}
                >
                  Profile
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
                  role="teacher"
                />
              </div>
              
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  { key: 'dashboard', label: 'Dashboard' },
                  { key: 'attendance', label: 'Attendance' },
                  { key: 'grading', label: 'Grading' },
                  { key: 'resources', label: 'Resources' },
                  { key: 'messages', label: 'Messages' },
                  { key: 'quizzes', label: 'Quizzes' },
                  { key: 'performance', label: 'Performance' },
                  { key: 'profile', label: 'Profile' }
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
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8 pb-20 md:pb-8 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="apple-card p-6 mb-6">
              <div className="flex items-center space-x-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                <span>Error: {error}</span>
              </div>
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <TeacherDashboard
              profile={displayProfile}
              dashboardData={sampleDashboardData}
            />
          )}
          {activeTab === 'attendance' && (
            <TeacherAttendance
              profile={displayProfile}
              attendanceSessions={sampleAttendanceSessions}
              studentRecords={sampleStudentRecords}
            />
          )}
          {activeTab === 'grading' && (
            <TeacherGrading
              profile={displayProfile}
              gradingSessions={sampleGradingSessions}
              studentRecords={sampleStudentRecords}
            />
          )}
          {activeTab === 'resources' && (
            <TeacherResources
              profile={displayProfile}
              resources={sampleResources}
            />
          )}
          {activeTab === 'messages' && (
            <TeacherMessages
              profile={displayProfile}
              messageTemplates={sampleMessageTemplates}
              studentRecords={sampleStudentRecords}
            />
          )}
          {activeTab === 'quizzes' && (
            <TeacherQuizzes
              profile={displayProfile}
              quizzes={sampleQuizzes}
            />
          )}
          {activeTab === 'performance' && (
            <TeacherPerformanceView
              teacherId={displayProfile.id}
              metrics={sampleTeacherPerformanceMetrics}
              analytics={samplePerformanceAnalytics}
            />
          )}
          {activeTab === 'profile' && (
            <TeacherProfile
              profile={displayProfile}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-apple-gray-600/80 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20 backdrop-blur-apple">
        <div className="grid grid-cols-7 h-14">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`mobile-nav-item ${
              activeTab === 'dashboard'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <LayoutDashboard className="mobile-nav-icon" />
            <span className="mobile-nav-text">Dashboard</span>
          </button>
          <button
            onClick={() => handleTabChange('attendance')}
            className={`mobile-nav-item ${
              activeTab === 'attendance'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <UserCheck className="mobile-nav-icon" />
            <span className="mobile-nav-text">Attendance</span>
          </button>
          <button
            onClick={() => handleTabChange('grading')}
            className={`mobile-nav-item ${
              activeTab === 'grading'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <GraduationCap className="mobile-nav-icon" />
            <span className="mobile-nav-text">Grading</span>
          </button>
          <button
            onClick={() => handleTabChange('resources')}
            className={`mobile-nav-item ${
              activeTab === 'resources'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <BookOpen className="mobile-nav-icon" />
            <span className="mobile-nav-text">Resources</span>
          </button>
          <button
            onClick={() => handleTabChange('messages')}
            className={`mobile-nav-item ${
              activeTab === 'messages'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <MessageSquare className="mobile-nav-icon" />
            <span className="mobile-nav-text">Messages</span>
          </button>
          <button
            onClick={() => handleTabChange('quizzes')}
            className={`mobile-nav-item ${
              activeTab === 'quizzes'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <BrainCircuit className="mobile-nav-icon" />
            <span className="mobile-nav-text">Quizzes</span>
          </button>
          <button
            onClick={() => handleTabChange('profile')}
            className={`mobile-nav-item ${
              activeTab === 'profile'
                ? 'text-apple-blue-500'
                : 'text-apple-gray-400 dark:text-apple-gray-300'
            }`}
          >
            <User className="mobile-nav-icon" />
            <span className="mobile-nav-text">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};