import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { SystemReport } from '../../types/admin';
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
  X,
  Loader2,
  Eye
} from 'lucide-react';

const REPORT_TYPES = [
  {
    value: 'user_summary',
    label: 'User Summary',
    description: 'Overview of all users by role, status, and demographics',
    icon: Users
  },
  {
    value: 'academic_report',
    label: 'Academic Performance',
    description: 'Student performance analysis and trends',
    icon: GraduationCap
  },
  {
    value: 'attendance_summary',
    label: 'Attendance Summary',
    description: 'Attendance patterns across all classes',
    icon: Calendar
  },
  {
    value: 'performance_analysis',
    label: 'Performance Analysis',
    description: 'Detailed metrics and comparative analysis',
    icon: TrendingUp
  }
];

const GRADE_LEVELS = ['Pre-Primary', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];
const PEER_GROUPS = ['Pre-Primary', 'Primary', 'Secondary', 'Higher Secondary'];
const USER_ROLES = ['Student', 'Teacher', 'Admin', 'Staff'];
const USER_STATUS = ['Active', 'Inactive', 'Suspended', 'Graduated'];
const PERFORMANCE_RANGES = ['Excellent (90-100%)', 'Good (75-89%)', 'Average (60-74%)', 'Below Average (<60%)'];

export const ReportsView: React.FC = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<SystemReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportName, setReportName] = useState('');
  const [selectedReport, setSelectedReport] = useState<SystemReport | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const [filters, setFilters] = useState<{
    grades: string[];
    sections: string[];
    peerGroups: string[];
    roles: string[];
    status: string[];
    performanceRange: string[];
    dateRange: { start: string; end: string };
  }>({
    grades: [],
    sections: [],
    peerGroups: [],
    roles: [],
    status: [],
    performanceRange: [],
    dateRange: { start: '', end: '' }
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('system_reports')
        .select('*')
        .order('generated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setReports(data || []);
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

      if (!user) {
        setError('User not authenticated');
        return;
      }

      setIsGenerating(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/generate_report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_type: selectedReportType,
          report_name: reportName,
          filters: filters
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const result = await response.json();

      setReportName('');
      setSelectedReportType('');
      setFilters({
        grades: [],
        sections: [],
        peerGroups: [],
        roles: [],
        status: [],
        performanceRange: [],
        dateRange: { start: '', end: '' }
      });
      setShowReportForm(false);

      await fetchReports();

    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewReport = async (report: SystemReport) => {
    try {
      setSelectedReport(report);
      setIsLoading(true);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate_report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_type: report.type,
          report_name: report.name,
          filters: report.filters || {}
        })
      });

      const result = await response.json();
      setReportData(result.data);

    } catch (err) {
      console.error('Error viewing report:', err);
      setError(err instanceof Error ? err.message : 'Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[filterType] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [filterType]: newArray };
    });
  };

  const getStatusIcon = (status: SystemReport['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'generating':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
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

  const renderReportData = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        {reportData.total_users !== undefined && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="apple-card p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.total_users}</p>
              </div>
              {reportData.by_role && Object.entries(reportData.by_role).map(([role, count]: [string, any]) => (
                <div key={role} className="apple-card p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 capitalize">{role}s</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                </div>
              ))}
            </div>

            {reportData.by_status && (
              <div className="apple-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(reportData.by_status).map(([status, count]: [string, any]) => (
                    <div key={status} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-1">{status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportData.by_peer_group && Object.keys(reportData.by_peer_group).length > 0 && (
              <div className="apple-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Peer Group Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(reportData.by_peer_group).map(([group, count]: [string, any]) => (
                    <div key={group} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-1">{group.replace(/_/g, ' ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {reportData.total_courses !== undefined && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="apple-card p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.total_courses}</p>
              </div>
              <div className="apple-card p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Sections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.total_sections}</p>
              </div>
              <div className="apple-card p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.total_enrollments}</p>
              </div>
            </div>
            {reportData.course_distribution && (
              <div className="apple-card p-6">
                <p className="text-gray-700 dark:text-gray-300">{reportData.course_distribution}</p>
              </div>
            )}
          </>
        )}

        {reportData.institutional_metrics && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(reportData.institutional_metrics).map(([key, value]: [string, any]) => (
                <div key={key} className="apple-card p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>

            {reportData.user_distribution && (
              <div className="apple-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(reportData.user_distribution).map(([role, count]: [string, any]) => (
                    <div key={role} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-1">{role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportData.recommendations && reportData.recommendations.length > 0 && (
              <div className="apple-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {reportData.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {reportData.total_timetable_sessions !== undefined && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="apple-card p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Timetable Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.total_timetable_sessions}</p>
              </div>
              <div className="apple-card p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Timetables</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.active_timetables}</p>
              </div>
              <div className="apple-card p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Published</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.published_timetables}</p>
              </div>
            </div>
            {reportData.timetable_coverage && (
              <div className="apple-card p-6">
                <p className="text-gray-700 dark:text-gray-300">{reportData.timetable_coverage}</p>
              </div>
            )}
          </>
        )}

        <div className="apple-card p-6">
          <details className="cursor-pointer">
            <summary className="text-lg font-semibold text-gray-900 dark:text-white mb-4">View Raw Data (JSON)</summary>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm mt-4">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  };

  const renderFiltersForReportType = () => {
    if (!selectedReportType) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter Options</span>
        </div>

        {(selectedReportType === 'user_summary' || selectedReportType === 'performance_analysis') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                User Roles
              </label>
              <div className="grid grid-cols-2 gap-2">
                {USER_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => toggleFilter('roles', role.toLowerCase())}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                      filters.roles.includes(role.toLowerCase())
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                User Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {USER_STATUS.map(status => (
                  <button
                    key={status}
                    onClick={() => toggleFilter('status', status.toLowerCase())}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                      filters.status.includes(status.toLowerCase())
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Peer Groups
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PEER_GROUPS.map(group => (
                  <button
                    key={group}
                    onClick={() => toggleFilter('peerGroups', group.toLowerCase().replace(/\s+/g, '_'))}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                      filters.peerGroups.includes(group.toLowerCase().replace(/\s+/g, '_'))
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {(selectedReportType === 'academic_report' || selectedReportType === 'attendance_summary') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Grade Levels
              </label>
              <div className="grid grid-cols-4 gap-2">
                {GRADE_LEVELS.map(grade => (
                  <button
                    key={grade}
                    onClick={() => toggleFilter('grades', grade)}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                      filters.grades.includes(grade)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Sections
              </label>
              <div className="grid grid-cols-6 gap-2">
                {SECTIONS.map(section => (
                  <button
                    key={section}
                    onClick={() => toggleFilter('sections', section)}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                      filters.sections.includes(section)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedReportType === 'academic_report' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Performance Range
            </label>
            <div className="grid grid-cols-1 gap-2">
              {PERFORMANCE_RANGES.map(range => (
                <button
                  key={range}
                  onClick={() => toggleFilter('performanceRange', range)}
                  className={`px-3 py-2 text-sm rounded-lg border-2 transition-all text-left ${
                    filters.performanceRange.includes(range)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {(filters.grades.length > 0 || filters.sections.length > 0 || filters.peerGroups.length > 0 ||
          filters.roles.length > 0 || filters.status.length > 0 || filters.performanceRange.length > 0) && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {[...filters.grades, ...filters.sections, ...filters.peerGroups, ...filters.roles,
                  ...filters.status, ...filters.performanceRange].length} filters applied
              </span>
              <button
                onClick={() => setFilters({
                  grades: [],
                  sections: [],
                  peerGroups: [],
                  roles: [],
                  status: [],
                  performanceRange: [],
                  dateRange: { start: '', end: '' }
                })}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (selectedReport) {
    return (
      <div className="space-y-6">
        <div className="apple-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setReportData(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
                  {selectedReport.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Generated: {new Date(selectedReport.generated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="apple-card p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          renderReportData()
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
                System Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Generate and view institutional reports
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REPORT_TYPES.map((reportType) => {
          const Icon = reportType.icon;
          const count = reports.filter(r => r.type === reportType.value).length;

          return (
            <button
              key={reportType.value}
              onClick={() => {
                setSelectedReportType(reportType.value);
                setReportName(reportType.label + ' - ' + new Date().toLocaleDateString());
                setShowReportForm(true);
              }}
              className="apple-card p-6 hover:shadow-lg transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>
                {count > 0 && (
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {count} generated
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {reportType.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {reportType.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="apple-card">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Reports ({reports.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
          {reports.map((report) => {
            const reportType = REPORT_TYPES.find(t => t.value === report.type);
            const Icon = reportType?.icon || FileText;

            return (
              <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {report.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {reportType?.label}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(report.generated_at).toLocaleDateString()}
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
                        onClick={() => handleViewReport(report)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {reports.length === 0 && !isLoading && (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Reports Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate your first report to analyze institutional data
              </p>
            </div>
          )}
        </div>
      </div>

      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Generate Report
                </h2>
                <button
                  onClick={() => {
                    setShowReportForm(false);
                    setSelectedReportType('');
                    setFilters({
                      grades: [],
                      sections: [],
                      peerGroups: [],
                      roles: [],
                      status: [],
                      performanceRange: [],
                      dateRange: { start: '', end: '' }
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Report Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {REPORT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => {
                          setSelectedReportType(type.value);
                          if (!reportName || REPORT_TYPES.some(t => reportName.startsWith(t.label))) {
                            setReportName(type.label + ' - ' + new Date().toLocaleDateString());
                          }
                        }}
                        className={`p-3 border-2 rounded-lg text-left transition-all flex items-center space-x-3 ${
                          selectedReportType === type.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{type.label}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{type.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              {renderFiltersForReportType()}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={() => {
                    setShowReportForm(false);
                    setSelectedReportType('');
                    setFilters({
                      grades: [],
                      sections: [],
                      peerGroups: [],
                      roles: [],
                      status: [],
                      performanceRange: [],
                      dateRange: { start: '', end: '' }
                    });
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={!selectedReportType || !reportName || isGenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      <span>Generate Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
