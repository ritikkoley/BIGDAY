import React, { useState, useEffect } from 'react';
import { coursesApi } from '../../services/timetableApi';
import { Course } from '../../types/timetable';
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
  X
} from 'lucide-react';

export const CoursesManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    weekly_theory_periods: 0,
    weekly_lab_periods: 0,
    lab_block_size: 2,
    constraints: {},
    active: true
  });

  useEffect(() => {
    // Don't fetch courses until table exists
    setIsLoading(false);
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (err) {
      console.warn('Courses not available:', err);
      setError('Courses management will be available after database migration');
      setCourses([]);
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
        await coursesApi.create(formData);
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
      description: course.description || '',
      weekly_theory_periods: course.weekly_theory_periods,
      weekly_lab_periods: course.weekly_lab_periods,
      lab_block_size: course.lab_block_size,
      constraints: course.constraints,
      active: course.active
    });
    setShowForm(true);
  };

  const handleDelete = async (course: Course) => {
    if (confirm(`Are you sure you want to delete ${course.title}?`)) {
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
      description: '',
      weekly_theory_periods: 0,
      weekly_lab_periods: 0,
      lab_block_size: 2,
      constraints: {},
      active: true
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <BookOpen className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Courses Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Manage subjects and their scheduling requirements
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
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
          <button className="flex items-center space-x-2 px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="apple-card">
        <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Courses ({filteredCourses.length})
          </h2>
        </div>
        
        <div className="divide-y divide-apple-gray-200/50 dark:divide-apple-gray-500/20">
          {filteredCourses.map((course) => (
            <div key={course.id} className="p-6 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-apple-blue-50 dark:bg-apple-blue-900/30 rounded-lg">
                    <BookOpen className="w-6 h-6 text-apple-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-apple-gray-600 dark:text-white">
                      {course.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        Code: {course.code}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-apple-gray-400" />
                        <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                          {course.weekly_theory_periods} theory
                        </span>
                      </div>
                      {course.weekly_lab_periods > 0 && (
                        <div className="flex items-center space-x-2">
                          <Microscope className="w-4 h-4 text-apple-gray-400" />
                          <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                            {course.weekly_lab_periods} lab
                          </span>
                        </div>
                      )}
                    </div>
                    {course.description && (
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                        {course.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {course.active ? 'Active' : 'Inactive'}
                  </span>
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
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                Courses Management Not Available
              </h3>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                Database migration required to enable course management
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
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
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    placeholder="e.g., MATH101"
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
                    placeholder="e.g., Advanced Mathematics"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
                    placeholder="Course description..."
                  />
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

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    value={formData.active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
        </div>
      )}
    </div>
  );
};