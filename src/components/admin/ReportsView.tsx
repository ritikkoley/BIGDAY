import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { SystemReport, FilterCriteria } from '../../types/admin';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  GraduationCap,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const REPORT_TYPES = [
  { 
    value: 'user_summary', 
    label: 'User Summary Report',
    description: 'Comprehensive overview of all users by role, status, and demographics',
    icon: Users
  },
  { 
    value: 'academic_report', 
    label: 'Academic Performance Report',
    description: 'Student academic performance analysis and trends',
    icon: GraduationCap
  },
  { 
    value: 'attendance_summary', 
    label: 'Attendance Summary Report',
    description: 'Attendance patterns and statistics across all classes',
    icon: Calendar
  },
  { 
    value: 'performance_analysis', 
    label: 'Performance Analysis Report',
    description: 'Detailed performance metrics and comparative analysis',
    icon: TrendingUp
  }
];

export const ReportsView: React.FC = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<SystemReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportFilters, setReportFilters] = useState<FilterCriteria>({});
  const [reportName, setReportName] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock reports data since we don't have a reports table yet
      const mockReports: SystemReport[] = [
        {
          id: 'report-1',
          name: 'Monthly User Summary - March 2024',
          type: 'user_summary',
          filters: { role: ['student', 'teacher'] },
          generated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          generated_by: user?.id || 'admin',
          file_path: '/reports/user_summary_march_2024.pdf',
          status: 'completed'
        },
        {
          id: 'report-2',
          name: 'Academic Performance Analysis Q1',
          type: 'academic_report',
          filters: { peer_group: ['secondary', 'higher_secondary'] },
          generated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          generated_by: user?.id || 'admin',
          file_path: '/reports/academic_performance_q1.pdf',
          status: 'completed'
        },
        {
          id: 'report-3',
          name: 'Attendance Summary - Current Semester',
          type: 'attendance_summary',
          filters: { status: ['active'] },
          generated_at: new Date().toISOString(),
          generated_by: user?.id || 'admin',
          status: 'generating'
        }
      ];
      
      setReports(mockReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      if (!selectedReportType || !reportName) {
        setError('Please select a report type and enter a name');
        return;
      }

      setIsLoading(true);
      setError(null);

      const newReport: SystemReport = {
        id: `report-${Date.now()}`,
        name: reportName,
        type: selectedReportType as any,
        filters: reportFilters,
        generated_at: new Date().toISOString(),
        generated_by: user?.id || 'admin',
        status: 'generating'
      };

      // Simulate report generation
      setReports(prev => [newReport, ...prev]);
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        setReports(prev => prev.map(r => 
          r.id === newReport.id 
            ? { ...r, status: 'completed', file_path: `/reports/${reportName.toLowerCase().replace(/\s+/g, '_')}.pdf` }
            : r
        ));
      }, 3000);

      // Reset form
      setReportName('');
      setSelectedReportType('');
      setReportFilters({});
      setShowReportForm(false);
      
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async (report: SystemReport) => {
    try {
      if (report.status !== 'completed' || !report.file_path) {
        setError('Report is not ready for download');
        return;
      }

      // In a real implementation, this would download from Supabase storage
      alert(`Downloading report: ${report.name}`);
      
    } catch (err) {
      console.error('Error downloading report:', err);
      setError(err instanceof Error ? err.message : 'Failed to download report');
    }
  };

  const getStatusIcon = (status: SystemReport['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'generating':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: SystemReport['status']) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      generating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors.generating;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <FileText className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                System Reports
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Generate and manage institutional reports
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Report Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REPORT_TYPES.map((reportType) => (
          <div key={reportType.value} className="apple-card p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-apple-blue-50 dark:bg-apple-blue-900/30 rounded-lg">
                <reportType.icon className="w-6 h-6 text-apple-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-apple-gray-600 dark:text-white">
                  {reportType.label}
                </h3>
              </div>
            </div>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              {reportType.description}
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedReportType(reportType.value);
                  setReportName(reportType.label);
                  setShowReportForm(true);
                }}
                className="w-full px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reports List */}
      <div className="apple-card">
        <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Generated Reports ({reports.length})
          </h2>
        </div>
        
        <div className="divide-y divide-apple-gray-200/50 dark:divide-apple-gray-500/20">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-lg">
                    <FileText className="w-6 h-6 text-apple-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-apple-gray-600 dark:text-white">
                      {report.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        Type: {REPORT_TYPES.find(t => t.value === report.type)?.label}
                      </span>
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        Generated: {new Date(report.generated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(report.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  {report.status === 'completed' && (
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {reports.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                No Reports Generated
              </h3>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                Generate your first report to get started with data analysis
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Generation Form */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  Generate New Report
                </h2>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-4">
                  Report Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REPORT_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedReportType(type.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedReportType === type.value
                          ? 'border-apple-blue-500 bg-apple-blue-50 dark:bg-apple-blue-900/20'
                          : 'border-apple-gray-200 dark:border-apple-gray-600 hover:border-apple-gray-300 dark:hover:border-apple-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <type.icon className="w-5 h-5 text-apple-blue-500" />
                        <span className="font-medium text-apple-gray-600 dark:text-white">
                          {type.label}
                        </span>
                      </div>
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Report Name */}
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter a descriptive name for this report"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                />
              </div>

              {/* Report Filters */}
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-4">
                  Report Filters (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">
                      Roles
                    </label>
                    <select
                      multiple
                      value={reportFilters.role || []}
                      onChange={(e) => setReportFilters(prev => ({
                        ...prev,
                        role: Array.from(e.target.selectedOptions, option => option.value)
                      }))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      multiple
                      value={reportFilters.status || []}
                      onChange={(e) => setReportFilters(prev => ({
                        ...prev,
                        status: Array.from(e.target.selectedOptions, option => option.value)
                      }))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
                <button
                  onClick={() => setShowReportForm(false)}
                  className="px-6 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={!selectedReportType || !reportName || isLoading}
                  className="flex items-center space-x-2 px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="apple-card p-4">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};