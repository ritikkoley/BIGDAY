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
      report_id, 
      language = 'english',
      include_charts = true,
      include_signatures = true 
    } = await req.json();

    // Get complete report data
    const { data: report, error: reportError } = await supabase
      .from('hpc_reports')
      .select(`
        *,
        student:user_profiles(*),
        term:academic_terms(*),
        workflow:hpc_approval_workflows(*)
      `)
      .eq('id', report_id)
      .single();

    if (reportError) throw reportError;
    if (!report) throw new Error('Report not found');

    // Generate PDF content based on language
    const pdfContent = await generatePDFContent(report, language, include_charts, include_signatures);
    
    // In a real implementation, this would use a PDF generation library
    // For now, we'll return a mock PDF URL
    const filename = `HPC_${report.student.admission_number}_${report.term.name.replace(/\s+/g, '_')}_${language}.pdf`;
    const pdfUrl = `/reports/hpc/${filename}`;

    // Store PDF metadata
    await supabase
      .from('hpc_reports')
      .update({
        summary_json: {
          ...report.summary_json,
          pdf_exports: {
            ...report.summary_json.pdf_exports,
            [language]: {
              url: pdfUrl,
              generated_at: new Date().toISOString(),
              filename: filename
            }
          }
        }
      })
      .eq('id', report_id);

    return new Response(
      JSON.stringify({
        success: true,
        pdf_url: pdfUrl,
        filename: filename,
        language: language,
        generated_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generatePDFContent(
  report: any, 
  language: string, 
  includeCharts: boolean, 
  includeSignatures: boolean
): Promise<string> {
  const summaryJson = report.summary_json;
  
  // PDF Template Structure
  const template = {
    header: {
      school_logo: '/assets/school_logo.png',
      school_name: language === 'hindi' ? 'दिल्ली पब्लिक स्कूल, भिलाई' : 'Delhi Public School, Bhilai',
      document_title: language === 'hindi' ? 'समग्र प्रगति कार्ड' : 'Holistic Progress Card',
      academic_year: summaryJson.student_info.academic_year,
      term: report.term.name
    },
    student_info: {
      name: summaryJson.student_info.name,
      grade: `${language === 'hindi' ? 'कक्षा' : 'Grade'} ${summaryJson.student_info.grade}`,
      section: `${language === 'hindi' ? 'वर्ग' : 'Section'} ${summaryJson.student_info.section}`,
      admission_number: summaryJson.student_info.admission_number,
      photo_placeholder: '/assets/student_photos/placeholder.jpg'
    },
    performance_summary: {
      overall_grade: summaryJson.evaluation_summary.overall_grade,
      overall_score: summaryJson.evaluation_summary.overall_score.toFixed(2),
      parameters_evaluated: summaryJson.evaluation_summary.total_parameters_evaluated
    },
    scholastic_performance: generateScholasticSection(summaryJson, language),
    co_scholastic_performance: generateCoScholasticSection(summaryJson, language),
    life_skills_assessment: generateLifeSkillsSection(summaryJson, language),
    stakeholder_feedback: generateStakeholderSection(summaryJson, language),
    achievements: generateAchievementsSection(summaryJson, language),
    student_reflections: generateReflectionsSection(summaryJson, language),
    recommendations: generateRecommendationsSection(summaryJson, language),
    signatures: includeSignatures ? generateSignatureSection(language) : null,
    charts: includeCharts ? generateChartsSection(summaryJson) : null
  };

  return JSON.stringify(template, null, 2);
}

function generateScholasticSection(summaryJson: any, language: string): any {
  const scholasticParams = Object.values(summaryJson.parameter_breakdown || {})
    .filter((param: any) => param.category === 'scholastic');

  return {
    title: language === 'hindi' ? 'शैक्षणिक प्रदर्शन' : 'Scholastic Performance',
    subjects: scholasticParams.map((param: any) => ({
      name: param.parameter_name,
      grade: param.grade,
      score: param.score.toFixed(1),
      teacher_remark: param.stakeholder_feedback?.teacher?.evaluations?.[0]?.remark || '',
      rubric_descriptor: param.rubric_level?.descriptor || ''
    }))
  };
}

function generateCoScholasticSection(summaryJson: any, language: string): any {
  const coScholasticParams = Object.values(summaryJson.parameter_breakdown || {})
    .filter((param: any) => param.category === 'co_scholastic');

  return {
    title: language === 'hindi' ? 'सह-शैक्षणिक गतिविधियाँ' : 'Co-Scholastic Activities',
    areas: coScholasticParams.map((param: any) => ({
      name: param.parameter_name,
      grade: param.grade,
      score: param.score.toFixed(1),
      evidence: param.evidence.join('; '),
      teacher_observation: param.stakeholder_feedback?.teacher?.evaluations?.[0]?.remark || ''
    }))
  };
}

function generateLifeSkillsSection(summaryJson: any, language: string): any {
  const lifeSkillsParams = Object.values(summaryJson.parameter_breakdown || {})
    .filter((param: any) => param.category === 'life_skills');

  return {
    title: language === 'hindi' ? 'जीवन कौशल' : 'Life Skills',
    skills: lifeSkillsParams.map((param: any) => ({
      name: param.parameter_name,
      grade: param.grade,
      score: param.score.toFixed(1),
      multi_stakeholder_input: {
        teacher: param.stakeholder_feedback?.teacher?.evaluations?.[0]?.remark || '',
        parent: param.stakeholder_feedback?.parent?.evaluations?.[0]?.remark || '',
        peer: param.stakeholder_feedback?.peer?.evaluations?.[0]?.remark || '',
        self: param.stakeholder_feedback?.self?.evaluations?.[0]?.remark || ''
      }
    }))
  };
}

function generateStakeholderSection(summaryJson: any, language: string): any {
  return {
    title: language === 'hindi' ? 'हितधारक प्रतिक्रिया' : 'Stakeholder Feedback',
    teacher_comments: summaryJson.stakeholder_summary?.teacher_feedback || [],
    parent_comments: summaryJson.stakeholder_summary?.parent_feedback || [],
    peer_feedback: summaryJson.stakeholder_summary?.peer_feedback || [],
    self_reflections: summaryJson.stakeholder_summary?.self_reflections || []
  };
}

function generateAchievementsSection(summaryJson: any, language: string): any {
  return {
    title: language === 'hindi' ? 'उपलब्धियाँ' : 'Achievements',
    achievements: summaryJson.achievements || [],
    total_points: summaryJson.achievements?.reduce((sum: number, ach: any) => sum + (ach.points || 0), 0) || 0
  };
}

function generateReflectionsSection(summaryJson: any, language: string): any {
  return {
    title: language === 'hindi' ? 'छात्र चिंतन' : 'Student Reflections',
    reflections: summaryJson.student_reflections || [],
    goals_for_next_term: summaryJson.next_steps || []
  };
}

function generateRecommendationsSection(summaryJson: any, language: string): any {
  return {
    title: language === 'hindi' ? 'सुझाव' : 'Recommendations',
    strengths: summaryJson.strengths_identified || [],
    growth_areas: summaryJson.growth_areas || [],
    recommendations: summaryJson.recommendations || [],
    next_steps: summaryJson.next_steps || []
  };
}

function generateSignatureSection(language: string): any {
  return {
    title: language === 'hindi' ? 'हस्ताक्षर' : 'Signatures',
    class_teacher: {
      label: language === 'hindi' ? 'कक्षा अध्यापक' : 'Class Teacher',
      name: '________________________',
      date: '____________'
    },
    principal: {
      label: language === 'hindi' ? 'प्राचार्य' : 'Principal',
      name: '________________________',
      date: '____________'
    },
    parent: {
      label: language === 'hindi' ? 'अभिभावक' : 'Parent/Guardian',
      name: '________________________',
      date: '____________'
    }
  };
}

function generateChartsSection(summaryJson: any): any {
  const parameterScores = Object.values(summaryJson.parameter_breakdown || {})
    .map((param: any) => ({
      name: param.parameter_name,
      score: param.score,
      grade: param.grade
    }));

  return {
    radar_chart: {
      type: 'radar',
      data: parameterScores,
      title: 'Parameter Performance Overview'
    },
    bar_chart: {
      type: 'bar',
      data: parameterScores,
      title: 'Detailed Parameter Scores'
    },
    growth_chart: {
      type: 'line',
      data: [], // Would be populated with historical data
      title: 'Growth Trajectory'
    }
  };
}