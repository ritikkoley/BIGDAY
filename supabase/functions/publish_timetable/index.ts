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

    const { timetable_id } = await req.json();

    // Validate timetable exists and is in draft status
    const { data: timetable, error: timetableError } = await supabase
      .from('timetables')
      .select('*')
      .eq('id', timetable_id)
      .eq('status', 'draft')
      .single();

    if (timetableError) throw new Error('Timetable not found or not in draft status');

    // Archive any existing published timetables for this section
    await supabase
      .from('timetables')
      .update({ status: 'archived' })
      .eq('section_id', timetable.section_id)
      .eq('academic_term_id', timetable.academic_term_id)
      .eq('status', 'published');

    // Publish the timetable
    const { data: publishedTimetable, error: publishError } = await supabase
      .from('timetables')
      .update({ status: 'published' })
      .eq('id', timetable_id)
      .select(`
        *,
        section:sections(*),
        academic_term:academic_terms(*)
      `)
      .single();

    if (publishError) throw publishError;

    return new Response(
      JSON.stringify({
        success: true,
        timetable: publishedTimetable
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Publish timetable error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});