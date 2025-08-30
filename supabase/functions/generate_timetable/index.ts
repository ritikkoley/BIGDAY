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

    const { group_id, academic_term_id, force_regenerate = false, preserve_locked = true } = await req.json();

    // Get group configuration
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('id', group_id)
      .single();

    if (groupError) throw groupError;

    // Get group courses with teacher assignments
    const { data: groupCourses, error: coursesError } = await supabase
      .from('group_courses')
      .select(`
        *,
        course:courses(*),
        teacher:user_profiles(id, full_name, availability_pref)
      `)
      .eq('group_id', group_id)
      .eq('course.active', true);

    if (coursesError) throw coursesError;

    // Check if timetable already exists
    let timetable;
    const { data: existingTimetable } = await supabase
      .from('timetables')
      .select('*')
      .eq('group_id', group_id)
      .eq('academic_term_id', academic_term_id)
      .eq('status', 'draft')
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (existingTimetable && !force_regenerate) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Timetable already exists. Use force_regenerate=true to recreate.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new timetable
    const { data: newTimetable, error: timetableError } = await supabase
      .from('timetables')
      .insert({
        group_id,
        academic_term_id,
        status: 'draft',
        version: existingTimetable ? existingTimetable.version + 1 : 1
      })
      .select()
      .single();

    if (timetableError) throw timetableError;
    timetable = newTimetable;

    // Generate timetable sessions
    const sessions = await generateTimetableSessions(group, groupCourses);
    
    // Insert sessions
    const { error: sessionsError } = await supabase
      .from('timetable_sessions')
      .insert(
        sessions.map(session => ({
          ...session,
          timetable_id: timetable.id,
          group_id: group_id
        }))
      );

    if (sessionsError) throw sessionsError;

    return new Response(
      JSON.stringify({
        success: true,
        timetable_id: timetable.id,
        sessions_created: sessions.length,
        conflicts: [],
        warnings: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Timetable generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateTimetableSessions(group: any, groupCourses: any[]) {
  const sessions: any[] = [];
  const grid: boolean[][] = [];
  
  // Initialize grid
  for (let day = 0; day < group.days_per_week; day++) {
    grid[day] = new Array(group.periods_per_day).fill(false);
  }

  // Apply business hours constraints
  if (group.business_hours) {
    Object.entries(group.business_hours).forEach(([dayName, periods]) => {
      const dayIndex = getDayIndex(dayName);
      if (dayIndex >= 0 && dayIndex < group.days_per_week) {
        for (let period = 0; period < group.periods_per_day; period++) {
          if (!periods.includes(period)) {
            grid[dayIndex][period] = true; // Mark as unavailable
          }
        }
      }
    });
  }

  // Sort courses by priority (higher priority first)
  const sortedCourses = [...groupCourses].sort((a, b) => b.priority - a.priority);

  // Schedule lab sessions first (they need contiguous blocks)
  for (const groupCourse of sortedCourses) {
    const labPeriods = groupCourse.weekly_lab_periods || groupCourse.course.weekly_lab_periods;
    const blockSize = groupCourse.lab_block_size || groupCourse.course.lab_block_size;
    
    if (labPeriods > 0) {
      const labSessions = Math.ceil(labPeriods / blockSize);
      
      for (let session = 0; session < labSessions; session++) {
        const slot = findAvailableSlot(grid, blockSize, group.days_per_week, group.periods_per_day);
        if (slot) {
          // Mark slots as occupied
          for (let i = 0; i < blockSize; i++) {
            grid[slot.day][slot.period + i] = true;
          }
          
          sessions.push({
            course_id: groupCourse.course_id,
            teacher_id: groupCourse.teacher_id,
            day_of_week: slot.day,
            period_start_index: slot.period,
            duration_periods: blockSize,
            type: 'lab'
          });
        }
      }
    }
  }

  // Schedule theory sessions
  for (const groupCourse of sortedCourses) {
    const theoryPeriods = groupCourse.weekly_theory_periods || groupCourse.course.weekly_theory_periods;
    
    for (let period = 0; period < theoryPeriods; period++) {
      const slot = findAvailableSlot(grid, 1, group.days_per_week, group.periods_per_day);
      if (slot) {
        grid[slot.day][slot.period] = true;
        
        sessions.push({
          course_id: groupCourse.course_id,
          teacher_id: groupCourse.teacher_id,
          day_of_week: slot.day,
          period_start_index: slot.period,
          duration_periods: 1,
          type: 'theory'
        });
      }
    }
  }

  return sessions;
}

function findAvailableSlot(grid: boolean[][], duration: number, daysPerWeek: number, periodsPerDay: number) {
  for (let day = 0; day < daysPerWeek; day++) {
    for (let period = 0; period <= periodsPerDay - duration; period++) {
      let available = true;
      
      // Check if all required consecutive periods are available
      for (let i = 0; i < duration; i++) {
        if (grid[day][period + i]) {
          available = false;
          break;
        }
      }
      
      if (available) {
        return { day, period };
      }
    }
  }
  
  return null;
}

function getDayIndex(dayName: string): number {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days.indexOf(dayName.toLowerCase());
}