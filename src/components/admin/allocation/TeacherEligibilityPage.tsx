import React, { useState, useEffect } from 'react';
import { teacherEligibilityApi, coursesApi } from '../../../services/allocationApi';
import { TeacherEligibilityMatrix, Course } from '../../../types/allocation';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Settings,
  Check,
  X,
  AlertTriangle,
  Save,
  Clock,
  Calendar
} from 'lucide-react';

export const TeacherEligibilityPage: React.FC = () => {
  const [matrix, setMatrix] = useState<TeacherEligibilityMatrix[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [showLoadRulesForm, setShowLoadRulesForm] = useState(false);
  const [loadRulesForm, setLoadRulesForm] = useState({
    max_periods_per_day: 6,
    max_periods_per_week: 30,
    availability: {
      monday: [1,2,3,4,5,6,7,8],
      tuesday: [1,2,3,4,5,6,7,8],
      wednesday: [1,2,3,4,5,6,7,8],
      thursday: [1,2,3,4,5,6,7,8],
      friday: [1,2,3,4,5,6,7,8],
      saturday: [1,2,3,4,5,6,7,8]
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [matrixData, coursesData] = await Promise.all([
        teacherEligibilityApi.getMatrix(),
        coursesApi.getAll()
      ]);
      
      setMatrix(matrixData);
      setCourses(coursesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teacher eligibility data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectEligibilityToggle = async (teacherId: string, courseId: string, eligible: boolean) => {
    try {
      await teacherEligibilityApi.updateSubjectEligibility(teacherId, courseId, eligible);
      
      // Update local state
      setMatrix(prev => prev.map(teacher => 
        teacher.teacher_id === teacherId
          ? {
              ...teacher,
              subjects: teacher.subjects.map(subject =>
                subject.course_id === courseId
                  ? { ...subject, eligible }
                  : subject
              )
            }
          : teacher
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subject eligibility');
    }
  };

  const handleGradeEligibilityToggle = async (teacherId: string, grade: string, eligible: boolean) => {
    try {
      await teacherEligibilityApi.updateGradeEligibility(teacherId, grade, eligible);
      
      // Update local state
      setMatrix(prev => prev.map(teacher => 
        teacher.teacher_id === teacherId
          ? {
              ...teacher,
              grades: teacher.grades.map(g =>
                g.grade === grade
                  ? { ...g, eligible }
                  : g
              )
            }
          : teacher
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update grade eligibility');
    }
  };

  const handleLoadRulesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    
    try {
      setError(null);
      await teacherEligibilityApi.updateLoadRules(selectedTeacher, loadRulesForm);
      await fetchData();
      setShowLoadRulesForm(false);
      setSelectedTeacher(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update load rules');
    }
  };

  const openLoadRulesForm = (teacher: TeacherEligibilityMatrix) => {
    setSelectedTeacher(teacher.teacher_id);
    setLoadRulesForm({
      max_periods_per_day: teacher.load_rules?.max_periods_per_day || 6,
      max_periods_per_week: teacher.load_rules?.max_periods_per_week || 30,
      availability: teacher.load_rules?.availability || {
        monday: [1,2,3,4,5,6,7,8],
        tuesday: [1,2,3,4,5,6,7,8],
        wednesday: [1,2,3,4,5,6,7,8],
        thursday: [1,2,3,4,5,6,7,8],
        friday: [1,2,3,4,5,6,7,8],
        saturday: [1,2,3,4,5,6,7,8]
      }
    });
    setShowLoadRulesForm(true);
  };

  const togglePeriodAvailability = (day: string, period: number) => {
    setLoadRulesForm(prev => {
      const dayPeriods = prev.availability[day] || [];
      const newPeriods = dayPeriods.includes(period)
        ? dayPeriods.filter(p => p !== period)
        : [...dayPeriods, period].sort((a, b) => a - b);
      
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: newPeriods
        }
      };
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
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Teacher Eligibility Matrix
            </h2>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Configure which subjects and grades each teacher can handle
            </p>
          </div>
        </div>
      </div>

      {/* Teacher Cards */}
      <div className="grid gap-6">
        {matrix.map((teacher) => (
          <div key={teacher.teacher_id} className="apple-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-apple-blue-50 dark:bg-apple-blue-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-apple-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {teacher.teacher_name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Max: {teacher.load_rules?.max_periods_per_day || 6} periods/day
                    </span>
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Subjects: {teacher.subjects.filter(s => s.eligible).length}
                    </span>
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Grades: {teacher.grades.filter(g => g.eligible).length}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openLoadRulesForm(teacher)}
                className="flex items-center space-x-2 px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Load Rules</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Eligibility */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-4 h-4 text-apple-blue-500" />
                  <h4 className="font-medium text-apple-gray-600 dark:text-white">
                    Subject Eligibility
                  </h4>
                </div>
                <div className="space-y-2">
                  {teacher.subjects.map((subject) => (
                    <div
                      key={subject.course_id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-apple-gray-600 dark:text-white">
                        {subject.course_title}
                      </span>
                      <button
                        onClick={() => handleSubjectEligibilityToggle(
                          teacher.teacher_id,
                          subject.course_id,
                          !subject.eligible
                        )}
                        className={`p-1 rounded-full transition-colors ${
                          subject.eligible
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                        }`}
                      >
                        {subject.eligible ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade Eligibility */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <GraduationCap className="w-4 h-4 text-apple-blue-500" />
                  <h4 className="font-medium text-apple-gray-600 dark:text-white">
                    Grade Eligibility
                  </h4>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {teacher.grades.map((grade) => (
                    <button
                      key={grade.grade}
                      onClick={() => handleGradeEligibilityToggle(
                        teacher.teacher_id,
                        grade.grade,
                        !grade.eligible
                      )}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        grade.eligible
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      Grade {grade.grade}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {matrix.length === 0 && (
          <div className="apple-card p-12 text-center">
            <Users className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
              No Teachers Found
            </h3>
            <p className="text-apple-gray-400 dark:text-apple-gray-300">
              Add teachers to the system to configure their eligibility
            </p>
          </div>
        )}
      </div>

      {/* Load Rules Form Modal */}
      {showLoadRulesForm && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  Teacher Load Rules & Availability
                </h2>
                <button
                  onClick={() => {
                    setShowLoadRulesForm(false);
                    setSelectedTeacher(null);
                  }}
                  className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleLoadRulesSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Max Periods Per Day
                  </label>
                  <input
                    type="number"
                    value={loadRulesForm.max_periods_per_day}
                    onChange={(e) => setLoadRulesForm({ 
                      ...loadRulesForm, 
                      max_periods_per_day: parseInt(e.target.value) || 6 
                    })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="1"
                    max="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Max Periods Per Week
                  </label>
                  <input
                    type="number"
                    value={loadRulesForm.max_periods_per_week}
                    onChange={(e) => setLoadRulesForm({ 
                      ...loadRulesForm, 
                      max_periods_per_week: parseInt(e.target.value) || 30 
                    })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="1"
                    max="40"
                  />
                </div>
              </div>

              {/* Availability Calendar */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-4 h-4 text-apple-blue-500" />
                  <h3 className="font-medium text-apple-gray-600 dark:text-white">
                    Weekly Availability
                  </h3>
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    (Click periods to toggle availability)
                  </span>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                          Day
                        </th>
                        {Array.from({ length: 8 }, (_, i) => (
                          <th key={i} className="p-2 text-center text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                            P{i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(loadRulesForm.availability).map(([day, periods]) => (
                        <tr key={day}>
                          <td className="p-2 text-sm font-medium text-apple-gray-600 dark:text-white capitalize">
                            {day}
                          </td>
                          {Array.from({ length: 8 }, (_, i) => {
                            const period = i + 1;
                            const isAvailable = periods.includes(period);
                            
                            return (
                              <td key={i} className="p-1">
                                <button
                                  type="button"
                                  onClick={() => togglePeriodAvailability(day, period)}
                                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                                    isAvailable
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  }`}
                                >
                                  {isAvailable ? '✓' : '✗'}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  onClick={() => {
                    setShowLoadRulesForm(false);
                    setSelectedTeacher(null);
                  }}
                  className="px-6 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Load Rules</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && !showLoadRulesForm && (
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