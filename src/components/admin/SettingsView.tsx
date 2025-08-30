import React, { useState } from 'react';
import { Settings, Bell, Shield, Users, Mail, Calendar, BookOpen, Clock } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { CoursesManagement } from './CoursesManagement';
import { GroupsManagement } from './GroupsManagement';
import { TimetablesManagement } from './TimetablesManagement';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'groups' | 'timetables' | 'notifications' | 'security' | 'email'>('users');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <Settings className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Settings
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              System Configuration and Preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex space-x-4 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users</span>
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'courses'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses</span>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'groups'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Groups</span>
        </button>
        <button
          onClick={() => setActiveTab('timetables')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'timetables'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timetables</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'email'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'courses' && <CoursesManagement />}
        {activeTab === 'groups' && <GroupsManagement />}
        {activeTab === 'timetables' && <TimetablesManagement />}
        {activeTab === 'notifications' && (
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              Notification Settings
            </h2>
            {/* Add notification settings content */}
          </div>
        )}
        {activeTab === 'security' && (
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              Security Settings
            </h2>
            {/* Add security settings content */}
          </div>
        )}
        {activeTab === 'email' && (
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              Email Settings
            </h2>
            {/* Add email settings content */}
          </div>
        )}
      </div>
    </div>
  );
};