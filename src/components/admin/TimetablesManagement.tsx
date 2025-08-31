import React, { useState, useEffect } from 'react';
import { timetablesApi, groupsApi, academicTermsApi, timetableSessionsApi, timetableUtils } from '../../services/timetableApi';
import { Group, AcademicTerm, Timetable, TimetableSession, TimetableGrid } from '../../types/timetable';
import { 
  Calendar, 
  Play, 
  Eye, 
  Archive, 
  Lock, 
  Unlock,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  BookOpen,
  Microscope
} from 'lucide-react';

export const TimetablesManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<AcademicTerm | null>(null);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [sessions, setSessions] = useState<TimetableSession[]>([]);
  const [timetableGrid, setTimetableGrid] = useState<TimetableGrid>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch until tables exist
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchTimetables();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedTimetable) {
      fetchSessions();
    }
  }, [selectedTimetable]);

  useEffect(() => {
    if (sessions.length > 0 && selectedGroup) {
      const grid = timetableUtils.convertSessionsToGrid(
        sessions,
        selectedGroup.days_per_week,
        selectedGroup.periods_per_day
      );
      setTimetableGrid(grid);
    }
  }, [sessions, selectedGroup]);

  const fetchGroups = async () => {
    try {
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch (err) {
      console.warn('Groups not available:', err);
      setGroups([]);
    }
  };

  const fetchAcademicTerms = async () => {
    try {
      const data = await academicTermsApi.getAll();
      setAcademicTerms(data);
    } catch (err) {
      console.warn('Academic terms not available:', err);
      setAcademicTerms([]);
    }
  };

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [groupsData, termsData] = await Promise.all([
        groupsApi.getAll(),
        academicTermsApi.getAll()
      ]);
      
      setGroups(groupsData);
      setAcademicTerms(termsData);
      
      if (groupsData.length > 0) {
        setSelectedGroup(groupsData[0]);
      }
      if (termsData.length > 0) {
        setSelectedTerm(termsData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimetables = async () => {
    if (!selectedGroup) return;
    
    try {
      const data = await timetablesApi.getByGroup(selectedGroup.id);
      setTimetables(data);
      
      if (data.length > 0) {
        setSelectedTimetable(data[0]);
      }
    } catch (err) {
      console.error('Error fetching timetables:', err);
    }
  };

  const fetchSessions = async () => {
    if (!selectedTimetable) return;
    
    try {
      const data = await timetablesApi.getSessions(selectedTimetable.id);
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const handleGenerateTimetable = async () => {
    if (!selectedGroup || !selectedTerm) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      
      const result = await timetablesApi.generateTimetable({
        group_id: selectedGroup.id,
        academic_term_id: selectedTerm.id,
        force_regenerate: true
      });
      
      if (result.success) {
        await fetchTimetables();
      } else {
        setError('Failed to generate timetable');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate timetable');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishTimetable = async () => {
    if (!selectedTimetable) return;
    
    try {
      await timetablesApi.publishTimetable(selectedTimetable.id);
      await fetchTimetables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish timetable');
    }
  };

  const handleLockSession = async (session: TimetableSession) => {
    try {
      await timetableSessionsApi.lockSession(session.id);
      await fetchSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lock session');
    }
  };

  const handleUnlockSession = async (session: TimetableSession) => {
    try {
      await timetableSessionsApi.unlockSession(session.id);
      await fetchSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock session');
    }
  };

  const renderTimetableGrid = () => {
    if (!selectedGroup || Object.keys(timetableGrid).length === 0) {
      return (
        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No timetable data available</p>
        </div>
      );
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, selectedGroup.days_per_week);
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300 border-b border-apple-gray-200 dark:border-apple-gray-600">
                Period
              </th>
              {days.map((day, index) => (
                <th key={index} className="p-3 text-center text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300 border-b border-apple-gray-200 dark:border-apple-gray-600">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: selectedGroup.periods_per_day }, (_, periodIndex) => (
              <tr key={periodIndex}>
                <td className="p-3 text-sm text-apple-gray-600 dark:text-apple-gray-300 border-b border-apple-gray-200 dark:border-apple-gray-600">
                  <div>
                    <div className="font-medium">Period {periodIndex + 1}</div>
                    <div className="text-xs text-apple-gray-400">
                      {timetableUtils.getPeriodTime(periodIndex, selectedGroup.period_length_minutes)}
                    </div>
                  </div>
                </td>
                {days.map((_, dayIndex) => {
                  const session = timetableGrid[dayIndex]?.[periodIndex];
                  return (
                    <td key={dayIndex} className="p-2 border-b border-apple-gray-200 dark:border-apple-gray-600">
                      {session ? (
                        <div className={`p-2 rounded-lg text-xs ${
                          session.type === 'lab'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        } ${session.locked ? 'ring-2 ring-yellow-400' : ''}`}>
                          <div className="font-medium truncate">
                            {session.course?.title}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {session.type === 'lab' ? (
                              <Microscope className="w-3 h-3" />
                            ) : (
                              <BookOpen className="w-3 h-3" />
                            )}
                            <span className="truncate">
                              {session.teacher?.full_name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-75">
                              {session.duration_periods}p
                            </span>
                            <button
                              onClick={() => session.locked ? handleUnlockSession(session) : handleLockSession(session)}
                              className="p-1 hover:bg-white/20 rounded"
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
                        <div className="h-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Calendar className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Timetables Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Generate and manage class timetables
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerateTimetable}
            disabled={!selectedGroup || !selectedTerm || isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate Timetable'}</span>
          </button>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="apple-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Select Group
            </label>
            <select
              value={selectedGroup?.id || ''}
              onChange={(e) => {
                const group = groups.find(g => g.id === e.target.value);
                setSelectedGroup(group || null);
              }}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              <option value="">Select a group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Academic Term
            </label>
            <select
              value={selectedTerm?.id || ''}
              onChange={(e) => {
                const term = academicTerms.find(t => t.id === e.target.value);
                setSelectedTerm(term || null);
              }}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              <option value="">Select academic term</option>
              {academicTerms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Versions */}
      {selectedGroup && (
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Timetable Versions
            </h2>
            {selectedTimetable && selectedTimetable.status === 'draft' && (
              <button
                onClick={handlePublishTimetable}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Timetable</span>
              </button>
            )}
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
            
            {timetables.length === 0 && (
              <div className="text-apple-gray-400 dark:text-apple-gray-300">
                No timetables generated yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      {selectedTimetable && (
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Timetable Grid - {selectedGroup?.name}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                {sessions.length} sessions scheduled
              </span>
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
          
          {renderTimetableGrid()}
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

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
        </div>
      )}
    </div>
  );
};