import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { report_type, filters, report_name } = await req.json();

    let reportData: any = {};

    switch (report_type) {
      case 'user_summary':
        reportData = await generateUserSummaryReport(supabase, filters);
        break;
      case 'academic_report':
        reportData = await generateAcademicReport(supabase, filters);
        break;
      case 'attendance_summary':
        reportData = await generateAttendanceReport(supabase, filters);
        break;
      case 'performance_analysis':
        reportData = await generatePerformanceReport(supabase, filters);
        break;
      default:
        throw new Error('Invalid report type');
    }

    const { data: report, error: reportError } = await supabase
      .from('system_reports')
      .insert({
        name: report_name,
        type: report_type,
        filters: filters,
        status: 'completed',
        file_path: `/reports/${report_name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`
      })
      .select()
      .single();

    if (reportError) throw reportError;

    return new Response(
      JSON.stringify({
        success: true,
        report_id: report.id,
        data: reportData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Report generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function generateUserSummaryReport(supabase: any, filters: any) {
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*');

  if (error) throw error;

  const summary = {
    total_users: users.length,
    by_role: users.reduce((acc: any, user: any) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {}),
    by_status: users.reduce((acc: any, user: any) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {}),
    by_peer_group: users.reduce((acc: any, user: any) => {
      if (user.peer_group) {
        acc[user.peer_group] = (acc[user.peer_group] || 0) + 1;
      }
      return acc;
    }, {}),
    accommodation_breakdown: users.reduce((acc: any, user: any) => {
      if (user.accommodation_type) {
        acc[user.accommodation_type] = (acc[user.accommodation_type] || 0) + 1;
      }
      return acc;
    }, {}),
    recent_additions: users
      .filter((user: any) => {
        const createdDate = new Date(user.created_at);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return createdDate > thirtyDaysAgo;
      })
      .length,
    by_gender: users.reduce((acc: any, user: any) => {
      if (user.gender) {
        acc[user.gender] = (acc[user.gender] || 0) + 1;
      }
      return acc;
    }, {}),
    by_department: users.reduce((acc: any, user: any) => {
      if (user.department) {
        acc[user.department] = (acc[user.department] || 0) + 1;
      }
      return acc;
    }, {})
  };

  return summary;
}

async function generateAcademicReport(supabase: any, filters: any) {
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*');

  if (coursesError) throw coursesError;

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*');

  if (sectionsError) throw sectionsError;

  const { data: sectionCourses, error: scError } = await supabase
    .from('section_courses')
    .select('*');

  if (scError) throw scError;

  const { data: sectionStudents, error: ssError } = await supabase
    .from('section_students')
    .select('*');

  if (ssError) throw ssError;

  const academicSummary = {
    total_courses: courses.length,
    total_sections: sections.length,
    total_enrollments: sectionStudents.length,
    courses_by_type: courses.reduce((acc: any, course: any) => {
      const type = course.type || 'regular';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}),
    average_section_size: sectionStudents.length / (sections.length || 1),
    sections_by_grade: sections.reduce((acc: any, section: any) => {
      const grade = section.grade_level || 'unknown';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {}),
    course_distribution: sectionCourses.length > 0 ?
      `${sectionCourses.length} course assignments across ${sections.length} sections` :
      'No course assignments yet'
  };

  return academicSummary;
}

async function generateAttendanceReport(supabase: any, filters: any) {
  const { data: timetableSessions, error } = await supabase
    .from('timetable_sessions')
    .select('*');

  if (error) throw error;

  const { data: timetables, error: ttError } = await supabase
    .from('timetables')
    .select('*');

  if (ttError) throw ttError;

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*');

  if (sectionsError) throw sectionsError;

  const attendanceSummary = {
    total_timetable_sessions: timetableSessions.length,
    total_timetables: timetables.length,
    total_sections: sections.length,
    sessions_by_day: timetableSessions.reduce((acc: any, session: any) => {
      const day = session.day_of_week || 'unknown';
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {}),
    active_timetables: timetables.filter((t: any) => t.status === 'active').length,
    published_timetables: timetables.filter((t: any) => t.is_published).length,
    timetable_coverage: timetableSessions.length > 0 ?
      `${timetableSessions.length} scheduled sessions across ${sections.length} sections` :
      'No scheduled sessions yet'
  };

  return attendanceSummary;
}

async function generatePerformanceReport(supabase: any, filters: any) {
  const { data: users, error: usersError } = await supabase
    .from('user_profiles')
    .select('*');

  if (usersError) throw usersError;

  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*');

  if (coursesError) throw coursesError;

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*');

  if (sectionsError) throw sectionsError;

  const { data: sectionStudents, error: ssError } = await supabase
    .from('section_students')
    .select('*');

  if (ssError) throw ssError;

  const students = users.filter((u: any) => u.role === 'student');
  const teachers = users.filter((u: any) => u.role === 'teacher');
  const activeUsers = users.filter((u: any) => u.status === 'active');

  const performanceData = {
    institutional_metrics: {
      total_students: students.length,
      total_teachers: teachers.length,
      total_courses: courses.length,
      total_sections: sections.length,
      active_users: activeUsers.length,
      student_teacher_ratio: teachers.length > 0 ? (students.length / teachers.length).toFixed(2) : 'N/A',
      average_class_size: sections.length > 0 ? (sectionStudents.length / sections.length).toFixed(1) : 'N/A',
      enrollment_rate: `${((activeUsers.length / users.length) * 100).toFixed(1)}%`
    },
    user_distribution: {
      students: students.length,
      teachers: teachers.length,
      admin: users.filter((u: any) => u.role === 'admin').length,
      staff: users.filter((u: any) => u.role === 'staff').length
    },
    status_breakdown: users.reduce((acc: any, user: any) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {}),
    peer_group_distribution: users.reduce((acc: any, user: any) => {
      if (user.peer_group) {
        acc[user.peer_group] = (acc[user.peer_group] || 0) + 1;
      }
      return acc;
    }, {}),
    recommendations: [
      students.length === 0 ? 'Add student data to enable comprehensive reporting' : '',
      teachers.length === 0 ? 'Add teacher data for workload analysis' : '',
      courses.length === 0 ? 'Create courses to track academic performance' : '',
      sections.length === 0 ? 'Set up class sections for better organization' : ''
    ].filter(r => r !== '')
  };

  return performanceData;
}