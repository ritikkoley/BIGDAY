# HPC Partitioning and Materialized Views

## Overview

This document defines the partitioning strategy and materialized view design for the HPC system to ensure optimal performance at scale with thousands of students across multiple institutions.

## Partitioning Strategy

### Primary Partitioning Approach

#### 1. Institution-Based Partitioning
**Rationale**: Natural data isolation boundary, supports multi-tenancy

```sql
-- Partition large tables by institution_id
CREATE TABLE hpc_evaluations_partitioned (
  LIKE hpc_evaluations INCLUDING ALL
) PARTITION BY HASH (institution_id);

-- Create partitions for institutions (example for 10 institutions)
CREATE TABLE hpc_evaluations_inst_0 PARTITION OF hpc_evaluations_partitioned
  FOR VALUES WITH (MODULUS 10, REMAINDER 0);
CREATE TABLE hpc_evaluations_inst_1 PARTITION OF hpc_evaluations_partitioned
  FOR VALUES WITH (MODULUS 10, REMAINDER 1);
-- ... continue for all remainders
```

#### 2. Time-Based Sub-Partitioning
**Rationale**: Academic terms create natural time boundaries

```sql
-- Sub-partition by academic term for time-based queries
CREATE TABLE hpc_evaluations_inst_0_2025 PARTITION OF hpc_evaluations_inst_0
  FOR VALUES FROM ('2025-01-01') TO ('2025-12-31');
CREATE TABLE hpc_evaluations_inst_0_2026 PARTITION OF hpc_evaluations_inst_0
  FOR VALUES FROM ('2026-01-01') TO ('2026-12-31');
```

### Partition Maintenance Schedule

#### Automatic Partition Creation
```sql
-- Function to create new partitions
CREATE OR REPLACE FUNCTION create_hpc_partition(
  table_name text,
  institution_id uuid,
  year integer
) RETURNS void AS $$
DECLARE
  partition_name text;
  start_date date;
  end_date date;
BEGIN
  partition_name := format('%s_inst_%s_%s', table_name, 
    replace(institution_id::text, '-', '_'), year);
  start_date := make_date(year, 1, 1);
  end_date := make_date(year + 1, 1, 1);
  
  EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF %I
    FOR VALUES FROM (%L) TO (%L)',
    partition_name, table_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;
```

#### Scheduled Maintenance (using pg_cron)
```sql
-- Create partitions for next year in advance
SELECT cron.schedule('create-hpc-partitions', '0 0 1 10 *', 
  'SELECT create_hpc_partition(''hpc_evaluations'', inst.id, EXTRACT(YEAR FROM NOW())::integer + 1)
   FROM institutions inst WHERE inst.active = true');

-- Archive old partitions annually
SELECT cron.schedule('archive-hpc-partitions', '0 2 1 1 *',
  'SELECT archive_old_hpc_partitions(EXTRACT(YEAR FROM NOW())::integer - 3)');
```

### Partition Pruning Optimization
```sql
-- Enable constraint exclusion for partition pruning
SET constraint_exclusion = partition;

-- Example query that benefits from partition pruning
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM hpc_evaluations 
WHERE institution_id = 'inst-123' 
  AND evaluation_date >= '2025-01-01' 
  AND evaluation_date < '2025-12-31';
```

## Materialized Views Design

### 1. Student Performance Dashboard View

```sql
CREATE MATERIALIZED VIEW mv_hpc_student_dashboard AS
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
  MAX(e.score) FILTER (WHERE e.status = 'submitted') as highest_score,
  MIN(e.score) FILTER (WHERE e.status = 'submitted') as lowest_score,
  
  -- Report status
  r.overall_grade,
  r.overall_score,
  r.status as report_status,
  r.published_at,
  
  -- Last activity
  GREATEST(
    COALESCE(MAX(e.updated_at), '1970-01-01'::timestamptz),
    COALESCE(r.updated_at, '1970-01-01'::timestamptz)
  ) as last_activity,
  
  -- Completion percentage
  CASE 
    WHEN COUNT(pa.id) > 0 THEN 
      (COUNT(e.id) FILTER (WHERE e.status = 'submitted')::float / COUNT(pa.id)::float) * 100
    ELSE 0 
  END as completion_percentage

FROM user_profiles s
CROSS JOIN academic_terms t
LEFT JOIN hpc_evaluations e ON s.id = e.student_id AND t.id = e.term_id
LEFT JOIN hpc_reports r ON s.id = r.student_id AND t.id = r.term_id
LEFT JOIN hpc_parameters p ON p.institution_id = s.institution_id
LEFT JOIN hpc_parameter_assignments pa ON p.id = pa.parameter_id

WHERE s.role = 'student' 
  AND s.status = 'active'
  AND t.institution_id = s.institution_id

GROUP BY s.id, s.institution_id, s.full_name, s.current_standard, s.section, 
         s.admission_number, t.id, t.name, r.overall_grade, r.overall_score, 
         r.status, r.published_at, r.updated_at;

-- Indexes for fast access
CREATE INDEX idx_mv_hpc_student_dashboard_lookup 
ON mv_hpc_student_dashboard (student_id, term_id);

CREATE INDEX idx_mv_hpc_student_dashboard_institution 
ON mv_hpc_student_dashboard (institution_id, term_id, completion_percentage);
```

