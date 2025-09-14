# HPC Data Model Specification

## Overview

This document defines the complete data model for the Holistic Progress Card (HPC) system, including entity relationships, constraints, indexes, and storage policies.

## Entity Relationship Diagram

### Core Entities and Relationships

```
Institutions (1) ──────────── (∞) HPC_Parameters
     │                              │
     │                              │
     ├── (∞) User_Profiles           ├── (∞) HPC_Rubrics
     │        │                     │
     │        │                     │
     │        └── (∞) HPC_Evaluations ── (∞) HPC_Parameter_Assignments
     │                 │
     │                 │
     ├── (∞) Academic_Terms          │
     │        │                     │
     │        │                     │
     │        └── (∞) HPC_Reports ───┘
     │                 │
     │                 │
     └── (∞) HPC_Analytics ──────────┘
```

### Detailed Entity Specifications

#### 1. HPC_Parameters
**Purpose**: Define evaluation criteria for student assessment

**Key Relationships**:
- Belongs to Institution (institution_id)
- Has many Rubrics (1:N)
- Has many Parameter Assignments (1:N)
- Has many Evaluations (1:N)

**Business Rules**:
- Parameter codes must be unique within institution
- Weightage sum across all parameters should equal 1.0
- Grade applicability must be valid grade values
- Active parameters cannot be deleted if evaluations exist

#### 2. HPC_Evaluations
**Purpose**: Store individual stakeholder assessments

**Key Relationships**:
- Belongs to Student (student_id → user_profiles)
- Belongs to Parameter (parameter_id → hpc_parameters)
- Belongs to Evaluator (evaluator_id → user_profiles)
- Belongs to Term (term_id → academic_terms)
- Belongs to Cycle (cycle_id → hpc_evaluation_cycles)

**Business Rules**:
- One evaluation per (student, parameter, evaluator, cycle) combination
- Score must be between 1.0 and 5.0
- Confidence level must be between 0.0 and 1.0
- Qualitative remark required (minimum 10 characters)
- Evidence files stored in private buckets

#### 3. HPC_Reports
**Purpose**: Store compiled assessment reports

**Key Relationships**:
- Belongs to Student (student_id → user_profiles)
- Belongs to Term (term_id → academic_terms)
- Has many Approval Workflows (1:N)
- Has many Analytics records (1:N)

**Business Rules**:
- One active report per (student, term) combination
- Overall score calculated from weighted parameter scores
- Summary JSON must include all required sections
- Published reports are immutable (versioning for changes)

## Composite Indexes

### Performance-Critical Indexes

#### 1. HPC_Evaluations Indexes
```sql
-- Multi-column index for common queries
CREATE INDEX idx_hpc_evaluations_student_term_status 
ON hpc_evaluations (student_id, term_id, status);

-- Evaluator workload queries
CREATE INDEX idx_hpc_evaluations_evaluator_status_date 
ON hpc_evaluations (evaluator_id, status, evaluation_date);

-- Parameter analysis queries
CREATE INDEX idx_hpc_evaluations_parameter_institution 
ON hpc_evaluations (parameter_id, institution_id) 
WHERE status = 'submitted';

-- Real-time collaboration queries
CREATE INDEX idx_hpc_evaluations_updated_at 
ON hpc_evaluations (updated_at DESC) 
WHERE status IN ('draft', 'submitted');
```

#### 2. HPC_Reports Indexes
```sql
-- Student report history
CREATE INDEX idx_hpc_reports_student_term_version 
ON hpc_reports (student_id, term_id, version DESC);

-- Institution reporting queries
CREATE INDEX idx_hpc_reports_institution_status_compiled 
ON hpc_reports (institution_id, status, compiled_at DESC);

-- Approval workflow queries
CREATE INDEX idx_hpc_reports_status_compiled_by 
ON hpc_reports (status, compiled_by, compiled_at);
```

#### 3. HPC_Analytics Indexes
```sql
-- Percentile calculation queries
CREATE INDEX idx_hpc_analytics_institution_term_percentiles 
ON hpc_analytics (institution_id, term_id, class_percentile, grade_percentile);

-- Growth tracking queries
CREATE INDEX idx_hpc_analytics_student_growth 
ON hpc_analytics (student_id, term_id, growth_trajectory);

-- Risk identification queries
CREATE INDEX idx_hpc_analytics_risk_indicators 
ON hpc_analytics USING gin(risk_indicators) 
WHERE array_length(risk_indicators, 1) > 0;
```

