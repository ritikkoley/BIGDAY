# HPC System Developer Guide

## Overview

The Holistic Progress Card (HPC) system is a comprehensive CBSE-mandated 360° student evaluation platform integrated into the BIG DAY educational management system. This guide provides everything a new developer needs to understand and work with the HPC system.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Edge          │
│   (React/TS)    │◄──►│   Database      │◄──►│   Functions     │
│   HPC Portal    │    │   HPC Tables    │    │   (Deno)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Row Level Security)
- **Real-time**: Supabase subscriptions
- **Export**: Edge Functions for PDF generation
- **Charts**: Recharts for performance visualization

## 📊 Database Schema Overview

### Core HPC Tables

#### 1. hpc_parameters
**Purpose**: Store CBSE evaluation parameters
```sql
CREATE TABLE hpc_parameters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text CHECK (category IN ('scholastic', 'co_scholastic', 'life_skills', 'discipline')),
  sub_category text NOT NULL,
  weightage decimal(3,2) CHECK (weightage > 0 AND weightage <= 1),
  description text,
  cbse_code text UNIQUE,
  grade_applicability text[] DEFAULT '{}',
  evaluation_frequency text CHECK (evaluation_frequency IN ('continuous', 'periodic', 'annual')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Sample Data**:
```json
{
  "name": "Mathematics",
  "category": "scholastic",
  "sub_category": "core_subject",
  "weightage": 0.20,
  "description": "Mathematical reasoning, problem-solving, and computational skills",
  "cbse_code": "MATH",
  "grade_applicability": ["5", "6", "7", "8", "9", "10"]
}
```

#### 2. hpc_evaluations
**Purpose**: Store individual evaluation inputs from all stakeholders
```sql
CREATE TABLE hpc_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  parameter_id uuid REFERENCES hpc_parameters(id) ON DELETE CASCADE,
  evaluator_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  evaluator_role text CHECK (evaluator_role IN ('teacher', 'parent', 'peer', 'self', 'counselor', 'coach')),
  score decimal(2,1) CHECK (score >= 1.0 AND score <= 5.0),
  grade text CHECK (grade IN ('A+', 'A', 'B', 'C', 'D')),
  qualitative_remark text NOT NULL,
  evidence_notes text,
  confidence_level decimal(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1),
  evaluation_date date DEFAULT CURRENT_DATE,
  term_id uuid REFERENCES academic_terms(id) ON DELETE CASCADE,
  cycle_id uuid REFERENCES hpc_evaluation_cycles(id),
  status text CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved')) DEFAULT 'draft',
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 3. hpc_reports
**Purpose**: Store compiled final reports per student per term
```sql
CREATE TABLE hpc_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  term_id uuid REFERENCES academic_terms(id) ON DELETE CASCADE,
  cycle_id uuid REFERENCES hpc_evaluation_cycles(id),
  overall_grade text CHECK (overall_grade IN ('A+', 'A', 'B', 'C', 'D')),
  overall_score decimal(3,2) CHECK (overall_score >= 1.0 AND overall_score <= 5.0),
  summary_json jsonb NOT NULL DEFAULT '{}',
  status text CHECK (status IN ('draft', 'under_review', 'approved', 'published')) DEFAULT 'draft',
  compiled_at timestamptz DEFAULT now(),
  compiled_by uuid REFERENCES user_profiles(id),
  approved_at timestamptz,
  approved_by uuid REFERENCES user_profiles(id),
  published_at timestamptz,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Supporting Tables

#### hpc_rubrics
**Purpose**: Store evaluation rubrics and descriptors
```sql
CREATE TABLE hpc_rubrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parameter_id uuid REFERENCES hpc_parameters(id) ON DELETE CASCADE,
  level text CHECK (level IN ('A+', 'A', 'B', 'C', 'D')),
  grade_equivalent text CHECK (grade_equivalent IN ('outstanding', 'excellent', 'good', 'satisfactory', 'needs_improvement')),
  descriptor text NOT NULL,
  detailed_description text,
  examples text[] DEFAULT '{}',
  indicators text[] DEFAULT '{}',
  version integer DEFAULT 1,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

