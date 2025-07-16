import React, { useState } from 'react';
import { TeacherProfile, Quiz } from '../../types/teacher';
import { BrainCircuit, Clock, AlertTriangle, CheckCircle2, GraduationCap, Plus, X, Save } from 'lucide-react';
import { useEffect } from 'react';
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
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [realQuizzes, setRealQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    totalMarks: 20,
    topics: [''],
    status: 'draft' as Quiz['status']
  });

  useEffect(() => {
    if (selectedSubject) {
      fetchQuizzes(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchQuizzes = async (subjectId: string) => {
    try {
      setIsLoading(true);
      // Use the sample data directly instead of fetching from Supabase
      setRealQuizzes(quizzes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
      console.error('Error fetching quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    try {
      setShowQuizForm(true);
      setSelectedQuiz(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    }
  };

  const handleAddTopic = () => {
    setNewQuiz(prev => ({
      ...prev,
      topics: [...prev.topics, '']
    }));
  };

  const handleRemoveTopic = (index: number) => {
    setNewQuiz(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const handleTopicChange = (index: number, value: string) => {
    setNewQuiz(prev => {
      const newTopics = [...prev.topics];
      newTopics[index] = value;
      return {
        ...prev,
        topics: newTopics
      };
    });
  };

  const handleSaveQuiz = () => {
    try {
      setIsLoading(true);
      
      // Create a new quiz object
      const quiz: Quiz = {
        id: `q-${Date.now()}`,
        subject: profile.subjects.find(s => s.id === selectedSubject)?.name || '',
        title: newQuiz.title,
        date: newQuiz.date,
        duration: newQuiz.duration,
        totalMarks: newQuiz.totalMarks,
        topics: newQuiz.topics.filter(t => t.trim() !== ''),
        status: newQuiz.status
      };
      
      // Add to the quizzes list
      setRealQuizzes(prev => [quiz, ...prev]);
      
      // Reset form
      setNewQuiz({
        title: '',
        date: new Date().toISOString().split('T')[0],
        duration: 30,
        totalMarks: 20,
        topics: [''],
        status: 'draft'
      });
      
      setShowQuizForm(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quiz');
    } finally {
      setIsLoading(false);
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

  // Form validation
  const isFormValid = () => {
    return (
      newQuiz.title.trim() !== '' &&
      newQuiz.date !== '' &&
      newQuiz.duration > 0 &&
      newQuiz.totalMarks > 0 &&
      newQuiz.topics.some(t => t.trim() !== '')
    );
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
      {showQuizForm ? (
        <div className="apple-card p-6 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue-500"></div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Create New Quiz
            </h2>
            <button
              onClick={() => setShowQuizForm(false)}
              className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  placeholder="Enter quiz title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                >
                  {profile.subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newQuiz.date}
                  onChange={(e) => setNewQuiz(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newQuiz.duration}
                  onChange={(e) => setNewQuiz(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  value={newQuiz.totalMarks}
                  onChange={(e) => setNewQuiz(prev => ({ ...prev, totalMarks: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Status
                </label>
                <select
                  value={newQuiz.status}
                  onChange={(e) => setNewQuiz(prev => ({ ...prev, status: e.target.value as Quiz['status'] }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white">
                  Topics Covered
                </label>
                <button
                  onClick={handleAddTopic}
                  className="flex items-center space-x-1 text-sm text-apple-blue-500 hover:text-apple-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Topic</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {newQuiz.topics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      placeholder={`Topic ${index + 1}`}
                    />
                    {index > 0 && (
                      <button
                        onClick={() => handleRemoveTopic(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowQuizForm(false)}
                className="px-4 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuiz}
                disabled={!isFormValid()}
                className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Save Quiz</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {error && (
        <div className="apple-card p-6 mt-6">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  }
};