### 2. Teacher Workload View

```sql
CREATE MATERIALIZED VIEW mv_hpc_teacher_workload AS
SELECT 
  t.id as teacher_id,
  t.institution_id,
  t.full_name as teacher_name,
  t.department,
  term.id as term_id,
  term.name as term_name,
  
  -- Assignment counts
  COUNT(DISTINCT e.student_id) as assigned_students,
  COUNT(DISTINCT e.parameter_id) as assigned_parameters,
  COUNT(e.id) as total_evaluations,
  
  -- Completion status
  COUNT(e.id) FILTER (WHERE e.status = 'submitted') as completed_evaluations,
  COUNT(e.id) FILTER (WHERE e.status = 'draft') as draft_evaluations,
  
  -- Performance metrics
  AVG(e.score) FILTER (WHERE e.status = 'submitted') as average_score_given,
  AVG(e.confidence_level) FILTER (WHERE e.status = 'submitted') as average_confidence,
  
  -- Workload distribution
  COUNT(e.id) FILTER (WHERE e.updated_at >= NOW() - INTERVAL '7 days') as recent_activity,
  MAX(e.updated_at) as last_evaluation_date,
  
  -- Efficiency metrics
  CASE 
    WHEN COUNT(e.id) > 0 THEN 
      (COUNT(e.id) FILTER (WHERE e.status = 'submitted')::float / COUNT(e.id)::float) * 100
    ELSE 0 
  END as completion_rate

FROM user_profiles t
CROSS JOIN academic_terms term
LEFT JOIN hpc_evaluations e ON t.id = e.evaluator_id AND term.id = e.term_id AND e.evaluator_role = 'teacher'

WHERE t.role = 'teacher' 
  AND t.status = 'active'
  AND term.institution_id = t.institution_id

GROUP BY t.id, t.institution_id, t.full_name, t.department, term.id, term.name;

-- Index for teacher dashboard queries
CREATE INDEX idx_mv_hpc_teacher_workload_lookup 
ON mv_hpc_teacher_workload (teacher_id, term_id);
```

### 3. Institution Analytics View

```sql
CREATE MATERIALIZED VIEW mv_hpc_institution_analytics AS
SELECT 
  i.id as institution_id,
  i.name as institution_name,
  t.id as term_id,
  t.name as term_name,
  
  -- Student metrics
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT s.id) FILTER (WHERE r.status = 'published') as students_with_reports,
  
  -- Evaluation metrics
  COUNT(e.id) as total_evaluations,
  COUNT(e.id) FILTER (WHERE e.status = 'submitted') as completed_evaluations,
  AVG(e.score) FILTER (WHERE e.status = 'submitted') as institution_average_score,
  
  -- Parameter breakdown
  jsonb_object_agg(
    p.category,
    jsonb_build_object(
      'average_score', AVG(e.score) FILTER (WHERE e.status = 'submitted' AND p.category = p.category),
      'total_evaluations', COUNT(e.id) FILTER (WHERE p.category = p.category),
      'completion_rate', 
        CASE 
          WHEN COUNT(e.id) FILTER (WHERE p.category = p.category) > 0 THEN
            (COUNT(e.id) FILTER (WHERE e.status = 'submitted' AND p.category = p.category)::float / 
             COUNT(e.id) FILTER (WHERE p.category = p.category)::float) * 100
          ELSE 0 
        END
    )
  ) as category_breakdown,
  
  -- Grade distribution
  jsonb_object_agg(
    r.overall_grade,
    COUNT(r.id) FILTER (WHERE r.overall_grade = r.overall_grade)
  ) FILTER (WHERE r.overall_grade IS NOT NULL) as grade_distribution,
  
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
      NULLIF(COUNT(e.id) FILTER (WHERE e.evaluator_role = 'self'), 0)::float * 100
  ) as stakeholder_participation,
  
  -- Quality indicators
  AVG(e.confidence_level) FILTER (WHERE e.status = 'submitted') as average_confidence,
  COUNT(ef.id)::float / NULLIF(COUNT(e.id), 0)::float as evidence_attachment_rate,
  
  -- Refresh metadata
  NOW() as refreshed_at

FROM institutions i
CROSS JOIN academic_terms t
LEFT JOIN user_profiles s ON i.id = s.institution_id AND s.role = 'student' AND s.status = 'active'
LEFT JOIN hpc_evaluations e ON s.id = e.student_id AND t.id = e.term_id
LEFT JOIN hpc_parameters p ON e.parameter_id = p.id
LEFT JOIN hpc_reports r ON s.id = r.student_id AND t.id = r.term_id
LEFT JOIN hpc_evidence_files ef ON e.id = ef.evaluation_id

WHERE t.institution_id = i.id

GROUP BY i.id, i.name, t.id, t.name;

-- Index for institution dashboard
CREATE INDEX idx_mv_hpc_institution_analytics_lookup 
ON mv_hpc_institution_analytics (institution_id, term_id);
```