#### hpc_analytics
**Purpose**: Store performance analytics and insights
```sql
CREATE TABLE hpc_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  parameter_id uuid REFERENCES hpc_parameters(id),
  term_id uuid REFERENCES academic_terms(id) ON DELETE CASCADE,
  report_id uuid REFERENCES hpc_reports(id),
  class_percentile decimal(5,2),
  grade_percentile decimal(5,2),
  school_percentile decimal(5,2),
  growth_trajectory text CHECK (growth_trajectory IN ('improving', 'declining', 'stable')),
  predicted_next_score decimal(3,2),
  confidence_interval jsonb,
  strengths_identified text[] DEFAULT '{}',
  improvement_areas text[] DEFAULT '{}',
  risk_indicators text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔄 Backend Processing Pipeline

### 1. Evaluation Collection & Pre-Processing

```typescript
// Step 1: Collect evaluations from all stakeholders
const { evaluations, parameters, rubrics } = await HPCProcessor.collectEvaluations(studentId, termId);

// Step 2: Validate each evaluation
evaluations.forEach(evaluation => {
  const validation = HPCProcessor.validateEvaluation(evaluation);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
});

// Step 3: Normalize scores to grades
const normalizedEvaluations = evaluations.map(evaluation => ({
  ...evaluation,
  grade: HPCProcessor.normalizeScore(evaluation.score).grade
}));
```

### 2. Aggregation Logic

```typescript
// Apply weightages from parameter assignments
const aggregateParameterEvaluations = (evaluations, parameter, assignments) => {
  let weightedSum = 0;
  let totalWeight = 0;
  
  // Group evaluations by evaluator role
  const evaluationsByRole = evaluations.reduce((acc, eval) => {
    if (!acc[eval.evaluator_role]) acc[eval.evaluator_role] = [];
    acc[eval.evaluator_role].push(eval);
    return acc;
  }, {});

  // Apply weightages from parameter assignments
  assignments.forEach(assignment => {
    const roleEvaluations = evaluationsByRole[assignment.evaluator_role] || [];
    
    if (roleEvaluations.length > 0) {
      // Average multiple evaluations from same role
      const roleAverage = roleEvaluations.reduce((sum, eval) => sum + eval.score, 0) / roleEvaluations.length;
      
      weightedSum += roleAverage * assignment.weightage;
      totalWeight += assignment.weightage;
    }
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};
```

### 3. Report Compilation

```typescript
// Generate comprehensive HPC report
const compileReport = async (studentId, termId, compiledBy) => {
  // Collect all data
  const { evaluations, parameters, rubrics } = await collectEvaluations(studentId, termId);
  
  // Process each parameter
  const parameterResults = {};
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const parameter of parameters) {
    const paramEvaluations = evaluations.filter(e => e.parameter_id === parameter.id);
    const paramAssignments = assignments?.filter(a => a.parameter_id === parameter.id) || [];
    
    if (paramEvaluations.length > 0) {
      const result = aggregateParameterEvaluations(paramEvaluations, parameter, paramAssignments);
      
      parameterResults[parameter.id] = {
        parameter_name: parameter.name,
        category: parameter.category,
        score: result.aggregatedScore,
        grade: result.aggregatedGrade,
        stakeholder_feedback: result.stakeholderBreakdown,
        evidence: result.evidenceCollection
      };

      totalWeightedScore += result.aggregatedScore * parameter.weightage;
      totalWeight += parameter.weightage;
    }
  }

  // Calculate overall performance
  const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  const overallGrade = normalizeScore(overallScore).grade;

  // Create report record
  const report = await supabase.from('hpc_reports').insert({
    student_id: studentId,
    term_id: termId,
    overall_grade: overallGrade,
    overall_score: overallScore,
    summary_json: compiledSummary,
    status: 'draft',
    compiled_by: compiledBy
  });

  return report;
};
```

## 🎨 Frontend Architecture

### Component Structure

```
src/components/hpc/
├── admin/                     # Admin configuration components
│   ├── HPCConfigurationPanel.tsx
│   ├── HPCParameterTable.tsx
│   ├── HPCRubricEditor.tsx
│   └── HPCReportsManagement.tsx
├── teacher/                   # Teacher evaluation components
│   ├── HPCTeacherDashboard.tsx
│   ├── HPCEvaluationForm.tsx
│   ├── HPCStudentSelector.tsx
│   └── HPCBulkEvaluationForm.tsx
├── student/                   # Student self-assessment components
│   ├── HPCStudentDashboard.tsx
│   ├── HPCSelfAssessmentForm.tsx
│   ├── HPCReflectionForm.tsx
│   └── HPCGoalSetter.tsx
└── shared/                    # Shared HPC components
    ├── forms/
    │   ├── HPCStarRating.tsx
    │   ├── HPCParameterCard.tsx
    │   └── HPCEvidenceUploader.tsx
    ├── display/
    │   ├── HPCRadarChart.tsx
    │   ├── HPCProgressTracker.tsx
    │   └── HPCReportPreview.tsx
    └── workflow/
        ├── HPCApprovalWorkflow.tsx
        └── HPCReviewPanel.tsx
```

### Key Components

#### HPCStarRating
**Purpose**: Accessible star rating for evaluations
```typescript
interface HPCStarRatingProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  showGrade?: boolean;
  ariaLabel?: string;
}
```

#### HPCParameterCard
**Purpose**: Individual parameter evaluation form
```typescript
interface HPCParameterCardProps {
  parameter: HPCParameter;
  evaluation?: HPCEvaluation;
  rubric?: HPCRubric[];
  onSave: (evaluation: Partial<HPCEvaluation>) => Promise<void>;
  readonly?: boolean;
  showEvidence?: boolean;
  validationErrors?: string[];
}
```

#### HPCReportPreview
**Purpose**: Preview compiled HPC report
```typescript
interface HPCReportPreviewProps {
  report: HPCReport;
  mode: 'preview' | 'print' | 'export';
  language?: 'english' | 'hindi';
  includeCharts?: boolean;
  onExport?: (format: 'pdf' | 'json') => Promise<void>;
}
```

## 🔌 API Integration

### Core API Functions

#### Evaluation Management
```typescript
// Submit evaluation
const submitEvaluation = async (evaluation: Partial<HPCEvaluation>) => {
  const { data, error } = await supabase
    .from('hpc_evaluations')
    .insert({
      ...evaluation,
      status: 'submitted'
    });
  
  if (error) throw error;
  return data;
};

