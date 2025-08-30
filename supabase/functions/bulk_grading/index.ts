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

    const { assessment_id, grades } = await req.json();

    // Insert grades
    const gradeInserts = grades.map((g: any) => ({
      student_id: g.student_id,
      assessment_id,
      score: g.score,
      max_score: 100,
      feedback: g.feedback || null,
      subtopic_performance: g.subtopic_performance || null
    }));

    const { error: insertError } = await supabase
      .from('grades')
      .insert(gradeInserts);

    if (insertError) throw insertError;

    // Update percentiles
    const { error: percentileError } = await supabase
      .rpc('update_percentiles', { assess_id: assessment_id });

    if (percentileError) throw percentileError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        grades_inserted: gradeInserts.length 
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