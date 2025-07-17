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

  // Demo data for progress
  const demoSubtopics = {
    'Computer Science': [
      { name: 'Neural Networks', progress: 92, strengths: ['Good understanding of backpropagation', 'Excellent implementation skills'], weaknesses: ['Could improve on optimization techniques'] },
      { name: 'Data Structures', progress: 85, strengths: ['Strong grasp of tree structures', 'Good understanding of time complexity'], weaknesses: ['Need more practice with advanced graph algorithms'] },
      { name: 'Algorithms', progress: 78, strengths: ['Good problem-solving approach', 'Strong in sorting algorithms'], weaknesses: ['Dynamic programming needs improvement'] },
      { name: 'Object-Oriented Programming', progress: 88, strengths: ['Excellent class design', 'Good understanding of inheritance'], weaknesses: ['Could improve on design patterns'] }
    ],
    'Data Structures': [
      { name: 'Arrays', progress: 95, strengths: ['Excellent understanding of array operations', 'Good implementation of algorithms'], weaknesses: [] },
      { name: 'Linked Lists', progress: 87, strengths: ['Good understanding of pointers', 'Solid implementation skills'], weaknesses: ['Could improve on complex operations'] },
      { name: 'Trees', progress: 82, strengths: ['Good grasp of binary trees', 'Strong in traversal algorithms'], weaknesses: ['AVL and Red-Black trees need more practice'] },
      { name: 'Graphs', progress: 75, strengths: ['Good understanding of basic concepts', 'Strong in BFS and DFS'], weaknesses: ['Advanced algorithms like Dijkstra need improvement'] }
    ],
    'Mathematics': [
      { name: 'Calculus', progress: 80, strengths: ['Strong in differentiation', 'Good understanding of limits'], weaknesses: ['Integration techniques need more practice'] },
      { name: 'Linear Algebra', progress: 85, strengths: ['Excellent matrix operations', 'Good understanding of vector spaces'], weaknesses: ['Eigenvalues and eigenvectors need more work'] },
      { name: 'Probability', progress: 90, strengths: ['Excellent understanding of basic probability', 'Strong in Bayes theorem'], weaknesses: [] },
      { name: 'Statistics', progress: 88, strengths: ['Good data analysis skills', 'Strong in hypothesis testing'], weaknesses: ['Advanced regression techniques need improvement'] }
    ]
  };

  useEffect(() => {
    if (user) {
      fetchCourses(user.id, 'student');
      fetchSubjectsFromCourses();
    }
  }, [user, fetchCourses, courses]);

  const fetchSubjectsFromCourses = () => {
    if (courses && courses.length > 0) {
      const mappedSubjects = courses.map(course => ({
        id: course.id || `course-${course.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: course.name || 'Unknown Course',
        code: course.code || 'CS000',
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
    } else if (subjects.length > 0) {
      // If no subject is selected but we have subjects, select the first one
      setSelectedSubject(subjects[0].id);
    }
  }, [selectedSubject]);

  const fetchProgress = async (courseId: string) => {
    try {
      setIsLoading(true);
      
      // Check if this is a demo/mock user
      if (user?.id && (user.id.startsWith('student-') || user.id.startsWith('teacher-') || user.id.startsWith('admin-'))) {
        // Use demo data
        const subjectName = subjects.find(s => s.id === courseId)?.name || 'Computer Science';
        const demoProgress = {};
        
        // Get demo subtopics for this subject
        const subtopics = demoSubtopics[subjectName as keyof typeof demoSubtopics] || demoSubtopics['Computer Science'];
        
        // Create progress data
        subtopics.forEach(subtopic => {
          demoProgress[subtopic.name] = subtopic.progress;
        });
        
        setProgress(demoProgress);
        setIsLoading(false);
        return;
      }
      
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
    <div className="space-y-6 min-h-screen">
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
          {selectedSubjectData.subtopics.length > 0 ? (
            selectedSubjectData.subtopics.map((subtopic, index) => {
              const subtopicProgress = progress[subtopic.name] || Math.floor(Math.random() * 30) + 70; // Fallback to random progress between 70-100
              const bgPattern = getBackgroundPattern(subtopicProgress);
              
              // Get demo data for this subtopic if available
              const subjectName = selectedSubjectData.name;
              const demoSubtopic = demoSubtopics[subjectName as keyof typeof demoSubtopics]?.find(s => s.name === subtopic.name);
              const strengths = demoSubtopic?.strengths || ['Good understanding of core concepts'];
              const weaknesses = demoSubtopic?.weaknesses || [];
            return (
              <div 
                key={index} 
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${bgPattern}`}
              return (
                <div 
                  key={index} 
                  className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${bgPattern}`}
                >
                  <button
                    onClick={() => setExpandedSubject(expandedSubject === subtopic.name ? null : subtopic.name)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
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
                            <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                              {strengths.map((strength, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </p>
                        </div>
                          {weaknesses.length > 0 && (
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-apple-blue-500" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  Areas for Improvement
                                </span>
                              </div>
                              <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                                {weaknesses.map((weakness, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-yellow-500 mr-2">•</span>
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-4">
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
                  </div>
                )}
              </div>
            })
          ) : (
            // If no subtopics are defined in the course, use demo data
            demoSubtopics[selectedSubjectData.name as keyof typeof demoSubtopics]?.map((subtopic, index) => {
              const subtopicProgress = subtopic.progress;
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
                          Weight: 25% of course
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
                            <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                              {subtopic.strengths.map((strength, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {subtopic.weaknesses.length > 0 && (
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-apple-blue-500" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  Areas for Improvement
                                </span>
                              </div>
                              <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                                {subtopic.weaknesses.map((weakness, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-yellow-500 mr-2">•</span>
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-4">
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
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Progress;