import React, { useState } from 'react';
import { TeacherProfile, StudentRecord, GradingSession } from '../../types/teacher';
import { GraduationCap, Clock, Users, CheckCircle2, XCircle, AlertTriangle, Plus, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { TeacherGradeEntry } from './TeacherGradeEntry';
import { ExamCreationForm } from './ExamCreationForm';
import { BulkGradeUpload } from './BulkGradeUpload';

interface TeacherGradingProps {
  profile: TeacherProfile;
  gradingSessions: GradingSession[];
  studentRecords: StudentRecord[];
}

export const TeacherGrading: React.FC<TeacherGradingProps> = ({
  profile,
  gradingSessions,
  studentRecords
}) => {
  const [selectedSubject, setSelectedSubject] = useState(profile.subjects[0]?.id);
  const [selectedSession, setSelectedSession] = useState<GradingSession | null>(null);
  const [activeView, setActiveView] = useState<'sessions' | 'create-exam' | 'manual-entry' | 'bulk-upload'>('sessions');
  const [currentExam, setCurrentExam] = useState<any>(null);
  const [realGradingSessions, setRealGradingSessions] = useState<GradingSession[]>([]);
  const [realStudentRecords, setRealStudentRecords] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSubject) {
      fetchGradingSessions(selectedSubject);
      fetchStudentRecords(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchGradingSessions = async (subjectId: string) => {
    try {
      setIsLoading(true);
      
      // Get course ID from subject ID
      const courseId = profile.subjects.find(s => s.id === subjectId)?.id;
      if (!courseId) return;

      // Get assessments for this course
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessments')
        .select('*')
        .eq('course_id', courseId);

      if (assessmentsError) throw assessmentsError;

      // For each assessment, get the submissions
      const sessions: GradingSession[] = [];
      
      for (const assessment of assessments || []) {
        // Get grades for this assessment
        const { data: grades, error: gradesError } = await supabase
          .from('grades')
          .select(`
            *,
            student:users!grades_student_id_fkey(id, name)
          `)
          .eq('assessment_id', assessment.id);

        if (gradesError) throw gradesError;

        // Get total students in this course
        const { data: students, error: studentsError } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'student')
          .in('group_id', profile.subjects.find(s => s.id === subjectId)?.schedule.map(s => s.room) || []);

        if (studentsError) throw studentsError;

        sessions.push({
          id: assessment.id,
          subject: profile.subjects.find(s => s.id === subjectId)?.name || '',
          assignmentTitle: assessment.name,
          dueDate: assessment.due_date || '',
          totalSubmissions: students?.length || 0,
          gradedSubmissions: grades?.filter(g => g.graded_at).length || 0,
          averageScore: grades?.length ? grades.reduce((sum, g) => sum + g.score, 0) / grades.length : 0,
          submissions: grades?.map(g => ({
            studentId: g.student_id,
            studentName: g.student.name,
            submissionDate: g.created_at,
            status: g.graded_at ? 'graded' : 'pending',
            score: g.score,
            feedback: g.feedback || undefined
          })) || []
        });
      }

      setRealGradingSessions(sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grading sessions');
      console.error('Error fetching grading sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentRecords = async (subjectId: string) => {
    try {
      // Get course ID from subject ID
      const courseId = profile.subjects.find(s => s.id === subjectId)?.id;
      if (!courseId) return;

      // Get students in this course
      const { data: students, error: studentsError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'student')
        .in('group_id', profile.subjects.find(s => s.id === subjectId)?.schedule.map(s => s.room) || []);

      if (studentsError) throw studentsError;

      // Format as StudentRecord
      const records: StudentRecord[] = (students || []).map(student => ({
        id: student.id,
        name: student.name,
        rollNumber: student.id.substring(0, 8).toUpperCase(), // Generate a roll number from ID
        email: student.email,
        attendance: [],
        grades: [],
        submissions: []
      }));

      setRealStudentRecords(records);
    } catch (err) {
      console.error('Error fetching student records:', err);
    }
  };

  const handleCreateExam = async (examData: any) => {
    try {
      setIsLoading(true);
      const courseId = profile.subjects.find(s => s.id === selectedSubject)?.id;
      if (!courseId) throw new Error('Course not found');

      // Create assessment in Supabase
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          course_id: courseId,
          name: examData.examName,
          type: examData.type || 'quiz',
          weightage: examData.maxMarks / 100, // Convert to decimal (e.g., 20 points = 0.2)
          due_date: examData.examDate,
          instructions: examData.instructions,
          total_marks: examData.maxMarks
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      setCurrentExam(assessment);
      setActiveView('manual-entry');
      
      // Refresh grading sessions
      fetchGradingSessions(selectedSubject);
    } catch (error) {
      console.error('Error creating exam:', error);
      setError(error instanceof Error ? error.message : 'Failed to create exam');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGrades = async (grades: { studentId: string; marks: number }[]) => {
    try {
      setIsLoading(true);
      
      // Format grades for Supabase
      const gradesToInsert = grades.map(grade => ({
        student_id: grade.studentId,
        assessment_id: currentExam.id,
        score: grade.marks,
        max_score: currentExam.total_marks || 100,
        graded_by: (await supabase.auth.getUser()).data.user?.id,
        graded_at: new Date().toISOString()
      }));

      // Use Edge Function for bulk upload
      const { data, error } = await supabase.functions.invoke('bulk-upload-grades', {
        body: { assessment_id: currentExam.id, grades: gradesToInsert }
      });

      if (error) throw error;
      
      // Refresh grading sessions
      fetchGradingSessions(selectedSubject);
      setActiveView('sessions');
    } catch (error) {
      console.error('Error saving grades:', error);
      setError(error instanceof Error ? error.message : 'Failed to save grades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = async (file: File, examData: any) => {
    try {
      setIsLoading(true);
      
      // Create the assessment first
      await handleCreateExam(examData);
      
      // In a real implementation, we would:
      // 1. Parse the Excel/CSV file (using FileReader API)
      // 2. Extract student IDs and grades
      // 3. Call the bulk-upload-grades Edge Function
      
      // For now, we'll just show a success message
      alert('File uploaded successfully! In a real implementation, this would process the Excel file.');
      
      setActiveView('sessions');
    } catch (error) {
      console.error('Error processing bulk upload:', error);
      setError(error instanceof Error ? error.message : 'Failed to process bulk upload');
    } finally {
      setIsLoading(false);
    }
  };

  const getGradingProgress = (session: GradingSession) => {
    return (session.gradedSubmissions / session.totalSubmissions) * 100;
  };

  const getStatusColor = (status: 'pending' | 'graded') => {
    return status === 'graded'
      ? 'text-green-500 dark:text-green-400'
      : 'text-yellow-500 dark:text-yellow-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <GraduationCap className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Grading Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Create exams and manage student grades
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveView('create-exam')}
              className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Exam</span>
            </button>
            <button
              onClick={() => setActiveView('bulk-upload')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Bulk Upload</span>
            </button>
          </div>
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

      {/* Navigation Tabs */}
      <div className="apple-card relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue-500"></div>
          </div>
        )}
        
        <div className="border-b border-apple-gray-200/50 dark:border-apple-gray-500/20 px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('sessions')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'sessions'
                  ? 'border-apple-blue-500 text-apple-blue-500'
                  : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
              }`}
            >
              Grading Sessions
            </button>
            <button
              onClick={() => setActiveView('create-exam')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'create-exam'
                  ? 'border-apple-blue-500 text-apple-blue-500'
                  : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
              }`}
            >
              Create Exam
            </button>
            <button
              onClick={() => setActiveView('bulk-upload')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'bulk-upload'
                  ? 'border-apple-blue-500 text-apple-blue-500'
                  : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
              }`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Grading Sessions View */}
          {activeView === 'sessions' && (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-1 space-y-4">
                {(realGradingSessions.length > 0 ? realGradingSessions : gradingSessions).map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full text-left apple-card p-4 transition-all ${
                      selectedSession?.id === session.id
                        ? 'ring-2 ring-apple-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-apple-gray-600 dark:text-white">
                        {session.assignmentTitle}
                      </h3>
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        Due: {format(new Date(session.dueDate), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{session.gradedSubmissions}/{session.totalSubmissions} graded</span>
                      </div>
                      <span className="font-medium text-apple-blue-500">
                        Avg: {session.averageScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-apple-blue-500 rounded-full transition-all"
                        style={{ width: `${getGradingProgress(session)}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Session Details */}
              <div className="lg:col-span-2">
                {selectedSession ? (
                  <div className="apple-card p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                        Grading Details
                      </h2>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                          Progress:
                        </span>
                        <span className="text-lg font-medium text-apple-blue-500">
                          {getGradingProgress(selectedSession).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Submissions List */}
                    <div className="space-y-4">
                      {selectedSession.submissions.map((submission) => (
                        <div
                          key={submission.studentId}
                          className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            {submission.status === 'graded' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-500" />
                            )}
                            <div>
                              <p className="font-medium text-apple-gray-600 dark:text-white">
                                {submission.studentName}
                              </p>
                              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                                Submitted: {format(new Date(submission.submissionDate), 'MMM d, h:mm a')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-medium capitalize ${getStatusColor(submission.status)}`}>
                              {submission.status}
                            </span>
                            {submission.score && (
                              <p className="text-lg font-medium text-apple-blue-500 mt-1">
                                {submission.score}%
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="apple-card p-6 text-center">
                    <GraduationCap className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                      No Session Selected
                    </h3>
                    <p className="text-apple-gray-400 dark:text-apple-gray-300">
                      Select a grading session from the list to view submissions
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create Exam View */}
          {activeView === 'create-exam' && (
            <ExamCreationForm
              subjects={profile.subjects}
              onCreateExam={handleCreateExam}
              onCancel={() => setActiveView('sessions')}
            />
          )}

          {/* Manual Grade Entry View */}
          {activeView === 'manual-entry' && currentExam && (
            <TeacherGradeEntry
              students={realStudentRecords.length > 0 ? realStudentRecords : studentRecords}
              examName={currentExam.examName}
              maxMarks={currentExam.maxMarks}
              onSave={handleSaveGrades}
              onCancel={() => setActiveView('sessions')}
            />
          )}

          {/* Bulk Upload View */}
          {activeView === 'bulk-upload' && (
            <BulkGradeUpload
              students={realStudentRecords.length > 0 ? realStudentRecords : studentRecords}
              subjects={profile.subjects}
              onUpload={handleBulkUpload}
              onCancel={() => setActiveView('sessions')}
            />
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