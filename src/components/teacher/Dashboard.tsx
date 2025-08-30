import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { LayoutDashboard, Clock, Users, AlertTriangle, CheckCircle2, TrendingUp, BookOpen, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

interface UpcomingClass {
  subject: string;
  time: string;
  room: string;
  studentsCount: number;
  hasQuiz: boolean;
  attendanceRate: number;
}

interface PendingTask {
  type: 'grading' | 'attendance' | 'quiz' | 'message';
  subject: string;
  title: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

interface Submission {
  student: string;
  subject: string;
  assignment: string;
  submittedAt: string;
  status: 'pending' | 'graded';
}

interface ClassPerformance {
  subject: string;
  averageScore: number;
  attendanceRate: number;
  riskStudents: number;
  topPerformers: number;
}

interface DashboardData {
  upcomingClasses: UpcomingClass[];
  pendingTasks: PendingTask[];
  recentSubmissions: Submission[];
  classPerformance: ClassPerformance[];
}

const UpcomingCards: React.FC<{ items: UpcomingClass[] }> = ({ items }) => (
  <div className="col-span-3 apple-card p-6">
    <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
      Upcoming Classes
    </h3>
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {items.map((classItem, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-apple-blue-500" />
            <div>
              <h3 className="font-medium text-apple-gray-600 dark:text-white">
                {classItem.subject}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-4 h-4 text-apple-gray-400" />
                <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  {classItem.time}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-apple-gray-400" />
              <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                {classItem.studentsCount} students
              </span>
            </div>
            {classItem.hasQuiz && (
              <span className="px-2 py-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                Quiz Today
              </span>
            )}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-2 text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No upcoming classes today</p>
        </div>
      )}
    </div>
  </div>
);

const PendingTasksList: React.FC<{ items: PendingTask[] }> = ({ items }) => {
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    const colors = {
      low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority];
  };

  const getTaskIcon = (type: 'grading' | 'attendance' | 'quiz' | 'message') => {
    const icons = {
      grading: <GraduationCap className="w-5 h-5" />,
      attendance: <Users className="w-5 h-5" />,
      quiz: <BookOpen className="w-5 h-5" />,
      message: <AlertTriangle className="w-5 h-5" />
    };
    return icons[type];
  };

  return (
    <div className="col-span-3 md:col-span-1 apple-card p-6">
      <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
        Pending Tasks
      </h3>
      <div className="space-y-4">
        {items.map((task, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                  {getTaskIcon(task.type)}
                </div>
                <h3 className="font-medium text-apple-gray-600 dark:text-white">
                  {task.title}
                </h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
              <Clock className="w-4 h-4" />
              <span>Due {format(new Date(task.deadline), 'MMM d')}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No pending tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SubmissionsList: React.FC<{ items: Submission[] }> = ({ items }) => (
  <div className="col-span-3 md:col-span-1 apple-card p-6">
    <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
      Recent Submissions
    </h3>
    <div className="space-y-4">
      {items.map((submission, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-apple-gray-600 dark:text-white">
              {submission.student}
            </h3>
            {submission.status === 'graded' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Clock className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">
            {submission.assignment}
          </p>
          <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
            <Clock className="w-4 h-4" />
            <span>
              {format(new Date(submission.submittedAt), 'MMM d, h:mm a')}
            </span>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No recent submissions</p>
        </div>
      )}
    </div>
  </div>
);

const PerformanceMetrics: React.FC<{ 
  atRisk: { student_id: string; avg_score: number }[];
  top: { student_id: string; avg_score: number }[];
  onClickRisk: () => void;
}> = ({ atRisk, top, onClickRisk }) => (
  <div className="col-span-3 md:col-span-1 apple-card p-6">
    <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
      Class Performance
    </h3>
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-apple-gray-600 dark:text-white">
            At-Risk Students
          </h4>
          <span className="text-red-500 font-medium">
            {atRisk.length}
          </span>
        </div>
        <button
          onClick={onClickRisk}
          className="w-full px-4 py-2 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm font-medium"
        >
          View Students Below 70%
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-apple-gray-600 dark:text-white">
            Top Performers
          </h4>
          <span className="text-green-500 font-medium">
            {top.length}
          </span>
        </div>
        <button
          className="w-full px-4 py-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-sm font-medium"
        >
          View Students Above 80%
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-apple-gray-600 dark:text-white">
            Class Average
          </h4>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">
              {atRisk.length > 0 || top.length > 0 
                ? ((atRisk.reduce((sum, s) => sum + s.avg_score, 0) + 
                   top.reduce((sum, s) => sum + s.avg_score, 0)) / 
                   (atRisk.length + top.length)).toFixed(1)
                : 'N/A'}%
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ 
              width: `${atRisk.length > 0 || top.length > 0 
                ? ((atRisk.reduce((sum, s) => sum + s.avg_score, 0) + 
                   top.reduce((sum, s) => sum + s.avg_score, 0)) / 
                   (atRisk.length + top.length))
                : 0}%` 
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchCourses, courses, getAtRiskStudents, getTopPerformers } = useDataStore();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    upcomingClasses: [],
    pendingTasks: [],
    recentSubmissions: [],
    classPerformance: []
  });
  const [atRiskStudents, setAtRiskStudents] = useState<{ student_id: string; avg_score: number }[]>([]);
  const [topPerformers, setTopPerformers] = useState<{ student_id: string; avg_score: number }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCourses(user.id, 'teacher');
    }
  }, [user, fetchCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      setSelectedCourse(courses[0].id);
      fetchDashboardData(courses);
    }
  }, [courses]);

  const fetchDashboardData = async (courses: any[]) => {
    try {
      // Process courses to get timetable entries
      const upcomingClasses: UpcomingClass[] = [];
      courses.forEach(course => {
        if (course.timetable && Array.isArray(course.timetable)) {
          // Get today's day name
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
          
          // Filter for today's classes
          const todayClasses = course.timetable.filter((entry: any) => 
            entry.day.toLowerCase() === today
          );
          
          todayClasses.forEach((entry: any) => {
            upcomingClasses.push({
              subject: course.name,
              time: entry.time,
              room: entry.room || 'TBD',
              studentsCount: 0, // Will be updated below
              hasQuiz: false, // Will be updated below
              attendanceRate: 0 // Will be updated below
            });
          });
        }
      });
      
      // Get student counts for each course
      for (let i = 0; i < upcomingClasses.length; i++) {
        const course = courses.find(c => c.name === upcomingClasses[i].subject);
        if (course) {
          // Count students in the course's groups
          const { data: studentsCount, error: countError } = await supabase
            .from('user_profiles')
            .select('id', { count: 'exact' })
            .eq('role', 'student')
            .containedBy('group_id', course.group_ids);
          
          if (!countError) {
            upcomingClasses[i].studentsCount = studentsCount || 0;
          }
          
          // Check if there's a quiz today
          const today = new Date().toISOString().split('T')[0];
          const { data: quizzes, error: quizzesError } = await supabase
            .from('assessments')
            .select('id')
            .eq('course_id', course.id)
            .eq('type', 'quiz')
            .gte('due_date', `${today}T00:00:00`)
            .lte('due_date', `${today}T23:59:59`);
          
          if (!quizzesError) {
            upcomingClasses[i].hasQuiz = (quizzes?.length || 0) > 0;
          }
          
          // Get attendance rate
          const { data: attendance, error: attendanceError } = await supabase
            .from('attendance')
            .select('status')
            .eq('course_id', course.id);
          
          if (!attendanceError && attendance) {
            const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
            upcomingClasses[i].attendanceRate = attendance.length > 0 
              ? (presentCount / attendance.length) * 100 
              : 0;
          }
        }
      }
      
      // Get pending tasks
      const pendingTasks: PendingTask[] = [];
      
      // Grading tasks
      const { data: pendingGrades, error: gradesError } = await supabase
        .from('assessments')
        .select(`
          id,
          name,
          course_id,
          due_date,
          courses!inner(name)
        `)
        .in('course_id', courses.map(c => c.id))
        .eq('status', 'published')
        .lt('due_date', new Date().toISOString());
      
      if (!gradesError && pendingGrades) {
        pendingGrades.forEach(assessment => {
          pendingTasks.push({
            type: 'grading',
            subject: assessment.courses.name,
            title: `Grade: ${assessment.name}`,
            deadline: new Date(new Date(assessment.due_date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week after due date
            priority: 'high'
          });
        });
      }
      
      // Upcoming quizzes
      const { data: upcomingQuizzes, error: quizzesError } = await supabase
        .from('assessments')
        .select(`
          id,
          name,
          course_id,
          due_date,
          courses!inner(name)
        `)
        .in('course_id', courses.map(c => c.id))
        .eq('type', 'quiz')
        .eq('status', 'draft');
      
      if (!quizzesError && upcomingQuizzes) {
        upcomingQuizzes.forEach(quiz => {
          pendingTasks.push({
            type: 'quiz',
            subject: quiz.courses.name,
            title: `Prepare: ${quiz.name}`,
            deadline: quiz.due_date || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
          });
        });
      }
      
      // Get recent submissions
      const recentSubmissions: Submission[] = [];
      
      // For each course, get recent grades
      for (const course of courses) {
        const { data: grades, error: gradesError } = await supabase
          .from('grades')
          .select(`
            id,
            student_id,
            score,
            graded_at,
            assessments!inner(
              name,
              course_id
            ),
            user_profiles!inner(name)
          `)
          .eq('assessments.course_id', course.id)
          .order('graded_at', { ascending: false })
          .limit(5);
        
        if (!gradesError && grades) {
          grades.forEach(grade => {
            recentSubmissions.push({
              student: grade.user_profiles.name,
              subject: course.name,
              assignment: grade.assessments.name,
              submittedAt: grade.graded_at,
              status: 'graded'
            });
          });
        }
      }
      
      // Get at-risk students and top performers for the first course
      if (courses.length > 0) {
        const atRisk = await getAtRiskStudents(courses[0].id);
        setAtRiskStudents(atRisk || []);
        
        const top = await getTopPerformers(courses[0].id);
        setTopPerformers(top || []);
      }
      
      // Update dashboard data
      setDashboardData({
        upcomingClasses,
        pendingTasks,
        recentSubmissions,
        classPerformance: []
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    }
  };

  const handleViewAtRiskStudents = async () => {
    // This would typically navigate to a detailed view or open a modal
    console.log('Viewing at-risk students');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apple-card p-6">
        <div className="flex items-center space-x-2 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Teacher Dashboard
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-3 gap-6">
        <UpcomingCards items={dashboardData.upcomingClasses} />
        
        <PendingTasksList items={dashboardData.pendingTasks} />
        
        <SubmissionsList items={dashboardData.recentSubmissions} />
        
        <PerformanceMetrics 
          atRisk={atRiskStudents} 
          top={topPerformers}
          onClickRisk={handleViewAtRiskStudents}
        />
      </div>
    </div>
  );
};

export default Dashboard;