import React, { useState } from 'react';
import { Calendar, Users, BookOpen, Settings, Play, FileText } from 'lucide-react';
import { CohortsSectionsPage } from './allocation/CohortsSectionsPage';
import { CoursesAllocationPage } from './allocation/CoursesAllocationPage';
import { TeacherEligibilityPage } from './allocation/TeacherEligibilityPage';
import { SlotTemplatesPage } from './allocation/SlotTemplatesPage';
import { GeneratePage } from './allocation/GeneratePage';
import { ReviewAdjustPage } from './allocation/ReviewAdjustPage';

type AllocationTab = 'cohorts' | 'courses' | 'teachers' | 'templates' | 'generate' | 'review';

export const AllocationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AllocationTab>('cohorts');

  const tabs = [
    {
      id: 'cohorts' as AllocationTab,
      label: 'Cohorts & Sections',
      icon: Users,
      description: 'Manage academic groups and student assignments'
    },
    {
      id: 'courses' as AllocationTab,
      label: 'Courses',
      icon: BookOpen,
      description: 'Define subjects and scheduling requirements'
    },
    {
      id: 'teachers' as AllocationTab,
      label: 'Teacher Eligibility',
      icon: Users,
      description: 'Configure teacher qualifications and availability'
    },
    {
      id: 'templates' as AllocationTab,
      label: 'Slot Templates',
      icon: Settings,
      description: 'Define period schedules and bell times'
    },
    {
      id: 'generate' as AllocationTab,
      label: 'Generate',
      icon: Play,
      description: 'Create automated timetables'
    },
    {
      id: 'review' as AllocationTab,
      label: 'Review & Adjust',
      icon: Calendar,
      description: 'Review and manually adjust timetables'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <Calendar className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Timetable Allocation System
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Comprehensive timetable generation and management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="apple-card">
        <div className="border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-apple-blue-500 text-apple-blue-500'
                    : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Description */}
        <div className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/30">
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'cohorts' && <CohortsSectionsPage />}
        {activeTab === 'courses' && <CoursesAllocationPage />}
        {activeTab === 'teachers' && <TeacherEligibilityPage />}
        {activeTab === 'templates' && <SlotTemplatesPage />}
        {activeTab === 'generate' && <GeneratePage />}
        {activeTab === 'review' && <ReviewAdjustPage />}
      </div>
    </div>
  );
};