// Get evaluations for student
const getEvaluationsByStudent = async (studentId: string, termId: string) => {
  const { data, error } = await supabase
    .from('hpc_evaluations')
    .select(`
      *,
      parameter:hpc_parameters(*),
      evaluator:user_profiles(full_name, role)
    `)
    .eq('student_id', studentId)
    .eq('term_id', termId);
  
  return data || [];
};
```

#### Report Compilation
```typescript
// Compile report from evaluations
const compileReport = async (studentId: string, termId: string, compiledBy: string) => {
  const { data, error } = await supabase.functions.invoke('hpc-compile-report', {
    body: { student_id: studentId, term_id: termId, compiled_by: compiledBy }
  });
  
  return data;
};

// Approve report in workflow
const approveReport = async (reportId: string, decision: string, comments?: string) => {
  const { data, error } = await supabase.functions.invoke('hpc-approve-report', {
    body: { report_id: reportId, decision, comments }
  });
  
  return data;
};
```

### Real-time Subscriptions

```typescript
// Subscribe to evaluation updates
const subscribeToEvaluations = (studentId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('hpc-evaluations')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'hpc_evaluations',
      filter: `student_id=eq.${studentId}`
    }, callback)
    .subscribe();
};

// Subscribe to report status changes
const subscribeToReports = (reportId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('hpc-reports')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'hpc_reports',
      filter: `id=eq.${reportId}`
    }, callback)
    .subscribe();
};
```

## 🎯 User Flows

### Teacher Evaluation Flow
```
1. Teacher Login → Navigate to HPC tab
2. Select student from class list
3. View parameter list with completion status
4. For each parameter:
   - Rate performance (1-5 stars)
   - Add qualitative remark (min 10 chars)
   - Upload evidence (optional)
   - Set confidence level
   - Save draft or submit