### Full-Text Search Indexes
```sql
-- Search across qualitative content
CREATE INDEX idx_hpc_evaluations_search 
ON hpc_evaluations USING gin(
  to_tsvector('english', 
    coalesce(qualitative_remark, '') || ' ' || 
    coalesce(evidence_notes, '')
  )
);

-- Search across report summaries
CREATE INDEX idx_hpc_reports_search 
ON hpc_reports USING gin(
  to_tsvector('english', summary_json::text)
);
```

## Storage Policies

### Data Retention

#### Evaluation Data
- **Active evaluations**: Retained indefinitely
- **Draft evaluations**: Auto-delete after 90 days if not submitted
- **Superseded versions**: Retain for 2 years for audit purposes

#### Report Data
- **Published reports**: Permanent retention (legal requirement)
- **Draft reports**: Retain for 1 year after term end
- **Approval workflow logs**: Retain for 7 years (compliance)

#### Evidence Files
- **Submitted evidence**: Retain for duration of student enrollment + 2 years
- **Unused uploads**: Auto-delete after 30 days
- **Virus scan logs**: Retain for 90 days

### Storage Optimization

#### File Storage Strategy
```sql
-- Evidence file metadata
CREATE TABLE hpc_evidence_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid REFERENCES hpc_evaluations(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  virus_scan_status text CHECK (virus_scan_status IN ('pending', 'clean', 'infected', 'failed')),
  virus_scan_date timestamptz,
  uploaded_by uuid REFERENCES user_profiles(id),
  uploaded_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  access_count integer DEFAULT 0,
  last_accessed_at timestamptz
);
```

#### Bucket Organization
- **Private bucket**: `/hpc-evidence/{institution_id}/{term_id}/{student_id}/`
- **Public bucket**: `/hpc-exports/{institution_id}/reports/`
- **Temporary bucket**: `/hpc-temp/` (auto-cleanup after 24 hours)

## Data Integrity Constraints

### Referential Integrity
```sql
-- Ensure evaluator has permission to evaluate student
ALTER TABLE hpc_evaluations ADD CONSTRAINT check_evaluator_permission
CHECK (
  -- Teachers can evaluate assigned students
  (evaluator_role = 'teacher' AND EXISTS (
    SELECT 1 FROM section_courses sc
    JOIN section_students ss ON sc.section_id = ss.section_id
    WHERE sc.teacher_id = evaluator_id AND ss.student_id = hpc_evaluations.student_id
  )) OR
  -- Parents can evaluate their children
  (evaluator_role = 'parent' AND EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = evaluator_id AND up.children @> ARRAY[hpc_evaluations.student_id]
  )) OR
  -- Students can self-evaluate
  (evaluator_role = 'self' AND evaluator_id = student_id) OR
  -- Peers must be in same grade/section
  (evaluator_role = 'peer' AND EXISTS (
    SELECT 1 FROM user_profiles up1, user_profiles up2
    WHERE up1.id = evaluator_id AND up2.id = student_id
    AND up1.current_standard = up2.current_standard
    AND up1.section = up2.section
  ))
);
```

### Business Logic Constraints
```sql
-- Ensure parameter weightages are valid
ALTER TABLE hpc_parameters ADD CONSTRAINT check_weightage_range
CHECK (weightage > 0 AND weightage <= 1);

-- Ensure evaluation scores are in valid range
ALTER TABLE hpc_evaluations ADD CONSTRAINT check_score_range
CHECK (score >= 1.0 AND score <= 5.0);

-- Ensure confidence levels are valid
ALTER TABLE hpc_evaluations ADD CONSTRAINT check_confidence_range
CHECK (confidence_level >= 0.0 AND confidence_level <= 1.0);

-- Ensure overall scores are calculated correctly
ALTER TABLE hpc_reports ADD CONSTRAINT check_overall_score_range
CHECK (overall_score >= 1.0 AND overall_score <= 5.0);
```

## Materialized View Candidates

