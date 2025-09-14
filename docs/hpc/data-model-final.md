/*
  # HPC Final Data Model Specification

  ## Entity Relationship Overview

  The HPC system consists of 11 core tables with multi-tenant architecture supporting thousands of students across multiple institutions.

  ### Core Entity Relationships

  ```
  institutions (1) ──────────── (∞) hpc_parameters
       │                              │
       │                              │
       ├── (∞) user_profiles           ├── (∞) hpc_rubrics
       │        │                     │
       │        │                     │
       │        └── (∞) hpc_evaluations ── (∞) hpc_parameter_assignments
       │                 │
       │                 │
       ├── (∞) academic_terms          │
       │        │                     │
       │        │                     │
       │        └── (∞) hpc_reports ───┘
       │                 │
       │                 │
       └── (∞) hpc_analytics ──────────┘
  ```

  ## Table Specifications

  ### 1. hpc_parameters
  **Purpose**: CBSE evaluation parameters and criteria
  
  **Columns**:
  - `id` uuid PRIMARY KEY
  - `institution_id` uuid NOT NULL REFERENCES institutions(id)
  - `name` text NOT NULL (e.g., "Mathematics", "Creativity")
  - `category` text CHECK (category IN ('scholastic', 'co_scholastic', 'life_skills', 'discipline'))
  - `sub_category` text NOT NULL (e.g., "core_subject", "arts_creativity")
  - `weightage` decimal(3,2) CHECK (weightage > 0 AND weightage <= 1)
  - `description` text
  - `cbse_code` text UNIQUE per institution
  - `grade_applicability` text[] (e.g., ["5", "6", "7", "8"])
  - `evaluation_frequency` text CHECK (evaluation_frequency IN ('continuous', 'periodic', 'annual'))
  - `active` boolean DEFAULT true
  - `created_at` timestamptz DEFAULT now()
  - `updated_at` timestamptz DEFAULT now()
  - `created_by` uuid REFERENCES user_profiles(id)
  - `updated_by` uuid REFERENCES user_profiles(id)

  **Indexes**:
  - `idx_hpc_parameters_institution_active` ON (institution_id, active)
  - `idx_hpc_parameters_category_grade` ON (category, grade_applicability) USING gin
  - `idx_hpc_parameters_cbse_code` ON (institution_id, cbse_code) UNIQUE

  ### 2. hpc_evaluations
  **Purpose**: Individual stakeholder assessments
  
  **Columns**:
  - `id` uuid PRIMARY KEY
  - `institution_id` uuid NOT NULL REFERENCES institutions(id)
  - `student_id` uuid NOT NULL REFERENCES user_profiles(id)
  - `parameter_id` uuid NOT NULL REFERENCES hpc_parameters(id)
  - `evaluator_id` uuid NOT NULL REFERENCES user_profiles(id)
  - `evaluator_role` text CHECK (evaluator_role IN ('teacher', 'parent', 'peer', 'self', 'counselor', 'coach'))
  - `score` decimal(2,1) CHECK (score >= 1.0 AND score <= 5.0)
  - `normalized_score` decimal(5,2) CHECK (normalized_score >= 0 AND normalized_score <= 100)
  - `grade` text CHECK (grade IN ('A+', 'A', 'B', 'C', 'D'))
  - `qualitative_remark` text NOT NULL CHECK (length(qualitative_remark) >= 10)
  - `evidence_notes` text
  - `confidence_level` decimal(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1)
  - `evaluation_date` date DEFAULT CURRENT_DATE
  - `term_id` uuid NOT NULL REFERENCES academic_terms(id)
  - `cycle_id` uuid REFERENCES hpc_evaluation_cycles(id)
  - `status` text CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved')) DEFAULT 'draft'
  - `version` integer DEFAULT 1
  - `created_at` timestamptz DEFAULT now()
  - `updated_at` timestamptz DEFAULT now()
  - `created_by` uuid REFERENCES user_profiles(id)
  - `updated_by` uuid REFERENCES user_profiles(id)

  **Indexes**:
  - `idx_hpc_evaluations_student_term_status` ON (student_id, term_id, status)
  - `idx_hpc_evaluations_evaluator_role_date` ON (evaluator_id, evaluator_role, evaluation_date)
  - `idx_hpc_evaluations_parameter_institution` ON (parameter_id, institution_id)
  - `idx_hpc_evaluations_updated_at` ON (updated_at DESC) WHERE status IN ('draft', 'submitted')

  **Unique Constraints**:
  - `unique_evaluation_per_cycle` ON (student_id, parameter_id, evaluator_id, cycle_id)

  ### 3. hpc_reports
  **Purpose**: Compiled student assessment reports
  
  **Columns**:
  - `id` uuid PRIMARY KEY
  - `institution_id` uuid NOT NULL REFERENCES institutions(id)
  - `student_id` uuid NOT NULL REFERENCES user_profiles(id)
  - `term_id` uuid NOT NULL REFERENCES academic_terms(id)
  - `cycle_id` uuid REFERENCES hpc_evaluation_cycles(id)
  - `overall_grade` text CHECK (overall_grade IN ('A+', 'A', 'B', 'C', 'D'))
  - `overall_score` decimal(3,2) CHECK (overall_score >= 1.0 AND overall_score <= 5.0)
  - `summary_json` jsonb NOT NULL DEFAULT '{}'
  - `status` text CHECK (status IN ('draft', 'under_review', 'approved', 'published')) DEFAULT 'draft'
  - `compiled_at` timestamptz DEFAULT now()
  - `compiled_by` uuid REFERENCES user_profiles(id)
  - `approved_at` timestamptz
  - `approved_by` uuid REFERENCES user_profiles(id)
  - `published_at` timestamptz
  - `version` integer DEFAULT 1
  - `created_at` timestamptz DEFAULT now()
  - `updated_at` timestamptz DEFAULT now()

  **Indexes**:
  - `idx_hpc_reports_student_term_version` ON (student_id, term_id, version DESC)
  - `idx_hpc_reports_institution_status_compiled` ON (institution_id, status, compiled_at DESC)
  - `idx_hpc_reports_published_at` ON (published_at DESC) WHERE status = 'published'

  ## Composite Index Recommendations

  ### Performance-Critical Indexes

  #### Multi-Column Indexes for Common Queries
  ```sql
  -- Student dashboard queries
  CREATE INDEX idx_hpc_student_dashboard 
  ON hpc_evaluations (institution_id, student_id, term_id, status);
  
  -- Teacher workload queries
  CREATE INDEX idx_hpc_teacher_workload 
  ON hpc_evaluations (institution_id, evaluator_id, evaluator_role, status, updated_at);
  
  -- Institution analytics queries
  CREATE INDEX idx_hpc_institution_analytics 
  ON hpc_evaluations (institution_id, term_id, parameter_id, status);
  
  -- Report compilation queries
  CREATE INDEX idx_hpc_report_compilation 
  ON hpc_evaluations (student_id, term_id, parameter_id, status) 
  WHERE status = 'submitted';
  ```

  #### Partial Indexes for Specific Use Cases
  ```sql
  -- Active evaluations only
  CREATE INDEX idx_hpc_evaluations_active 
  ON hpc_evaluations (student_id, parameter_id, evaluator_role) 
  WHERE status IN ('draft', 'submitted');
  
  -- Published reports only
  CREATE INDEX idx_hpc_reports_published 
  ON hpc_reports (institution_id, student_id, published_at DESC) 
  WHERE status = 'published';
  
  -- Pending approvals only
  CREATE INDEX idx_hpc_approval_pending 
  ON hpc_approval_workflows (approver_id, status, due_date) 
  WHERE status = 'pending';
  ```

  #### Full-Text Search Indexes
  ```sql
  -- Search across evaluation content
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

  ## Partitioning Strategy

  ### Primary Partitioning: By Institution
  **Rationale**: Natural tenant boundary, enables data isolation
  
  ```sql
  -- Partition large tables by institution_id
  CREATE TABLE hpc_evaluations_partitioned (
    LIKE hpc_evaluations INCLUDING ALL
  ) PARTITION BY HASH (institution_id);
  
  -- Create partitions (example for 10 institutions)
  CREATE TABLE hpc_evaluations_inst_0 PARTITION OF hpc_evaluations_partitioned
    FOR VALUES WITH (MODULUS 10, REMAINDER 0);
  -- ... continue for all remainders
  ```

  ### Sub-Partitioning: By Academic Term
  **Rationale**: Time-based access patterns, enables archival
  
  ```sql
  -- Sub-partition by academic term for large institutions
  CREATE TABLE hpc_evaluations_inst_0_2025 PARTITION OF hpc_evaluations_inst_0
    FOR VALUES FROM ('2025-01-01') TO ('2025-12-31');
  ```

  ### Partition Maintenance
  ```sql
  -- Automated partition creation
  CREATE OR REPLACE FUNCTION create_hpc_partition(
    table_name text,
    institution_id uuid,
    year integer
  ) RETURNS void AS $$
  -- Function implementation for automatic partition creation
  $$;
  
  -- Schedule partition maintenance
  SELECT cron.schedule('create-hpc-partitions', '0 0 1 10 *', 
    'SELECT create_hpc_partition(table_name, inst_id, year) 
     FROM institutions, generate_series(2025, 2030) AS year');
  ```

  ## Data Retention & Storage Policy

  ### Retention Rules by Data Type

  #### Evaluation Data
  - **Active evaluations**: Retained indefinitely
  - **Draft evaluations**: Auto-delete after 90 days if not submitted
  - **Superseded versions**: Retain for 2 years for audit purposes
  - **Deleted evaluations**: Soft delete with 30-day recovery window

  #### Report Data
  - **Published reports**: Permanent retention (legal requirement)
  - **Draft reports**: Retain for 1 year after term end
  - **Approval workflow logs**: Retain for 7 years (compliance requirement)
  - **Report versions**: Retain all versions for published reports

  #### Evidence Files
  - **Submitted evidence**: Retain for duration of student enrollment + 2 years
  - **Unused uploads**: Auto-delete after 30 days
  - **Virus scan logs**: Retain for 90 days
  - **Access logs**: Retain for 1 year

  #### Analytics Data
  - **Current term analytics**: Real-time refresh
  - **Historical analytics**: Monthly aggregation
  - **Percentile data**: Recalculate annually
  - **Growth metrics**: Retain for student's academic career

  ### Storage Optimization

  #### Compression Strategy
  ```sql
  -- Enable compression for large text fields
  ALTER TABLE hpc_evaluations ALTER COLUMN qualitative_remark SET STORAGE EXTENDED;
  ALTER TABLE hpc_reports ALTER COLUMN summary_json SET STORAGE EXTENDED;
  
  -- Use TOAST compression
  ALTER TABLE hpc_reports ALTER COLUMN summary_json SET COMPRESSION lz4;
  ```

  #### Archival Strategy
  ```sql
  -- Archive old evaluations to separate tables
  CREATE TABLE hpc_evaluations_archive (
    LIKE hpc_evaluations INCLUDING ALL
  );
  
  -- Automated archival process
  CREATE OR REPLACE FUNCTION archive_old_hpc_data(cutoff_date date)
  RETURNS bigint AS $$
  -- Archive evaluations older than cutoff_date
  $$;
  ```

  ## Query Performance Targets

  ### Dashboard Queries
  - **Student dashboard**: < 50ms (using materialized views)
  - **Teacher workload**: < 100ms (using indexes)
  - **Institution analytics**: < 200ms (using materialized views)

  ### Report Operations
  - **Report compilation**: < 5 seconds (async job)
  - **Report retrieval**: < 100ms (indexed lookup)
  - **PDF generation**: < 10 seconds (async job)

  ### Bulk Operations
  - **Batch evaluation insert**: < 1 second per 100 evaluations
  - **Bulk report generation**: < 30 minutes per 1000 students
  - **Analytics refresh**: < 15 minutes for full institution

  ## Scalability Projections

  ### Storage Growth Estimates (per 1000 students)
  - **hpc_evaluations**: ~50MB per term (6 parameters × 4 evaluators)
  - **hpc_reports**: ~10MB per term (JSON summaries)
  - **hpc_analytics**: ~5MB per term (aggregated metrics)
  - **Evidence files**: ~500MB per term (photos, documents)
  - **Total per term**: ~565MB per 1000 students

  ### Performance Scaling
  - **10,000 students**: Requires partitioning and materialized views
  - **50,000 students**: Requires read replicas and caching layer
  - **100,000+ students**: Requires sharding and distributed architecture

  ### Concurrent User Limits
  - **500 concurrent evaluators**: Supported with current architecture
  - **1000+ concurrent users**: Requires connection pooling and load balancing
  - **Peak evaluation periods**: May require queue-based processing

  This data model provides a robust foundation for the HPC system that can scale to support large educational institutions while maintaining performance and data integrity.
*/