5. Review all evaluations
6. Submit for approval
```

### Student Self-Assessment Flow
```
1. Student Login → Navigate to "My Progress Card"
2. Select mood emoji (gamified entry point)
3. Fill self-evaluation for assigned parameters
4. Write reflection on strengths and improvements
5. Set goals for next term
6. Preview assessment
7. Submit for inclusion in report
```

### Report Approval Flow
```
1. Draft Report Generated → Notify Class Teacher
2. Class Teacher Review:
   - View raw evaluations vs compiled summary
   - Add reviewer comments
   - Approve/Reject/Request Revision
3. Principal Review (if approved):
   - Final review and approval
   - Publish report
4. Published Report → Notify all stakeholders
```

## 🎨 Frontend Implementation

### Portal Integration

The HPC system integrates into existing portals:

#### Admin Portal
```typescript
// Added HPC tab to admin navigation
const adminTabs = [
  // ... existing tabs
  { key: 'hpc', label: 'HPC System', component: HPCManagement }
];
```

#### Teacher Portal
```typescript
// Added HPC tab to teacher navigation
const teacherTabs = [
  // ... existing tabs
  { key: 'hpc', label: 'HPC Evaluations', component: HPCEvaluations }
];
```

#### Student Portal
```typescript
// Added HPC tab to student navigation
const studentTabs = [
  // ... existing tabs
  { key: 'hpc', label: 'My Progress Card', component: HPCSelfAssessment }
];
```

### State Management

```typescript
// HPC-specific Zustand store
interface HPCState {
  // Data
  parameters: HPCParameter[];
  evaluations: HPCEvaluation[];
  reports: HPCReport[];
  currentStudent: Student | null;
  
  // Actions
  submitEvaluation: (evaluation: HPCEvaluation) => Promise<void>;
  compileReport: (studentId: string, termId: string) => Promise<void>;
  approveReport: (reportId: string, decision: string) => Promise<void>;
  exportReport: (reportId: string, options: ExportOptions) => Promise<void>;
}
```

### Component Examples

#### HPCEvaluationForm
```typescript
const HPCEvaluationForm: React.FC<{
  parameter: HPCParameter;
  student: Student;
  onSave: (evaluation: Partial<HPCEvaluation>) => Promise<void>;
}> = ({ parameter, student, onSave }) => {
  const [score, setScore] = useState(0);
  const [remark, setRemark] = useState('');
  const [confidence, setConfidence] = useState(0.8);

  return (
    <div className="hpc-parameter-card">
      <h3>{parameter.name}</h3>
      <p>{parameter.description}</p>
      
      <HPCStarRating
        value={score}
        onChange={setScore}
        showGrade
        ariaLabel={`Rate ${parameter.name} performance`}
      />
      
      <textarea
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        placeholder="Provide specific observations..."
        maxLength={500}
      />
      
      <HPCConfidenceSlider
        value={confidence}
        onChange={setConfidence}
      />
      
      <button onClick={() => onSave({ score, qualitative_remark: remark, confidence_level: confidence })}>
        Save Evaluation
      </button>
    </div>
  );
};
```

## 📱 User Interface Specifications

### Admin HPC Configuration
**Route**: `/admin/hpc/config`
**Features**:
- Parameter management table
- Rubric editor with versioning
- Role weightage configuration
- System analytics dashboard

### Teacher Evaluation Input
**Route**: `/teacher/hpc/input/:studentId`
**Features**:
- Student context header
- Parameter navigation sidebar
- Evaluation form with validation
- Evidence upload capability
- Progress tracking

### Student Self-Assessment
**Route**: `/student/hpc/self`
**Features**:
- Gamified mood selector
- Age-appropriate parameter evaluation
- Reflection and goal setting
- Preview before submission

### Report Viewer
**Route**: `/reports/hpc/:studentId/:reportId`
**Features**:
- Comprehensive report display
- Performance charts and visualizations
- Multi-language export options
- Print-optimized layouts

## 🔐 Security & Permissions

### Row Level Security Policies

```sql
-- Students can only access their own HPC data
CREATE POLICY "Students can view own HPC data"
  ON hpc_evaluations FOR SELECT TO authenticated
  USING (student_id = auth.uid());

