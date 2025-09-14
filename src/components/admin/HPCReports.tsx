import React, { useState } from 'react';
import { FileText, Eye, Download, CheckCircle2, Clock, AlertTriangle, Users } from 'lucide-react';

export const HPCReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'under_review' | 'published'>('all');

  const demoReports = [
    {
      id: '1',
      studentName: 'Aarav Sharma',
      grade: '5-A',
      overallGrade: 'A',
      status: 'published',
      compiledAt: '2025-01-30T10:00:00Z',
      publishedAt: '2025-01-30T14:30:00Z',
      version: 1
    },
    {
      id: '2',
      studentName: 'Saanvi Patel',
      grade: '8-B',
      overallGrade: 'A+',
      status: 'under_review',
      compiledAt: '2025-01-29T15:20:00Z',
      version: 1
    },
    {
      id: '3',
      studentName: 'Arjun Verma',
      grade: '10-A',
      overallGrade: 'B+',
      status: 'draft',
      compiledAt: '2025-01-28T11:45:00Z',
      version: 2
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'draft':
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const filteredReports = filterStatus === 'all' 
    ? demoReports 
    : demoReports.filter(report => report.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <FileText className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              HPC Reports Management
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Review, approve, and publish student progress cards
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-apple-gray-600 dark:text-white">
            Filter by status:
          </span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Reports' },
              { key: 'draft', label: 'Draft' },
              { key: 'under_review', label: 'Under Review' },
              { key: 'published', label: 'Published' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === filter.key
                    ? 'bg-apple-blue-500 text-white'
                    : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`w-full text-left apple-card p-6 transition-all ${
                selectedReport === report.id
                  ? 'ring-2 ring-apple-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-apple-gray-600 dark:text-white">
                    {report.studentName}
                  </h3>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    {report.grade} • Overall Grade: {report.overallGrade}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(report.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-apple-gray-400 dark:text-apple-gray-300">
                <span>Version {report.version}</span>
                <span>
                  {report.status === 'published' ? 'Published' : 'Compiled'}: {' '}
                  {new Date(report.publishedAt || report.compiledAt).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Report Preview */}
        <div className="apple-card p-6">
          {selectedReport ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                  Report Preview
                </h2>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View Full Report</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* Report Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-apple-gray-600 dark:text-white mb-3">
                  Performance Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-apple-blue-500">A</div>
                    <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300">Overall Grade</div>
                  </div>
                  <div className="text-center p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">4.15</div>
                    <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300">Score (out of 5)</div>
                  </div>
                </div>
              </div>

              {/* Parameter Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-apple-gray-600 dark:text-white mb-3">
                  Parameter Breakdown
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'Mathematics', grade: 'A', score: 4.12 },
                    { name: 'Creativity', grade: 'A+', score: 4.42 },
                    { name: 'Teamwork', grade: 'A', score: 4.03 },
                    { name: 'Empathy', grade: 'A', score: 3.8 }
                  ].map((param, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-apple-gray-600 dark:text-white">
                        {param.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-apple-blue-500">
                          {param.score.toFixed(2)}
                        </span>
                        <span className="px-2 py-1 bg-apple-blue-50 text-apple-blue-700 dark:bg-apple-blue-900/30 dark:text-apple-blue-300 rounded-full text-xs">
                          {param.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stakeholder Input Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-apple-gray-600 dark:text-white mb-3">
                  Stakeholder Input
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-apple-gray-400 dark:text-apple-gray-300">Teacher:</span>
                    <span className="ml-2 text-green-500">✓ Complete</span>
                  </div>
                  <div>
                    <span className="text-apple-gray-400 dark:text-apple-gray-300">Parent:</span>
                    <span className="ml-2 text-green-500">✓ Complete</span>
                  </div>
                  <div>
                    <span className="text-apple-gray-400 dark:text-apple-gray-300">Self:</span>
                    <span className="ml-2 text-green-500">✓ Complete</span>
                  </div>
                  <div>
                    <span className="text-apple-gray-400 dark:text-apple-gray-300">Peer:</span>
                    <span className="ml-2 text-yellow-500">⏳ Pending</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                Select a Report
              </h3>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                Choose a report from the list to view details and take actions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};