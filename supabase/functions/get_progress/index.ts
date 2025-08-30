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

    const { student_id, course_id } = await req.json();

    // Get all grades for the student in this course
    const { data: grades, error } = await supabase
      .from('grades')
      .select('subtopic_performance')
      .eq('student_id', student_id)
      .in('assessment_id', 
        supabase
          .from('assessments')
          .select('id')
          .eq('course_id', course_id)
      );

    if (error) throw error;

    // Aggregate subtopic performance
    const aggregated: Record<string, number> = {};
    const counts: Record<string, number> = {};

    grades?.forEach(grade => {
      if (grade.subtopic_performance) {
        Object.entries(grade.subtopic_performance).forEach(([subtopic, score]) => {
          if (typeof score === 'number') {
            aggregated[subtopic] = (aggregated[subtopic] || 0) + score;
            counts[subtopic] = (counts[subtopic] || 0) + 1;
          }
        });
      }
    });

    // Calculate averages
    const result: Record<string, number> = {};
    Object.keys(aggregated).forEach(subtopic => {
      result[subtopic] = aggregated[subtopic] / counts[subtopic];
    });

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});