-- Teachers can evaluate assigned students
CREATE POLICY "Teachers can evaluate assigned students"
  ON hpc_evaluations FOR ALL TO authenticated
  USING (
    evaluator_id = auth.uid() AND 
    evaluator_role = 'teacher' AND
    EXISTS (
      SELECT 1 FROM section_courses sc
      JOIN section_students ss ON sc.section_id = ss.section_id
      WHERE sc.teacher_id = auth.uid() AND ss.student_id = hpc_evaluations.student_id
    )
  );

-- Parents can evaluate their own children
CREATE POLICY "Parents can evaluate own children"
  ON hpc_evaluations FOR ALL TO authenticated
  USING (
    evaluator_role = 'parent' AND
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.parent_of @> ARRAY[hpc_evaluations.student_id]
    )
  );

-- Admins can manage all HPC data
CREATE POLICY "Admins can manage all HPC data"
  ON hpc_evaluations FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );
```

## 📊 Data Flow Examples

### Complete Evaluation to Report Flow

```typescript
// 1. Teacher submits evaluation
await hpcApi.submitEvaluation({
  student_id: 'student-001',
  parameter_id: 'hpc-param-001', // Mathematics
  evaluator_role: 'teacher',
  score: 4.2,
  qualitative_remark: 'Excellent mathematical reasoning and problem-solving ability',
  confidence_level: 0.95,
  term_id: 'term-2025-1'
});

// 2. Parent provides feedback
await hpcApi.submitEvaluation({
  student_id: 'student-001',
  parameter_id: 'hpc-param-001',
  evaluator_role: 'parent',
  score: 4.0,
  qualitative_remark: 'Shows strong interest in mathematics at home',
  confidence_level: 0.85,
  term_id: 'term-2025-1'
});

// 3. Student self-assessment
await hpcApi.submitEvaluation({
  student_id: 'student-001',
  parameter_id: 'hpc-param-001',
  evaluator_role: 'self',
  score: 3.8,
  qualitative_remark: 'I like mathematics because it\'s like solving puzzles',
  confidence_level: 0.75,
  term_id: 'term-2025-1'
});

// 4. Compile report (aggregates all evaluations)
const report = await hpcApi.compileReport('student-001', 'term-2025-1', 'teacher-001');

// 5. Approval workflow
await hpcApi.approveReport(report.id, 'approved', 'Report is comprehensive and accurate');

