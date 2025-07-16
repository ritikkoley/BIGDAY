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

    // Get progress data by calling the get_progress function
    const progressResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/get_progress`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id, course_id })
    });

    const progress = await progressResponse.json();

    // Identify weak areas (score < 70)
    const weakAreas = Object.entries(progress)
      .filter(([_, score]) => typeof score === 'number' && score < 70)
      .map(([subtopic]) => subtopic);

    // Generate study plan recommendations
    const plan = weakAreas.map(subtopic => ({
      subtopic,
      recommendation: `Focus on ${subtopic}: Study 2 hours daily, review past assessments, and practice problems.`,
      priority: progress[subtopic] < 50 ? 'high' : 'medium',
      estimated_hours: progress[subtopic] < 50 ? 3 : 2
    }));

    // Add general recommendations
    const generalPlan = {
      weak_areas: weakAreas,
      specific_recommendations: plan,
      general_tips: [
        'Create a consistent study schedule',
        'Use active recall techniques',
        'Form study groups for difficult topics',
        'Seek help from teachers for challenging concepts'
      ],
      total_recommended_hours: plan.reduce((sum, item) => sum + item.estimated_hours, 0)
    };

    return new Response(
      JSON.stringify(generalPlan),
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