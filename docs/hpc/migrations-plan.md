/*
  # HPC Multi-Tenant Migration Plan

  ## Overview
  
  This document outlines a zero-downtime migration strategy to implement the Holistic Progress Card (HPC) system with full multi-tenant support. The migration adds institution-level data isolation while maintaining backward compatibility with existing BIG DAY infrastructure.

  ## Migration Objectives
  
  - **Multi-Tenancy**: Add institution_id scoping to all HPC tables
  - **Zero Downtime**: Online migration with no service interruption
  - **Data Integrity**: Maintain referential integrity throughout migration
  - **Performance**: Optimize for 10k+ students per institution
  - **Rollback Safety**: Complete rollback plan for any migration step

  ## Schema Changes Required

  ### New Tables to Create
  ```
  1. hpc_parameters - CBSE evaluation parameters
  2. hpc_rubrics - Performance level descriptors  
  3. hpc_parameter_assignments - Role-based weightings
  4. hpc_evaluation_cycles - Evaluation periods
  5. hpc_evaluations - Multi-stakeholder assessments
  6. hpc_reports - Compiled student reports
  7. hpc_approval_workflows - Multi-step approval process
  8. hpc_analytics - Performance analytics
  9. hpc_achievements - Student achievements
  10. hpc_reflections - Student self-reflections
  11. hpc_evidence_files - Evidence file metadata
  ```

  ### Existing Tables to Modify
  ```
  user_profiles:
    + institution_id uuid REFERENCES institutions(id)
    + parent_of uuid[] (for parent-child relationships)
    
  academic_terms:
    + institution_id uuid REFERENCES institutions(id)
    
  courses:
    + institution_id uuid REFERENCES institutions(id)
    
  audit_logs:
    + hpc_context jsonb (for HPC-specific audit data)
  ```

  ### New Fields for Multi-Tenancy
  ```
  All HPC tables include:
    + institution_id uuid NOT NULL REFERENCES institutions(id)
    + created_by uuid REFERENCES user_profiles(id)
    + updated_by uuid REFERENCES user_profiles(id)
    + normalized_score decimal(5,2) (for hpc_evaluations)
  ```

  ## Zero-Downtime Migration Sequence

  ### Step 1: Infrastructure Preparation (30 minutes)
  **Objective**: Prepare environment and monitoring
  
  **Actions**:
  1. Create database backup with point-in-time recovery
  2. Enable query logging for migration monitoring
  3. Set up monitoring dashboards for key metrics
  4. Prepare rollback scripts and test on staging
  
  **Pseudocode**:
  ```sql
  -- Enable monitoring
  ALTER SYSTEM SET log_statement = 'all';
  ALTER SYSTEM SET log_duration = on;
  
  -- Create backup
  SELECT pg_start_backup('hpc_migration_' || now()::text);
  ```
  
  **Verification**:
  - Backup completed successfully
  - Monitoring dashboards active
  - Rollback scripts tested on staging

  ### Step 2: Schema Extension (45 minutes)
  **Objective**: Add new columns and tables without affecting existing functionality
  
  **Actions**:
  1. Create institutions table if not exists
  2. Add institution_id columns as NULLABLE to existing tables
  3. Create all HPC tables with proper constraints
  4. Add audit trail columns (created_by, updated_by)
  
  **Pseudocode**:
  ```sql
  -- Add nullable columns first (zero downtime)
  ALTER TABLE user_profiles ADD COLUMN institution_id uuid;
  ALTER TABLE academic_terms ADD COLUMN institution_id uuid;
  ALTER TABLE courses ADD COLUMN institution_id uuid;
  ALTER TABLE user_profiles ADD COLUMN parent_of uuid[];
  
  -- Create HPC tables
  CREATE TABLE hpc_parameters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id uuid NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    -- ... full schema
  );
  ```
  
  **Verification**:
  - All new columns added successfully
  - Existing queries continue to work
  - No application errors in logs

  ### Step 3: Data Backfill (60 minutes)
  **Objective**: Populate institution_id values in existing tables
  
  **Batch Strategy**:
  - **Batch Size**: 1000 rows per batch
  - **Parallelism**: 4 concurrent workers
  - **Rate Limiting**: 100ms delay between batches
  - **Progress Tracking**: Log completion percentage
  
  **Estimated Time Calculations**:
  ```
  For 50,000 user_profiles:
  - Batches: 50,000 / 1000 = 50 batches
  - Time per batch: ~500ms (update + delay)
  - Total time: 50 * 0.5s = 25 minutes
  - With 4 workers: ~7 minutes
  ```
  
  **Pseudocode**:
  ```sql
  -- Backfill user_profiles in batches
  DO $$
  DECLARE
    batch_size INTEGER := 1000;
    offset_val INTEGER := 0;
    rows_updated INTEGER;
    default_institution_id uuid;
  BEGIN
    -- Get or create default institution
    SELECT id INTO default_institution_id FROM institutions LIMIT 1;
    
    LOOP
      UPDATE user_profiles 
      SET institution_id = default_institution_id
      WHERE institution_id IS NULL
        AND id IN (
          SELECT id FROM user_profiles 
          WHERE institution_id IS NULL 
          LIMIT batch_size OFFSET offset_val
        );
      
      GET DIAGNOSTICS rows_updated = ROW_COUNT;
      EXIT WHEN rows_updated = 0;
      
      offset_val := offset_val + batch_size;
      RAISE NOTICE 'Updated % rows, offset %', rows_updated, offset_val;
      
      -- Rate limiting
      PERFORM pg_sleep(0.1);
    END LOOP;
  END $$;
  ```
  
  **Verification**:
  - All rows have institution_id populated
  - No NULL values in critical tables
  - Data integrity checks pass

  ### Step 4: Constraint Addition (30 minutes)
  **Objective**: Add NOT NULL constraints and foreign keys
  
  **Actions**:
  1. Add NOT NULL constraints to institution_id columns
  2. Add foreign key constraints to institutions table
  3. Create composite indexes for performance
  4. Enable Row Level Security on HPC tables
  
  **Pseudocode**:
  ```sql
  -- Add constraints after backfill
  ALTER TABLE user_profiles 
    ALTER COLUMN institution_id SET NOT NULL,
    ADD CONSTRAINT fk_user_profiles_institution 
    FOREIGN KEY (institution_id) REFERENCES institutions(id);
  
  -- Create performance indexes
  CREATE INDEX CONCURRENTLY idx_user_profiles_institution_role 
    ON user_profiles(institution_id, role);
  ```
  
  **Verification**:
  - All constraints added successfully
  - Foreign key relationships validated
  - Index creation completed

  ### Step 5: Performance Optimization (45 minutes)
  **Objective**: Create materialized views and optimize query performance
  
  **Actions**:
  1. Create materialized views for dashboard queries
  2. Set up automatic refresh schedules
  3. Create partition templates for large tables
  4. Optimize query plans with EXPLAIN ANALYZE
  
  **Pseudocode**:
  ```sql
  -- Create materialized views
  CREATE MATERIALIZED VIEW mv_hpc_student_summary AS
  SELECT 
    s.id as student_id,
    s.institution_id,
    s.full_name,
    COUNT(e.id) as total_evaluations,
    AVG(e.score) as average_score
  FROM user_profiles s
  LEFT JOIN hpc_evaluations e ON s.id = e.student_id
  WHERE s.role = 'student'
  GROUP BY s.id, s.institution_id, s.full_name;
  
  -- Set up refresh schedule
  SELECT cron.schedule('refresh-hpc-summary', '*/15 * * * *',
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hpc_student_summary');
  ```

  ## Backfill Strategy Details

  ### Batch Processing Approach
  **Rationale**: Minimize lock time and allow concurrent operations
  
  **Implementation**:
  - Process in small batches (1000 rows)
  - Use advisory locks to prevent conflicts
  - Include progress logging and error handling
  - Support pause/resume for long operations
  
  **Parallelism Strategy**:
  ```
  Worker 1: user_profiles (rows 1-1000, 4001-5000, ...)
  Worker 2: user_profiles (rows 1001-2000, 5001-6000, ...)
  Worker 3: academic_terms (all rows)
  Worker 4: courses (all rows)
  ```
  
  **Error Handling**:
  - Retry failed batches up to 3 times
  - Log all errors with context
  - Continue processing other batches on failure
  - Manual intervention required for persistent failures

  ### Data Validation During Backfill
  ```sql
  -- Validation queries to run after each batch
  
  -- Check for NULL institution_id values
  SELECT COUNT(*) FROM user_profiles WHERE institution_id IS NULL;
  
  -- Verify foreign key integrity
  SELECT COUNT(*) FROM user_profiles u 
  LEFT JOIN institutions i ON u.institution_id = i.id 
  WHERE i.id IS NULL;
  
  -- Check data distribution
  SELECT institution_id, COUNT(*) 
  FROM user_profiles 
  GROUP BY institution_id;
  ```

  ## Rollback Strategy

  ### Immediate Rollback (< 5 minutes)
  **Scenario**: Critical error detected during migration
  
  **Actions**:
  1. Stop all migration processes
  2. Revert application to previous version
  3. Disable HPC feature flags
  4. Monitor error rates and performance
  
  **Commands**:
  ```bash
  # Stop migration workers
  pkill -f "hpc_migration_worker"
  
  # Revert application
  kubectl rollout undo deployment/bigday-api
  
  # Disable feature flags
  curl -X POST /api/feature-flags/hpc/disable
  ```

  ### Schema Rollback (< 30 minutes)
  **Scenario**: Schema changes need to be reverted
  
  **Actions**:
  1. Drop HPC tables (if no critical data)
  2. Remove institution_id columns from existing tables
  3. Restore from backup if data corruption detected
  4. Validate system functionality
  
  **Commands**:
  ```sql
  -- Drop HPC tables
  DROP TABLE IF EXISTS hpc_evaluations CASCADE;
  DROP TABLE IF EXISTS hpc_reports CASCADE;
  -- ... drop all HPC tables
  
  -- Remove added columns
  ALTER TABLE user_profiles DROP COLUMN IF EXISTS institution_id;
  ALTER TABLE academic_terms DROP COLUMN IF EXISTS institution_id;
  ```

  ### Full Restore (< 60 minutes)
  **Scenario**: Complete rollback to pre-migration state required
  
  **Actions**:
  1. Stop all application services
  2. Restore database from backup
  3. Verify data integrity
  4. Restart services and validate functionality
  
  **Estimated Downtime**: 45-60 minutes for full restore

  ## Migration Verification Steps

  ### Data Integrity Checks
  ```sql
  -- 1. Row count verification
  SELECT 
    'user_profiles' as table_name,
    COUNT(*) as row_count,
    COUNT(institution_id) as institution_id_count
  FROM user_profiles
  
  UNION ALL
  
  SELECT 
    'hpc_evaluations' as table_name,
    COUNT(*) as row_count,
    COUNT(institution_id) as institution_id_count
  FROM hpc_evaluations;
  
  -- 2. Foreign key integrity
  SELECT COUNT(*) as orphaned_records
  FROM user_profiles u
  LEFT JOIN institutions i ON u.institution_id = i.id
  WHERE u.institution_id IS NOT NULL AND i.id IS NULL;
  
  -- 3. Data distribution check
  SELECT 
    i.name as institution_name,
    COUNT(u.id) as user_count,
    COUNT(u.id) FILTER (WHERE u.role = 'student') as student_count,
    COUNT(u.id) FILTER (WHERE u.role = 'teacher') as teacher_count
  FROM institutions i
  LEFT JOIN user_profiles u ON i.id = u.institution_id
  GROUP BY i.id, i.name;
  ```

  ### Performance Validation
  ```sql
  -- Test query performance with new indexes
  EXPLAIN (ANALYZE, BUFFERS) 
  SELECT * FROM user_profiles 
  WHERE institution_id = 'inst-123' AND role = 'student';
  
  -- Verify materialized view performance
  EXPLAIN (ANALYZE, BUFFERS)
  SELECT * FROM mv_hpc_student_summary 
  WHERE institution_id = 'inst-123';
  ```

  ### RLS Policy Validation
  ```sql
  -- Test RLS policies with role impersonation
  SET ROLE 'student_user';
  SELECT COUNT(*) FROM hpc_evaluations; -- Should only see own evaluations
  
  SET ROLE 'teacher_user';  
  SELECT COUNT(*) FROM hpc_evaluations; -- Should see assigned students only
  
  SET ROLE 'admin_user';
  SELECT COUNT(*) FROM hpc_evaluations; -- Should see all in institution
  ```

  ## Risk Assessment & Mitigation

  ### High Risk Items
  1. **Large Table Modifications** (user_profiles, academic_terms)
     - **Mitigation**: Use small batches with rate limiting
     - **Monitoring**: Track lock wait times and query performance
  
  2. **Foreign Key Addition** (potential deadlocks)
     - **Mitigation**: Add constraints during low-traffic periods
     - **Monitoring**: Monitor for lock timeouts
  
  3. **Materialized View Creation** (resource intensive)
     - **Mitigation**: Create during maintenance window
     - **Monitoring**: Track CPU and memory usage

  ### Medium Risk Items
  1. **Index Creation** (table locks during creation)
     - **Mitigation**: Use CONCURRENTLY option
     - **Monitoring**: Track index build progress
  
  2. **RLS Policy Deployment** (access control changes)
     - **Mitigation**: Test thoroughly on staging first
     - **Monitoring**: Monitor for access denied errors

  ### Low Risk Items
  1. **New Table Creation** (no impact on existing data)
  2. **Demo Data Insertion** (isolated to new tables)
  3. **Function Creation** (no immediate impact)

  ## Estimated Timeline & Resource Impact

  ### Timeline Breakdown
  - **Step 1 (Preparation)**: 30 minutes
  - **Step 2 (Schema Extension)**: 45 minutes  
  - **Step 3 (Data Backfill)**: 60 minutes (varies by data size)
  - **Step 4 (Constraints)**: 30 minutes
  - **Step 5 (Optimization)**: 45 minutes
  - **Total Migration Time**: 3.5 hours
  - **Application Downtime**: 0 minutes (online migration)

  ### Resource Requirements
  - **CPU**: 2-4 cores for backfill workers
  - **Memory**: 8GB minimum for large batch operations
  - **Storage**: 20% additional space for indexes and materialized views
  - **Network**: Minimal impact (internal operations)

  ### Batch Size Calculations
  ```
  For 100,000 user_profiles:
  - Batch size: 1000 rows
  - Batches needed: 100
  - Time per batch: ~600ms (update + verification)
  - Sequential time: 100 * 0.6s = 60 minutes
  - With 4 workers: ~15 minutes
  - Safety buffer: 2x = 30 minutes
  ```

  ## Monitoring & Alerting

  ### Key Metrics to Track
  - **Migration Progress**: Percentage complete per table
  - **Error Rate**: Failed batches per minute
  - **Performance Impact**: Query latency during migration
  - **Resource Usage**: CPU, memory, disk I/O
  - **Lock Contention**: Wait times and deadlocks

  ### Alert Thresholds
  - **High Error Rate**: > 5% batch failures
  - **Performance Degradation**: > 2x normal query latency
  - **Resource Exhaustion**: > 90% CPU or memory usage
  - **Lock Timeouts**: > 10 lock wait events per minute

  ### Monitoring Queries
  ```sql
  -- Track migration progress
  SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
  FROM pg_stat_user_tables 
  WHERE tablename LIKE 'hpc_%' OR tablename IN ('user_profiles', 'academic_terms');
  
  -- Monitor lock waits
  SELECT 
    waiting.pid AS waiting_pid,
    waiting.query AS waiting_query,
    blocking.pid AS blocking_pid,
    blocking.query AS blocking_query
  FROM pg_stat_activity waiting
  JOIN pg_stat_activity blocking ON blocking.pid = ANY(pg_blocking_pids(waiting.pid))
  WHERE waiting.state = 'active';
  ```

  ## Success Criteria

  ### Functional Validation
  - [ ] All HPC tables created with proper constraints
  - [ ] Institution_id populated in all existing tables
  - [ ] Foreign key relationships established
  - [ ] RLS policies prevent cross-institution access
  - [ ] Materialized views refresh successfully

  ### Performance Validation  
  - [ ] Query performance within 10% of baseline
  - [ ] Index usage confirmed with EXPLAIN plans
  - [ ] Materialized view queries under 100ms
  - [ ] No long-running locks during migration

  ### Security Validation
  - [ ] RLS policies tested with role impersonation
  - [ ] Audit logs capture all HPC operations
  - [ ] Evidence files properly secured in private buckets
  - [ ] No unauthorized cross-institution data access

  This migration plan ensures a safe, monitored deployment of the HPC system with zero downtime and complete rollback capability.
*/