// 6. Export to PDF
const pdfUrl = await hpcApi.exportToPDF(report.id, 'english');
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Component testing
describe('HPCStarRating', () => {
  test('renders correct number of stars', () => {
    render(<HPCStarRating value={3} max={5} />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  test('calls onChange when star clicked', () => {
    const onChange = jest.fn();
    render(<HPCStarRating value={3} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button')[3]);
    expect(onChange).toHaveBeenCalledWith(4);
  });
});
```

### Integration Tests
```typescript
// Workflow testing
describe('HPC Evaluation Workflow', () => {
  test('teacher can submit evaluation', async () => {
    render(<HPCEvaluationForm parameter={mockParameter} onSave={mockSave} />);
    
    // Fill form
    fireEvent.click(screen.getAllByRole('radio')[3]); // 4 stars
    fireEvent.change(screen.getByLabelText(/remark/), { 
      target: { value: 'Excellent work' } 
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/ }));
    
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith({
        score: 4,
        qualitative_remark: 'Excellent work',
        status: 'submitted'
      });
    });
  });
});
```

## 🎨 Design System

### Color Palette
```css
/* HPC-specific colors */
:root {
  --hpc-primary: #2563EB;        /* Blue - main actions */
  --hpc-grade-a-plus: #059669;   /* Green - A+ grade */
  --hpc-grade-a: #0891B2;        /* Cyan - A grade */
  --hpc-grade-b: #7C3AED;        /* Purple - B grade */
  --hpc-grade-c: #D97706;        /* Orange - C grade */
  --hpc-grade-d: #DC2626;        /* Red - D grade */
}
```

### Component Styles
```css
.hpc-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #E5E7EB;
}

.hpc-star-rating {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.hpc-parameter-card {
  border-left: 4px solid var(--hpc-primary);
  transition: all 0.2s ease;
}
```

## 📋 Development Workflow

### Getting Started
1. **Database Setup**: Apply HPC migration (`supabase/migrations/20250131120000_create_hpc_system.sql`)
2. **Demo Data**: Insert demo data (`supabase/migrations/insert_hpc_demo_data.sql`)
3. **Frontend**: Navigate to HPC tabs in Admin/Teacher/Student portals
4. **Testing**: Use demo accounts to test evaluation workflows

### Key Files to Understand
- `src/services/hpcApi.ts` - Main API service layer
- `src/types/hpc.ts` - TypeScript type definitions
- `src/components/admin/HPCManagement.tsx` - Admin interface
- `src/components/teacher/HPCEvaluations.tsx` - Teacher interface
- `src/components/student/HPCSelfAssessment.tsx` - Student interface

### Development Commands
```bash
# Start development server
npm run dev

# Run HPC-specific tests
npm run test -- --testPathPattern=hpc

# Type checking
npm run type-check

# Build for production
npm run build
```

## 🔍 Debugging & Troubleshooting

### Common Issues
1. **Missing HPC Tables**: Ensure migration is applied
2. **Permission Errors**: Check RLS policies and user roles
3. **Real-time Issues**: Verify Supabase subscription setup
4. **Export Failures**: Check Edge Function deployment

### Debug Tools
```typescript
// Enable HPC debug logging
localStorage.setItem('hpc-debug', 'true');

// Check evaluation validation
const validation = HPCProcessor.validateEvaluation(evaluation);
console.log('Validation result:', validation);

// Monitor real-time subscriptions
supabase.channel('debug').subscribe((status) => {
  console.log('Subscription status:', status);
});
```

## 📈 Performance Considerations

### Optimization Strategies
- **Lazy loading** for large student lists
- **Debounced auto-save** for draft evaluations
- **Memoized calculations** for report aggregation
- **Efficient queries** with proper indexing

### Monitoring
- **Evaluation submission times** (target: <1 second)
- **Report compilation times** (target: <5 seconds)
- **PDF generation times** (target: <10 seconds)
- **Real-time update latency** (target: <500ms)

## 🚀 Deployment & Production

### Environment Variables
```bash
# HPC-specific configuration
VITE_HPC_ENABLED=true
VITE_HPC_PDF_SERVICE_URL=https://your-pdf-service.com
VITE_HPC_ANALYTICS_ENABLED=true
```

### Production Checklist
- [ ] HPC database migration applied
- [ ] Demo data inserted (for testing)
- [ ] Edge Functions deployed
- [ ] RLS policies tested
- [ ] Export functionality verified
- [ ] Real-time subscriptions working
- [ ] Accessibility compliance verified
- [ ] Performance benchmarks met

This comprehensive guide provides everything a new developer needs to understand, work with, and extend the HPC system within the BIG DAY platform.