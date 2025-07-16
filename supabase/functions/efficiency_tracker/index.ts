import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { teacher_id } = await req.json();

    // Get teacher's courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .eq('teacher_id', teacher_id);

    if (coursesError) throw coursesError;

    if (!courses || courses.length === 0) {
      return new Response(
        JSON.stringify({ efficiency: 0, courses_count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate average for each course
    const courseAverages = await Promise.all(
      courses.map(async (course) => {
        const { data: avg, error } = await supabase
          .rpc('calculate_course_avg', { crs_id: course.id });
        
        if (error) throw error;
        return avg || 0;
      })
    );

    // Calculate overall efficiency
    const efficiency = courseAverages.reduce((sum, avg) => sum + avg, 0) / courseAverages.length;

    // Get additional metrics
    const { data: totalStudents, error: studentsError } = await supabase
      .from('grades')
      .select('student_id')
      .in('assessment_id', 
        supabase
          .from('assessments')
          .select('id')
          .in('course_id', courses.map(c => c.id))
      );

    if (studentsError) throw studentsError;

    const uniqueStudents = new Set(totalStudents?.map(s => s.student_id) || []).size;

    return new Response(
      JSON.stringify({ 
        efficiency: Math.round(efficiency * 100) / 100,
        courses_count: courses.length,
        students_taught: uniqueStudents,
        course_averages: courseAverages
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});