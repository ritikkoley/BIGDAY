import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

// Types for HPC system
export interface HPCParameter {
  id: string;
  name: string;
  category: 'scholastic' | 'co_scholastic' | 'life_skills' | 'discipline';
  sub_category: string;
  weightage: number;
  description: string;
  cbse_code: string;
  grade_applicability: string[];
  evaluation_frequency: 'continuous' | 'periodic' | 'annual';
  active: boolean;
}

export interface HPCEvaluation {
  id: string;
  student_id: string;
  parameter_id: string;
  evaluator_id: string;
  evaluator_role: 'teacher' | 'parent' | 'peer' | 'self' | 'counselor' | 'coach';
  score: number;
  grade: string;
  qualitative_remark: string;
  evidence_notes?: string;
  confidence_level: number;
  evaluation_date: string;
  term_id: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
}

export interface HPCReport {
  id: string;
  student_id: string;
  term_id: string;
  overall_grade: string;
  overall_score: number;
  summary_json: any;
  status: 'draft' | 'under_review' | 'approved' | 'published';
  compiled_at: string;
  compiled_by: string;
  approved_at?: string;
  approved_by?: string;
  published_at?: string;
  version: number;
}

export interface HPCRubric {
  id: string;
  parameter_id: string;
  level: string;
  grade_equivalent: string;
  descriptor: string;
  detailed_description: string;
  examples: string[];
  indicators: string[];
  version: number;
  active: boolean;
}

// HPC Processing Pipeline
export class HPCProcessor {
  
  /**
   * Step 1: Evaluation Collection & Pre-Processing
   * Handles multiple inputs per student and normalizes data
   */
  static async collectEvaluations(studentId: string, termId: string): Promise<{
    evaluations: HPCEvaluation[];
    parameters: HPCParameter[];
    rubrics: HPCRubric[];
  }> {
    try {
      // Get all evaluations for student in this term
      const { data: evaluations, error: evalError } = await supabase
        .from('hpc_evaluations')
        .select(`
          *,
          parameter:hpc_parameters(*),
          evaluator:user_profiles(full_name, role)
        `)
        .eq('student_id', studentId)
        .eq('term_id', termId)
        .eq('status', 'submitted');

      if (evalError) throw evalError;

      // Get all active parameters for student's grade
      const { data: student } = await supabase
        .from('user_profiles')
        .select('current_standard')
        .eq('id', studentId)
        .single();

      const { data: parameters, error: paramError } = await supabase
        .from('hpc_parameters')
        .select('*')
        .eq('active', true)
        .contains('grade_applicability', [student?.current_standard]);

      if (paramError) throw paramError;

      // Get current rubrics
      const { data: rubrics, error: rubricError } = await supabase
        .from('hpc_rubrics')
        .select('*')
        .eq('active', true)
        .in('parameter_id', parameters?.map(p => p.id) || []);

      if (rubricError) throw rubricError;

      return {
        evaluations: evaluations || [],
        parameters: parameters || [],
        rubrics: rubrics || []
      };
    } catch (error) {
      console.error('Error collecting evaluations:', error);
      throw error;
    }
  }

  /**
   * Step 2: Score Normalization & Validation
   * Converts raw scores to standardized grades and validates data
   */
  static normalizeScore(score: number): { grade: string; level: string } {
    if (score >= 4.5) return { grade: 'A+', level: 'outstanding' };
    if (score >= 3.5) return { grade: 'A', level: 'excellent' };
    if (score >= 2.5) return { grade: 'B', level: 'good' };
    if (score >= 1.5) return { grade: 'C', level: 'satisfactory' };
    return { grade: 'D', level: 'needs_improvement' };
  }

  static validateEvaluation(evaluation: HPCEvaluation): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Score validation
    if (evaluation.score < 1 || evaluation.score > 5) {
      errors.push('Score must be between 1 and 5');
    }

    // Confidence level validation
    if (evaluation.confidence_level < 0.5) {
      warnings.push('Low confidence level - consider additional evidence');
    }

