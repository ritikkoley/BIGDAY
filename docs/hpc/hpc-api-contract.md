# HPC API Contract Documentation

## Overview

This document defines the API contract for the Holistic Progress Card (HPC) system, specifying all endpoints, request/response formats, and integration patterns with the existing BIG DAY architecture.

## 🔗 Base Configuration

### Authentication
All HPC API calls require authentication via Supabase Auth:
```typescript
headers: {
  'Authorization': `Bearer ${supabaseSession.access_token}`,
  'Content-Type': 'application/json'
}
```

### Base URL Structure
```
/api/hpc/*           - REST API endpoints
/functions/v1/hpc/*  - Supabase Edge Functions
/realtime/*          - WebSocket subscriptions
```

## 📋 Parameters Management API

### GET /api/hpc/parameters
**Purpose**: Retrieve all HPC parameters for an institution

**Request**:
```typescript
interface GetParametersRequest {
  institution_id?: string;
  grade?: string;
  category?: 'scholastic' | 'co_scholastic' | 'life_skills' | 'discipline';
  active_only?: boolean;
}
```

**Response**:
```typescript
interface GetParametersResponse {
  success: boolean;
  data: HPCParameter[];
  total_count: number;
}

interface HPCParameter {
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
  created_at: string;
  updated_at: string;
}
```

**Security**: Admin role required for full access, teachers can view assigned parameters

### POST /api/hpc/parameters
**Purpose**: Create new HPC parameter

**Request**:
```typescript
interface CreateParameterRequest {
  name: string;
  category: 'scholastic' | 'co_scholastic' | 'life_skills' | 'discipline';
  sub_category: string;
  weightage: number;
  description: string;
  cbse_code: string;
  grade_applicability: string[];
  evaluation_frequency: 'continuous' | 'periodic' | 'annual';
}
```

**Response**:
```typescript
interface CreateParameterResponse {
  success: boolean;
  data: HPCParameter;
  message: string;
}
```

**Validation Rules**:
- `name`: Required, 3-100 characters
- `weightage`: 0.01-1.0 range
- `cbse_code`: Unique per institution
- `grade_applicability`: Valid grade values only

**Error Codes**:
- `400`: Validation error
- `401`: Unauthorized
- `409`: Duplicate CBSE code

## 📝 Evaluations API

### GET /api/hpc/evaluations
**Purpose**: Retrieve evaluations for a student or evaluator

**Request**:
```typescript
interface GetEvaluationsRequest {
  student_id?: string;
  evaluator_id?: string;
  term_id?: string;
  parameter_id?: string;
  status?: 'draft' | 'submitted' | 'reviewed' | 'approved';
  limit?: number;
  offset?: number;
}
```

**Response**:
```typescript
interface GetEvaluationsResponse {
  success: boolean;
  data: HPCEvaluation[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

interface HPCEvaluation {
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
  version: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  parameter?: HPCParameter;
  evaluator?: {
    full_name: string;
    role: string;
  };
  student?: {
    full_name: string;
    current_standard: string;
    section: string;
  };
}
```

### POST /api/hpc/evaluations
**Purpose**: Submit new evaluation

**Request**:
```typescript
interface SubmitEvaluationRequest {
  student_id: string;
  parameter_id: string;
  score: number;
  qualitative_remark: string;
  evidence_notes?: string;
  confidence_level: number;
  evaluation_date?: string;
  term_id: string;
  status?: 'draft' | 'submitted';
}
```

**Response**:
```typescript
interface SubmitEvaluationResponse {
  success: boolean;
  data: HPCEvaluation;
  validation_result: {
    is_valid: boolean;
    errors: string[];
    warnings: string[];
  };
}
```

**Validation Rules**:
- `score`: 1.0-5.0 range
- `qualitative_remark`: 10-500 characters
- `confidence_level`: 0.0-1.0 range
- `evaluator_role`: Must match user's actual role

### PUT /api/hpc/evaluations/:id
**Purpose**: Update existing evaluation

**Request**: Same as POST with optional fields
**Response**: Updated evaluation object
**Security**: Only original evaluator or admin can update

## 📊 Reports API

