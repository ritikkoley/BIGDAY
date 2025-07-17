import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { CircularProgress } from '../CircularProgress';
import { TrendingUp, Brain, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string;
  subtopics: {
    name: string;
    weight: number;
  }[];
}

interface SubtopicProgress {
  [key: string]: number;
}

export const Progress: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchCourses, courses } = useDataStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [progress, setProgress] = useState<SubtopicProgress>({});
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCourses(user.id, 'student');
      fetchSubjectsFromCourses();
    }
  }, [user, fetchCourses, courses]);

  const fetchSubjectsFromCourses = () => {
    if (courses && courses.length > 0) {
      const mappedSubjects = courses.map(course => ({
        id: course.id,
        name: course.name,
        code: course.code,
        subtopics: course.subtopics || []
      }));
      
      setSubjects(mappedSubjects);
      
      if (mappedSubjects.length > 0 && !selectedSubject) {
        setSelectedSubject(mappedSubjects[0].id);
      }
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      fetchProgress(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchProgress = async (courseId: string) => {
    try {
      setIsLoading(true);
      
      // Call the get_progress edge function
      const { data, error } = await supabase.functions.invoke('get_progress', {
        body: { student_id: user?.id, course_id: courseId }
      });
      
      if (error) throw error;
      
      setProgress(data || {});
      
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressTextColor = (progress: number) => {
    if (progress < 50) return 'text-red-600 dark:text-red-400';
    if (progress < 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getBackgroundPattern = (progress: number) => {
    if (progress >= 90) return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
    if (progress >= 75) return 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
    if (progress >= 50) return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20';
    return 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20';
  };

  if (isLoading && subjects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  if (error && subjects.length === 0) {
    return (
      <div className="apple-card p-6">
        <div className="flex items-center space-x-2 text-red-500">
          <TrendingUp className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-apple-blue-500" />
          <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
            Learning Progress
          </h2>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedSubject === subject.id
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {selectedSubjectData && (
        <div className="grid grid-cols-1 gap-6">
          {selectedSubjectData.subtopics.map((subtopic, index) => {
            const subtopicProgress = progress[subtopic.name] || 0;
            const bgPattern = getBackgroundPattern(subtopicProgress);

            return (
              <div 
                key={index} 
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${bgPattern}`}
              >
                <button
                  onClick={() => setExpandedSubject(expandedSubject === subtopic.name ? null : subtopic.name)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-32">
                      <CircularProgress progress={subtopicProgress}>
                        <div className="text-center">
                          <span className={`text-2xl font-bold ${getProgressTextColor(subtopicProgress)}`}>
                            {Math.round(subtopicProgress)}%
                          </span>
                        </div>
                      </CircularProgress>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{subtopic.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Weight: {(subtopic.weight * 100).toFixed(0)}% of course
                      </p>
                    </div>
                  </div>
                  <div>
                    {expandedSubject === subtopic.name ? (
                      <ChevronUp className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </button>

                {expandedSubject === subtopic.name && (
                  <div className="px-6 pb-6 animate-fadeIn">
                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                        Performance Analysis
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <BookOpen className="w-4 h-4 text-apple-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              Strengths
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {subtopicProgress >= 70 
                              ? `You're doing well in ${subtopic.name}! Keep up the good work.`
                              : `This area needs improvement. Focus on building your understanding of ${subtopic.name}.`
                            }
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-apple-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              Recommendations
                            </span>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            {subtopicProgress < 70 ? (
                              <>
                                <li className="flex items-center space-x-2">
                                  <span className="w-1.5 h-1.5 bg-apple-blue-500 rounded-full"></span>
                                  <span>Spend at least 2 hours per day on this topic</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <span className="w-1.5 h-1.5 bg-apple-blue-500 rounded-full"></span>
                                  <span>Review past assessments and identify knowledge gaps</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <span className="w-1.5 h-1.5 bg-apple-blue-500 rounded-full"></span>
                                  <span>Consider seeking additional help from your teacher</span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li className="flex items-center space-x-2">
                                  <span className="w-1.5 h-1.5 bg-apple-blue-500 rounded-full"></span>
                                  <span>Continue with your current study approach</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <span className="w-1.5 h-1.5 bg-apple-blue-500 rounded-full"></span>
                                  <span>Challenge yourself with advanced problems</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Progress;