### 1. Student Summary View
**Purpose**: Fast access to student HPC overview
```sql
CREATE MATERIALIZED VIEW hpc_student_summary AS
SELECT 
  s.id as student_id,
  s.institution_id,
  s.full_name,
  s.current_standard,
  s.section,
  t.id as term_id,
  t.name as term_name,
  COUNT(e.id) as total_evaluations,
  COUNT(e.id) FILTER (WHERE e.status = 'submitted') as completed_evaluations,
  AVG(e.score) FILTER (WHERE e.status = 'submitted') as average_score,
  MAX(e.updated_at) as last_evaluation_date,
  r.overall_grade,
  r.overall_score,
  r.status as report_status
FROM user_profiles s
CROSS JOIN academic_terms t
LEFT JOIN hpc_evaluations e ON s.id = e.student_id AND t.id = e.term_id
LEFT JOIN hpc_reports r ON s.id = r.student_id AND t.id = r.term_id
WHERE s.role = 'student' AND s.status = 'active'
GROUP BY s.id, s.institution_id, s.full_name, s.current_standard, s.section, 
         t.id, t.name, r.overall_grade, r.overall_score, r.status;

-- Refresh strategy: Every 15 minutes during active hours
```

### 2. Parameter Performance View
**Purpose**: Institution-wide parameter analysis
```sql
CREATE MATERIALIZED VIEW hpc_parameter_performance AS
SELECT 
  p.institution_id,
  p.id as parameter_id,
  p.name as parameter_name,
  p.category,
  t.id as term_id,
  COUNT(e.id) as total_evaluations,
  AVG(e.score) as average_score,
  STDDEV(e.score) as score_stddev,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e.score) as median_score,
  COUNT(DISTINCT e.student_id) as students_evaluated,
  COUNT(DISTINCT e.evaluator_id) as evaluators_involved
FROM hpc_parameters p
CROSS JOIN academic_terms t
LEFT JOIN hpc_evaluations e ON p.id = e.parameter_id AND t.id = e.term_id
WHERE e.status = 'submitted'
GROUP BY p.institution_id, p.id, p.name, p.category, t.id;

-- Refresh strategy: Daily at 2 AM
```

### 3. Evaluator Workload View
**Purpose**: Track evaluator assignments and completion rates
```sql
CREATE MATERIALIZED VIEW hpc_evaluator_workload AS
SELECT 
  e.evaluator_id,
  e.evaluator_role,
  e.institution_id,
  t.id as term_id,
  COUNT(*) as assigned_evaluations,
  COUNT(*) FILTER (WHERE e.status = 'submitted') as completed_evaluations,
  COUNT(*) FILTER (WHERE e.status = 'draft') as draft_evaluations,
  AVG(e.confidence_level) FILTER (WHERE e.status = 'submitted') as avg_confidence,
  MAX(e.updated_at) as last_activity
FROM hpc_evaluations e
JOIN academic_terms t ON e.term_id = t.id
GROUP BY e.evaluator_id, e.evaluator_role, e.institution_id, t.id;

-- Refresh strategy: Every 30 minutes
```

## Query Optimization Examples

### Common Query Patterns

#### 1. Student Dashboard Query
```sql
-- Optimized query for student HPC dashboard
SELECT 
  ss.student_id,
  ss.full_name,
  ss.current_standard,
  ss.section,
  ss.total_evaluations,
  ss.completed_evaluations,
  ss.average_score,
  ss.report_status,
  COALESCE(pending.pending_count, 0) as pending_evaluations
FROM hpc_student_summary ss
LEFT JOIN (
  SELECT 
    student_id, 
    COUNT(*) as pending_count
  FROM hpc_evaluations 
  WHERE status = 'draft' AND evaluator_role = 'self'
  GROUP BY student_id
) pending ON ss.student_id = pending.student_id
WHERE ss.student_id = $1 AND ss.term_id = $2;
```

#### 2. Teacher Evaluation List Query
```sql
-- Optimized query for teacher evaluation assignments
SELECT 
  e.student_id,
  s.full_name as student_name,
  s.current_standard,
  s.section,
  p.name as parameter_name,
  p.category,
  e.score,
  e.status,
  e.updated_at
FROM hpc_evaluations e
JOIN user_profiles s ON e.student_id = s.id
JOIN hpc_parameters p ON e.parameter_id = p.id
WHERE e.evaluator_id = $1 
  AND e.term_id = $2 
  AND e.evaluator_role = 'teacher'
ORDER BY e.updated_at DESC;
```

