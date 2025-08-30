import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { CircularProgress } from '../CircularProgress';
import { Subject } from '../../types';
import { TrendingUp, Brain, BookOpen, ChevronDown, ChevronUp, Sparkles, Trophy, GraduationCap } from 'lucide-react';
import { sampleSubjects } from '../../data/sampleData';

export const StudentProgress: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchCourses, courses } = useDataStore();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use sample subjects data directly
  const subjects = sampleSubjects;

  useEffect(() => {
    if (user) {
      fetchCourses(user.id, 'student');
    }
    
    // Set first subject as selected by default
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0].name);
    }
  }, [user, fetchCourses]);

  const getProgressTextColor = (progress: number) => {
    if (progress < 50) return 'text-red-600 dark:text-red-400';
    if (progress < 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const calculateAverageProgress = (pillars: Subject['pillars']) => {
    const total = pillars.reduce((sum, pillar) => sum + pillar.progress, 0);
    return Math.round(total / pillars.length);
  };

  const getSubjectIcon = (subject: string) => {
    const icons = {
      'Mathematics': '🔢',
      'Computer Science': '💻',
      'Physics': '⚡'
    };
    return icons[subject as keyof typeof icons] || '📚';
  };

  const getBackgroundPattern = (progress: number) => {
    if (progress >= 90) return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
    if (progress >= 75) return 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
    if (progress >= 50) return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20';
    return 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20';
  };

  const overallProgress = Math.round(
    subjects.reduce((sum, subject) => sum + calculateAverageProgress(subject.pillars), 0) / subjects.length
  );

  const selectedSubjectData = subjects.find(s => s.name === selectedSubject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <Brain className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Learning Progress
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Overall Progress: {overallProgress}%
            </p>
          </div>
        </div>
        
        {/* Subject Selection */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => setSelectedSubject(subject.name)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedSubject === subject.name
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Subject Progress */}
      {selectedSubjectData && (
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl" role="img" aria-label={selectedSubjectData.name}>
                {getSubjectIcon(selectedSubjectData.name)}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-apple-gray-600 dark:text-white">
                  {selectedSubjectData.name}
                </h2>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  {selectedSubjectData.pillars.length} learning pillars
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-apple-blue-500">
                {calculateAverageProgress(selectedSubjectData.pillars)}%
              </div>
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                Average Progress
              </p>
            </div>
          </div>

          {/* Progress Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {selectedSubjectData.pillars.map((pillar) => (
              <div 
                key={pillar.name} 
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="mb-4">
                  <CircularProgress progress={pillar.progress} size={100}>
                    <div className="text-center">
                      <span className={`text-xl font-bold ${getProgressTextColor(pillar.progress)}`}>
                        {pillar.progress}%
                      </span>
                    </div>
                  </CircularProgress>
                </div>
                <h3 className="text-sm font-medium text-apple-gray-600 dark:text-white text-center mb-2">
                  {pillar.name}
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  pillar.progress >= 75 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  pillar.progress >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {pillar.progress >= 75 ? 'Advanced' :
                   pillar.progress >= 50 ? 'Intermediate' :
                   'Beginner'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Subjects Overview */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <GraduationCap className="w-5 h-5 text-apple-blue-500" />
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            All Subjects Overview
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {subjects.map((subject) => {
            const averageProgress = calculateAverageProgress(subject.pillars);
            const isExpanded = expandedSubject === subject.name;
            const bgPattern = getBackgroundPattern(averageProgress);

            return (
              <div 
                key={subject.name} 
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${bgPattern}`}
              >
                <button
                  onClick={() => setExpandedSubject(isExpanded ? null : subject.name)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24">
                        <CircularProgress progress={averageProgress} size={96}>
                          <div className="text-center">
                            <span className={`text-xl font-bold ${getProgressTextColor(averageProgress)}`}>
                              {averageProgress}%
                            </span>
                          </div>
                        </CircularProgress>
                      </div>
                      <span className="absolute -top-2 -right-2 text-2xl" role="img" aria-label={subject.name}>
                        {getSubjectIcon(subject.name)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{subject.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {subject.pillars.length} learning pillars
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {averageProgress >= 90 && (
                      <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Excellence</span>
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 animate-fadeIn">
                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {subject.pillars.map((pillar) => (
                          <div 
                            key={pillar.name} 
                            className="flex flex-col items-center p-4 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="mb-3">
                              <CircularProgress progress={pillar.progress} size={80}>
                                <div className="text-center">
                                  <span className={`text-lg font-bold ${getProgressTextColor(pillar.progress)}`}>
                                    {pillar.progress}%
                                  </span>
                                </div>
                              </CircularProgress>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-2">
                              {pillar.name}
                            </p>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pillar.progress >= 75 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                              pillar.progress >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}>
                              {pillar.progress >= 75 ? 'Advanced' :
                               pillar.progress >= 50 ? 'Intermediate' :
                               'Beginner'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;