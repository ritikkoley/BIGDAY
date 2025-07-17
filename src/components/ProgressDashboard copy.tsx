import React, { useState } from 'react';
import { CircularProgress } from './CircularProgress';
import { Subject } from '../types';
import { GraduationCap, ChevronDown, ChevronUp, Sparkles, Trophy } from 'lucide-react';

interface ProgressDashboardProps {
  studentName: string;
  subjects: Subject[];
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  studentName,
  subjects
}) => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full transform translate-x-32 -translate-y-32 opacity-50" />
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <GraduationCap className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{studentName}'s Academic Progress</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Overall Progress: {overallProgress}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Keep going! You're making great progress.</p>
            </div>
          </div>
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
                      <div className="w-32">
                        <CircularProgress progress={averageProgress}>
                          <div className="text-center">
                            <span className={`text-2xl font-bold ${getProgressTextColor(averageProgress)}`}>
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
                            <CircularProgress progress={pillar.progress}>
                              <div className="text-center">
                                <span className={`text-2xl font-bold ${getProgressTextColor(pillar.progress)}`}>
                                  {pillar.progress}%
                                </span>
                              </div>
                            </CircularProgress>
                            <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{pillar.name}</p>
                            <div className={`mt-2 px-2 py-1 rounded-full text-xs ${
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