import React, { useState, useEffect } from 'react';
import { groupsApi, academicTermsApi, groupCoursesApi, coursesApi } from '../../services/timetableApi';
import { Group, AcademicTerm, GroupCourse, Course } from '../../types/timetable';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Settings,
  Clock,
  Calendar,
  AlertTriangle,
  Save,
  X,
  BookOpen,
  User
} from 'lucide-react';

export const GroupsManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupCourses, setGroupCourses] = useState<GroupCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState<'groups' | 'courses'>('groups');
  const [formData, setFormData] = useState({
    name: '',
    academic_term_id: '',
    period_length_minutes: 45,
    days_per_week: 6,
    periods_per_day: 8,
    max_daily_periods: 7,
    lab_block_size: 2,
    business_hours: {
      monday: [0,1,2,3,4,5,6,7],
      tuesday: [0,1,2,3,4,5,6,7],
      wednesday: [0,1,2,3,4,5,6,7],
      thursday: [0,1,2,3,4,5,6,7],
      friday: [0,1,2,3,4,5,6,7],
      saturday: [0,1,2,3,4,5,6,7]
    },
    holiday_calendar: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupCourses(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [groupsData, termsData, coursesData] = await Promise.all([
        groupsApi.getAll(),
        academicTermsApi.getAll(),
        coursesApi.getAll()
      ]);
      
      setGroups(groupsData);
      setAcademicTerms(termsData);
      setCourses(coursesData);
      
      if (groupsData.length > 0 && !selectedGroup) {
        setSelectedGroup(groupsData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupCourses = async (groupId: string) => {
    try {
      const data = await groupCoursesApi.getByGroup(groupId);
      setGroupCourses(data);
    } catch (err) {
      console.error('Error fetching group courses:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (editingGroup) {
        await groupsApi.update(editingGroup.id, formData);
      } else {
        await groupsApi.create(formData);
      }
      
      await fetchData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save group');
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      academic_term_id: group.academic_term_id,
      period_length_minutes: group.period_length_minutes,
      days_per_week: group.days_per_week,
      periods_per_day: group.periods_per_day,
      max_daily_periods: group.max_daily_periods,
      lab_block_size: group.lab_block_size,
      business_hours: group.business_hours,
      holiday_calendar: group.holiday_calendar
    });
    setShowForm(true);
  };

  const handleDelete = async (group: Group) => {
    if (confirm(`Are you sure you want to delete ${group.name}?`)) {
      try {
        await groupsApi.delete(group.id);
        await fetchData();
        if (selectedGroup?.id === group.id) {
          setSelectedGroup(groups[0] || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete group');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      academic_term_id: '',
      period_length_minutes: 45,
      days_per_week: 6,
      periods_per_day: 8,
      max_daily_periods: 7,
      lab_block_size: 2,
      business_hours: {
        monday: [0,1,2,3,4,5,6,7],
        tuesday: [0,1,2,3,4,5,6,7],
        wednesday: [0,1,2,3,4,5,6,7],
        thursday: [0,1,2,3,4,5,6,7],
        friday: [0,1,2,3,4,5,6,7],
        saturday: [0,1,2,3,4,5,6,7]
      },
      holiday_calendar: []
    });
    setEditingGroup(null);
    setShowForm(false);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Groups Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Manage academic classes and their course assignments
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="apple-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups List */}
        <div className="lg:col-span-1">
          <div className="apple-card">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                Groups ({filteredGroups.length})
              </h2>
            </div>
            
            <div className="divide-y divide-apple-gray-200/50 dark:divide-apple-gray-500/20 max-h-96 overflow-y-auto">
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`w-full text-left p-4 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/30 transition-colors ${
                    selectedGroup?.id === group.id ? 'bg-apple-blue-50 dark:bg-apple-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-apple-gray-600 dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                        {group.academic_term?.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(group);
                        }}
                        className="p-1 text-apple-gray-400 hover:text-apple-blue-500 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(group);
                        }}
                        className="p-1 text-apple-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Group Details */}
        <div className="lg:col-span-2">
          {selectedGroup ? (
            <div className="apple-card">
              {/* Tabs */}
              <div className="border-b border-apple-gray-200/50 dark:border-apple-gray-500/20 px-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('groups')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'groups'
                        ? 'border-apple-blue-500 text-apple-blue-500'
                        : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
                    }`}
                  >
                    Group Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'courses'
                        ? 'border-apple-blue-500 text-apple-blue-500'
                        : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
                    }`}
                  >
                    Course Assignments ({groupCourses.length})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'groups' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                          <Users className="w-4 h-4" />
                          <span>Group Name</span>
                        </div>
                        <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
                          {selectedGroup.name}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                          <Calendar className="w-4 h-4" />
                          <span>Academic Term</span>
                        </div>
                        <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
                          {selectedGroup.academic_term?.name}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                          <Clock className="w-4 h-4" />
                          <span>Period Length</span>
                        </div>
                        <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
                          {selectedGroup.period_length_minutes} minutes
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                          <Settings className="w-4 h-4" />
                          <span>Schedule</span>
                        </div>
                        <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
                          {selectedGroup.days_per_week} days × {selectedGroup.periods_per_day} periods
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                        Course Assignments
                      </h3>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Assign Course</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {groupCourses.map((groupCourse) => (
                        <div
                          key={groupCourse.id}
                          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-apple-gray-200 dark:border-apple-gray-600"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-apple-blue-50 dark:bg-apple-blue-900/30 rounded-lg">
                                <BookOpen className="w-5 h-5 text-apple-blue-500" />
                              </div>
                              <div>
                                <h4 className="font-medium text-apple-gray-600 dark:text-white">
                                  {groupCourse.course?.title}
                                </h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                                    Code: {groupCourse.course?.code}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-apple-gray-400" />
                                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                                      {groupCourse.teacher?.full_name || 'No teacher assigned'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                                  Theory: {groupCourse.weekly_theory_periods || groupCourse.course?.weekly_theory_periods || 0}
                                </div>
                                <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                                  Lab: {groupCourse.weekly_lab_periods || groupCourse.course?.weekly_lab_periods || 0}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="p-2 text-apple-gray-400 hover:text-apple-blue-500 transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-apple-gray-400 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {groupCourses.length === 0 && (
                        <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No courses assigned to this group</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="apple-card p-6 text-center">
              <Users className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                No Group Selected
              </h3>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                Select a group from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Group Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  {editingGroup ? 'Edit Group' : 'Add New Group'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    placeholder="e.g., Grade 10 - A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Academic Term *
                  </label>
                  <select
                    value={formData.academic_term_id}
                    onChange={(e) => setFormData({ ...formData, academic_term_id: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    required
                  >
                    <option value="">Select Academic Term</option>
                    {academicTerms.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Period Length (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.period_length_minutes}
                    onChange={(e) => setFormData({ ...formData, period_length_minutes: parseInt(e.target.value) || 45 })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="30"
                    max="90"
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
                    onChange={(e) => setFormData({ ...formData, periods_per_day: parseInt(e.target.value) || 8 })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="4"
                    max="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Max Daily Periods
                  </label>
                  <input
                    type="number"
                    value={formData.max_daily_periods}
                    onChange={(e) => setFormData({ ...formData, max_daily_periods: parseInt(e.target.value) || 7 })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="1"
                    max={formData.periods_per_day}
                  />
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
                  <span>{editingGroup ? 'Update Group' : 'Create Group'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
        </div>
      )}
    </div>
  );
};