### GET /api/hpc/reports
**Purpose**: Retrieve HPC reports

**Request**:
```typescript
interface GetReportsRequest {
  student_id?: string;
  term_id?: string;
  status?: 'draft' | 'under_review' | 'approved' | 'published';
  compiled_by?: string;
  limit?: number;
}
```

**Response**:
```typescript
interface GetReportsResponse {
  success: boolean;
  data: HPCReport[];
  summary: {
    total_reports: number;
    by_status: Record<string, number>;
    latest_compilation: string;
  };
}

interface HPCReport {
  id: string;
  student_id: string;
  term_id: string;
  overall_grade: string;
  overall_score: number;
  summary_json: HPCReportSummary;
  status: 'draft' | 'under_review' | 'approved' | 'published';
  compiled_at: string;
  compiled_by: string;
  approved_at?: string;
  approved_by?: string;
  published_at?: string;
  version: number;
  created_at: string;
  updated_at: string;
}
```

### POST /functions/v1/hpc/compile-report
**Purpose**: Compile evaluations into HPC report

**Request**:
```typescript
interface CompileReportRequest {
  student_id: string;
  term_id: string;
  force_recompile?: boolean;
}
```

**Response**:
```typescript
interface CompileReportResponse {
  success: boolean;
  report_id: string;
  compilation_stats: {
    total_evaluations: number;
    parameters_covered: number;
    stakeholder_coverage: number;
    quality_score: number;
  };
  validation_results: Array<{
    parameter_id: string;
    is_complete: boolean;
    missing_roles: string[];
    warnings: string[];
  }>;
}
```

**Processing Logic**:
1. Collect all evaluations for student/term
2. Apply parameter weightages
3. Aggregate stakeholder feedback
4. Calculate overall scores
5. Generate summary JSON
6. Create draft report record

### POST /api/hpc/reports/:id/approve
**Purpose**: Approve report in workflow

**Request**:
```typescript
interface ApproveReportRequest {
  decision: 'approved' | 'rejected' | 'needs_revision';
  comments?: string;
  next_approver?: string;
}
```

**Response**:
```typescript
interface ApproveReportResponse {
  success: boolean;
  workflow_status: {
    current_step: number;
    next_approver: string;
    due_date: string;
    is_final_approval: boolean;
  };
  report_status: 'draft' | 'under_review' | 'approved' | 'published';
}
```

## 📄 Export API

### POST /functions/v1/hpc/export-pdf
**Purpose**: Generate PDF export of HPC report

**Request**:
```typescript
interface ExportPDFRequest {
  report_id: string;
  language: 'english' | 'hindi';
  include_charts: boolean;
  include_signatures: boolean;
  include_evidence: boolean;
  watermark?: string;
}
```

**Response**:
```typescript
interface ExportPDFResponse {
  success: boolean;
  pdf_url: string;
  filename: string;
  file_size: number;
  generated_at: string;
  expires_at: string;
}
```

**Processing**:
1. Fetch complete report data
2. Apply language templates
3. Generate charts as images
4. Compile HTML template
5. Convert to PDF
6. Upload to storage
7. Return signed URL

## 🔄 Real-Time Subscriptions

### Evaluation Updates
```typescript
// Subscribe to evaluation changes for a student
const subscription = supabase
  .channel('hpc-evaluations')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'hpc_evaluations',
    filter: `student_id=eq.${studentId}`
  }, (payload) => {
    // Handle evaluation update
    handleEvaluationUpdate(payload);
  })
  .subscribe();
```

### Report Status Changes
```typescript
// Subscribe to report workflow updates
const subscription = supabase
  .channel('hpc-reports')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'hpc_reports',
    filter: `id=eq.${reportId}`
  }, (payload) => {
    // Handle status change
    handleReportStatusUpdate(payload);
  })
  .subscribe();
```

### Approval Workflow
```typescript
// Subscribe to approval workflow changes
const subscription = supabase
  .channel('hpc-workflow')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'hpc_approval_workflows',
    filter: `report_id=eq.${reportId}`
  }, (payload) => {
    // Handle workflow update
    handleWorkflowUpdate(payload);
  })
  .subscribe();
```