#### 3. Institution Analytics Query
```sql
-- Optimized query for institution-wide analytics
SELECT 
  pp.parameter_name,
  pp.category,
  pp.average_score,
  pp.students_evaluated,
  pp.total_evaluations,
  RANK() OVER (PARTITION BY pp.category ORDER BY pp.average_score DESC) as category_rank
FROM hpc_parameter_performance pp
WHERE pp.institution_id = $1 AND pp.term_id = $2
ORDER BY pp.category, pp.average_score DESC;
```

## Storage Guidelines

### Database Storage

#### Table Size Estimates (per 1000 students)
- **hpc_evaluations**: ~50MB per term (6 parameters × 4 evaluators × 1000 students)
- **hpc_reports**: ~10MB per term (JSON summaries)
- **hpc_analytics**: ~5MB per term (aggregated metrics)
- **Total per term**: ~65MB per 1000 students

#### Partition Strategy
```sql
-- Partition by institution for data isolation
CREATE TABLE hpc_evaluations_partitioned (
  LIKE hpc_evaluations INCLUDING ALL
) PARTITION BY HASH (institution_id);

-- Subpartition by term for time-based queries
CREATE TABLE hpc_evaluations_inst_1_term_2025 PARTITION OF hpc_evaluations_inst_1
FOR VALUES FROM ('2025-01-01') TO ('2025-12-31');
```

### File Storage

#### Evidence Files
- **Location**: Private Supabase Storage bucket
- **Structure**: `/hpc-evidence/{institution_id}/{term_id}/{student_id}/{evaluation_id}/`
- **Security**: Signed URLs with 24-hour expiration
- **Virus Scanning**: Required before storage
- **Size Limits**: 10MB per file, 50MB total per evaluation

#### Report Exports
- **Location**: Public Supabase Storage bucket (temporary)
- **Structure**: `/hpc-exports/{institution_id}/{report_id}/`
- **Retention**: 7 days auto-cleanup
- **Formats**: PDF, JSON, CSV
- **Access**: Signed URLs for authorized users only

## Data Archival Strategy

### Hot Data (Current Term)
- **Storage**: Primary database tables
- **Performance**: Optimized indexes and materialized views
- **Backup**: Daily incremental backups
- **Access**: Real-time queries

### Warm Data (Previous 2 Terms)
- **Storage**: Partitioned tables with reduced indexing
- **Performance**: Acceptable for reporting queries
- **Backup**: Weekly full backups
- **Access**: Batch queries acceptable

### Cold Data (Historical)
- **Storage**: Compressed archive tables
- **Performance**: Export-only access
- **Backup**: Monthly archive backups
- **Access**: Restore-on-demand for compliance

## Scalability Considerations

### Horizontal Scaling
- **Read Replicas**: For analytics and reporting queries
- **Connection Pooling**: PgBouncer for connection management
- **Caching Layer**: Redis for frequently accessed data
- **CDN**: For static assets and exported reports

### Vertical Scaling
- **Database Resources**: CPU and memory scaling for peak periods
- **Storage**: Auto-scaling for evidence files
- **Compute**: Edge Functions auto-scaling for PDF generation

### Performance Targets
- **Query Response**: < 100ms for dashboard queries
- **Report Generation**: < 5 seconds for single student
- **Batch Operations**: < 30 minutes for 1000 students
- **Concurrent Users**: Support 500 concurrent evaluators

## Monitoring and Alerting

### Key Metrics to Track
- **Evaluation submission rate**: Evaluations per minute
- **Report compilation time**: Average and P95 latency
- **Storage usage**: Evidence files and database growth
- **Error rates**: Failed evaluations and report generations

### Alert Thresholds
- **High evaluation failure rate**: > 5% in 15 minutes
- **Slow report compilation**: > 10 seconds average
- **Storage quota**: > 80% of allocated space
- **Database connections**: > 80% of pool size

This data model provides a robust foundation for the HPC system that can scale to support thousands of students across multiple institutions while maintaining performance and data integrity.