import React, { useState, useRef, useEffect } from 'react';
import { Grade } from '../types';
import { AlertTriangle, Calendar, CheckCircle2, Clock, School, XCircle, BookOpen, Microscope, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';

interface GradesViewProps {
  studentName: string;
  grades: Grade[];
  selectedSubject: string | null;
}

const GradesView: React.FC<GradesViewProps> = ({
  studentName,
  grades,
  selectedSubject
}) => {
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const subjectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (selectedSubject && subjectRefs.current[selectedSubject]) {
      subjectRefs.current[selectedSubject]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [selectedSubject]);

  const getGradeColor = (grade: string) => {
    const colors = {
      'A': 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950/30 dark:to-rose-900/30 text-red-800 dark:text-red-300 border-l-4 border-red-500',
      'B': 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-900/30 text-orange-800 dark:text-orange-300 border-l-4 border-orange-500',
      'C': 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-950/30 dark:to-amber-900/30 text-yellow-800 dark:text-yellow-300 border-l-4 border-yellow-500',
      'D': 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950/30 dark:to-rose-900/30 text-red-800 dark:text-red-300 border-l-4 border-red-500',
      'F': 'bg-gradient-to-r from-red-200 to-rose-200 dark:from-red-950/40 dark:to-rose-900/40 text-red-900 dark:text-red-300 border-l-4 border-red-600'
    };
    return colors[grade.charAt(0)] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
  };

  const getGradeEmoji = (score: number) => {
    if (score >= 95) return '🚀';
    if (score >= 90) return '⭐';
    if (score >= 85) return '💫';
    if (score >= 80) return '🎯';
    if (score >= 75) return '💪';
    return '📚';
  };

  const renderDistributionGraph = (distribution: number[]) => {
    const maxStudents = Math.max(...distribution);
    const yAxisSteps = 5;
    const yAxisValues = Array.from({ length: yAxisSteps + 1 }, (_, i) => 
      Math.round((maxStudents * (yAxisSteps - i)) / yAxisSteps)
    );

    return (
      <div className="w-full space-y-6">
        <div className="relative w-full h-[300px] md:h-[250px]">
          {/* Y-axis */}
          <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between">
            {yAxisValues.map((value, index) => (
              <div key={index} className="flex items-center justify-end h-6 -mt-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 pr-2">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Y-axis label */}
          <div className="absolute -left-6 top-1/2 -rotate-90 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Number of Students
          </div>

          {/* Grid lines */}
          <div className="absolute left-12 right-4 top-0 bottom-8">
            {yAxisValues.map((_, index) => (
              <div
                key={index}
                className="absolute w-full border-t border-gray-200 dark:border-gray-700/30"
                style={{ top: `${(index * 100) / yAxisSteps}%` }}
              />
            ))}
          </div>

          {/* Bars container */}
          <div className="absolute left-12 right-4 top-0 bottom-8 flex items-end justify-between">
            {distribution.map((value, index) => {
              const heightPercentage = maxStudents > 0 ? (value / maxStudents) * 100 : 0;
              return (
                <div key={index} className="relative h-full w-[8%] group">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-300 to-amber-200 dark:from-yellow-600 dark:to-amber-500 rounded-t transition-all duration-300 hover:from-yellow-400 hover:to-amber-300 dark:hover:from-yellow-500 dark:hover:to-amber-400"
                    style={{ 
                      height: `${heightPercentage}%`,
                      minHeight: value > 0 ? '4px' : '0'
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                        {value} students
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis */}
          <div className="absolute left-12 right-4 bottom-0 flex justify-between">
            {distribution.map((_, index) => (
              <div key={index} className="w-[8%]">
                <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 text-center transform -rotate-45 origin-top-left translate-y-3 translate-x-2">
                  {`${index * 10}-${(index + 1) * 10}`}
                </div>
              </div>
            ))}
          </div>

          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 mt-6 pt-8">
            Score Range (%)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-red-50 dark:from-gray-900 dark:via-slate-900 dark:to-red-950 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 rounded-full transform translate-x-48 -translate-y-48 opacity-50" />
          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <School className="w-12 h-12 text-red-600 dark:text-red-500" />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  A
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {studentName}'s Grade Report
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Spring Semester 2024
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {grades.map((grade, index) => {
            const averageScore = grade.exams.reduce((sum, exam) => sum + exam.score, 0) / grade.exams.length;
            
            return (
              <div
                key={index}
                ref={el => subjectRefs.current[grade.subject] = el}
                className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.01] duration-300"
              >
                <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-900/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-red-500 dark:text-red-400" />
                        <span>{grade.subject}</span>
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{grade.term}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Average:</div>
                      <div className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 shadow-sm text-red-700 dark:text-red-400 font-semibold">
                        {averageScore.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {grade.exams.map((exam, examIndex) => {
                    const isExpanded = expandedHistory === `${grade.subject}-${exam.title}`;
                    
                    return (
                      <div 
                        key={examIndex}
                        className={`rounded-lg transition-all ${getGradeColor(exam.grade)}`}
                      >
                        <button
                          onClick={() => setExpandedHistory(isExpanded ? null : `${grade.subject}-${exam.title}`)}
                          className="w-full p-4 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-red-500 dark:text-red-400" />
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-100">{exam.title}</h3>
                                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {exam.date}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl" role="img" aria-label="grade emoji">
                                {getGradeEmoji(exam.score)}
                              </span>
                              <div className="flex flex-col items-end">
                                <span className="text-lg font-bold">{exam.grade}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{exam.score}%</span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-b-lg animate-fadeIn">
                            <div className="grid grid-cols-1 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Detailed Scores</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Marks Obtained:</span>
                                    <span className="font-medium">{exam.marksObtained}/{exam.totalMarks}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Class Average:</span>
                                    <span className="font-medium">{exam.classAverage}/{exam.totalMarks}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Percentile:</span>
                                    <span className="font-medium">{exam.percentile}th</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center space-x-2 mb-3">
                                  <CalendarDays className="w-4 h-4 text-red-500 dark:text-red-400" />
                                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Class Distribution</h4>
                                </div>
                                {renderDistributionGraph(exam.distribution)}
                              </div>

                              <div>
                                <div className="flex items-center space-x-2 mb-3">
                                  <BookOpen className="w-4 h-4 text-red-400 dark:text-red-500" />
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Topics Covered:</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {exam.modules.map((module, moduleIndex) => (
                                    <div
                                      key={moduleIndex}
                                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500"></span>
                                      <span>{module}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { GradesView };
export default GradesView;