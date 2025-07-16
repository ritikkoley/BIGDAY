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

    const { user_id } = await req.json();

    // Get historical grades for the user
    const { data: historic, error } = await supabase
      .from('grades')
      .select('score')
      .eq('student_id', user_id);

    if (error) throw error;

    if (!historic || historic.length === 0) {
      return new Response(
        JSON.stringify({ baseline: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate baseline as average of all historical scores
    const baseline = historic.reduce((sum, grade) => sum + grade.score, 0) / historic.length;

    // Update user profile with baseline
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        profile_data: {
          baseline,
          strengths: [],
          psycho_test: {}
        }
      })
      .eq('id', user_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ baseline }),
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