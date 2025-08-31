import React, { useState, useEffect } from 'react';
import { coursesApi } from '../../../services/allocationApi';
import { Course } from '../../../types/allocation';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Clock,
  Microscope,
  AlertTriangle,
  CheckCircle2,
  Save,
  X,
  Settings
} from 'lucide-react';

export const CoursesAllocationPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'theory' | 'lab' | 'mixed'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    subject_type: 'theory' as 'theory' | 'lab' | 'mixed',
    weekly_theory_periods: 0,
    weekly_lab_periods: 0,
    lab_block_size: 2,
    constraints: {},
    active: true
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (editingCourse) {
        await coursesApi.update(editingCourse.id, formData);
      } else {
        await coursesApi.create({
          ...formData
        });
      }
      
      await fetchCourses();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      subject_type: course.subject_type,
      weekly_theory_periods: course.weekly_theory_periods,
      weekly_lab_periods: course.weekly_lab_periods,
      lab_block_size: course.lab_block_size,
      constraints: course.constraints,
      active: course.active
    });
    setShowForm(true);
  };

  const handleDelete = async (course: Course) => {
    if (confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      try {
        await coursesApi.delete(course.id);
        await fetchCourses();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete course');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      subject_type: 'theory',
      weekly_theory_periods: 0,
      weekly_lab_periods: 0,
      lab_block_size: 2,
      constraints: {},
      active: true
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const getSubjectTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Microscope className="w-5 h-5 text-purple-500" />;
      case 'mixed':
        return <Settings className="w-5 h-5 text-orange-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case 'lab':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mixed':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || course.subject_type === filterType;
    return matchesSearch && matchesFilter;
  });

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
              Courses Management
            </h2>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              {filteredCourses.length} of {courses.length} courses
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by name or code..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
          >
            <option value="all">All Types</option>
            <option value="theory">Theory Only</option>
            <option value="lab">Lab Only</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="apple-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getSubjectTypeColor(course.subject_type)}`}>
                  {getSubjectTypeIcon(course.subject_type)}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                      {course.title}
                    </h3>
                    <span className="px-2 py-1 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-full text-sm font-mono">
                      {course.code}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getSubjectTypeColor(course.subject_type)}`}>
                      {course.subject_type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-2">
                    {course.weekly_theory_periods > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.weekly_theory_periods} theory/week</span>
                      </div>
                    )}
                    {course.weekly_lab_periods > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        <Microscope className="w-4 h-4" />
                        <span>{course.weekly_lab_periods} lab/week (block: {course.lab_block_size})</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      {course.active ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {course.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  {course.description && (
                    <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-2">
                      {course.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="p-2 text-apple-gray-400 hover:text-apple-blue-500 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(course)}
                  className="p-2 text-apple-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredCourses.length === 0 && (
          <div className="apple-card p-12 text-center">
            <BookOpen className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
              {searchTerm || filterType !== 'all' ? 'No Courses Found' : 'No Courses Created'}
            </h3>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first course to start building the curriculum'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Course</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
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
                    Course Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    placeholder="e.g., MATH8, PHY10, ENG12"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    placeholder="e.g., Mathematics Grade 8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Subject Type *
                  </label>
                  <select
                    value={formData.subject_type}
                    onChange={(e) => setFormData({ ...formData, subject_type: e.target.value as 'theory' | 'lab' | 'mixed' })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    required
                  >
                    <option value="theory">Theory Only</option>
                    <option value="lab">Lab Only</option>
                    <option value="mixed">Theory + Lab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Weekly Theory Periods
                  </label>
                  <input
                    type="number"
                    value={formData.weekly_theory_periods}
                    onChange={(e) => setFormData({ ...formData, weekly_theory_periods: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="0"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Weekly Lab Periods
                  </label>
                  <input
                    type="number"
                    value={formData.weekly_lab_periods}
                    onChange={(e) => setFormData({ ...formData, weekly_lab_periods: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="0"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Lab Block Size
                  </label>
                  <select
                    value={formData.lab_block_size}
                    onChange={(e) => setFormData({ ...formData, lab_block_size: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  >
                    <option value={1}>1 Period</option>
                    <option value={2}>2 Periods</option>
                    <option value={3}>3 Periods</option>
                  </select>
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
                  <span>{editingCourse ? 'Update Course' : 'Create Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && !showForm && (
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