import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { course_id, date, attendance_records } = await req.json()

    if (!course_id || !date || !attendance_records || !Array.isArray(attendance_records)) {
      throw new Error('Invalid request: course_id, date, and attendance_records array required')
    }

    // Validate attendance records format
    for (const record of attendance_records) {
      if (!record.student_id || !record.status) {
        throw new Error('Invalid attendance format: student_id and status required')
      }
      if (!['present', 'absent', 'late', 'excused'].includes(record.status)) {
        throw new Error('Invalid status: must be present, absent, late, or excused')
      }
    }

    // Prepare attendance records
    const attendanceWithDetails = attendance_records.map(record => ({
      ...record,
      course_id,
      date,
      marked_by: req.headers.get('user-id'), // From auth context
    }))

    // Insert/update attendance records
    const { data: insertedRecords, error: insertError } = await supabase
      .from('attendance')
      .upsert(attendanceWithDetails, { 
        onConflict: 'student_id,course_id,date',
        ignoreDuplicates: false 
      })
      .select()

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: insertedRecords,
        message: `Successfully uploaded attendance for ${attendance_records.length} students`
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