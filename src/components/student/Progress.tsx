import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore'; 
import { CircularProgress } from '../CircularProgress';
import { TrendingUp, Brain, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

// Import sample data
import { sampleSubjects } from '../../data/sampleData';

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
  const [subjects, setSubjects] = useState<Subject[]>(
    sampleSubjects.map((subject, index) => ({
      id: `subject-${index}`,
      name: subject.name,
      code: `${subject.name.substring(0, 3).toUpperCase()}101`,
      subtopics: subject.pillars.map(pillar => ({
        name: pillar.name,
        weight: 1 / subject.pillars.length
      }))
    }))
  );
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
      // Use sample data for immediate display
      if (!selectedSubject && subjects.length > 0) {
        setSelectedSubject(subjects[0].id);
      }
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
    }
  }, [selectedSubject]);

  const fetchProgress = async (courseId: string) => {
    try {
      setIsLoading(true);
      
      // Check if this is a demo/mock user
      if (user?.id && (user.id.startsWith('student-') || user.id.startsWith('teacher-') || user.id.startsWith('admin-'))) {
        // Fall through to use demo data
      } else {
        // Call the get_progress edge function
        const { data, error } = await supabase.functions.invoke('get_progress', {
          body: { student_id: user?.id, course_id: courseId }
        });
        
        if (error) throw error;
        
        if (data && Object.keys(data).length > 0) {
          setProgress(data);
          setIsLoading(false);
          return;
        }
      }
      
      // Use demo data for all cases (as fallback or for demo users)
      const subjectName = subjects.find(s => s.id === courseId)?.name || 'Computer Science';
      const demoProgress = {};
      
      // Get demo subtopics for this subject
      const subtopics = demoSubtopics[subjectName as keyof typeof demoSubtopics] || demoSubtopics['Computer Science'];
      
      // Create progress data
      subtopics.forEach(subtopic => {
        demoProgress[subtopic.name] = subtopic.progress;
      });
      
      setProgress(demoProgress);
      
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
        <div className="flex items-center space-x-3 mb-6">
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
        <div className="ProgressDashboard">
          <ProgressDashboard 
            studentName="Ritik Koley"
            subjects={sampleSubjects}
          />
        </div>
      )}
    </div>
  );
};

export default Progress;