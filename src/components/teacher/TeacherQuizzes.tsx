import React, { useState } from 'react';
import { TeacherProfile, Quiz } from '../../types/teacher';
import { BrainCircuit, Clock, AlertTriangle, CheckCircle2, GraduationCap } from 'lucide-react';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface TeacherQuizzesProps {
  profile: TeacherProfile;
  quizzes: Quiz[];
}

export const TeacherQuizzes: React.FC<TeacherQuizzesProps> = ({
  profile,
  quizzes
}) => {
  const [selectedSubject, setSelectedSubject] = useState(profile.subjects[0]?.id);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [realQuizzes, setRealQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuizzes(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchQuizzes = async (subjectId: string) => {
    try {
      setIsLoading(true);
      
      // Get course ID from subject ID
      const courseId = profile.subjects.find(s => s.id === subjectId)?.id;
      if (!courseId) return;

      // Get quizzes for this course
      const { data, error: quizzesError } = await supabase
        .from('assessments')
        .select('*')
        .eq('course_id', courseId)
        .eq('type', 'quiz');

      if (quizzesError) throw quizzesError;

      // Format as Quiz
      const formattedQuizzes: Quiz[] = (data || []).map(quiz => ({
        id: quiz.id,
        subject: profile.subjects.find(s => s.id === subjectId)?.name || '',
        title: quiz.name,
        date: quiz.due_date || new Date().toISOString(),
        duration: quiz.duration || 45,
        totalMarks: quiz.total_marks || 20,
        topics: quiz.subtopics_covered || [],
        status: quiz.status as 'draft' | 'scheduled' | 'ongoing' | 'completed'
      }));

      setRealQuizzes(formattedQuizzes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
      console.error('Error fetching quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    try {
      // This would open a modal or navigate to a quiz creation page
      alert('In a real implementation, this would open a quiz creation form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    }
  };

  const handleEditQuiz = async (quizId: string) => {
    try {
      // This would open a modal or navigate to a quiz edit page
      alert(`In a real implementation, this would open a form to edit quiz ${quizId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit quiz');
    }
  };

  const handleViewResults = async (quizId: string) => {
    try {
      // This would navigate to a quiz results page
      alert(`In a real implementation, this would show results for quiz ${quizId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to view quiz results');
    }
  };

  const getStatusColor = (status: Quiz['status']) => {
    const colors = {
      draft: 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
      scheduled: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      ongoing: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      completed: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    };
    return colors[status];
  };

  // Use real quizzes if available, otherwise fall back to sample data
  const displayQuizzes = realQuizzes.length > 0 ? realQuizzes : quizzes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue-500"></div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Quiz Management
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Create and manage quizzes
            </p>
          </div>
        </div>
          <button
            onClick={handleCreateQuiz}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quiz</span>
          </button>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="apple-card p-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {profile.subjects.map((subject) => (
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

      {/* Quiz List and Details */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 lg:col-span-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue-500"></div>
          </div>
        )}
        
        <div className="lg:col-span-1 space-y-4">
          {displayQuizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => setSelectedQuiz(quiz)}
              className={`w-full text-left apple-card p-4 transition-all ${
                selectedQuiz?.id === quiz.id
                  ? 'ring-2 ring-apple-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-apple-gray-600 dark:text-white">
                  {quiz.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(quiz.status)}`}>
                  {quiz.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.duration} mins</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{quiz.totalMarks} marks</span>
                </div>
              </div>
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-2">
                {format(new Date(quiz.date), 'MMMM d, yyyy')}
              </p>
            </button>
          ))}
        </div>

        {/* Quiz Details */}
        <div className="lg:col-span-2">
          {selectedQuiz ? (
            <div className="apple-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                  Quiz Details
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedQuiz.status)}`}>
                  {selectedQuiz.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {selectedQuiz.duration} minutes
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                    <GraduationCap className="w-4 h-4" />
                    <span>Total Marks</span>
                  </div>
                  <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {selectedQuiz.totalMarks} marks
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Scheduled Date</span>
                  </div>
                  <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {format(new Date(selectedQuiz.date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Subject</span>
                  </div>
                  <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {selectedQuiz.subject}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-apple-gray-600 dark:text-white mb-3">
                  Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedQuiz.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full text-sm text-apple-gray-600 dark:text-apple-gray-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
                <button 
                  onClick={() => handleEditQuiz(selectedQuiz.id)}
                  className="px-4 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-full transition-colors"
                >
                  Edit Quiz
                </button>
                <button 
                  onClick={() => handleViewResults(selectedQuiz.id)}
                  className="px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
                >
                  {selectedQuiz.status === 'draft' ? 'Schedule Quiz' : 'View Results'}
                </button>
              </div>
            </div>
          ) : (
            <div className="apple-card p-6 text-center">
              <BrainCircuit className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                No Quiz Selected
              </h3>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                Select a quiz from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="apple-card p-6 mt-6">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  );
};