import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Lead, LeadAnalytics } from '../../types/operations';
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
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';

const STAGES = [
  { id: 'new_inquiry', label: 'New Inquiry', color: 'blue' },
  { id: 'campus_visit', label: 'Campus Visit', color: 'purple' },
  { id: 'application', label: 'Application', color: 'orange' },
  { id: 'interview', label: 'Interview', color: 'yellow' },
  { id: 'admitted', label: 'Admitted', color: 'green' },
  { id: 'enrolled', label: 'Enrolled', color: 'emerald' }
];

const GRADES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [newLead, setNewLead] = useState({
    student_name: '',
    date_of_birth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    grade_applying_for: '1',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    notes: ''
  });

  useEffect(() => {
    fetchLeads();
    fetchAnalytics();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
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
        },
        {
          id: '5',
          student_name: 'Rohan Gupta',
          date_of_birth: '2014-03-20',
          gender: 'male',
          parent_name: 'Mr. Vikram Gupta',
          parent_email: 'vikram.gupta@example.com',
          parent_phone: '+91-9876543214',
          grade_applying_for: '6',
          stage: 'admitted',
          priority: 'medium',
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
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

  const handleAddLead = async () => {
    if (!newLead.student_name || !newLead.parent_name || !newLead.parent_phone) {
      return;
    }

    setIsSaving(true);
    try {
      const lead: Lead = {
        id: `lead-${Date.now()}`,
        student_name: newLead.student_name,
        date_of_birth: newLead.date_of_birth || undefined,
        gender: newLead.gender,
        parent_name: newLead.parent_name,
        parent_email: newLead.parent_email || undefined,
        parent_phone: newLead.parent_phone,
        grade_applying_for: newLead.grade_applying_for,
        stage: 'new_inquiry',
        priority: newLead.priority,
        notes: newLead.notes || undefined,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setLeads([lead, ...leads]);
      setShowAddLead(false);
      setNewLead({
        student_name: '',
        date_of_birth: '',
        gender: 'male',
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        grade_applying_for: '1',
        priority: 'medium',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveStage = (lead: Lead, direction: 'next' | 'prev') => {
    const currentIndex = STAGES.findIndex((s) => s.id === lead.stage);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < STAGES.length) {
      const updatedLeads = leads.map((l) =>
        l.id === lead.id ? { ...l, stage: STAGES[newIndex].id as Lead['stage'], updated_at: new Date().toISOString() } : l
      );
      setLeads(updatedLeads);
      if (selectedLead?.id === lead.id) {
        setSelectedLead({ ...lead, stage: STAGES[newIndex].id as Lead['stage'] });
      }
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleSMS = (phone: string) => {
    window.open(`sms:${phone.replace(/[^0-9+]/g, '')}`, '_self');
  };

  const getFilteredLeads = () => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.parent_phone.includes(searchQuery);
      const matchesStage = filterStage === 'all' || lead.stage === filterStage;
      return matchesSearch && matchesStage;
    });
  };

  const getLeadsByStage = (stage: string) => {
    return getFilteredLeads().filter((lead) => lead.stage === stage);
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
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Users className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">Lead Management</h1>
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

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">Total Leads</p>
              <Users className="w-5 h-5 text-apple-blue-500" />
            </div>
            <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">{leads.length}</p>
            <p className="text-xs text-green-500 mt-2">+{analytics.this_month} this month</p>
          </div>

          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">Conversion Rate</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">{analytics.conversion_rate}%</p>
            <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-2">Inquiry to admission</p>
          </div>

          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">New Inquiries</p>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">{getLeadsByStage('new_inquiry').length}</p>
            <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-2">Awaiting follow-up</p>
          </div>

          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">Enrolled</p>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">{getLeadsByStage('enrolled').length}</p>
            <p className="text-xs text-green-500 mt-2">Successfully converted</p>
          </div>
        </div>
      )}

      <div className="apple-card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-apple-gray-50 dark:bg-apple-gray-700 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg text-sm text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-apple-gray-400" />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 bg-apple-gray-50 dark:bg-apple-gray-700 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg text-sm text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
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
                        <h4 className="font-medium text-apple-gray-600 dark:text-white text-sm">{lead.student_name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </div>
                      <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mb-2">
                        Grade {lead.grade_applying_for} - {lead.parent_name}
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

      {showAddLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-apple-gray-600 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200 dark:border-apple-gray-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">Add New Lead</h2>
                <button
                  onClick={() => setShowAddLead(false)}
                  className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-apple-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={newLead.student_name}
                  onChange={(e) => setNewLead({ ...newLead, student_name: e.target.value })}
                  className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  placeholder="Enter student name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={newLead.date_of_birth}
                    onChange={(e) => setNewLead({ ...newLead, date_of_birth: e.target.value })}
                    className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">Gender</label>
                  <select
                    value={newLead.gender}
                    onChange={(e) => setNewLead({ ...newLead, gender: e.target.value as any })}
                    className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                    Grade Applying For
                  </label>
                  <select
                    value={newLead.grade_applying_for}
                    onChange={(e) => setNewLead({ ...newLead, grade_applying_for: e.target.value })}
                    className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">Priority</label>
                  <select
                    value={newLead.priority}
                    onChange={(e) => setNewLead({ ...newLead, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  Parent/Guardian Name *
                </label>
                <input
                  type="text"
                  value={newLead.parent_name}
                  onChange={(e) => setNewLead({ ...newLead, parent_name: e.target.value })}
                  className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  placeholder="Enter parent name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newLead.parent_phone}
                    onChange={(e) => setNewLead({ ...newLead, parent_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    placeholder="+91-9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">Email</label>
                  <input
                    type="email"
                    value={newLead.parent_email}
                    onChange={(e) => setNewLead({ ...newLead, parent_email: e.target.value })}
                    className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">Notes</label>
                <textarea
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 rounded-lg bg-white dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddLead(false)}
                  className="flex-1 px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-500 text-apple-gray-600 dark:text-white rounded-lg hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLead}
                  disabled={isSaving || !newLead.student_name || !newLead.parent_name || !newLead.parent_phone}
                  className="flex-1 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Lead</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-apple-gray-600 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200 dark:border-apple-gray-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">Lead Details</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-apple-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <button
                  onClick={() => handleMoveStage(selectedLead, 'prev')}
                  disabled={selectedLead.stage === 'new_inquiry'}
                  className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-apple-gray-600 dark:text-white" />
                </button>
                <div className="text-center">
                  <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mb-1">Current Stage</p>
                  <p className="font-medium text-apple-gray-600 dark:text-white">
                    {STAGES.find((s) => s.id === selectedLead.stage)?.label}
                  </p>
                </div>
                <button
                  onClick={() => handleMoveStage(selectedLead, 'next')}
                  disabled={selectedLead.stage === 'enrolled'}
                  className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-600 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-apple-gray-600 dark:text-white" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">Student Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Student Name</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{selectedLead.student_name}</p>
                  </div>
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Grade Applying</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{selectedLead.grade_applying_for}</p>
                  </div>
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Date of Birth</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">
                      {formatDate(selectedLead.date_of_birth) || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Gender</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white capitalize">{selectedLead.gender}</p>
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
                    <p className="font-medium text-apple-gray-600 dark:text-white">{selectedLead.parent_name}</p>
                  </div>
                  <div>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Phone</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{selectedLead.parent_phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">Email</p>
                    <p className="font-medium text-apple-gray-600 dark:text-white">
                      {selectedLead.parent_email || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleCall(selectedLead.parent_phone)}
                  className="flex-1 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => selectedLead.parent_email && handleEmail(selectedLead.parent_email)}
                  disabled={!selectedLead.parent_email}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => handleSMS(selectedLead.parent_phone)}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center space-x-2"
                >
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