    // Qualitative remark validation
    if (!evaluation.qualitative_remark || evaluation.qualitative_remark.length < 10) {
      warnings.push('Qualitative remark should be more detailed');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Step 3: Aggregation Logic
   * Combines multiple evaluations per parameter using weightages
   */
  static aggregateParameterEvaluations(
    evaluations: HPCEvaluation[],
    parameter: HPCParameter,
    assignments: any[]
  ): {
    aggregatedScore: number;
    aggregatedGrade: string;
    stakeholderBreakdown: any;
    evidenceCollection: string[];
  } {
    const stakeholderBreakdown: any = {};
    const evidenceCollection: string[] = [];
    let weightedSum = 0;
    let totalWeight = 0;

    // Group evaluations by evaluator role
    const evaluationsByRole = evaluations.reduce((acc, eval) => {
      if (!acc[eval.evaluator_role]) acc[eval.evaluator_role] = [];
      acc[eval.evaluator_role].push(eval);
      return acc;
    }, {} as Record<string, HPCEvaluation[]>);

    // Apply weightages from parameter assignments
    assignments.forEach(assignment => {
      const roleEvaluations = evaluationsByRole[assignment.evaluator_role] || [];
      
      if (roleEvaluations.length > 0) {
        // Average multiple evaluations from same role
        const roleAverage = roleEvaluations.reduce((sum, eval) => sum + eval.score, 0) / roleEvaluations.length;
        
        weightedSum += roleAverage * assignment.weightage;
        totalWeight += assignment.weightage;

        // Collect stakeholder feedback
        stakeholderBreakdown[assignment.evaluator_role] = {
          score: roleAverage,
          grade: this.normalizeScore(roleAverage).grade,
          evaluations: roleEvaluations.map(eval => ({
            evaluator_name: eval.evaluator?.full_name,
            score: eval.score,
            remark: eval.qualitative_remark,
            confidence: eval.confidence_level,
            date: eval.evaluation_date
          }))
        };

        // Collect evidence
        roleEvaluations.forEach(eval => {
          if (eval.evidence_notes) {
            evidenceCollection.push(`${assignment.evaluator_role}: ${eval.evidence_notes}`);
          }
        });
      }
    });

    const aggregatedScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const aggregatedGrade = this.normalizeScore(aggregatedScore).grade;

    return {
      aggregatedScore,
      aggregatedGrade,
      stakeholderBreakdown,
      evidenceCollection
    };
  }

  /**
   * Step 4: Report Compilation
   * Generates comprehensive HPC report from all evaluations
   */
  static async compileReport(studentId: string, termId: string, compiledBy: string): Promise<HPCReport> {
    try {
      // Collect all data
      const { evaluations, parameters, rubrics } = await this.collectEvaluations(studentId, termId);
      
      // Get student info
      const { data: student } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', studentId)
        .single();

      // Get parameter assignments
      const { data: assignments } = await supabase
        .from('hpc_parameter_assignments')
        .select('*')
        .in('parameter_id', parameters.map(p => p.id));

      // Get achievements
      const { data: achievements } = await supabase
        .from('hpc_achievements')
        .select('*')
        .eq('student_id', studentId);

      // Get reflections
      const { data: reflections } = await supabase
        .from('hpc_reflections')
        .select('*')
        .eq('student_id', studentId)
        .eq('term_id', termId);

      // Process each parameter
      const parameterResults: any = {};
      let totalWeightedScore = 0;
      let totalWeight = 0;

      for (const parameter of parameters) {
        const paramEvaluations = evaluations.filter(e => e.parameter_id === parameter.id);
        const paramAssignments = assignments?.filter(a => a.parameter_id === parameter.id) || [];
        
        if (paramEvaluations.length > 0) {
          const result = this.aggregateParameterEvaluations(
            paramEvaluations,
            parameter,
            paramAssignments
          );

          parameterResults[parameter.id] = {
            parameter_name: parameter.name,
            category: parameter.category,
            weightage: parameter.weightage,
            score: result.aggregatedScore,
            grade: result.aggregatedGrade,
            stakeholder_feedback: result.stakeholderBreakdown,
            evidence: result.evidenceCollection,
            rubric_level: this.getRubricDescriptor(result.aggregatedScore, parameter.id, rubrics)
          };

          totalWeightedScore += result.aggregatedScore * parameter.weightage;
          totalWeight += parameter.weightage;
        }
      }

      // Calculate overall performance
      const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
      const overallGrade = this.normalizeScore(overallScore).grade;

      // Identify strengths and growth areas
      const strengths = Object.values(parameterResults)
        .filter((result: any) => result.score >= 4.0)
        .map((result: any) => result.parameter_name);

      const growthAreas = Object.values(parameterResults)
        .filter((result: any) => result.score < 3.0)
        .map((result: any) => result.parameter_name);

      // Compile final report JSON
      const summaryJson = {
        student_info: {
          name: student?.full_name,
          grade: student?.current_standard,
          section: student?.section,
          admission_number: student?.admission_number,
          academic_year: '2024-25'
        },
        evaluation_summary: {
          overall_score: overallScore,
          overall_grade: overallGrade,
          total_parameters_evaluated: Object.keys(parameterResults).length,
          evaluation_period: format(new Date(), 'MMMM yyyy')
        },
        parameter_breakdown: parameterResults,
        stakeholder_summary: this.generateStakeholderSummary(parameterResults),
        achievements: achievements?.map(a => ({
          title: a.title,
          category: a.category,
          date: a.date_achieved,
          points: a.points_awarded
        })) || [],
        student_reflections: reflections?.map(r => ({
          type: r.reflection_type,
          content: r.content,
          goals: r.goals_set
        })) || [],
        strengths_identified: strengths,
        growth_areas: growthAreas,
        recommendations: this.generateRecommendations(parameterResults, strengths, growthAreas),
        next_steps: this.generateNextSteps(growthAreas, reflections),
        compiled_metadata: {
          compilation_date: new Date().toISOString(),
          compiled_by: compiledBy,
          data_sources: this.getDataSources(evaluations),
          quality_indicators: this.calculateQualityIndicators(evaluations, parameters)
        }
      };

      // Create report record
      const { data: report, error: reportError } = await supabase
        .from('hpc_reports')
        .insert({
          student_id: studentId,
          term_id: termId,
          overall_grade: overallGrade,
          overall_score: overallScore,
          summary_json: summaryJson,
          status: 'draft',
          compiled_by: compiledBy,
          version: 1
        })
        .select()
        .single();

      if (reportError) throw reportError;

      return report;
    } catch (error) {
      console.error('Error compiling report:', error);
      throw error;
    }
  }

  /**
   * Step 5: Approval Workflow Management
   */
  static async initiateApprovalWorkflow(reportId: string): Promise<void> {
    try {
      // Get report details
      const { data: report } = await supabase
        .from('hpc_reports')
        .select('*, student:user_profiles(current_standard, section)')
        .eq('id', reportId)
        .single();

      if (!report) throw new Error('Report not found');

      // Create approval workflow steps
      const workflowSteps = [
        {
          step_number: 1,
          approver_role: 'class_teacher',
          approver_id: await this.getClassTeacher(report.student.current_standard, report.student.section),
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
        },
        {
          step_number: 2,
          approver_role: 'principal',
          approver_id: await this.getPrincipal(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }
      ];

      // Insert workflow steps
      const { error: workflowError } = await supabase
        .from('hpc_approval_workflows')
        .insert(
          workflowSteps.map(step => ({
            report_id: reportId,
            ...step,
            status: step.step_number === 1 ? 'pending' : 'waiting',
            assigned_at: step.step_number === 1 ? new Date().toISOString() : null
          }))
        );

      if (workflowError) throw workflowError;

      // Update report status
      await supabase
        .from('hpc_reports')
        .update({ status: 'under_review' })
        .eq('id', reportId);

    } catch (error) {
      console.error('Error initiating approval workflow:', error);
      throw error;
    }
  }

  /**
   * Step 6: Approval Processing
   */
  static async processApproval(
    workflowId: string, 
    approverId: string, 
    decision: 'approved' | 'rejected' | 'needs_revision',
    comments?: string
  ): Promise<void> {
    try {
      // Update workflow step
      const { data: workflow, error: updateError } = await supabase
        .from('hpc_approval_workflows')
        .update({
          status: decision,
          approved_at: decision === 'approved' ? new Date().toISOString() : null,
          comments: comments
        })
        .eq('id', workflowId)
        .select('*, report:hpc_reports(*)')
        .single();

      if (updateError) throw updateError;

      if (decision === 'approved') {
        // Check if this was the final approval step
        const { data: remainingSteps } = await supabase
          .from('hpc_approval_workflows')
          .select('*')
          .eq('report_id', workflow.report_id)
          .neq('status', 'approved');

        if (!remainingSteps || remainingSteps.length === 0) {
          // All steps approved - publish report
          await this.publishReport(workflow.report_id, approverId);
        } else {
          // Activate next step
          const nextStep = remainingSteps.find(s => s.step_number === workflow.step_number + 1);
          if (nextStep) {
            await supabase
              .from('hpc_approval_workflows')
              .update({
                status: 'pending',
                assigned_at: new Date().toISOString()
              })
              .eq('id', nextStep.id);
          }
        }
      } else if (decision === 'rejected' || decision === 'needs_revision') {
        // Send back to draft
        await supabase
          .from('hpc_reports')
          .update({ status: 'draft' })
          .eq('id', workflow.report_id);
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      throw error;
    }
  }

  /**
   * Step 7: Report Publishing
   */
  static async publishReport(reportId: string, publishedBy: string): Promise<void> {
    try {
      await supabase
        .from('hpc_reports')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          approved_by: publishedBy
        })
        .eq('id', reportId);

      // Generate analytics
      await this.generateAnalytics(reportId);
      
      // Trigger notifications to stakeholders
      await this.notifyStakeholders(reportId);
    } catch (error) {
      console.error('Error publishing report:', error);
      throw error;
    }
  }

  /**
   * Step 8: Export & Presentation
   */
  static async exportReportToPDF(
    reportId: string, 
    language: 'english' | 'hindi' = 'english'
  ): Promise<{ pdfUrl: string; filename: string }> {
    try {
      // Get complete report data
      const { data: report } = await supabase
        .from('hpc_reports')
        .select(`
          *,
          student:user_profiles(*),
          term:academic_terms(*)
        `)
        .eq('id', reportId)
        .single();

      if (!report) throw new Error('Report not found');

      // Call PDF generation edge function
      const { data: pdfResult, error: pdfError } = await supabase.functions.invoke('generate_hpc_pdf', {
        body: {
          report_id: reportId,
          language: language,
          include_charts: true,
          include_signatures: true
        }
      });

      if (pdfError) throw pdfError;

      return {
        pdfUrl: pdfResult.pdf_url,
        filename: `HPC_${report.student.admission_number}_${report.term.name.replace(/\s+/g, '_')}_${language}.pdf`
      };
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  }

  /**
   * Step 9: Analytics Integration
   */
  static async generateAnalytics(reportId: string): Promise<void> {
    try {
      const { data: report } = await supabase
        .from('hpc_reports')
        .select('*, student:user_profiles(current_standard, section)')
        .eq('id', reportId)
        .single();

      if (!report) return;

      // Calculate percentiles
      const percentiles = await this.calculatePercentiles(
        report.student_id,
        report.term_id,
        report.student.current_standard,
        report.overall_score
      );

      // Predict growth trajectory
      const growthTrajectory = await this.predictGrowthTrajectory(
        report.student_id,
        report.overall_score
      );

      // Insert analytics
      await supabase
        .from('hpc_analytics')
        .insert({
          student_id: report.student_id,
          term_id: report.term_id,
          report_id: reportId,
          class_percentile: percentiles.class,
          grade_percentile: percentiles.grade,
          school_percentile: percentiles.school,
          growth_trajectory: growthTrajectory.trend,
          predicted_next_score: growthTrajectory.predicted,
          confidence_interval: growthTrajectory.confidence,
          strengths_identified: this.extractStrengths(report.summary_json),
          improvement_areas: this.extractImprovementAreas(report.summary_json)
        });
    } catch (error) {
      console.error('Error generating analytics:', error);
    }
  }

  // Helper methods
  private static getRubricDescriptor(score: number, parameterId: string, rubrics: HPCRubric[]): any {
    const grade = this.normalizeScore(score).grade;
    const rubric = rubrics.find(r => r.parameter_id === parameterId && r.level === grade);
    
    return rubric ? {
      level: rubric.level,
      descriptor: rubric.descriptor,
      detailed_description: rubric.detailed_description,
      examples: rubric.examples
    } : null;
  }

  private static generateStakeholderSummary(parameterResults: any): any {
    const summary: any = {
      teacher_feedback: [],
      parent_feedback: [],
      peer_feedback: [],
      self_reflections: []
    };

    Object.values(parameterResults).forEach((result: any) => {
      const stakeholders = result.stakeholder_feedback || {};
      
      if (stakeholders.teacher) {
        summary.teacher_feedback.push({
          parameter: result.parameter_name,
          grade: stakeholders.teacher.grade,
          remarks: stakeholders.teacher.evaluations.map((e: any) => e.remark)
        });
      }
      
      if (stakeholders.parent) {
        summary.parent_feedback.push({
          parameter: result.parameter_name,
          grade: stakeholders.parent.grade,
          remarks: stakeholders.parent.evaluations.map((e: any) => e.remark)
        });
      }
      
      if (stakeholders.peer) {
        summary.peer_feedback.push({
          parameter: result.parameter_name,
          grade: stakeholders.peer.grade,
          remarks: stakeholders.peer.evaluations.map((e: any) => e.remark)
        });
      }
      
      if (stakeholders.self) {
        summary.self_reflections.push({
          parameter: result.parameter_name,
          grade: stakeholders.self.grade,
          remarks: stakeholders.self.evaluations.map((e: any) => e.remark)
        });
      }
    });

    return summary;
  }

  private static generateRecommendations(
    parameterResults: any,
    strengths: string[],
    growthAreas: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Strength-based recommendations
    if (strengths.includes('Mathematics')) {
      recommendations.push('Consider advanced mathematics programs or competitions');
    }
    if (strengths.includes('Creativity & Innovation')) {
      recommendations.push('Explore art exhibitions or creative writing opportunities');
    }
    if (strengths.includes('Physical Fitness & Health')) {
      recommendations.push('Consider sports leadership roles or fitness mentoring');
    }

    // Growth area recommendations
    if (growthAreas.includes('Teamwork & Collaboration')) {
      recommendations.push('Participate in more group projects and collaborative activities');
    }
    if (growthAreas.includes('Empathy & Compassion')) {
      recommendations.push('Engage in community service or peer support programs');
    }

    return recommendations;
  }

  private static generateNextSteps(growthAreas: string[], reflections: any[]): string[] {
    const nextSteps: string[] = [];

    // Extract goals from student reflections
    reflections?.forEach(reflection => {
      if (reflection.goals_set && Array.isArray(reflection.goals_set)) {
        nextSteps.push(...reflection.goals_set);
      }
    });

    // Add system-generated next steps based on growth areas
    growthAreas.forEach(area => {
      switch (area) {
        case 'Mathematics':
          nextSteps.push('Schedule additional math practice sessions');
          break;
        case 'Physical Fitness & Health':
          nextSteps.push('Develop a personalized fitness plan');
          break;
        case 'Teamwork & Collaboration':
          nextSteps.push('Join collaborative extracurricular activities');
          break;
      }
    });

    return [...new Set(nextSteps)]; // Remove duplicates
  }

  private static getDataSources(evaluations: HPCEvaluation[]): any {
    const sources = evaluations.reduce((acc, eval) => {
      acc[eval.evaluator_role] = (acc[eval.evaluator_role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total_evaluations: evaluations.length,
      by_role: sources,
      evaluation_period: {
        start: evaluations.reduce((earliest, eval) => 
          eval.evaluation_date < earliest ? eval.evaluation_date : earliest, 
          evaluations[0]?.evaluation_date || new Date().toISOString()
        ),
        end: evaluations.reduce((latest, eval) => 
          eval.evaluation_date > latest ? eval.evaluation_date : latest, 
          evaluations[0]?.evaluation_date || new Date().toISOString()
        )
      }
    };
  }

  private static calculateQualityIndicators(
    evaluations: HPCEvaluation[],
    parameters: HPCParameter[]
  ): any {
    const avgConfidence = evaluations.reduce((sum, eval) => sum + eval.confidence_level, 0) / evaluations.length;
    const parametersWithEvaluations = new Set(evaluations.map(e => e.parameter_id)).size;
    const completeness = parametersWithEvaluations / parameters.length;
    
    return {
      average_confidence: avgConfidence,
      completeness_percentage: completeness * 100,
      multi_stakeholder_coverage: this.calculateStakeholderCoverage(evaluations),
      evidence_richness: this.calculateEvidenceRichness(evaluations)
    };
  }

  private static calculateStakeholderCoverage(evaluations: HPCEvaluation[]): number {
    const roles = new Set(evaluations.map(e => e.evaluator_role));
    const expectedRoles = ['teacher', 'parent', 'self'];
    const coverage = expectedRoles.filter(role => roles.has(role)).length / expectedRoles.length;
    return coverage * 100;
  }

  private static calculateEvidenceRichness(evaluations: HPCEvaluation[]): number {
    const withEvidence = evaluations.filter(e => e.evidence_notes && e.evidence_notes.length > 0).length;
    return evaluations.length > 0 ? (withEvidence / evaluations.length) * 100 : 0;
  }

  private static async calculatePercentiles(
    studentId: string,
    termId: string,
    grade: string,
    score: number
  ): Promise<{ class: number; grade: number; school: number }> {
    // Get all students in same class
    const { data: classmates } = await supabase
      .from('hpc_reports')
      .select('overall_score')
      .eq('term_id', termId)
      .neq('student_id', studentId)
      .in('student_id', 
        supabase
          .from('user_profiles')
          .select('id')
          .eq('current_standard', grade)
          .eq('section', await this.getStudentSection(studentId))
      );

    // Get all students in same grade
    const { data: grademates } = await supabase
      .from('hpc_reports')
      .select('overall_score')
      .eq('term_id', termId)
      .neq('student_id', studentId)
      .in('student_id',
        supabase
          .from('user_profiles')
          .select('id')
          .eq('current_standard', grade)
      );

    // Get all students in school
    const { data: schoolmates } = await supabase
      .from('hpc_reports')
      .select('overall_score')
      .eq('term_id', termId)
      .neq('student_id', studentId);

    return {
      class: this.calculatePercentile(score, classmates?.map(c => c.overall_score) || []),
      grade: this.calculatePercentile(score, grademates?.map(g => g.overall_score) || []),
      school: this.calculatePercentile(score, schoolmates?.map(s => s.overall_score) || [])
    };
  }

  private static calculatePercentile(score: number, otherScores: number[]): number {
    if (otherScores.length === 0) return 50;
    const belowCount = otherScores.filter(s => s < score).length;
    return Math.round((belowCount / otherScores.length) * 100);
  }

  private static async predictGrowthTrajectory(studentId: string, currentScore: number): Promise<{
    trend: 'improving' | 'declining' | 'stable';
    predicted: number;
    confidence: any;
  }> {
    // Get historical scores
    const { data: historicalReports } = await supabase
      .from('hpc_reports')
      .select('overall_score, compiled_at')
      .eq('student_id', studentId)
      .order('compiled_at', { ascending: true });

    if (!historicalReports || historicalReports.length < 2) {
      return {
        trend: 'stable',
        predicted: currentScore,
        confidence: { lower: currentScore - 0.2, upper: currentScore + 0.2 }
      };
    }

    // Simple linear regression for trend
    const scores = historicalReports.map(r => r.overall_score);
    const lastScore = scores[scores.length - 2];
    const trend = currentScore > lastScore + 0.1 ? 'improving' : 
                 currentScore < lastScore - 0.1 ? 'declining' : 'stable';

    // Predict next score based on trend
    const avgChange = scores.length > 1 ? 
      (currentScore - scores[0]) / (scores.length - 1) : 0;
    const predicted = Math.max(1, Math.min(5, currentScore + avgChange));

    return {
      trend,
      predicted,
      confidence: {
        lower: Math.max(1, predicted - 0.3),
        upper: Math.min(5, predicted + 0.3)
      }
    };
  }

  private static extractStrengths(summaryJson: any): string[] {
    return summaryJson.strengths_identified || [];
  }

  private static extractImprovementAreas(summaryJson: any): string[] {
    return summaryJson.growth_areas || [];
  }

  private static async getClassTeacher(grade: string, section: string): Promise<string> {
    const { data: teacher } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'teacher')
      .eq('class_teacher_of', `${grade}-${section}`)
      .single();
    
    return teacher?.id || await this.getAnyTeacher();
  }

  private static async getPrincipal(): Promise<string> {
    const { data: admin } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'admin')
      .single();
    
    return admin?.id || '';
  }

  private static async getAnyTeacher(): Promise<string> {
    const { data: teacher } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'teacher')
      .limit(1)
      .single();
    
    return teacher?.id || '';
  }

  private static async getStudentSection(studentId: string): Promise<string> {
    const { data: student } = await supabase
      .from('user_profiles')
      .select('section')
      .eq('id', studentId)
      .single();
    
    return student?.section || '';
  }

  private static async notifyStakeholders(reportId: string): Promise<void> {
    // Implementation for sending notifications to parents, students, teachers
    // This would integrate with the existing messaging system
    console.log(`Notifying stakeholders about published report: ${reportId}`);
  }
}

// API Functions for HPC Management
export const hpcApi = {
  // Parameters Management
  getParameters: async (): Promise<HPCParameter[]> => {
    const { data, error } = await supabase
      .from('hpc_parameters')
      .select('*')
      .eq('active', true)
      .order('category, weightage desc');
    
    if (error) throw error;
    return data || [];
  },

  createParameter: async (parameter: Omit<HPCParameter, 'id'>): Promise<HPCParameter> => {
    const { data, error } = await supabase
      .from('hpc_parameters')
      .insert(parameter)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Evaluations Management
  submitEvaluation: async (evaluation: Omit<HPCEvaluation, 'id'>): Promise<HPCEvaluation> => {
    // Validate evaluation
    const validation = HPCProcessor.validateEvaluation(evaluation as HPCEvaluation);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('hpc_evaluations')
      .insert({
        ...evaluation,
        status: 'submitted'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getEvaluationsByStudent: async (studentId: string, termId: string): Promise<HPCEvaluation[]> => {
    const { data, error } = await supabase
      .from('hpc_evaluations')
      .select(`
        *,
        parameter:hpc_parameters(*),
        evaluator:user_profiles(full_name, role)
      `)
      .eq('student_id', studentId)
      .eq('term_id', termId)
      .order('evaluation_date desc');
    
    if (error) throw error;
    return data || [];
  },

  // Report Management
  compileReport: async (studentId: string, termId: string, compiledBy: string): Promise<HPCReport> => {
    return await HPCProcessor.compileReport(studentId, termId, compiledBy);
  },

  getReport: async (reportId: string): Promise<HPCReport> => {
    const { data, error } = await supabase
      .from('hpc_reports')
      .select(`
        *,
        student:user_profiles(*),
        term:academic_terms(*),
        workflow:hpc_approval_workflows(*)
      `)
      .eq('id', reportId)
      .single();
    
    if (error) throw error;
    return data;
  },

  getStudentReports: async (studentId: string): Promise<HPCReport[]> => {
    const { data, error } = await supabase
      .from('hpc_reports')
      .select(`
        *,
        term:academic_terms(name, start_date, end_date)
      `)
      .eq('student_id', studentId)
      .order('compiled_at desc');
    
    if (error) throw error;
    return data || [];
  },

  // Approval Workflow
  approveReport: async (
    workflowId: string, 
    approverId: string, 
    decision: 'approved' | 'rejected' | 'needs_revision',
    comments?: string
  ): Promise<void> => {
    return await HPCProcessor.processApproval(workflowId, approverId, decision, comments);
  },

  // Export Functions
  exportToPDF: async (reportId: string, language: 'english' | 'hindi' = 'english'): Promise<{
    pdfUrl: string;
    filename: string;
  }> => {
    return await HPCProcessor.exportReportToPDF(reportId, language);
  },

  // Analytics
  getStudentAnalytics: async (studentId: string, termId?: string): Promise<any> => {
    let query = supabase
      .from('hpc_analytics')
      .select('*')
      .eq('student_id', studentId);
    
    if (termId) {
      query = query.eq('term_id', termId);
    }
    
    const { data, error } = await query.order('created_at desc');
    if (error) throw error;
    return data || [];
  },

  // Bulk Operations
  bulkCompileReports: async (studentIds: string[], termId: string, compiledBy: string): Promise<{
    successful: number;
    failed: number;
    errors: string[];
  }> => {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const studentId of studentIds) {
      try {
        await HPCProcessor.compileReport(studentId, termId, compiledBy);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${studentId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }
};

// Real-time subscriptions for HPC updates
export const hpcSubscriptions = {
  subscribeToEvaluations: (studentId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('hpc-evaluations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hpc_evaluations',
        filter: `student_id=eq.${studentId}`
      }, callback)
      .subscribe();
  },

  subscribeToReports: (studentId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('hpc-reports')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hpc_reports',
        filter: `student_id=eq.${studentId}`
      }, callback)
      .subscribe();
  },

  subscribeToWorkflow: (reportId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('hpc-workflow')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hpc_approval_workflows',
        filter: `report_id=eq.${reportId}`
      }, callback)
      .subscribe();
  }
};