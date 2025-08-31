import React, { useState, useEffect } from 'react';
import { 
  timetablesApi, 
  sectionsApi, 
  cohortsApi, 
  academicTermsApi,
  allocationUtils 
} from '../../../services/allocationApi';
import { 
  AcademicTerm, 
  Cohort, 
  Section, 
  Timetable, 
  TimetableSession,
  TimetableGrid 
} from '../../../types/allocation';
import { 
  Calendar, 
  Eye, 
  Lock, 
  Unlock, 
  Edit, 
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Users,
  BookOpen,
  Microscope,
  Clock
} from 'lucide-react';

export const ReviewAdjustPage: React.FC = () => {
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [timetableGrid, setTimetableGrid] = useState<TimetableGrid>({});
  const [viewMode, setViewMode] = useState<'section' | 'teacher'>('section');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      fetchCohortsByTerm(selectedTerm);
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (selectedSection) {
      fetchTimetables(selectedSection);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedTimetable && selectedTimetable.sessions) {
      const section = sections.find(s => s.id === selectedTimetable.section_id);
      if (section) {
        const grid = allocationUtils.convertSessionsToGrid(
          selectedTimetable.sessions,
          section.cohort?.days_per_week || 5,
          section.cohort?.periods_per_day || 8
        );
        setTimetableGrid(grid);
      }
    }
  }, [selectedTimetable, sections]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const termsData = await academicTermsApi.getAll();
      setAcademicTerms(termsData);
      
      if (termsData.length > 0) {
        setSelectedTerm(termsData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch initial data');
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
      
      // Clear selections when term changes
      setSelectedSection('');
      setSelectedTimetable(null);
      setTimetableGrid({});
    } catch (err) {
      console.error('Error fetching cohorts:', err);
    }
  };

  const fetchTimetables = async (sectionId: string) => {
    try {
      const timetablesData = await timetablesApi.getBySection(sectionId);
      setTimetables(timetablesData);
      
      // Select the latest timetable
      if (timetablesData.length > 0) {
        setSelectedTimetable(timetablesData[0]);
      } else {
        setSelectedTimetable(null);
        setTimetableGrid({});
      }
    } catch (err) {
      console.error('Error fetching timetables:', err);
    }
  };

  const handleLockSession = async (session: TimetableSession) => {
    try {
      await timetablesApi.lockSession(session.id);
      
      // Update local state
      if (selectedTimetable) {
        const updatedSessions = selectedTimetable.sessions?.map(s =>
          s.id === session.id ? { ...s, locked: true } : s
        ) || [];
        
        setSelectedTimetable({
          ...selectedTimetable,
          sessions: updatedSessions
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lock session');
    }
  };

  const handleUnlockSession = async (session: TimetableSession) => {
    try {
      await timetablesApi.unlockSession(session.id);
      
      // Update local state
      if (selectedTimetable) {
        const updatedSessions = selectedTimetable.sessions?.map(s =>
          s.id === session.id ? { ...s, locked: false } : s
        ) || [];
        
        setSelectedTimetable({
          ...selectedTimetable,
          sessions: updatedSessions
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock session');
    }
  };

  const handlePublishTimetable = async () => {
    if (!selectedTimetable) return;
    
    try {
      await timetablesApi.publish(selectedTimetable.id);
      await fetchTimetables(selectedSection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish timetable');
    }
  };

  const handleExportTimetable = () => {
    if (!selectedTimetable) return;
    
    const csv = allocationUtils.exportTimetableCSV(selectedTimetable, timetableGrid);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable_${selectedTimetable.section?.name}_v${selectedTimetable.version}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const renderTimetableGrid = () => {
    if (!selectedTimetable || !selectedTimetable.section) {
      return (
        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Select a section to view its timetable</p>
        </div>
      );
    }

    const section = selectedTimetable.section;
    const daysPerWeek = section.cohort?.days_per_week || 5;
    const periodsPerDay = section.cohort?.periods_per_day || 8;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      .slice(0, daysPerWeek);
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300 border-b border-apple-gray-200 dark:border-apple-gray-600">
                Period
              </th>
              {days.map((day, index) => (
                <th key={index} className="p-3 text-center text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300 border-b border-apple-gray-200 dark:border-apple-gray-600 min-w-[200px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: periodsPerDay }, (_, periodIndex) => {
              const period = periodIndex + 1;
              
              return (
                <tr key={period}>
                  <td className="p-3 text-sm text-apple-gray-600 dark:text-apple-gray-300 border-b border-apple-gray-200 dark:border-apple-gray-600">
                    <div>
                      <div className="font-medium">Period {period}</div>
                      <div className="text-xs text-apple-gray-400">
                        {allocationUtils.getPeriodTime(period, selectedTimetable.section?.cohort?.bells)}
                      </div>
                    </div>
                  </td>
                  {days.map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const session = timetableGrid[day]?.[period];
                    
                    return (
                      <td key={dayIndex} className="p-2 border-b border-apple-gray-200 dark:border-apple-gray-600">
                        {session && typeof session === 'object' ? (
                          <div className={`p-3 rounded-lg text-xs relative ${
                            session.session_type === 'lab'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          } ${session.locked ? 'ring-2 ring-yellow-400' : ''}`}>
                            <div className="font-medium truncate">
                              {session.course?.title}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {session.session_type === 'lab' ? (
                                <Microscope className="w-3 h-3" />
                              ) : (
                                <BookOpen className="w-3 h-3" />
                              )}
                              <span className="truncate">
                                {session.teacher?.full_name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-75">
                                {session.duration_periods}p
                              </span>
                              <button
                                onClick={() => session.locked ? handleUnlockSession(session) : handleLockSession(session)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                              >
                                {session.locked ? (
                                  <Lock className="w-3 h-3" />
                                ) : (
                                  <Unlock className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center">
                            <span className="text-xs text-apple-gray-400">Free</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
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
      {/* Controls */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Review & Adjust Timetables
            </h2>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Review generated timetables and make manual adjustments
            </p>
          </div>
          
          {selectedTimetable && (
            <div className="flex space-x-3">
              <button
                onClick={handleExportTimetable}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              
              {selectedTimetable.status === 'draft' && (
                <button
                  onClick={handlePublishTimetable}
                  className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Academic Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              <option value="">Select Term</option>
              {academicTerms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.cohort?.stream} Grade {section.cohort?.grade} - Section {section.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              View Mode
            </label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'section' | 'teacher')}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              <option value="section">Section View</option>
              <option value="teacher">Teacher View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Versions */}
      {timetables.length > 0 && (
        <div className="apple-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-4 h-4 text-apple-blue-500" />
            <h3 className="font-medium text-apple-gray-600 dark:text-white">
              Timetable Versions
            </h3>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {timetables.map((timetable) => (
              <button
                key={timetable.id}
                onClick={() => setSelectedTimetable(timetable)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedTimetable?.id === timetable.id
                    ? 'bg-apple-blue-500 text-white'
                    : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
                }`}
              >
                <span>Version {timetable.version}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  timetable.status === 'published'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : timetable.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                }`}>
                  {timetable.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-apple-blue-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              {selectedTimetable ? 
                `${selectedTimetable.section?.cohort?.stream} Grade ${selectedTimetable.section?.cohort?.grade} - Section ${selectedTimetable.section?.name}` :
                'Timetable Grid'
              }
            </h3>
          </div>
          
          {selectedTimetable && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                <span>Sessions: {selectedTimetable.sessions?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                  <span className="text-xs text-apple-gray-400">Theory</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-100 dark:bg-purple-900/30 rounded"></div>
                  <span className="text-xs text-apple-gray-400">Lab</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-apple-gray-400">Locked</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {renderTimetableGrid()}
      </div>

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