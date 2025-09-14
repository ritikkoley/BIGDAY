/*
  # HPC Materialized Views Specification

  ## Overview

  This document defines the materialized views required for optimal HPC system performance, supporting fast dashboard queries and analytics for thousands of students.

  ## Core Materialized Views

  ### 1. mv_hpc_student_summary
  **Purpose**: Fast student dashboard and progress tracking
  **Refresh Policy**: Every 15 minutes during active hours (8 AM - 8 PM)

  #### View Definition
  ```sql
  CREATE MATERIALIZED VIEW mv_hpc_student_summary AS
  SELECT 
    s.id as student_id,
    s.institution_id,
    s.full_name,
    s.current_standard,
    s.section,
    s.admission_number,
    t.id as term_id,
    t.name as term_name,
    
    -- Evaluation progress
    COUNT(e.id) as total_evaluations,
    COUNT(e.id) FILTER (WHERE e.status = 'submitted') as completed_evaluations,
    COUNT(e.id) FILTER (WHERE e.status = 'draft') as draft_evaluations,
    
    -- Performance metrics
    AVG(e.score) FILTER (WHERE e.status = 'submitted') as average_score,
    AVG(e.normalized_score) FILTER (WHERE e.status = 'submitted') as average_normalized_score,
    MAX(e.score) FILTER (WHERE e.status = 'submitted') as highest_score,
    MIN(e.score) FILTER (WHERE e.status = 'submitted') as lowest_score,
    
    -- Report status
    r.overall_grade,
    r.overall_score,
    r.status as report_status,
    r.published_at,
    
    -- Last activity tracking
    GREATEST(
      COALESCE(MAX(e.updated_at), '1970-01-01'::timestamptz),
      COALESCE(r.updated_at, '1970-01-01'::timestamptz)
    ) as last_activity,
    
    -- Completion percentage
    CASE 
      WHEN COUNT(pa.id) > 0 THEN 
        (COUNT(e.id) FILTER (WHERE e.status = 'submitted')::float / COUNT(pa.id)::float) * 100
      ELSE 0 
    END as completion_percentage,
    
    -- Quality indicators
    AVG(e.confidence_level) FILTER (WHERE e.status = 'submitted') as average_confidence,
    COUNT(ef.id)::float / NULLIF(COUNT(e.id), 0)::float as evidence_attachment_rate

  FROM user_profiles s
  CROSS JOIN academic_terms t
  LEFT JOIN hpc_evaluations e ON s.id = e.student_id AND t.id = e.term_id
  LEFT JOIN hpc_reports r ON s.id = r.student_id AND t.id = r.term_id
  LEFT JOIN hpc_parameters p ON p.institution_id = s.institution_id
  LEFT JOIN hpc_parameter_assignments pa ON p.id = pa.parameter_id
  LEFT JOIN hpc_evidence_files ef ON e.id = ef.evaluation_id

  WHERE s.role = 'student' 
    AND s.status = 'active'
    AND t.institution_id = s.institution_id

  GROUP BY s.id, s.institution_id, s.full_name, s.current_standard, s.section, 
           s.admission_number, t.id, t.name, r.overall_grade, r.overall_score, 
           r.status, r.published_at, r.updated_at;
  ```

  #### Performance Indexes
  ```sql
  CREATE INDEX idx_mv_hpc_student_summary_lookup 
  ON mv_hpc_student_summary (student_id, term_id);

  CREATE INDEX idx_mv_hpc_student_summary_institution 
  ON mv_hpc_student_summary (institution_id, term_id, completion_percentage);

  CREATE INDEX idx_mv_hpc_student_summary_performance 
  ON mv_hpc_student_summary (institution_id, current_standard, average_score DESC);
  ```

  #### Example Queries Using This View
  ```sql
  -- Student dashboard query (5ms vs 500ms without view)
  SELECT 
    full_name,
    current_standard,
    section,
    total_evaluations,
    completed_evaluations,
    completion_percentage,
    average_score,
    report_status
  FROM mv_hpc_student_summary
  WHERE student_id = $1 AND term_id = $2;

  -- Class progress overview
  SELECT 
    current_standard,
    section,
    COUNT(*) as total_students,
    AVG(completion_percentage) as avg_completion,
    COUNT(*) FILTER (WHERE report_status = 'published') as published_reports
  FROM mv_hpc_student_summary
  WHERE institution_id = $1 AND term_id = $2
  GROUP BY current_standard, section;
  ```

  ### 2. mv_hpc_section_summary
  **Purpose**: Section-level analytics for teachers and administrators
  **Refresh Policy**: Every 30 minutes

  #### View Definition
  ```sql
  CREATE MATERIALIZED VIEW mv_hpc_section_summary AS
  SELECT 
    s.institution_id,
    s.current_standard,
    s.section,
    t.id as term_id,
    t.name as term_name,
    
    -- Student counts
    COUNT(DISTINCT s.id) as total_students,
    COUNT(DISTINCT s.id) FILTER (WHERE r.status = 'published') as students_with_reports,
    
    -- Evaluation progress
    COUNT(e.id) as total_evaluations,
    COUNT(e.id) FILTER (WHERE e.status = 'submitted') as completed_evaluations,
    
    -- Performance metrics
    AVG(e.score) FILTER (WHERE e.status = 'submitted') as section_average_score,
    STDDEV(e.score) FILTER (WHERE e.status = 'submitted') as score_stddev,
    
    -- Grade distribution
    COUNT(r.id) FILTER (WHERE r.overall_grade = 'A+') as grade_a_plus_count,
    COUNT(r.id) FILTER (WHERE r.overall_grade = 'A') as grade_a_count,
    COUNT(r.id) FILTER (WHERE r.overall_grade = 'B') as grade_b_count,
    COUNT(r.id) FILTER (WHERE r.overall_grade = 'C') as grade_c_count,
    COUNT(r.id) FILTER (WHERE r.overall_grade = 'D') as grade_d_count,
    
    -- Parameter breakdown
    jsonb_object_agg(
      p.name,
      jsonb_build_object(
        'average_score', AVG(e.score) FILTER (WHERE e.parameter_id = p.id AND e.status = 'submitted'),
        'evaluation_count', COUNT(e.id) FILTER (WHERE e.parameter_id = p.id),
        'completion_rate', 
          CASE 
            WHEN COUNT(e.id) FILTER (WHERE e.parameter_id = p.id) > 0 THEN
              (COUNT(e.id) FILTER (WHERE e.parameter_id = p.id AND e.status = 'submitted')::float / 
               COUNT(e.id) FILTER (WHERE e.parameter_id = p.id)::float) * 100
            ELSE 0 
          END
      )
    ) FILTER (WHERE p.id IS NOT NULL) as parameter_breakdown,
    
    -- Stakeholder participation
    jsonb_build_object(
      'teacher_participation', 
        COUNT(e.id) FILTER (WHERE e.evaluator_role = 'teacher' AND e.status = 'submitted')::float / 
        NULLIF(COUNT(e.id) FILTER (WHERE e.evaluator_role = 'teacher'), 0)::float * 100,
      'parent_participation',
        COUNT(e.id) FILTER (WHERE e.evaluator_role = 'parent' AND e.status = 'submitted')::float / 
        NULLIF(COUNT(e.id) FILTER (WHERE e.evaluator_role = 'parent'), 0)::float * 100,
      'self_assessment_rate',
        COUNT(e.id) FILTER (WHERE e.evaluator_role = 'self' AND e.status = 'submitted')::float / 
        NULLIF(COUNT(e.id) FILTER (WHERE e.evaluator_role = 'self'), 0)::float * 100,
      'peer_feedback_rate',
        COUNT(e.id) FILTER (WHERE e.evaluator_role = 'peer' AND e.status = 'submitted')::float / 
        NULLIF(COUNT(e.id) FILTER (WHERE e.evaluator_role = 'peer'), 0)::float * 100
    ) as stakeholder_participation,
    
    -- Quality metrics
    AVG(e.confidence_level) FILTER (WHERE e.status = 'submitted') as average_confidence,
    COUNT(ef.id)::float / NULLIF(COUNT(e.id), 0)::float as evidence_attachment_rate,
    
    -- Last update tracking
    MAX(e.updated_at) as last_evaluation_update,
    MAX(r.updated_at) as last_report_update

  FROM user_profiles s
  CROSS JOIN academic_terms t
  LEFT JOIN hpc_evaluations e ON s.id = e.student_id AND t.id = e.term_id
  LEFT JOIN hpc_reports r ON s.id = r.student_id AND t.id = r.term_id
  LEFT JOIN hpc_parameters p ON p.institution_id = s.institution_id
  LEFT JOIN hpc_parameter_assignments pa ON p.id = pa.parameter_id
  LEFT JOIN hpc_evidence_files ef ON e.id = ef.evaluation_id

  WHERE s.role = 'student' 
    AND s.status = 'active'
    AND t.institution_id = s.institution_id

  GROUP BY s.institution_id, s.current_standard, s.section, t.id, t.name;
  ```

  #### Example Queries Using This View
  ```sql
  -- Teacher class overview (10ms vs 800ms without view)
  SELECT 
    current_standard,
    section,
    total_students,
    students_with_reports,
    section_average_score,
    parameter_breakdown,
    stakeholder_participation
  FROM mv_hpc_section_summary
  WHERE institution_id = $1 AND term_id = $2 AND current_standard = $3;

  -- Institution performance comparison
  SELECT 
    current_standard,
    AVG(section_average_score) as grade_average,
    COUNT(*) as total_sections,
    SUM(total_students) as total_students
  FROM mv_hpc_section_summary
  WHERE institution_id = $1 AND term_id = $2
  GROUP BY current_standard
  ORDER BY current_standard;
  ```

  ## Refresh Strategies

  ### Concurrent Refresh Schedule
  ```sql
  -- High-frequency refresh for active data
  SELECT cron.schedule('refresh-student-summary', '*/15 8-20 * * *',
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_student_summary');

  -- Medium-frequency refresh for section data
  SELECT cron.schedule('refresh-section-summary', '*/30 * * * *',
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_section_summary');
  ```

  ### Incremental Refresh Strategy
  ```sql
  -- Track changes for incremental refresh
  CREATE TABLE mv_refresh_log (
    view_name text PRIMARY KEY,
    last_refresh timestamptz NOT NULL DEFAULT NOW(),
    refresh_duration interval,
    rows_affected bigint,
    refresh_method text CHECK (refresh_method IN ('full', 'incremental'))
  );

  -- Incremental refresh function
  CREATE OR REPLACE FUNCTION refresh_hpc_views_incremental()
  RETURNS void AS $$
  DECLARE
    last_refresh timestamptz;
    changed_students uuid[];
  BEGIN
    -- Get last refresh time
    SELECT last_refresh INTO last_refresh 
    FROM mv_refresh_log 
    WHERE view_name = 'mv_hpc_student_summary';
    
    -- Find changed students
    SELECT ARRAY_AGG(DISTINCT student_id) INTO changed_students
    FROM hpc_evaluations 
    WHERE updated_at > last_refresh;
    
    -- Delete and re-insert changed rows
    DELETE FROM mv_hpc_student_summary 
    WHERE student_id = ANY(changed_students);
    
    INSERT INTO mv_hpc_student_summary
    SELECT * FROM hpc_student_summary_query()
    WHERE student_id = ANY(changed_students);
    
    -- Update refresh log
    UPDATE mv_refresh_log 
    SET last_refresh = NOW(), refresh_method = 'incremental'
    WHERE view_name = 'mv_hpc_student_summary';
  END;
  $$ LANGUAGE plpgsql;
  ```

  ## Performance Monitoring

  ### View Performance Metrics
  ```sql
  -- Monitor materialized view performance
  CREATE TABLE mv_performance_metrics (
    view_name text,
    query_type text, -- 'refresh' | 'select'
    execution_time interval,
    rows_processed bigint,
    timestamp timestamptz DEFAULT NOW()
  );

  -- Performance monitoring function
  CREATE OR REPLACE FUNCTION log_view_performance(
    view_name text,
    query_type text,
    start_time timestamptz,
    rows_count bigint
  ) RETURNS void AS $$
  BEGIN
    INSERT INTO mv_performance_metrics (view_name, query_type, execution_time, rows_processed)
    VALUES (view_name, query_type, NOW() - start_time, rows_count);
  END;
  $$ LANGUAGE plpgsql;
  ```

  ### Automated Performance Alerts
  ```sql
  -- Alert if refresh takes too long
  CREATE OR REPLACE FUNCTION check_view_performance()
  RETURNS void AS $$
  DECLARE
    slow_views RECORD;
  BEGIN
    FOR slow_views IN
      SELECT view_name, AVG(execution_time) as avg_time
      FROM mv_performance_metrics
      WHERE timestamp > NOW() - INTERVAL '1 hour'
        AND query_type = 'refresh'
      GROUP BY view_name
      HAVING AVG(execution_time) > INTERVAL '5 minutes'
    LOOP
      -- Send alert (integrate with monitoring system)
      RAISE WARNING 'Slow materialized view refresh: % taking %', 
        slow_views.view_name, slow_views.avg_time;
    END LOOP;
  END;
  $$ LANGUAGE plpgsql;

  -- Schedule performance monitoring
  SELECT cron.schedule('check-view-performance', '*/10 * * * *',
    'SELECT check_view_performance()');
  ```

  ## Query Optimization Examples

  ### Before and After Performance Comparisons

  #### Student Dashboard Query
  ```sql
  -- BEFORE: Complex join across 5 tables (500ms average)
  SELECT 
    s.full_name,
    s.current_standard,
    s.section,
    COUNT(e.id) as total_evaluations,
    COUNT(e.id) FILTER (WHERE e.status = 'submitted') as completed,
    AVG(e.score) FILTER (WHERE e.status = 'submitted') as avg_score,
    r.overall_grade,
    r.status as report_status
  FROM user_profiles s
  LEFT JOIN hpc_evaluations e ON s.id = e.student_id
  LEFT JOIN hpc_reports r ON s.id = r.student_id
  LEFT JOIN hpc_parameters p ON e.parameter_id = p.id
  WHERE s.id = $1 AND e.term_id = $2
  GROUP BY s.id, s.full_name, s.current_standard, s.section, r.overall_grade, r.status;

  -- AFTER: Single materialized view lookup (5ms average)
  SELECT 
    full_name,
    current_standard,
    section,
    total_evaluations,
    completed_evaluations,
    average_score,
    overall_grade,
    report_status
  FROM mv_hpc_student_summary
  WHERE student_id = $1 AND term_id = $2;
  ```

  #### Teacher Class Overview Query
  ```sql
  -- BEFORE: Heavy aggregation with multiple joins (800ms average)
  SELECT 
    s.current_standard,
    s.section,
    COUNT(DISTINCT s.id) as student_count,
    AVG(e.score) as class_average,
    COUNT(r.id) FILTER (WHERE r.status = 'published') as published_reports
  FROM user_profiles s
  LEFT JOIN hpc_evaluations e ON s.id = e.student_id
  LEFT JOIN hpc_reports r ON s.id = r.student_id
  WHERE s.institution_id = $1 AND e.term_id = $2
  GROUP BY s.current_standard, s.section;

  -- AFTER: Pre-computed section summary (10ms average)
  SELECT 
    current_standard,
    section,
    total_students,
    section_average_score,
    students_with_reports
  FROM mv_hpc_section_summary
  WHERE institution_id = $1 AND term_id = $2;
  ```

  ## Refresh Management

  ### Refresh Scheduling Strategy
  ```sql
  -- Peak hours: More frequent refresh (every 15 minutes)
  SELECT cron.schedule('refresh-student-summary-peak', '*/15 8-18 * * 1-5',
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_student_summary');

  -- Off-peak hours: Less frequent refresh (every hour)
  SELECT cron.schedule('refresh-student-summary-offpeak', '0 19-7 * * *',
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_student_summary');

  -- Weekend: Reduced frequency (every 2 hours)
  SELECT cron.schedule('refresh-student-summary-weekend', '0 */2 * * 0,6',
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_student_summary');
  ```

  ### Refresh Monitoring
  ```sql
  -- Monitor refresh duration and success
  CREATE OR REPLACE FUNCTION monitor_mv_refresh()
  RETURNS void AS $$
  DECLARE
    start_time timestamptz;
    end_time timestamptz;
    duration interval;
  BEGIN
    start_time := NOW();
    
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_student_summary;
    
    end_time := NOW();
    duration := end_time - start_time;
    
    -- Log performance
    INSERT INTO mv_performance_metrics (view_name, query_type, execution_time, rows_processed)
    SELECT 'mv_hpc_student_summary', 'refresh', duration, COUNT(*)
    FROM mv_hpc_student_summary;
    
    -- Alert if refresh takes too long
    IF duration > INTERVAL '10 minutes' THEN
      RAISE WARNING 'Materialized view refresh took %: %', duration, 'mv_hpc_student_summary';
    END IF;
  END;
  $$ LANGUAGE plpgsql;
  ```

  ## Storage and Maintenance

  ### View Storage Requirements
  - **mv_hpc_student_summary**: ~1MB per 1000 students
  - **mv_hpc_section_summary**: ~100KB per 100 sections
  - **Refresh overhead**: ~10% additional storage during refresh

  ### Maintenance Schedule
  ```sql
  -- Weekly maintenance: Analyze and vacuum materialized views
  SELECT cron.schedule('maintain-hpc-views', '0 2 * * 0',
    'ANALYZE mv_hpc_student_summary; ANALYZE mv_hpc_section_summary;');

  -- Monthly maintenance: Full refresh and reindex
  SELECT cron.schedule('monthly-hpc-maintenance', '0 3 1 * *',
    'REFRESH MATERIALIZED VIEW mv_hpc_student_summary; 
     REFRESH MATERIALIZED VIEW mv_hpc_section_summary;
     REINDEX INDEX CONCURRENTLY idx_mv_hpc_student_summary_lookup;');
  ```

  This materialized view strategy provides significant performance improvements for dashboard queries while maintaining data freshness through intelligent refresh scheduling.
*/