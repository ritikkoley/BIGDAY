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

    const { user_id, message } = await req.json();

    // Get conversation history
    const { data: context, error: contextError } = await supabase
      .from('conversations')
      .select('message, response')
      .eq('user_id', user_id)
      .order('timestamp', { ascending: false })
      .limit(5);

    if (contextError) throw contextError;

    // Build conversation history
    const history = context?.map(c => `User: ${c.message}\nBot: ${c.response}`).join('\n') || '';

    // For now, provide a simple rule-based response
    // In production, this would integrate with OpenAI or another AI service
    let response = '';

    if (message.toLowerCase().includes('grade') || message.toLowerCase().includes('score')) {
      response = 'I can help you understand your grades and performance. Would you like me to analyze your recent test scores or suggest areas for improvement?';
    } else if (message.toLowerCase().includes('study') || message.toLowerCase().includes('plan')) {
      response = 'I can create a personalized study plan based on your performance data. Focus on your weak areas and maintain your strengths. Would you like specific recommendations for any subject?';
    } else if (message.toLowerCase().includes('attendance')) {
      response = 'Attendance is crucial for academic success. I can help you track your attendance patterns and suggest ways to improve if needed.';
    } else {
      response = 'I\'m here to help with your academic journey! I can assist with study planning, grade analysis, attendance tracking, and performance insights. What would you like to know?';
    }

    // Save conversation
    const { error: saveError } = await supabase
      .from('conversations')
      .insert({
        user_id,
        message,
        response
      });

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({ response }),
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