## 📊 Analytics API

### GET /api/hpc/analytics/student/:id
**Purpose**: Get student performance analytics

**Response**:
```typescript
interface StudentAnalyticsResponse {
  success: boolean;
  data: {
    percentile_rankings: {
      class: number;
      grade: number;
      school: number;
    };
    growth_trajectory: {
      trend: 'improving' | 'declining' | 'stable';
      predicted_next_score: number;
      confidence_interval: {
        lower: number;
        upper: number;
      };
    };
    parameter_insights: Array<{
      parameter_name: string;
      current_score: number;
      trend: string;
      peer_comparison: number;
      recommendations: string[];
    }>;
    risk_indicators: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
}
```

### GET /api/hpc/analytics/class/:id
**Purpose**: Get class-level analytics for teachers

**Response**:
```typescript
interface ClassAnalyticsResponse {
  success: boolean;
  data: {
    class_summary: {
      total_students: number;
      reports_completed: number;
      average_score: number;
      grade_distribution: Record<string, number>;
    };
    parameter_analysis: Array<{
      parameter_name: string;
      class_average: number;
      score_distribution: number[];
      top_performers: string[];
      needs_attention: string[];
    }>;
    stakeholder_participation: {
      teacher_completion: number;
      parent_participation: number;
      peer_evaluation_rate: number;
      self_assessment_rate: number;
    };
  };
}
```

## 🔐 Security & Authorization

### Role-Based Access Control
```typescript
interface HPCPermissions {
  admin: {
    can_configure_parameters: true;
    can_view_all_reports: true;
    can_approve_reports: true;
    can_export_bulk_data: true;
  };
  teacher: {
    can_evaluate_assigned_students: true;
    can_view_class_reports: true;
    can_approve_class_reports: true;
    can_export_class_data: true;
  };
  student: {
    can_self_evaluate: true;
    can_view_own_reports: true;
    can_provide_peer_feedback: true;
  };
  parent: {
    can_evaluate_own_child: true;
    can_view_child_reports: true;
  };
}
```

### Data Privacy Rules
- **Student Data**: Only accessible to assigned teachers, parents, and admins
- **Evaluation Data**: Evaluators can only see their own submissions
- **Report Data**: Published reports visible to authorized stakeholders
- **Analytics Data**: Aggregated data only, no individual identification

## 🚨 Error Handling

