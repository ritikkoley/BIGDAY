import React, { useState, useEffect } from 'react';
import { Brain, Users, FileText, Settings, BarChart3, CheckCircle2 } from 'lucide-react';

export const HPCManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'evaluations' | 'reports' | 'analytics'>('overview');
  const [stats, setStats] = useState({
    totalParameters: 6,
    activeEvaluations: 45,
    completedReports: 12,
    pendingApprovals: 3
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <Brain className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Holistic Progress Card System
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              CBSE-compliant 360° student evaluation platform
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Parameters</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">
                {stats.totalParameters}
              </h3>
            </div>
            <Settings className="w-8 h-8 text-apple-blue-500" />
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Active Evaluations</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">
                {stats.activeEvaluations}
              </h3>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Completed Reports</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">
                {stats.completedReports}
              </h3>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-apple-gray-600 dark:text-white mt-1">
                {stats.pendingApprovals}
              </h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('parameters')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'parameters'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Parameters</span>
        </button>
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'evaluations'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Evaluations</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'reports'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Reports</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-apple-blue-500 text-apple-blue-500'
              : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="apple-card p-6">
              <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
                HPC System Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-apple-gray-600 dark:text-white mb-2">
                    Evaluation Parameters
                  </h3>
                  <ul className="space-y-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                    <li>• Mathematics (Scholastic - 20%)</li>
                    <li>• Creativity & Innovation (Co-Scholastic - 15%)</li>
                    <li>• Teamwork & Collaboration (Life Skills - 12%)</li>
                    <li>• Empathy & Compassion (Life Skills - 10%)</li>
                    <li>• Physical Fitness (Co-Scholastic - 8%)</li>
                    <li>• Discipline & Responsibility (Discipline - 10%)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-apple-gray-600 dark:text-white mb-2">
                    Stakeholder Roles
                  </h3>
                  <ul className="space-y-2 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                    <li>• Teachers (Primary evaluators)</li>
                    <li>• Parents (Home behavior assessment)</li>
                    <li>• Peers (Collaborative skills)</li>
                    <li>• Self-Assessment (Student reflections)</li>
                    <li>• Counselors (Optional - emotional intelligence)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-apple-gray-600 dark:text-white">
                      HPC Report published for Aarav Sharma (Grade 5-A)
                    </p>
                    <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-apple-gray-600 dark:text-white">
                      15 new evaluations submitted by teachers
                    </p>
                    <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                      4 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-apple-gray-600 dark:text-white">
                      Rubric updated for Creativity parameter
                    </p>
                    <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                      1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parameters' && (
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              HPC Parameters Configuration
            </h2>
            <p className="text-apple-gray-400 dark:text-apple-gray-300">
              Configure evaluation parameters, rubrics, and weightages for the HPC system.
            </p>
            <div className="mt-6 p-8 bg-apple-gray-50 dark:bg-apple-gray-700/30 rounded-lg text-center">
              <Brain className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <p className="text-apple-gray-500 dark:text-apple-gray-400">
                HPC Parameter configuration interface will be implemented here
              </p>
            </div>
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              Evaluation Management
            </h2>
            <p className="text-apple-gray-400 dark:text-apple-gray-300">
              Monitor and manage ongoing evaluations across all stakeholders.
            </p>
            <div className="mt-6 p-8 bg-apple-gray-50 dark:bg-apple-gray-700/30 rounded-lg text-center">
              <Users className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <p className="text-apple-gray-500 dark:text-apple-gray-400">
                HPC Evaluation management interface will be implemented here
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              HPC Reports
            </h2>
            <p className="text-apple-gray-400 dark:text-apple-gray-300">
              Review, approve, and publish student HPC reports.
            </p>
            <div className="mt-6 p-8 bg-apple-gray-50 dark:bg-apple-gray-700/30 rounded-lg text-center">
              <FileText className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <p className="text-apple-gray-500 dark:text-apple-gray-400">
                HPC Reports management interface will be implemented here
              </p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
              HPC Analytics
            </h2>
            <p className="text-apple-gray-400 dark:text-apple-gray-300">
              View system-wide analytics and performance insights.
            </p>
            <div className="mt-6 p-8 bg-apple-gray-50 dark:bg-apple-gray-700/30 rounded-lg text-center">
              <BarChart3 className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <p className="text-apple-gray-500 dark:text-apple-gray-400">
                HPC Analytics dashboard will be implemented here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};