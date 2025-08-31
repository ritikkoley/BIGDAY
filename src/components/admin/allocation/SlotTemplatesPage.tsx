import React, { useState, useEffect } from 'react';
import { slotTemplatesApi, cohortsApi } from '../../../services/allocationApi';
import { SlotTemplate, SlotTemplateAssignment, Cohort } from '../../../types/allocation';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Calendar,
  AlertTriangle,
  Save,
  X,
  Link
} from 'lucide-react';

export const SlotTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<SlotTemplate[]>([]);
  const [assignments, setAssignments] = useState<SlotTemplateAssignment[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SlotTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SlotTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    days_per_week: 5,
    periods_per_day: 8,
    bells: {
      '1': '08:00-08:45',
      '2': '08:45-09:30',
      '3': '09:30-10:15',
      '4': '10:35-11:20',
      '5': '11:20-12:05',
      '6': '12:05-12:50',
      '7': '13:30-14:15',
      '8': '14:15-15:00'
    }
  });

  const [assignForm, setAssignForm] = useState({
    template_id: '',
    assignment_type: 'cohort' as 'cohort' | 'section',
    cohort_id: '',
    section_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [templatesData, assignmentsData, cohortsData] = await Promise.all([
        slotTemplatesApi.getAll(),
        slotTemplatesApi.getAssignments(),
        cohortsApi.getAll()
      ]);
      
      setTemplates(templatesData);
      setAssignments(assignmentsData);
      setCohorts(cohortsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slot templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (editingTemplate) {
        await slotTemplatesApi.update(editingTemplate.id, formData);
      } else {
        await slotTemplatesApi.create({
          ...formData
        });
      }
      
      await fetchData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (assignForm.assignment_type === 'cohort' && assignForm.cohort_id) {
        await slotTemplatesApi.assignToCohort(assignForm.template_id, assignForm.cohort_id);
      } else if (assignForm.assignment_type === 'section' && assignForm.section_id) {
        await slotTemplatesApi.assignToSection(assignForm.template_id, assignForm.section_id);
      }
      
      await fetchData();
      resetAssignForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign template');
    }
  };

  const handleEdit = (template: SlotTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      days_per_week: template.days_per_week,
      periods_per_day: template.periods_per_day,
      bells: template.bells || {}
    });
    setShowForm(true);
  };

  const handleDelete = async (template: SlotTemplate) => {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        await slotTemplatesApi.delete(template.id);
        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete template');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      days_per_week: 5,
      periods_per_day: 8,
      bells: {
        '1': '08:00-08:45',
        '2': '08:45-09:30',
        '3': '09:30-10:15',
        '4': '10:35-11:20',
        '5': '11:20-12:05',
        '6': '12:05-12:50',
        '7': '13:30-14:15',
        '8': '14:15-15:00'
      }
    });
    setEditingTemplate(null);
    setShowForm(false);
  };

  const resetAssignForm = () => {
    setAssignForm({
      template_id: '',
      assignment_type: 'cohort',
      cohort_id: '',
      section_id: ''
    });
    setSelectedTemplate(null);
    setShowAssignForm(false);
  };

  const updateBellTime = (period: string, time: string) => {
    setFormData(prev => ({
      ...prev,
      bells: {
        ...prev.bells,
        [period]: time
      }
    }));
  };

  const getAssignmentInfo = (template: SlotTemplate) => {
    const templateAssignments = assignments.filter(a => a.slot_template_id === template.id);
    return templateAssignments.map(assignment => {
      if (assignment.cohort) {
        return `${assignment.cohort.stream} Grade ${assignment.cohort.grade}`;
      } else if (assignment.section) {
        return `Section ${assignment.section.name}`;
      }
      return 'Unknown';
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Slot Templates Management
            </h2>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Define period schedules and bell times for different academic groups
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAssignForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Link className="w-4 h-4" />
              <span>Assign Template</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6">
        {templates.map((template) => {
          const assignmentInfo = getAssignmentInfo(template);
          
          return (
            <div key={template.id} className="apple-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-apple-blue-50 dark:bg-apple-blue-900/30 rounded-lg">
                    <Clock className="w-6 h-6 text-apple-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                      {template.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {template.days_per_week} days × {template.periods_per_day} periods
                      </span>
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        Assigned to: {assignmentInfo.length > 0 ? assignmentInfo.join(', ') : 'None'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setAssignForm(prev => ({ ...prev, template_id: template.id }));
                      setShowAssignForm(true);
                    }}
                    className="p-2 text-apple-gray-400 hover:text-green-500 transition-colors"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-2 text-apple-gray-400 hover:text-apple-blue-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template)}
                    className="p-2 text-apple-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bell Times Preview */}
              {template.bells && Object.keys(template.bells).length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-apple-gray-600 dark:text-white mb-3">
                    Bell Schedule
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(template.bells).map(([period, time]) => (
                      <div key={period} className="flex items-center space-x-2 text-sm">
                        <span className="font-medium text-apple-gray-500 dark:text-apple-gray-400">
                          P{period}:
                        </span>
                        <span className="text-apple-gray-600 dark:text-white font-mono">
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {templates.length === 0 && (
          <div className="apple-card p-12 text-center">
            <Clock className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
              No Slot Templates Created
            </h3>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mb-4">
              Create your first slot template to define period schedules
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Template</span>
            </button>
          </div>
        )}
      </div>

      {/* Template Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  {editingTemplate ? 'Edit Slot Template' : 'Create New Slot Template'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    placeholder="e.g., Standard 8 Period Schedule"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Days Per Week
                  </label>
                  <select
                    value={formData.days_per_week}
                    onChange={(e) => setFormData({ ...formData, days_per_week: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  >
                    <option value={5}>5 Days (Mon-Fri)</option>
                    <option value={6}>6 Days (Mon-Sat)</option>
                    <option value={7}>7 Days (Mon-Sun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Periods Per Day
                  </label>
                  <input
                    type="number"
                    value={formData.periods_per_day}
                    onChange={(e) => {
                      const periods = parseInt(e.target.value) || 8;
                      setFormData({ ...formData, periods_per_day: periods });
                      
                      // Update bells to match period count
                      const newBells: Record<string, string> = {};
                      for (let i = 1; i <= periods; i++) {
                        newBells[i.toString()] = formData.bells[i.toString()] || `${7 + i}:00-${7 + i}:45`;
                      }
                      setFormData(prev => ({ ...prev, bells: newBells }));
                    }}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="4"
                    max="12"
                  />
                </div>
              </div>

              {/* Bell Times Editor */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-4 h-4 text-apple-blue-500" />
                  <h3 className="font-medium text-apple-gray-600 dark:text-white">
                    Bell Schedule
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: formData.periods_per_day }, (_, i) => {
                    const period = (i + 1).toString();
                    return (
                      <div key={period}>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Period {period}
                        </label>
                        <input
                          type="text"
                          value={formData.bells[period] || ''}
                          onChange={(e) => updateBellTime(period, e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500 font-mono text-sm"
                          placeholder="08:00-08:45"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTemplate ? 'Update Template' : 'Create Template'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Form Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  Assign Template
                </h2>
                <button
                  onClick={resetAssignForm}
                  className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Template *
                </label>
                <select
                  value={assignForm.template_id}
                  onChange={(e) => setAssignForm({ ...assignForm, template_id: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  required
                >
                  <option value="">Select Template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Assignment Type *
                </label>
                <select
                  value={assignForm.assignment_type}
                  onChange={(e) => setAssignForm({ 
                    ...assignForm, 
                    assignment_type: e.target.value as 'cohort' | 'section',
                    cohort_id: '',
                    section_id: ''
                  })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  required
                >
                  <option value="cohort">Assign to Cohort</option>
                  <option value="section">Assign to Section</option>
                </select>
              </div>

              {assignForm.assignment_type === 'cohort' && (
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Cohort *
                  </label>
                  <select
                    value={assignForm.cohort_id}
                    onChange={(e) => setAssignForm({ ...assignForm, cohort_id: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    required
                  >
                    <option value="">Select Cohort</option>
                    {cohorts.map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.stream} Grade {cohort.grade}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
                <button
                  type="button"
                  onClick={resetAssignForm}
                  className="px-6 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
                >
                  <Link className="w-4 h-4" />
                  <span>Assign Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};