## Refresh Strategies

### Real-Time Views (< 1 minute lag)
**Use Cases**: Student dashboards, teacher workload, live progress tracking

```sql
-- Refresh every 30 seconds during active hours (8 AM - 8 PM)
SELECT cron.schedule('refresh-student-dashboard', '*/30 8-20 * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_student_dashboard');
```

### Near Real-Time Views (< 15 minutes lag)
**Use Cases**: Class analytics, parameter performance, evaluation progress

```sql
-- Refresh every 15 minutes
SELECT cron.schedule('refresh-teacher-workload', '*/15 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_teacher_workload');
```

### Batch Views (Daily refresh)
**Use Cases**: Institution analytics, percentile calculations, growth tracking

```sql
-- Refresh daily at 2 AM
SELECT cron.schedule('refresh-institution-analytics', '0 2 * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_institution_analytics');
```

### On-Demand Views (Manual refresh)
**Use Cases**: Historical reports, compliance audits, data exports

```sql
-- Manual refresh for heavy analytical queries
REFRESH MATERIALIZED VIEW mv_hpc_historical_trends;
```

## Query Optimization Examples

### 1. Student Dashboard Query (Uses mv_hpc_student_dashboard)
```sql
-- Before: Complex join across 5 tables (500ms)
SELECT s.full_name, COUNT(e.id), AVG(e.score), r.overall_grade
FROM user_profiles s
LEFT JOIN hpc_evaluations e ON s.id = e.student_id
LEFT JOIN hpc_reports r ON s.id = r.student_id
WHERE s.id = $1 AND e.term_id = $2
GROUP BY s.id, r.overall_grade;

-- After: Single table lookup (5ms)
SELECT full_name, total_evaluations, average_score, overall_grade
FROM mv_hpc_student_dashboard
WHERE student_id = $1 AND term_id = $2;
```

### 2. Institution Analytics Query (Uses mv_hpc_institution_analytics)
```sql
-- Before: Heavy aggregation across all tables (2000ms)
SELECT i.name, COUNT(DISTINCT s.id), AVG(e.score), 
       COUNT(r.id) FILTER (WHERE r.status = 'published')
FROM institutions i
JOIN user_profiles s ON i.id = s.institution_id
LEFT JOIN hpc_evaluations e ON s.id = e.student_id
LEFT JOIN hpc_reports r ON s.id = r.student_id
WHERE i.id = $1 AND e.term_id = $2
GROUP BY i.id, i.name;

-- After: Pre-computed view lookup (10ms)
SELECT institution_name, total_students, institution_average_score, students_with_reports
FROM mv_hpc_institution_analytics
WHERE institution_id = $1 AND term_id = $2;
```

### 3. Teacher Workload Query (Uses mv_hpc_teacher_workload)
```sql
-- Before: Complex aggregation with role filtering (300ms)
SELECT t.full_name, COUNT(DISTINCT e.student_id), 
       COUNT(e.id) FILTER (WHERE e.status = 'submitted'),
       AVG(e.confidence_level)
FROM user_profiles t
LEFT JOIN hpc_evaluations e ON t.id = e.evaluator_id
WHERE t.id = $1 AND e.term_id = $2 AND e.evaluator_role = 'teacher'
GROUP BY t.id, t.full_name;

-- After: Direct view lookup (3ms)
SELECT teacher_name, assigned_students, completed_evaluations, avg_confidence
FROM mv_hpc_teacher_workload
WHERE teacher_id = $1 AND term_id = $2;
```

