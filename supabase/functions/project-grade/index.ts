import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProjectionRequest {
  student_id: string;
  course_id: string;
  assumed_performance?: number; // 0.0 to 1.0, default 0.8 (80%)
  scenario?: 'optimistic' | 'realistic' | 'pessimistic';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { student_id, course_id, assumed_performance, scenario = 'realistic' }: ProjectionRequest = await req.json()

    if (!student_id || !course_id) {
      throw new Error('student_id and course_id are required')
    }

    // Set performance assumption based on scenario
    let performanceRate = assumed_performance ?? 0.8;
    switch (scenario) {
      case 'optimistic':
        performanceRate = 0.95;
        break;
      case 'pessimistic':
        performanceRate = 0.6;
        break;
      case 'realistic':
      default:
        performanceRate = 0.8;
        break;
    }

    // Get current grade calculation
    const { data: currentGrade, error: currentError } = await supabase
      .rpc('calculate_current_grade', { 
        stud_id: student_id, 
        crs_id: course_id 
      })

    if (currentError) throw currentError

    // Get projection
    const { data: projection, error: projectionError } = await supabase
      .rpc('project_future_grade', { 
        stud_id: student_id, 
        crs_id: course_id,
        assumed_performance: performanceRate
      })

    if (projectionError) throw projectionError

    // Get remaining assessments for detailed breakdown
    const { data: remainingAssessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('name, type, weightage, due_date')
      .eq('course_id', course_id)
      .gt('due_date', new Date().toISOString())
      .order('due_date')

    if (assessmentsError) throw assessmentsError

    // Calculate grade boundaries
    const current = projection[0]?.current_grade || 0
    const projected = projection[0]?.projected_grade || 0
    const confidence = projection[0]?.confidence_level || 'low'

    // Grade letter calculation
    const getGradeLetter = (score: number) => {
      if (score >= 90) return 'A'
      if (score >= 80) return 'B'
      if (score >= 70) return 'C'
      if (score >= 60) return 'D'
      return 'F'
    }

    // Calculate what's needed for next grade
    const currentLetter = getGradeLetter(projected)
    const nextGradeThreshold = projected >= 90 ? 95 : 
                              projected >= 80 ? 90 : 
                              projected >= 70 ? 80 : 
                              projected >= 60 ? 70 : 60

    const remainingWeight = projection[0]?.remaining_weightage || 0
    const neededScore = remainingWeight > 0 ? 
      Math.max(0, Math.min(100, (nextGradeThreshold - current) / remainingWeight)) : 0

    const result = {
      current_performance: {
        score: Math.round(current * 100) / 100,
        letter: getGradeLetter(current),
        completed_assessments: currentGrade[0]?.completed_assessments || 0
      },
      projection: {
        score: Math.round(projected * 100) / 100,
        letter: getGradeLetter(projected),
        confidence_level: confidence,
        scenario: scenario
      },
      grade_improvement: {
        next_grade_threshold: nextGradeThreshold,
        score_needed_on_remaining: Math.round(neededScore * 100) / 100,
        is_achievable: neededScore <= 100,
        remaining_weightage: remainingWeight
      },
      remaining_assessments: remainingAssessments?.map(assessment => ({
        ...assessment,
        impact_on_grade: (assessment.weightage * performanceRate * 100).toFixed(1)
      })) || [],
      scenarios: {
        optimistic: Math.round((current + remainingWeight * 0.95) * 100) / 100,
        realistic: Math.round((current + remainingWeight * 0.8) * 100) / 100,
        pessimistic: Math.round((current + remainingWeight * 0.6) * 100) / 100
      }
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to calculate grade projection'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})