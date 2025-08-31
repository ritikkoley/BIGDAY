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

    const { 
      academic_term_id, 
      section_ids, 
      use_slot_template,
      constraints = {}
    } = await req.json();

    const {
      teacher_max_per_day_default = 6,
      enforce_lab_blocks = true,
      spread_course_days = true
    } = constraints;

    const runId = crypto.randomUUID();
    const results = [];
    const allConflicts = [];

    // Process each section
    for (const sectionId of section_ids) {
      try {
        const result = await generateSectionTimetable(
          supabase,
          sectionId,
          academic_term_id,
          use_slot_template,
          {
            teacher_max_per_day_default,
            enforce_lab_blocks,
            spread_course_days,
            run_id: runId
          }
        );
        
        results.push(result.stats);
        allConflicts.push(...result.conflicts);
      } catch (error) {
        console.error(`Error generating timetable for section ${sectionId}:`, error);
        results.push({
          section_id: sectionId,
          placed: 0,
          required: 0,
          conflicts: 1
        });
        
        allConflicts.push({
          run_id: runId,
          section_id: sectionId,
          conflict_type: 'generation_error',
          details: { error: error.message }
        });
      }
    }

    // Log conflicts to database
    if (allConflicts.length > 0) {
      await supabase
        .from('timetable_conflicts')
        .insert(allConflicts);
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        section_results: results,
        conflicts: allConflicts
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

async function generateSectionTimetable(
  supabase: any,
  sectionId: string,
  academicTermId: string,
  slotTemplateId: string | undefined,
  options: any
) {
  // Get section with cohort info
  const { data: section, error: sectionError } = await supabase
    .from('sections')
    .select(`
      *,
      cohort:cohorts(*)
    `)
    .eq('id', sectionId)
    .single();

  if (sectionError) throw sectionError;

  // Get slot template (from assignment or direct)
  let slotTemplate;
  if (slotTemplateId) {
    const { data: template } = await supabase
      .from('slot_templates')
      .select('*')
      .eq('id', slotTemplateId)
      .single();
    slotTemplate = template;
  } else {
    // Find assigned template
    const { data: assignment } = await supabase
      .from('slot_template_assignments')
      .select('slot_template:slot_templates(*)')
      .or(`section_id.eq.${sectionId},cohort_id.eq.${section.cohort_id}`)
      .single();
    slotTemplate = assignment?.slot_template;
  }

  const daysPerWeek = slotTemplate?.days_per_week || section.cohort.days_per_week;
  const periodsPerDay = slotTemplate?.periods_per_day || section.cohort.periods_per_day;

  // Get section courses
  const { data: sectionCourses, error: coursesError } = await supabase
    .from('section_courses')
    .select(`
      *,
      course:courses(*),
      teacher:user_profiles(id, full_name)
    `)
    .eq('section_id', sectionId)
    .order('priority', { ascending: false });

  if (coursesError) throw coursesError;

  // Get teacher load rules
  const teacherIds = sectionCourses.map(sc => sc.teacher_id).filter(Boolean);
  const { data: teacherRules } = await supabase
    .from('teacher_load_rules')
    .select('*')
    .in('teacher_id', teacherIds);

  // Initialize grid and teacher tracking
  const grid = initializeGrid(daysPerWeek, periodsPerDay);
  const teacherDailyLoad = new Map();
  const conflicts = [];
  let totalRequired = 0;
  let totalPlaced = 0;

  // Calculate total periods required
  sectionCourses.forEach(sc => {
    const theoryPeriods = sc.weekly_theory_periods || sc.course.weekly_theory_periods;
    const labPeriods = sc.weekly_lab_periods || sc.course.weekly_lab_periods;
    totalRequired += theoryPeriods + labPeriods;
  });

  // Get existing timetable or create new one
  let timetable;
  const { data: existingTimetable } = await supabase
    .from('timetables')
    .select('*')
    .eq('section_id', sectionId)
    .eq('academic_term_id', academicTermId)
    .eq('status', 'draft')
    .order('version', { ascending: false })
    .limit(1)
    .single();

  if (existingTimetable) {
    // Update existing timetable
    const { data: updatedTimetable, error: updateError } = await supabase
      .from('timetables')
      .update({ 
        generated_at: new Date().toISOString(),
        version: existingTimetable.version + 1
      })
      .eq('id', existingTimetable.id)
      .select('*')
      .single();

    if (updateError) throw updateError;
    timetable = updatedTimetable;

    // Clear existing sessions (except locked ones)
    await supabase
      .from('timetable_sessions')
      .delete()
      .eq('timetable_id', timetable.id)
      .eq('locked', false);
  } else {
    // Create new timetable
    const { data: newTimetable, error: createError } = await supabase
      .from('timetables')
      .insert({
        section_id: sectionId,
        academic_term_id: academicTermId,
        status: 'draft',
        version: 1
      })
      .select('*')
      .single();

    if (createError) throw createError;
    timetable = newTimetable;
  }

  // Get locked sessions to preserve
  const { data: lockedSessions } = await supabase
    .from('timetable_sessions')
    .select('*')
    .eq('timetable_id', timetable.id)
    .eq('locked', true);

  // Mark locked sessions in grid
  (lockedSessions || []).forEach(session => {
    for (let i = 0; i < session.duration_periods; i++) {
      const period = session.period_index + i;
      if (period <= periodsPerDay) {
        grid[session.day_of_week][period] = 'locked';
      }
    }
    
    // Track teacher load for locked sessions
    if (session.teacher_id) {
      const key = `${session.teacher_id}-${session.day_of_week}`;
      teacherDailyLoad.set(key, (teacherDailyLoad.get(key) || 0) + session.duration_periods);
    }
  });

  // Sort courses: labs first (need contiguous blocks), then by priority
  const sortedCourses = [...sectionCourses].sort((a, b) => {
    const aHasLab = (a.weekly_lab_periods || a.course.weekly_lab_periods) > 0;
    const bHasLab = (b.weekly_lab_periods || b.course.weekly_lab_periods) > 0;
    
    if (aHasLab && !bHasLab) return -1;
    if (!aHasLab && bHasLab) return 1;
    return b.priority - a.priority;
  });

  const sessionsToInsert = [];

  // Schedule each course
  for (const sectionCourse of sortedCourses) {
    const theoryPeriods = sectionCourse.weekly_theory_periods || sectionCourse.course.weekly_theory_periods;
    const labPeriods = sectionCourse.weekly_lab_periods || sectionCourse.course.weekly_lab_periods;
    const labBlockSize = sectionCourse.lab_block_size || sectionCourse.course.lab_block_size;
    
    const teacherId = sectionCourse.teacher_id;
    const teacherRule = teacherRules?.find(tr => tr.teacher_id === teacherId);
    const maxPeriodsPerDay = teacherRule?.max_periods_per_day || options.teacher_max_per_day_default;
    const availability = teacherRule?.availability;

    // Schedule lab sessions first
    if (labPeriods > 0 && options.enforce_lab_blocks) {
      const labSessions = Math.ceil(labPeriods / labBlockSize);
      
      for (let i = 0; i < labSessions; i++) {
        const slot = findAvailableSlot(
          grid,
          labBlockSize,
          daysPerWeek,
          periodsPerDay,
          teacherId,
          teacherDailyLoad,
          maxPeriodsPerDay,
          availability
        );
        
        if (slot) {
          // Mark slots as occupied
          for (let j = 0; j < labBlockSize; j++) {
            grid[slot.day][slot.period + j] = 'occupied';
          }
          
          // Update teacher load
          const teacherKey = `${teacherId}-${slot.day}`;
          teacherDailyLoad.set(teacherKey, (teacherDailyLoad.get(teacherKey) || 0) + labBlockSize);
          
          sessionsToInsert.push({
            timetable_id: timetable.id,
            section_id: sectionId,
            course_id: sectionCourse.course_id,
            teacher_id: teacherId,
            day_of_week: slot.day,
            period_index: slot.period,
            duration_periods: labBlockSize,
            session_type: 'lab'
          });
          
          totalPlaced += labBlockSize;
        } else {
          conflicts.push({
            run_id: options.run_id,
            section_id: sectionId,
            course_id: sectionCourse.course_id,
            teacher_id: teacherId,
            conflict_type: 'no_lab_slot',
            details: { 
              message: `Could not find ${labBlockSize} consecutive periods for lab`,
              required_block_size: labBlockSize
            }
          });
        }
      }
    }

    // Schedule theory sessions
    for (let i = 0; i < theoryPeriods; i++) {
      const slot = findAvailableSlot(
        grid,
        1,
        daysPerWeek,
        periodsPerDay,
        teacherId,
        teacherDailyLoad,
        maxPeriodsPerDay,
        availability,
        options.spread_course_days ? sectionCourse.course_id : undefined
      );
      
      if (slot) {
        grid[slot.day][slot.period] = 'occupied';
        
        const teacherKey = `${teacherId}-${slot.day}`;
        teacherDailyLoad.set(teacherKey, (teacherDailyLoad.get(teacherKey) || 0) + 1);
        
        sessionsToInsert.push({
          timetable_id: timetable.id,
          section_id: sectionId,
          course_id: sectionCourse.course_id,
          teacher_id: teacherId,
          day_of_week: slot.day,
          period_index: slot.period,
          duration_periods: 1,
          session_type: 'theory'
        });
        
        totalPlaced++;
      } else {
        conflicts.push({
          run_id: options.run_id,
          section_id: sectionId,
          course_id: sectionCourse.course_id,
          teacher_id: teacherId,
          conflict_type: 'no_theory_slot',
          details: { 
            message: 'Could not find available period for theory session'
          }
        });
      }
    }
  }

  // Insert all sessions
  if (sessionsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('timetable_sessions')
      .insert(sessionsToInsert);

    if (insertError) throw insertError;
  }

  return {
    stats: {
      section_id: sectionId,
      placed: totalPlaced,
      required: totalRequired,
      conflicts: conflicts.length
    },
    conflicts
  };
}

function initializeGrid(daysPerWeek: number, periodsPerDay: number) {
  const grid: any = {};
  for (let day = 1; day <= daysPerWeek; day++) {
    grid[day] = {};
    for (let period = 1; period <= periodsPerDay; period++) {
      grid[day][period] = null;
    }
  }
  return grid;
}

function findAvailableSlot(
  grid: any,
  duration: number,
  daysPerWeek: number,
  periodsPerDay: number,
  teacherId: string,
  teacherDailyLoad: Map<string, number>,
  maxPeriodsPerDay: number,
  availability?: any,
  courseId?: string
) {
  // Try to spread courses across different days if specified
  const dayOrder = courseId && grid._courseLastDay?.[courseId] 
    ? getSpreadDayOrder(grid._courseLastDay[courseId], daysPerWeek)
    : Array.from({ length: daysPerWeek }, (_, i) => i + 1);

  for (const day of dayOrder) {
    // Check teacher availability for this day
    if (availability && availability[getDayName(day).toLowerCase()]) {
      const availablePeriods = availability[getDayName(day).toLowerCase()];
      
      for (const period of availablePeriods) {
        if (period + duration - 1 <= periodsPerDay) {
          if (isSlotAvailable(grid, day, period, duration) &&
              canTeacherTakeSlot(teacherId, day, duration, teacherDailyLoad, maxPeriodsPerDay)) {
            
            // Track course placement for spreading
            if (courseId) {
              if (!grid._courseLastDay) grid._courseLastDay = {};
              grid._courseLastDay[courseId] = day;
            }
            
            return { day, period };
          }
        }
      }
    } else {
      // No specific availability constraints, try all periods
      for (let period = 1; period <= periodsPerDay - duration + 1; period++) {
        if (isSlotAvailable(grid, day, period, duration) &&
            canTeacherTakeSlot(teacherId, day, duration, teacherDailyLoad, maxPeriodsPerDay)) {
          
          if (courseId) {
            if (!grid._courseLastDay) grid._courseLastDay = {};
            grid._courseLastDay[courseId] = day;
          }
          
          return { day, period };
        }
      }
    }
  }
  
  return null;
}

function isSlotAvailable(grid: any, day: number, period: number, duration: number): boolean {
  for (let i = 0; i < duration; i++) {
    if (grid[day][period + i] !== null) {
      return false;
    }
  }
  return true;
}

function canTeacherTakeSlot(
  teacherId: string,
  day: number,
  duration: number,
  teacherDailyLoad: Map<string, number>,
  maxPeriodsPerDay: number
): boolean {
  const teacherKey = `${teacherId}-${day}`;
  const currentLoad = teacherDailyLoad.get(teacherKey) || 0;
  return currentLoad + duration <= maxPeriodsPerDay;
}

function getDayName(dayIndex: number): string {
  const days = ['', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days[dayIndex] || 'unknown';
}

function getSpreadDayOrder(lastDay: number, daysPerWeek: number): number[] {
  const days = Array.from({ length: daysPerWeek }, (_, i) => i + 1);
  // Start from the day after the last scheduled day
  const startIndex = days.indexOf(lastDay);
  if (startIndex >= 0) {
    return [...days.slice(startIndex + 1), ...days.slice(0, startIndex + 1)];
  }
  return days;
}