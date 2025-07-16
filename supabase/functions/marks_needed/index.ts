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

    const { student_id, course_id, target } = await req.json();

    // Get current projected grade
    const { data: current, error: currentError } = await supabase
      .rpc('calculate_projected_grade', {
        stud_id: student_id,
        crs_id: course_id
      });

    if (currentError) throw currentError;

    // Get remaining weightage
    const { data: remainingData, error: remainingError } = await supabase
      .from('assessments')
      .select('weightage')
      .eq('course_id', course_id)
      .neq('status', 'completed');

    if (remainingError) throw remainingError;

    const remainingWeight = remainingData?.reduce((sum, a) => sum + a.weightage, 0) || 0;

    if (remainingWeight === 0) {
      return new Response(
        JSON.stringify({ needed: 0, message: 'No remaining assessments' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate needed percentage
    const needed = ((target - (current || 0)) / remainingWeight) * 100;

    return new Response(
      JSON.stringify({ 
        needed: Math.max(0, Math.min(100, needed)),
        current: current || 0,
        target,
        remaining_weight: remainingWeight
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