## Incremental Refresh Strategy

### Change Detection
```sql
-- Track changes for incremental refresh
CREATE TABLE mv_refresh_log (
  view_name text PRIMARY KEY,
  last_refresh timestamptz NOT NULL DEFAULT NOW(),
  refresh_duration interval,
  rows_affected bigint,
  refresh_method text CHECK (refresh_method IN ('full', 'incremental'))
);

-- Function to detect changes since last refresh
CREATE OR REPLACE FUNCTION get_changed_students_since(last_refresh timestamptz)
RETURNS TABLE(student_id uuid, institution_id uuid) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT e.student_id, s.institution_id
  FROM hpc_evaluations e
  JOIN user_profiles s ON e.student_id = s.id
  WHERE e.updated_at > last_refresh
  
  UNION
  
  SELECT DISTINCT r.student_id, s.institution_id
  FROM hpc_reports r
  JOIN user_profiles s ON r.student_id = s.id
  WHERE r.updated_at > last_refresh;
END;
$$ LANGUAGE plpgsql;
```

### Incremental Refresh Implementation
```sql
-- Incremental refresh for student dashboard
CREATE OR REPLACE FUNCTION refresh_student_dashboard_incremental()
RETURNS void AS $$
DECLARE
  last_refresh timestamptz;
  affected_students RECORD;
BEGIN
  -- Get last refresh time
  SELECT last_refresh INTO last_refresh 
  FROM mv_refresh_log 
  WHERE view_name = 'mv_hpc_student_dashboard';
  
  -- Delete affected rows
  FOR affected_students IN 
    SELECT student_id, institution_id FROM get_changed_students_since(last_refresh)
  LOOP
    DELETE FROM mv_hpc_student_dashboard 
    WHERE student_id = affected_students.student_id;
  END LOOP;
  
  -- Insert updated rows
  INSERT INTO mv_hpc_student_dashboard
  SELECT * FROM hpc_student_dashboard_query()
  WHERE student_id IN (
    SELECT student_id FROM get_changed_students_since(last_refresh)
  );
  
  -- Update refresh log
  UPDATE mv_refresh_log 
  SET last_refresh = NOW(), refresh_method = 'incremental'
  WHERE view_name = 'mv_hpc_student_dashboard';
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

-- Function to log view performance
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

## Storage Optimization

### Compression Strategy
```sql
-- Enable compression for large text fields
ALTER TABLE hpc_evaluations ALTER COLUMN qualitative_remark SET STORAGE EXTENDED;
ALTER TABLE hpc_reports ALTER COLUMN summary_json SET STORAGE EXTENDED;

-- Use TOAST compression for large JSON
ALTER TABLE hpc_reports ALTER COLUMN summary_json SET COMPRESSION lz4;
```

### Archive Strategy
```sql
-- Archive old evaluations to separate tables
CREATE TABLE hpc_evaluations_archive (
  LIKE hpc_evaluations INCLUDING ALL
);

-- Function to archive old data
CREATE OR REPLACE FUNCTION archive_old_hpc_data(cutoff_date date)
RETURNS bigint AS $$
DECLARE
  archived_count bigint;
BEGIN
  -- Move old evaluations to archive
  WITH archived AS (
    DELETE FROM hpc_evaluations 
    WHERE evaluation_date < cutoff_date
    RETURNING *
  )
  INSERT INTO hpc_evaluations_archive 
  SELECT * FROM archived;
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  
  RAISE NOTICE 'Archived % evaluation records older than %', archived_count, cutoff_date;
  
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule annual archival
SELECT cron.schedule('archive-hpc-data', '0 3 1 1 *',
  'SELECT archive_old_hpc_data(CURRENT_DATE - INTERVAL ''3 years'')');
```

## Maintenance Procedures

### Daily Maintenance
1. **Refresh critical materialized views** (student dashboard, teacher workload)
2. **Check partition health** and create new partitions if needed
3. **Monitor query performance** and identify slow queries
4. **Validate data integrity** with automated checks

### Weekly Maintenance
1. **Full refresh of analytical views** (institution analytics)
2. **Reindex fragmented indexes** if needed
3. **Archive old evidence files** based on retention policy
4. **Generate performance reports** for optimization

### Monthly Maintenance
1. **Partition maintenance** (drop old partitions, create future ones)
2. **Storage optimization** (compress old data, vacuum full if needed)
3. **Performance tuning** based on query patterns
4. **Capacity planning** review and scaling decisions

This partitioning and materialized view strategy ensures the HPC system can scale to support thousands of students while maintaining excellent query performance and data integrity.