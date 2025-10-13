import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Users, Mail, Calendar, BookOpen, Clock, Building2, Save, Loader2 } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { CoursesManagement } from './CoursesManagement';
import { GroupsManagement } from './GroupsManagement';
import { TimetablesManagement } from './TimetablesManagement';
import { AllocationView } from './AllocationView';
import { useBrandingStore } from '../../stores/brandingStore';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'groups' | 'timetables' | 'allocation' | 'notifications' | 'security' | 'email' | 'institution'>('users');
  const { institutionName, fetchBranding, updateInstitutionName } = useBrandingStore();
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  useEffect(() => {
    setEditedName(institutionName);
  }, [institutionName]);

  const handleSaveInstitutionName = async () => {
    if (!editedName.trim()) {
      setSaveError('Institution name cannot be empty');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateInstitutionName(editedName.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to update institution name');
    } finally {
      setIsSaving(false);
    }
  };

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
          onClick={() => setActiveTab('allocation')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'allocation'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Allocation</span>
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
        <button
          onClick={() => setActiveTab('institution')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'institution'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Institution</span>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'courses' && <CoursesManagement />}
        {activeTab === 'groups' && <GroupsManagement />}
        {activeTab === 'timetables' && <TimetablesManagement />}
        {activeTab === 'allocation' && <AllocationView />}
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
        {activeTab === 'institution' && (
          <div className="apple-card p-6">
            <div className="max-w-2xl">
              <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                Institution Settings
              </h2>
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-6">
                Configure your institution's branding and display settings
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Institution Name
                  </label>
                  <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mb-3">
                    This name will appear throughout the system, including the login page, navigation header, and all reports.
                  </p>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter institution name"
                    className="w-full px-4 py-3 border border-apple-gray-200 dark:border-apple-gray-500/20 rounded-lg bg-white dark:bg-gray-800 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  />
                </div>

                {saveError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-300">{saveError}</p>
                  </div>
                )}

                {saveSuccess && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Institution name updated successfully! The changes will be reflected across the system.
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveInstitutionName}
                    disabled={isSaving || editedName === institutionName}
                    className="flex items-center space-x-2 px-6 py-3 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditedName(institutionName)}
                    disabled={isSaving || editedName === institutionName}
                    className="px-6 py-3 border border-apple-gray-200 dark:border-apple-gray-500/20 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset
                  </button>
                </div>

                <div className="pt-6 border-t border-apple-gray-200 dark:border-apple-gray-500/20">
                  <h3 className="text-sm font-medium text-apple-gray-600 dark:text-white mb-3">
                    Preview
                  </h3>
                  <div className="p-4 bg-apple-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mb-2">
                      How it will appear:
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="font-extralight tracking-wider text-base text-apple-gray-600 dark:text-white">
                        BIG DAY
                      </span>
                      <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300">for</span>
                      <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                        {editedName || 'Your Institution Name'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};