### Standard Error Response
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}
```

### Common Error Codes
- `HPC_001`: Invalid parameter configuration
- `HPC_002`: Evaluation validation failed
- `HPC_003`: Insufficient permissions
- `HPC_004`: Report compilation failed
- `HPC_005`: Approval workflow error
- `HPC_006`: Export generation failed
- `HPC_007`: Real-time subscription error

## 📈 Rate Limiting

### API Limits
- **Evaluation Submission**: 100 requests/hour per user
- **Report Compilation**: 10 requests/hour per user
- **PDF Export**: 20 requests/hour per user
- **Analytics Queries**: 200 requests/hour per user

### WebSocket Limits
- **Max Connections**: 5 per user
- **Message Rate**: 100 messages/minute per connection
- **Channel Subscriptions**: 10 channels per connection

## 🔄 Batch Operations

### POST /functions/v1/hpc/bulk-compile
**Purpose**: Compile reports for multiple students

**Request**:
```typescript
interface BulkCompileRequest {
  student_ids: string[];
  term_id: string;
  compiled_by: string;
  notify_stakeholders?: boolean;
}
```

**Response**:
```typescript
interface BulkCompileResponse {
  success: boolean;
  results: Array<{
    student_id: string;
    report_id?: string;
    status: 'success' | 'failed' | 'partial';
    error?: string;
  }>;
  summary: {
    total_requested: number;
    successful: number;
    failed: number;
    processing_time_ms: number;
  };
}
```

### POST /functions/v1/hpc/bulk-export
**Purpose**: Export multiple reports as ZIP

**Request**:
```typescript
interface BulkExportRequest {
  report_ids: string[];
  format: 'pdf' | 'json' | 'csv';
  language: 'english' | 'hindi';
  include_analytics?: boolean;
}
```

**Response**:
```typescript
interface BulkExportResponse {
  success: boolean;
  download_url: string;
  filename: string;
  file_count: number;
  total_size: number;
  expires_at: string;
}
```

## 📱 Mobile API Considerations

### Optimized Endpoints
- **GET /api/hpc/mobile/dashboard**: Lightweight dashboard data
- **GET /api/hpc/mobile/evaluations/pending**: Pending evaluations only
- **POST /api/hpc/mobile/evaluations/quick**: Simplified evaluation submission

### Offline Support
- **Evaluation Drafts**: Store locally, sync when online
- **Report Caching**: Cache published reports for offline viewing
- **Conflict Resolution**: Handle offline/online data conflicts

## 🔍 Search & Filtering

### GET /api/hpc/search
**Purpose**: Search across HPC data

**Request**:
```typescript
interface HPCSearchRequest {
  query: string;
  filters: {
    entity_type?: 'students' | 'reports' | 'evaluations';
    grade?: string;
    section?: string;
    parameter?: string;
    date_range?: {
      start: string;
      end: string;
    };
  };
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
}
```

**Response**:
```typescript
interface HPCSearchResponse {
  success: boolean;
  results: Array<{
    type: 'student' | 'report' | 'evaluation';
    id: string;
    title: string;
    subtitle: string;
    metadata: any;
    relevance_score: number;
  }>;
  facets: {
    grades: Record<string, number>;
    parameters: Record<string, number>;
    status: Record<string, number>;
  };
}
```

## 🔔 Notification API

### POST /api/hpc/notifications/send
**Purpose**: Send HPC-related notifications

**Request**:
```typescript
interface SendNotificationRequest {
  recipient_ids: string[];
  type: 'evaluation_due' | 'report_ready' | 'approval_needed' | 'published';
  title: string;
  message: string;
  action_url?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
}
```

**Response**:
```typescript
interface SendNotificationResponse {
  success: boolean;
  notification_id: string;
  delivery_status: {
    total_recipients: number;
    successful_deliveries: number;
    failed_deliveries: number;
    pending_deliveries: number;
  };
}
```

## 📋 Rubrics API

### GET /api/hpc/rubrics
**Purpose**: Get rubrics for parameters

**Request**:
```typescript
interface GetRubricsRequest {
  parameter_id?: string;
  version?: number;
  active_only?: boolean;
  language?: 'english' | 'hindi';
}
```

**Response**:
```typescript
interface GetRubricsResponse {
  success: boolean;
  data: HPCRubric[];
  versions: Array<{
    version: number;
    created_at: string;
    is_active: boolean;
  }>;
}

interface HPCRubric {
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
  created_at: string;
}
```

### POST /api/hpc/rubrics/version
**Purpose**: Create new rubric version

**Request**:
```typescript
interface CreateRubricVersionRequest {
  parameter_id: string;
  rubrics: Array<{
    level: string;
    grade_equivalent: string;
    descriptor: string;
    detailed_description: string;
    examples: string[];
    indicators: string[];
  }>;
  version_notes?: string;
}
```

## 🎯 Integration Patterns

### Supabase Integration
```typescript
// Direct database queries for simple operations
const { data, error } = await supabase
  .from('hpc_evaluations')
  .select('*')
  .eq('student_id', studentId);

// Edge functions for complex operations
const { data, error } = await supabase.functions.invoke('hpc-compile-report', {
  body: { student_id: studentId, term_id: termId }
});

// Real-time subscriptions for live updates
const channel = supabase
  .channel('hpc-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'hpc_evaluations'
  }, handleUpdate)
  .subscribe();
```

### Error Boundary Integration
```typescript
// Wrap HPC components in error boundaries
<HPCErrorBoundary fallback={<HPCErrorFallback />}>
  <HPCEvaluationForm />
</HPCErrorBoundary>
```

### Loading State Management
```typescript
// Consistent loading patterns
interface HPCLoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
  error?: string;
}
```

This API contract provides a complete foundation for implementing the HPC frontend system with clear request/response patterns, comprehensive error handling, and seamless integration with the existing BIG DAY architecture.