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

    const { timetable_id, academic_term_id } = await req.json();

    let query = supabase
      .from('timetable_sessions')
      .select(`
        teacher_id,
        day_of_week,
        duration_periods,
        timetables!inner(status)
      `);

    if (timetable_id) {
      query = query.eq('timetable_id', timetable_id);
    } else if (academic_term_id) {
      query = query.eq('timetables.academic_term_id', academic_term_id);
    }

    query = query.eq('timetables.status', 'published');

    const { data: sessions, error: sessionsError } = await query;
    if (sessionsError) throw sessionsError;

    // Calculate teacher loads
    const teacherLoads = new Map();
    const teacherDailyLoads = new Map();

    (sessions || []).forEach(session => {
      if (!session.teacher_id) return;

      const teacherId = session.teacher_id;
      const day = session.day_of_week;
      const duration = session.duration_periods;

      // Daily load
      const dailyKey = `${teacherId}-${day}`;
      teacherDailyLoads.set(dailyKey, (teacherDailyLoads.get(dailyKey) || 0) + duration);

      // Weekly load
      teacherLoads.set(teacherId, (teacherLoads.get(teacherId) || 0) + duration);
    });

    // Get teacher load rules for validation
    const { data: loadRules, error: rulesError } = await supabase
      .from('teacher_load_rules')
      .select('*');

    if (rulesError) throw rulesError;

    // Check for overloads
    const overloads = [];
    const { data: settings } = await supabase
      .from('allocation_settings')
      .select('*')
      .single();

    const defaultMaxPerDay = settings?.teacher_max_periods_per_day || 6;

    for (const [key, load] of teacherDailyLoads.entries()) {
      const [teacherId, day] = key.split('-');
      const teacherRule = loadRules?.find(lr => lr.teacher_id === teacherId);
      const maxPerDay = teacherRule?.max_periods_per_day || defaultMaxPerDay;

      if (load > maxPerDay) {
        overloads.push({
          teacher_id: teacherId,
          day_of_week: parseInt(day),
          current_load: load,
          max_allowed: maxPerDay,
          excess: load - maxPerDay
        });
      }
    }

    // Calculate summary statistics
    const teacherStats = Array.from(teacherLoads.entries()).map(([teacherId, weeklyLoad]) => {
      const teacherRule = loadRules?.find(lr => lr.teacher_id === teacherId);
      const maxPerWeek = teacherRule?.max_periods_per_week || (defaultMaxPerDay * 5);
      
      return {
        teacher_id: teacherId,
        weekly_load: weeklyLoad,
        max_weekly: maxPerWeek,
        utilization: (weeklyLoad / maxPerWeek) * 100
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        teacher_loads: Object.fromEntries(teacherLoads),
        daily_loads: Object.fromEntries(teacherDailyLoads),
        overloads,
        teacher_stats: teacherStats,
        summary: {
          total_teachers: teacherLoads.size,
          overloaded_teachers: overloads.length,
          average_utilization: teacherStats.reduce((sum, stat) => sum + stat.utilization, 0) / teacherStats.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Recalculate teacher loads error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});