import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Lead, LeadInteraction, LeadAnalytics } from '../../types/operations';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  TrendingUp,
  XCircle,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';

const STAGES = [
  { id: 'new_inquiry', label: 'New Inquiry', color: 'blue' },
  { id: 'campus_visit', label: 'Campus Visit', color: 'purple' },
  { id: 'application', label: 'Application', color: 'orange' },
  { id: 'interview', label: 'Interview', color: 'yellow' },
  { id: 'admitted', label: 'Admitted', color: 'green' },
  { id: 'enrolled', label: 'Enrolled', color: 'emerald' }
];

export const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');

  useEffect(() => {
    fetchLeads();
    fetchAnalytics();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      // Mock data for now
      const mockLeads: Lead[] = [
        {
          id: '1',
          student_name: 'Aarav Sharma',
          date_of_birth: '2014-05-15',
          gender: 'male',
          parent_name: 'Mr. Rajesh Sharma',
          parent_email: 'rajesh.sharma@example.com',
          parent_phone: '+91-9876543210',
          grade_applying_for: '6',
          stage: 'new_inquiry',
          priority: 'high',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          student_name: 'Priya Patel',
          date_of_birth: '2013-08-22',
          gender: 'female',
          parent_name: 'Mrs. Anjali Patel',
          parent_email: 'anjali.patel@example.com',
          parent_phone: '+91-9876543211',
          grade_applying_for: '7',
          stage: 'campus_visit',
          priority: 'medium',
          scheduled_visit_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '3',
          student_name: 'Arjun Verma',
          date_of_birth: '2015-01-10',
          gender: 'male',
          parent_name: 'Dr. Amit Verma',
          parent_email: 'amit.verma@example.com',
          parent_phone: '+91-9876543212',
          grade_applying_for: '5',
          stage: 'application',
          priority: 'high',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '4',
          student_name: 'Kavya Singh',
          date_of_birth: '2013-11-05',
          gender: 'female',
          parent_name: 'Mrs. Sunita Singh',
          parent_email: 'sunita.singh@example.com',
          parent_phone: '+91-9876543213',
          grade_applying_for: '7',
          stage: 'interview',
          priority: 'urgent',
          interview_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        }
      ];
      setLeads(mockLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    const mockAnalytics: LeadAnalytics = {
      total_leads: 45,
      by_stage: {
        new_inquiry: 12,
        campus_visit: 8,
        application: 10,
        interview: 6,
        admitted: 5,
        enrolled: 4
      },
      by_source: {
        'Social Media': 15,
        Referrals: 18,
        Website: 12
      },
      conversion_rate: 65.5,
      this_month: 12,
      last_month: 10
    };
    setAnalytics(mockAnalytics);
  };

  const getLeadsByStage = (stage: string) => {
    return leads.filter((lead) => lead.stage === stage);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Users className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Lead Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Track admissions from inquiry to enrollment
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddLead(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">Total Leads</p>
              <Users className="w-5 h-5 text-apple-blue-500" />
            </div>
            <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">
              {analytics.total_leads}
            </p>
            <p className="text-xs text-green-500 mt-2">+{analytics.this_month} this month</p>
          </div>

          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">Conversion Rate</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">
              {analytics.conversion_rate}%
            </p>
            <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-2">
              Inquiry to admission
            </p>
          </div>

          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">New Inquiries</p>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">
              {analytics.by_stage.new_inquiry}
            </p>
            <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-2">
              Awaiting follow-up
            </p>
          </div>

          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">Enrolled</p>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">
              {analytics.by_stage.enrolled}
            </p>
            <p className="text-xs text-green-500 mt-2">Successfully converted</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="apple-card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-apple-gray-50 dark:bg-apple-gray-700 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-apple-gray-400" />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 bg-apple-gray-50 dark:bg-apple-gray-700 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              <option value="all">All Stages</option>
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {STAGES.map((stage) => (
            <div key={stage.id} className="w-80 flex-shrink-0">
              <div className="apple-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-apple-gray-600 dark:text-white flex items-center space-x-2">
                    <span>{stage.label}</span>
                    <span className="text-xs bg-apple-gray-100 dark:bg-apple-gray-700 px-2 py-0.5 rounded-full">
                      {getLeadsByStage(stage.id).length}
                    </span>
                  </h3>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getLeadsByStage(stage.id).map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-4 bg-white dark:bg-apple-gray-700 rounded-lg border border-apple-gray-200 dark:border-apple-gray-600 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-apple-gray-600 dark:text-white text-sm">
                          {lead.student_name}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(lead.priority)}`}
                        >
                          {lead.priority}
                        </span>
                      </div>
                      <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mb-2">
                        Grade {lead.grade_applying_for} • {lead.parent_name}
                      </p>
                      <div className="flex items-center justify-between text-xs text-apple-gray-400 dark:text-apple-gray-300">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{lead.parent_phone}</span>
                        </div>
                        {lead.scheduled_visit_date && (
                          <div className="flex items-center space-x-1 text-orange-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(lead.scheduled_visit_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {getLeadsByStage(stage.id).length === 0 && (
                    <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300 text-sm">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-apple-gray-600 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200 dark:border-apple-gray-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  Lead Details
                </h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-apple-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Student Name</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">
                      {selectedLead.student_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Grade Applying</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">
                      {selectedLead.grade_applying_for}
                    </p>
                  </div>
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Date of Birth</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">
                      {formatDate(selectedLead.date_of_birth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Gender</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white capitalize">
                      {selectedLead.gender}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
                  Parent/Guardian Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Name</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">
                      {selectedLead.parent_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Phone</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">
                      {selectedLead.parent_phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Email</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">
                      {selectedLead.parent_email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>SMS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
