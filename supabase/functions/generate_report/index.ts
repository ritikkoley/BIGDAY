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

    // Generate report based on type
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

    // Create report record
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

  // Aggregate data
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
      acc[user.peer_group] = (acc[user.peer_group] || 0) + 1;
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
      .length
  };

  return summary;
}

async function generateAcademicReport(supabase: any, filters: any) {
  // Get academic performance data
  const { data: grades, error: gradesError } = await supabase
    .from('grades')
    .select(`
      *,
      user_profiles!inner(full_name, current_standard, section),
      assessments!inner(name, type, course_id)
    `);

  if (gradesError) throw gradesError;

  // Aggregate academic data
  const academicSummary = {
    total_assessments: grades.length,
    average_score: grades.reduce((sum: number, grade: any) => sum + (grade.score / grade.max_score * 100), 0) / grades.length,
    by_standard: grades.reduce((acc: any, grade: any) => {
      const standard = grade.user_profiles.current_standard;
      if (standard) {
        if (!acc[standard]) acc[standard] = { total: 0, sum: 0 };
        acc[standard].total++;
        acc[standard].sum += (grade.score / grade.max_score * 100);
      }
      return acc;
    }, {}),
    performance_trends: {
      improving: 0,
      declining: 0,
      stable: 0
    }
  };

  return academicSummary;
}

async function generateAttendanceReport(supabase: any, filters: any) {
  const { data: attendance, error } = await supabase
    .from('attendance')
    .select(`
      *,
      user_profiles!inner(full_name, current_standard),
      courses!inner(name, code)
    `);

  if (error) throw error;

  const attendanceSummary = {
    total_records: attendance.length,
    overall_attendance_rate: attendance.filter((a: any) => a.status === 'present').length / attendance.length * 100,
    by_course: attendance.reduce((acc: any, record: any) => {
      const course = record.courses.name;
      if (!acc[course]) acc[course] = { total: 0, present: 0 };
      acc[course].total++;
      if (record.status === 'present') acc[course].present++;
      return acc;
    }, {}),
    at_risk_students: [] // Would calculate students with < 75% attendance
  };

  return attendanceSummary;
}

async function generatePerformanceReport(supabase: any, filters: any) {
  // Comprehensive performance analysis
  const performanceData = {
    institutional_metrics: {
      total_students: 0,
      total_teachers: 0,
      average_performance: 0,
      top_performing_classes: [],
      improvement_areas: []
    },
    comparative_analysis: {
      year_over_year: {},
      department_comparison: {},
      peer_benchmarking: {}
    },
    recommendations: []
  };

  return performanceData;
}