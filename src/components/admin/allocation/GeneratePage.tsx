import React, { useState, useEffect } from 'react';
import { 
  academicTermsApi, 
  cohortsApi, 
  sectionsApi, 
  slotTemplatesApi, 
  timetablesApi,
  allocationSettingsApi 
} from '../../../services/allocationApi';
import { 
  AcademicTerm, 
  Cohort, 
  Section, 
  SlotTemplate, 
  TimetableGenerationResult,
  AllocationSettings 
} from '../../../types/allocation';
import { 
  Play, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Users,
  BookOpen,
  Zap,
  BarChart3
} from 'lucide-react';

export const GeneratePage: React.FC = () => {
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [slotTemplates, setSlotTemplates] = useState<SlotTemplate[]>([]);
  const [settings, setSettings] = useState<AllocationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<TimetableGenerationResult | null>(null);
  
  const [generationForm, setGenerationForm] = useState({
    academic_term_id: '',
    selected_sections: [] as string[],
    slot_template_id: '',
    constraints: {
      teacher_max_per_day_default: 6,
      enforce_lab_blocks: true,
      spread_course_days: true
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (generationForm.academic_term_id) {
      fetchCohortsByTerm(generationForm.academic_term_id);
    }
  }, [generationForm.academic_term_id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [termsData, templatesData, settingsData] = await Promise.all([
        academicTermsApi.getAll(),
        slotTemplatesApi.getAll(),
        allocationSettingsApi.get()
      ]);
      
      setAcademicTerms(termsData);
      setSlotTemplates(templatesData);
      setSettings(settingsData);
      
      // Set defaults
      if (termsData.length > 0) {
        setGenerationForm(prev => ({ 
          ...prev, 
          academic_term_id: termsData[0].id,
          constraints: {
            ...prev.constraints,
            teacher_max_per_day_default: settingsData?.teacher_max_periods_per_day || 6
          }
        }));
      }
      
      if (templatesData.length > 0) {
        setGenerationForm(prev => ({ ...prev, slot_template_id: templatesData[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch generation data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCohortsByTerm = async (termId: string) => {
    try {
      const cohortsData = await cohortsApi.getAll();
      const termCohorts = cohortsData.filter(c => c.academic_term_id === termId);
      setCohorts(termCohorts);
      
      // Get all sections for these cohorts
      const allSections: Section[] = [];
      for (const cohort of termCohorts) {
        const cohortSections = await sectionsApi.getByCohort(cohort.id);
        allSections.push(...cohortSections);
      }
      setSections(allSections);
      
      // Clear selected sections when term changes
      setGenerationForm(prev => ({ ...prev, selected_sections: [] }));
    } catch (err) {
      console.error('Error fetching cohorts:', err);
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setGenerationForm(prev => ({
      ...prev,
      selected_sections: prev.selected_sections.includes(sectionId)
        ? prev.selected_sections.filter(id => id !== sectionId)
        : [...prev.selected_sections, sectionId]
    }));
  };

  const handleSelectAllSections = () => {
    setGenerationForm(prev => ({
      ...prev,
      selected_sections: sections.map(s => s.id)
    }));
  };

  const handleDeselectAllSections = () => {
    setGenerationForm(prev => ({
      ...prev,
      selected_sections: []
    }));
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setGenerationResult(null);
      
      if (generationForm.selected_sections.length === 0) {
        throw new Error('Please select at least one section');
      }
      
      const result = await timetablesApi.generate({
        academic_term_id: generationForm.academic_term_id,
        section_ids: generationForm.selected_sections,
        use_slot_template: generationForm.slot_template_id || undefined,
        constraints: generationForm.constraints
      });
      
      setGenerationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate timetables');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSuccessRate = (result: TimetableGenerationResult) => {
    const totalRequired = result.section_results.reduce((sum, r) => sum + r.required, 0);
    const totalPlaced = result.section_results.reduce((sum, r) => sum + r.placed, 0);
    return totalRequired > 0 ? (totalPlaced / totalRequired) * 100 : 0;
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
      {/* Generation Wizard */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-apple-blue-50 dark:bg-apple-blue-900/30 rounded-lg">
            <Zap className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Timetable Generation Wizard
            </h2>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Configure parameters and generate automated timetables
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Academic Term *
              </label>
              <select
                value={generationForm.academic_term_id}
                onChange={(e) => setGenerationForm({ ...generationForm, academic_term_id: e.target.value })}
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
                Slot Template
              </label>
              <select
                value={generationForm.slot_template_id}
                onChange={(e) => setGenerationForm({ ...generationForm, slot_template_id: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              >
                <option value="">Use Section Default</option>
                {slotTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Constraints */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-4 h-4 text-apple-blue-500" />
                <h3 className="font-medium text-apple-gray-600 dark:text-white">
                  Generation Constraints
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Teacher Max Periods Per Day
                  </label>
                  <input
                    type="number"
                    value={generationForm.constraints.teacher_max_per_day_default}
                    onChange={(e) => setGenerationForm({
                      ...generationForm,
                      constraints: {
                        ...generationForm.constraints,
                        teacher_max_per_day_default: parseInt(e.target.value) || 6
                      }
                    })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    min="1"
                    max="8"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={generationForm.constraints.enforce_lab_blocks}
                      onChange={(e) => setGenerationForm({
                        ...generationForm,
                        constraints: {
                          ...generationForm.constraints,
                          enforce_lab_blocks: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 rounded focus:ring-apple-blue-500"
                    />
                    <span className="text-sm text-apple-gray-600 dark:text-white">
                      Enforce Lab Block Requirements
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={generationForm.constraints.spread_course_days}
                      onChange={(e) => setGenerationForm({
                        ...generationForm,
                        constraints: {
                          ...generationForm.constraints,
                          spread_course_days: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 rounded focus:ring-apple-blue-500"
                    />
                    <span className="text-sm text-apple-gray-600 dark:text-white">
                      Spread Course Sessions Across Days
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-apple-blue-500" />
                <h3 className="font-medium text-apple-gray-600 dark:text-white">
                  Select Sections
                </h3>
                <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  ({generationForm.selected_sections.length} selected)
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSelectAllSections}
                  className="text-sm text-apple-blue-500 hover:text-apple-blue-600"
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAllSections}
                  className="text-sm text-apple-gray-400 hover:text-apple-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cohorts.map((cohort) => {
                const cohortSections = sections.filter(s => s.cohort_id === cohort.id);
                
                return (
                  <div key={cohort.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-apple-gray-600 dark:text-white mb-3">
                      {cohort.stream} Grade {cohort.grade}
                    </h4>
                    <div className="space-y-2">
                      {cohortSections.map((section) => (
                        <label
                          key={section.id}
                          className="flex items-center space-x-3 p-2 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={generationForm.selected_sections.includes(section.id)}
                            onChange={() => handleSectionToggle(section.id)}
                            className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 rounded focus:ring-apple-blue-500"
                          />
                          <span className="text-sm text-apple-gray-600 dark:text-white">
                            Section {section.name}
                          </span>
                          <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                            ({section.students?.length || 0} students, {section.courses?.length || 0} courses)
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {cohorts.length === 0 && (
                <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No cohorts found for selected term</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-center pt-6 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || generationForm.selected_sections.length === 0}
            className="flex items-center space-x-3 px-8 py-3 bg-apple-blue-500 text-white rounded-xl hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Timetables...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Generate Timetables</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generation Results */}
      {generationResult && (
        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Generation Results
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              getSuccessRate(generationResult) === 100
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : getSuccessRate(generationResult) >= 80
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {getSuccessRate(generationResult).toFixed(1)}% Success Rate
            </span>
          </div>

          {/* Section Results */}
          <div className="grid gap-4 mb-6">
            {generationResult.section_results.map((result) => {
              const section = sections.find(s => s.id === result.section_id);
              const successRate = result.required > 0 ? (result.placed / result.required) * 100 : 0;
              
              return (
                <div
                  key={result.section_id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {result.conflicts === 0 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <h4 className="font-medium text-apple-gray-600 dark:text-white">
                        {section?.cohort?.stream} Grade {section?.cohort?.grade} - Section {section?.name}
                      </h4>
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        {result.placed} of {result.required} periods scheduled
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-medium ${
                      successRate === 100 ? 'text-green-500' :
                      successRate >= 80 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {successRate.toFixed(1)}%
                    </div>
                    {result.conflicts > 0 && (
                      <p className="text-sm text-red-500">
                        {result.conflicts} conflicts
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conflicts */}
          {generationResult.conflicts.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h4 className="font-medium text-apple-gray-600 dark:text-white">
                  Conflicts Detected ({generationResult.conflicts.length})
                </h4>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {generationResult.conflicts.map((conflict, index) => (
                  <div
                    key={index}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        {conflict.conflict_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-red-600 dark:text-red-400">
                        Day {conflict.day_of_week}, Period {conflict.period_index}
                      </span>
                    </div>
                    {conflict.details?.message && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {conflict.details.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {generationResult.section_results.length > 0 && generationResult.conflicts.length === 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  Timetables generated successfully!
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                All sections have been scheduled without conflicts. You can now review and publish the timetables.
              </p>
            </div>
          )}
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