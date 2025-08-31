import React, { useState, useEffect } from 'react';
import { cohortsApi, sectionsApi, academicTermsApi } from '../../../services/allocationApi';
import { Cohort, Section, AcademicTerm } from '../../../types/allocation';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  GraduationCap,
  Home,
  UserPlus,
  Upload,
  Download,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';

export const CohortsSectionsPage: React.FC = () => {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([]);
  const [expandedCohort, setExpandedCohort] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCohortForm, setShowCohortForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [selectedCohortForSection, setSelectedCohortForSection] = useState<string | null>(null);
  
  const [cohortForm, setCohortForm] = useState({
    academic_term_id: '',
    stream: '',
    grade: '',
    boarding_type: 'day_scholar' as 'hosteller' | 'day_scholar',
    periods_per_day: 8,
    days_per_week: 5
  });

  const [sectionForm, setSectionForm] = useState({
    name: '',
    cohort_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [cohortsData, termsData] = await Promise.all([
        cohortsApi.getAll(),
        academicTermsApi.getAll()
      ]);
      
      setCohorts(cohortsData);
      setAcademicTerms(termsData);
      
      // Set default academic term
      if (termsData.length > 0 && !cohortForm.academic_term_id) {
        setCohortForm(prev => ({ ...prev, academic_term_id: termsData[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      // Get institution ID (assuming first institution)
      const { data: institutions } = await supabase
        .from('institutions')
        .select('id')
        .limit(1);
      
      const institutionId = institutions?.[0]?.id;
      if (!institutionId) throw new Error('No institution found');

      if (editingCohort) {
        await cohortsApi.update(editingCohort.id, cohortForm);
      } else {
        await cohortsApi.create({
          ...cohortForm,
          institution_id: institutionId
        });
      }
      
      await fetchData();
      resetCohortForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save cohort');
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (editingSection) {
        await sectionsApi.update(editingSection.id, sectionForm);
      } else {
        await sectionsApi.create(sectionForm);
      }
      
      await fetchData();
      resetSectionForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save section');
    }
  };

  const handleEditCohort = (cohort: Cohort) => {
    setEditingCohort(cohort);
    setCohortForm({
      academic_term_id: cohort.academic_term_id,
      stream: cohort.stream,
      grade: cohort.grade,
      boarding_type: cohort.boarding_type,
      periods_per_day: cohort.periods_per_day,
      days_per_week: cohort.days_per_week
    });
    setShowCohortForm(true);
  };

  const handleEditSection = (section: Section, cohortId: string) => {
    setEditingSection(section);
    setSectionForm({
      name: section.name,
      cohort_id: cohortId
    });
    setShowSectionForm(true);
  };

  const handleDeleteCohort = async (cohort: Cohort) => {
    if (confirm(`Are you sure you want to delete cohort "${cohort.stream} Grade ${cohort.grade}"? This will also delete all sections and their data.`)) {
      try {
        await cohortsApi.delete(cohort.id);
        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete cohort');
      }
    }
  };

  const handleDeleteSection = async (section: Section) => {
    if (confirm(`Are you sure you want to delete section "${section.name}"?`)) {
      try {
        await sectionsApi.delete(section.id);
        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete section');
      }
    }
  };

  const resetCohortForm = () => {
    setCohortForm({
      academic_term_id: academicTerms[0]?.id || '',
      stream: '',
      grade: '',
      boarding_type: 'day_scholar',
      periods_per_day: 8,
      days_per_week: 5
    });
    setEditingCohort(null);
    setShowCohortForm(false);
  };

  const resetSectionForm = () => {
    setSectionForm({
      name: '',
      cohort_id: selectedCohortForSection || ''
    });
    setEditingSection(null);
    setShowSectionForm(false);
    setSelectedCohortForSection(null);
  };

  const getBoardingTypeColor = (type: string) => {
    return type === 'hosteller'
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
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
              Cohorts & Sections Management
            </h2>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              {cohorts.length} cohorts with {cohorts.reduce((sum, c) => sum + (c.sections?.length || 0), 0)} sections
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCohortForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Cohort</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cohorts List */}
      <div className="space-y-4">
        {cohorts.map((cohort) => {
          const isExpanded = expandedCohort === cohort.id;
          
          return (
            <div key={cohort.id} className="apple-card overflow-hidden">
              <button
                onClick={() => setExpandedCohort(isExpanded ? null : cohort.id)}
                className="w-full p-6 text-left hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-apple-blue-50 dark:bg-apple-blue-900/30 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-apple-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                        {cohort.stream} - Grade {cohort.grade}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBoardingTypeColor(cohort.boarding_type)}`}>
                          {cohort.boarding_type.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                          {cohort.academic_term?.name}
                        </span>
                        <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                          {cohort.sections?.length || 0} sections
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCohort(cohort);
                      }}
                      className="p-2 text-apple-gray-400 hover:text-apple-blue-500 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCohort(cohort);
                      }}
                      className="p-2 text-apple-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-apple-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-apple-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
                  <div className="flex items-center justify-between mb-4 pt-4">
                    <h4 className="text-md font-medium text-apple-gray-600 dark:text-white">
                      Sections
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedCohortForSection(cohort.id);
                        setSectionForm(prev => ({ ...prev, cohort_id: cohort.id }));
                        setShowSectionForm(true);
                      }}
                      className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cohort.sections?.map((section) => (
                      <div
                        key={section.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-apple-gray-200 dark:border-apple-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Home className="w-4 h-4 text-apple-blue-500" />
                            <h5 className="font-medium text-apple-gray-600 dark:text-white">
                              Section {section.name}
                            </h5>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEditSection(section, cohort.id)}
                              className="p-1 text-apple-gray-400 hover:text-apple-blue-500 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSection(section)}
                              className="p-1 text-apple-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-apple-gray-400 dark:text-apple-gray-300">Students:</span>
                            <span className="font-medium text-apple-gray-600 dark:text-white">
                              {section.students?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-apple-gray-400 dark:text-apple-gray-300">Courses:</span>
                            <span className="font-medium text-apple-gray-600 dark:text-white">
                              {section.courses?.length || 0}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-apple-gray-200 dark:border-apple-gray-600">
                          <button className="flex items-center space-x-2 text-sm text-apple-blue-500 hover:text-apple-blue-600 transition-colors">
                            <UserPlus className="w-4 h-4" />
                            <span>Manage Students</span>
                          </button>
                        </div>
                      </div>
                    )) || []}
                    
                    {(!cohort.sections || cohort.sections.length === 0) && (
                      <div className="col-span-full text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No sections created yet</p>
                        <button
                          onClick={() => {
                            setSelectedCohortForSection(cohort.id);
                            setSectionForm(prev => ({ ...prev, cohort_id: cohort.id }));
                            setShowSectionForm(true);
                          }}
                          className="mt-2 text-apple-blue-500 hover:text-apple-blue-600 text-sm"
                        >
                          Create first section
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {cohorts.length === 0 && (
          <div className="apple-card p-12 text-center">
            <Users className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
              No Cohorts Created
            </h3>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mb-4">
              Create your first cohort to start organizing students into academic groups
            </p>
            <button
              onClick={() => setShowCohortForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Cohort</span>
            </button>
          </div>
        )}
      </div>

      {/* Cohort Form Modal */}
      {showCohortForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  {editingCohort ? 'Edit Cohort' : 'Create New Cohort'}
                </h2>
                <button
                  onClick={resetCohortForm}
                  className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateCohort} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Academic Term *
                  </label>
                  <select
                    value={cohortForm.academic_term_id}
                    onChange={(e) => setCohortForm({ ...cohortForm, academic_term_id: e.target.value })}
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
                    Stream *
                  </label>
                  <input
                    type="text"
                    value={cohortForm.stream}
                    onChange={(e) => setCohortForm({ ...cohortForm, stream: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    placeholder="e.g., Science, Commerce, Arts"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Grade *
                  </label>
                  <select
                    value={cohortForm.grade}
                    onChange={(e) => setCohortForm({ ...cohortForm, grade: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    required
                  >
                    <option value="">Select Grade</option>
                    {['6', '7', '8', '9', '10', '11', '12'].map((grade) => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Boarding Type *
                  </label>
                  <select
                    value={cohortForm.boarding_type}
                    onChange={(e) => setCohortForm({ ...cohortForm, boarding_type: e.target.value as 'hosteller' | 'day_scholar' })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    required
                  >
                    <option value="day_scholar">Day Scholar</option>
                    <option value="hosteller">Hosteller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Periods Per Day
                  </label>
                  <input
                    type="number"
                    value={cohortForm.periods_per_day}
                    onChange={(e) => setCohortForm({ ...cohortForm, periods_per_day: parseInt(e.target.value) || 8 })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="4"
                    max="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Days Per Week
                  </label>
                  <select
                    value={cohortForm.days_per_week}
                    onChange={(e) => setCohortForm({ ...cohortForm, days_per_week: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  >
                    <option value={5}>5 Days (Mon-Fri)</option>
                    <option value={6}>6 Days (Mon-Sat)</option>
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
                  onClick={resetCohortForm}
                  className="px-6 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCohort ? 'Update Cohort' : 'Create Cohort'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Form Modal */}
      {showSectionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  {editingSection ? 'Edit Section' : 'Create New Section'}
                </h2>
                <button
                  onClick={resetSectionForm}
                  className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateSection} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Cohort
                </label>
                <select
                  value={sectionForm.cohort_id}
                  onChange={(e) => setSectionForm({ ...sectionForm, cohort_id: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  required
                  disabled={!!selectedCohortForSection}
                >
                  <option value="">Select Cohort</option>
                  {cohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.stream} Grade {cohort.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Section Name *
                </label>
                <input
                  type="text"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  placeholder="e.g., A, B, C"
                  required
                />
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
                  onClick={resetSectionForm}
                  className="px-6 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSection ? 'Update Section' : 'Create Section'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};