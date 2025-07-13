import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { assessment_id, grades } = await req.json()

    if (!assessment_id || !grades || !Array.isArray(grades)) {
      throw new Error('Invalid request: assessment_id and grades array required')
    }

    // Validate grades format
    for (const grade of grades) {
      if (!grade.student_id || typeof grade.score !== 'number') {
        throw new Error('Invalid grade format: student_id and score required')
      }
    }

    // Get assessment details for validation
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('total_marks, course_id')
      .eq('id', assessment_id)
      .single()

    if (assessmentError) throw assessmentError

    // Prepare grades with assessment_id and validation
    const gradesWithAssessment = grades.map(grade => ({
      ...grade,
      assessment_id,
      max_score: assessment.total_marks,
      graded_by: req.headers.get('user-id'), // From auth context
      graded_at: new Date().toISOString()
    }))

    // Insert grades
    const { data: insertedGrades, error: insertError } = await supabase
      .from('grades')
      .upsert(gradesWithAssessment, { 
        onConflict: 'student_id,assessment_id',
        ignoreDuplicates: false 
      })
      .select()

    if (insertError) throw insertError

    // Calculate percentiles using RPC function
    const { error: percentileError } = await supabase
      .rpc('calculate_percentiles', { assess_id: assessment_id })

    if (percentileError) {
      console.warn('Percentile calculation failed:', percentileError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: insertedGrades,
        message: `Successfully uploaded ${grades.length} grades`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})