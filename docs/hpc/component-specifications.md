# HPC Component Specifications

## Overview

This document provides detailed specifications for all React components in the HPC system, including props, data expectations, behaviors, and usage examples.

## 🏗️ Component Architecture

### Component Categories
- **Input Components**: Forms, ratings, uploads
- **Display Components**: Charts, tables, previews
- **Layout Components**: Headers, navigation, containers
- **Administrative Components**: Configuration, management
- **Workflow Components**: Approval, review, status

## 📝 Input Components

### HPCStarRating
**Purpose**: Accessible star rating input for evaluations

```typescript
interface HPCStarRatingProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  showGrade?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}
```

**Usage Example**:
```json
{
  "value": 4.2,
  "max": 5,
  "size": "md",
  "readonly": false,
  "onChange": "handleRatingChange",
  "showValue": true,
  "showGrade": true,
  "ariaLabel": "Rate mathematics performance"
}
```

**Behaviors**:
- Keyboard navigation with arrow keys
- Click/tap to set rating
- Hover preview for rating values
- Automatic grade calculation (A+, A, B, C, D)
- Visual feedback for confidence levels

### HPCParameterCard
**Purpose**: Individual parameter evaluation form

```typescript
interface HPCParameterCardProps {
  parameter: HPCParameter;
  evaluation?: HPCEvaluation;
  rubric?: HPCRubric[];
  onSave: (evaluation: Partial<HPCEvaluation>) => Promise<void>;
  onSubmit?: (evaluation: HPCEvaluation) => Promise<void>;
  readonly?: boolean;
  showEvidence?: boolean;
  showRubric?: boolean;
  validationErrors?: string[];
}
```

**Usage Example**:
```json
{
  "parameter": {
    "id": "hpc-param-001",
    "name": "Mathematics",
    "category": "scholastic",
    "description": "Mathematical reasoning and problem-solving",
    "weightage": 0.20
  },
  "evaluation": {
    "score": 4.2,
    "grade": "A",
    "qualitative_remark": "Shows excellent problem-solving skills",
    "confidence_level": 0.95
  },
  "readonly": false,
  "showEvidence": true,
  "showRubric": true
}
```

### HPCEvidenceUploader
**Purpose**: File upload component for evaluation evidence

```typescript
interface HPCEvidenceUploaderProps {
  existingFiles: Array<{
    id: string;
    filename: string;
    url: string;
    type: string;
    size: number;
  }>;
  onUpload: (files: File[]) => Promise<string[]>;
  onDelete: (fileId: string) => Promise<void>;
  acceptTypes: string[];
  maxFiles?: number;
  maxSize?: number;
  showPreview?: boolean;
}
```

**Usage Example**:
```json
{
  "existingFiles": [
    {
      "id": "file-001",
      "filename": "math_worksheet.pdf",
      "url": "/storage/evidence/math_worksheet.pdf",
      "type": "application/pdf",
      "size": 245760
    }
  ],
  "acceptTypes": ["image/*", "application/pdf", ".doc", ".docx"],
  "maxFiles": 5,
  "maxSize": 10485760,
  "showPreview": true
}
```

### HPCReflectionForm
**Purpose**: Student self-reflection and goal setting

```typescript
interface HPCReflectionFormProps {
  studentId: string;
  termId: string;
  existingReflection?: HPCReflection;
  prompts: Array<{
    id: string;
    question: string;
    type: 'text' | 'goals' | 'emoji';
    required: boolean;
  }>;
  onSave: (reflection: Partial<HPCReflection>) => Promise<void>;
  maxLength?: number;
}
```

**Usage Example**:
```json
{
  "studentId": "hpc-student-001",
  "termId": "term-2025-1",
  "prompts": [
    {
      "id": "mood",
      "question": "How do you feel about your learning this term?",
      "type": "emoji",
      "required": true
    },
    {
      "id": "strengths",
      "question": "What are you most proud of this term?",
      "type": "text",
      "required": true
    },
    {
      "id": "goals",
      "question": "What do you want to improve next term?",
      "type": "goals",
      "required": false
    }
  ],
  "maxLength": 300
}
```

## 📊 Display Components

### HPCRadarChart
**Purpose**: Visual representation of multi-parameter performance

```typescript
interface HPCRadarChartProps {
  data: Array<{
    parameter: string;
    score: number;
    maxScore: number;
    grade: string;
  }>;
  size?: number;
  colors?: {
    fill: string;
    stroke: string;
    grid: string;
  };
  showLabels?: boolean;
  showValues?: boolean;
  interactive?: boolean;
}
```

**Usage Example**:
```json
{
  "data": [
    {
      "parameter": "Mathematics",
      "score": 4.2,
      "maxScore": 5.0,
      "grade": "A"
    },
    {
      "parameter": "Creativity",
      "score": 4.5,
      "maxScore": 5.0,
      "grade": "A+"
    },
    {
      "parameter": "Teamwork",
      "score": 4.0,
      "maxScore": 5.0,
      "grade": "A"
    }
  ],
  "size": 300,
  "showLabels": true,
  "showValues": true,
  "interactive": false
}
```

### HPCReportPreview
**Purpose**: Preview compiled HPC report before publication

```typescript
interface HPCReportPreviewProps {
  report: HPCReport;
  mode: 'preview' | 'print' | 'export';
  language?: 'english' | 'hindi';
  includeCharts?: boolean;
  includeSignatures?: boolean;
  onExport?: (format: 'pdf' | 'json') => Promise<void>;
}
```

**Usage Example**:
```json
{
  "report": {
    "id": "report-001",
    "student_id": "hpc-student-001",
    "overall_grade": "A",
    "overall_score": 4.15,
    "summary_json": {
      "student_info": {
        "name": "Aarav Sharma",
        "grade": "5",
        "section": "A"
      },
      "parameter_breakdown": {},
      "stakeholder_summary": {},
      "achievements": [],
      "recommendations": []
    }
  },
  "mode": "preview",
  "language": "english",
  "includeCharts": true,
  "includeSignatures": false
}
```

### HPCProgressTracker
**Purpose**: Visual progress indicator for evaluation completion

```typescript
interface HPCProgressTrackerProps {
  totalParameters: number;
  completedParameters: number;
  requiredParameters: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circular' | 'linear' | 'stepped';
}
```

**Usage Example**:
```json
{
  "totalParameters": 6,
  "completedParameters": 4,
  "requiredParameters": 5,
  "showDetails": true,
  "size": "md",
  "variant": "circular"
}
```

## 🏛️ Administrative Components

### HPCParameterTable
**Purpose**: Administrative table for parameter management

```typescript
interface HPCParameterTableProps {
  parameters: HPCParameter[];
  onEdit: (parameter: HPCParameter) => void;
  onDelete: (parameterId: string) => void;
  onToggleActive: (parameterId: string, active: boolean) => void;
  onDuplicate?: (parameter: HPCParameter) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filterBy?: {
    category?: string;
    active?: boolean;
    grade?: string;
  };
  showActions?: boolean;
}
```

**Usage Example**:
```json
{
  "parameters": [
    {
      "id": "hpc-param-001",
      "name": "Mathematics",
      "category": "scholastic",
      "weightage": 0.20,
      "active": true,
      "grade_applicability": ["5", "6", "7", "8"]
    }
  ],
  "sortBy": "name",
  "sortOrder": "asc",
  "filterBy": {
    "category": "scholastic",
    "active": true
  },
  "showActions": true
}
```

### HPCRubricEditor
**Purpose**: Rich editor for rubric descriptors

```typescript
interface HPCRubricEditorProps {
  parameterId: string;
  rubrics: HPCRubric[];
  onSave: (rubrics: HPCRubric[]) => Promise<void>;
  version: number;
  language?: 'english' | 'hindi';
  showPreview?: boolean;
  allowVersioning?: boolean;
}
```

**Usage Example**:
```json
{
  "parameterId": "hpc-param-001",
  "rubrics": [
    {
      "level": "A+",
      "descriptor": "Exceptional mathematical understanding",
      "detailed_description": "Demonstrates exceptional mathematical reasoning...",
      "examples": ["Solves complex problems", "Helps peers"],
      "indicators": ["95-100% accuracy", "Creative solutions"]
    }
  ],
  "version": 2,
  "language": "english",
  "showPreview": true,
  "allowVersioning": true
}
```

### HPCConfigurationPanel
**Purpose**: System configuration dashboard

```typescript
interface HPCConfigurationPanelProps {
  institution: {
    id: string;
    name: string;
    settings: any;
  };
  statistics: {
    total_parameters: number;
    active_parameters: number;
    total_rubrics: number;
    last_updated: string;
  };
  onExportConfig: () => Promise<void>;
  onImportConfig: (file: File) => Promise<void>;
  onResetDefaults: () => Promise<void>;
}
```

## 🔄 Workflow Components

### HPCApprovalWorkflow
**Purpose**: Visual workflow status and actions

```typescript
interface HPCApprovalWorkflowProps {
  workflow: Array<{
    step_number: number;
    approver_role: string;
    approver_name?: string;
    status: 'waiting' | 'pending' | 'approved' | 'rejected';
    due_date: string;
    completed_at?: string;
    comments?: string;
  }>;
  currentUserRole: string;
  onApprove?: (stepId: string, comments?: string) => Promise<void>;
  onReject?: (stepId: string, comments: string) => Promise<void>;
  onRequestRevision?: (stepId: string, comments: string) => Promise<void>;
}
```

**Usage Example**:
```json
{
  "workflow": [
    {
      "step_number": 1,
      "approver_role": "class_teacher",
      "approver_name": "Dr. Meera Joshi",
      "status": "approved",
      "due_date": "2025-01-25T17:00:00Z",
      "completed_at": "2025-01-24T14:30:00Z",
      "comments": "Report looks comprehensive and accurate"
    },
    {
      "step_number": 2,
      "approver_role": "principal",
      "approver_name": "Dr. Rajesh Gupta",
      "status": "pending",
      "due_date": "2025-01-30T17:00:00Z"
    }
  ],
  "currentUserRole": "admin"
}
```

### HPCReviewPanel
**Purpose**: Side-by-side review interface

```typescript
interface HPCReviewPanelProps {
  draftReport: HPCReport;
  rawEvaluations: HPCEvaluation[];
  reviewerActions: {
    canApprove: boolean;
    canReject: boolean;
    canRequestRevision: boolean;
    canEdit: boolean;
  };
  onAction: (action: string, data?: any) => Promise<void>;
  showComments?: boolean;
  showHistory?: boolean;
}
```

## 📱 Layout Components

### HPCStudentHeader
**Purpose**: Student identification and quick stats

```typescript
interface HPCStudentHeaderProps {
  student: {
    id: string;
    full_name: string;
    admission_number: string;
    current_standard: string;
    section: string;
    photo_url?: string;
  };
  stats?: {
    evaluations_completed: number;
    total_evaluations: number;
    last_updated: string;
    overall_grade?: string;
  };
  actions?: Array<{
    label: string;
    icon: string;
    onClick: () => void;
  }>;
  showProgress?: boolean;
}
```

**Usage Example**:
```json
{
  "student": {
    "id": "hpc-student-001",
    "full_name": "Aarav Sharma",
    "admission_number": "DPS2024001",
    "current_standard": "5",
    "section": "A",
    "photo_url": "/photos/students/aarav_sharma.jpg"
  },
  "stats": {
    "evaluations_completed": 4,
    "total_evaluations": 6,
    "last_updated": "2025-01-24T14:30:00Z",
    "overall_grade": "A"
  },
  "showProgress": true
}
```

### HPCParameterNavigation
**Purpose**: Left sidebar navigation for parameters

```typescript
interface HPCParameterNavigationProps {
  parameters: Array<{
    id: string;
    name: string;
    category: string;
    completed: boolean;
    required: boolean;
    score?: number;
    grade?: string;
  }>;
  activeParameter?: string;
  onParameterSelect: (parameterId: string) => void;
  groupByCategory?: boolean;
  showProgress?: boolean;
}
```

**Usage Example**:
```json
{
  "parameters": [
    {
      "id": "hpc-param-001",
      "name": "Mathematics",
      "category": "scholastic",
      "completed": true,
      "required": true,
      "score": 4.2,
      "grade": "A"
    },
    {
      "id": "hpc-param-002",
      "name": "Creativity",
      "category": "co_scholastic",
      "completed": false,
      "required": true
    }
  ],
  "activeParameter": "hpc-param-001",
  "groupByCategory": true,
  "showProgress": true
}
```

## 📊 Chart Components

### HPCPerformanceChart
**Purpose**: Multi-dimensional performance visualization

```typescript
interface HPCPerformanceChartProps {
  data: Array<{
    parameter: string;
    current_score: number;
    previous_score?: number;
    class_average?: number;
    grade_average?: number;
  }>;
  chartType: 'radar' | 'bar' | 'line' | 'comparison';
  showComparison?: boolean;
  showTrends?: boolean;
  interactive?: boolean;
  exportable?: boolean;
}
```

### HPCGrowthTrajectory
**Purpose**: Historical performance tracking

```typescript
interface HPCGrowthTrajectoryProps {
  studentId: string;
  data: Array<{
    term: string;
    overall_score: number;
    parameter_scores: Record<string, number>;
    date: string;
  }>;
  predictions?: {
    next_term_score: number;
    confidence_interval: {
      lower: number;
      upper: number;
    };
  };
  showPredictions?: boolean;
}
```

## 🎛️ Form Components

### HPCEvaluationForm
**Purpose**: Main evaluation input form

```typescript
interface HPCEvaluationFormProps {
  studentId: string;
  parameterId: string;
  evaluatorRole: 'teacher' | 'parent' | 'peer' | 'self';
  existingEvaluation?: HPCEvaluation;
  parameter: HPCParameter;
  rubrics: HPCRubric[];
  onSave: (evaluation: Partial<HPCEvaluation>) => Promise<void>;
  onSubmit: (evaluation: HPCEvaluation) => Promise<void>;
  autoSave?: boolean;
  showValidation?: boolean;
}
```

### HPCBulkEvaluationForm
**Purpose**: Batch evaluation input for multiple students

```typescript
interface HPCBulkEvaluationFormProps {
  students: Array<{
    id: string;
    name: string;
    admission_number: string;
  }>;
  parameter: HPCParameter;
  onSaveBatch: (evaluations: Array<{
    student_id: string;
    score: number;
    remark: string;
  }>) => Promise<void>;
  template?: {
    score: number;
    remark: string;
  };
  showProgress?: boolean;
}
```

## 🔍 Search & Filter Components

### HPCSearchBar
**Purpose**: Global search across HPC data

```typescript
interface HPCSearchBarProps {
  placeholder?: string;
  filters: Array<{
    key: string;
    label: string;
    type: 'select' | 'date' | 'range';
    options?: Array<{ value: string; label: string }>;
  }>;
  onSearch: (query: string, filters: Record<string, any>) => void;
  onClear: () => void;
  showFilters?: boolean;
  recentSearches?: string[];
}
```

### HPCFilterPanel
**Purpose**: Advanced filtering interface

```typescript
interface HPCFilterPanelProps {
  availableFilters: Array<{
    key: string;
    label: string;
    type: 'select' | 'multiselect' | 'date' | 'range';
    options?: Array<{ value: string; label: string; count?: number }>;
  }>;
  activeFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
  showCounts?: boolean;
}
```

## 📋 Table Components

### HPCEvaluationTable
**Purpose**: Tabular view of evaluations

```typescript
interface HPCEvaluationTableProps {
  evaluations: HPCEvaluation[];
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    render?: (value: any, row: HPCEvaluation) => React.ReactNode;
  }>;
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (evaluation: HPCEvaluation) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  showPagination?: boolean;
}
```

### HPCReportsTable
**Purpose**: Administrative reports management table

```typescript
interface HPCReportsTableProps {
  reports: HPCReport[];
  onView: (reportId: string) => void;
  onEdit?: (reportId: string) => void;
  onDelete?: (reportId: string) => void;
  onExport?: (reportId: string, format: string) => void;
  onBulkAction?: (action: string, reportIds: string[]) => void;
  showBulkActions?: boolean;
  showFilters?: boolean;
}
```

## 🔔 Notification Components

### HPCNotificationBell
**Purpose**: Real-time notification indicator

```typescript
interface HPCNotificationBellProps {
  notifications: Array<{
    id: string;
    type: 'evaluation_due' | 'report_ready' | 'approval_needed';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    action_url?: string;
  }>;
  onMarkRead: (notificationId: string) => void;
  onMarkAllRead: () => void;
  onNotificationClick: (notification: any) => void;
  maxVisible?: number;
}
```

### HPCToastNotification
**Purpose**: Temporary notification messages

```typescript
interface HPCToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss: () => void;
  position?: 'top-right' | 'top-center' | 'bottom-right';
}
```

## 🎨 Styling Components

### HPCCard
**Purpose**: Consistent card container

```typescript
interface HPCCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
  loading?: boolean;
}
```

### HPCBadge
**Purpose**: Status and grade indicators

```typescript
interface HPCBadgeProps {
  children: React.ReactNode;
  variant: 'grade' | 'status' | 'category' | 'priority';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}
```

## 🔧 Utility Components

### HPCLoadingSpinner
**Purpose**: Loading state indicator

```typescript
interface HPCLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  progress?: number;
  variant?: 'spinner' | 'dots' | 'pulse';
  overlay?: boolean;
}
```

### HPCErrorBoundary
**Purpose**: Error handling wrapper

```typescript
interface HPCErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
  showDetails?: boolean;
}
```

### HPCConfirmDialog
**Purpose**: Confirmation dialogs for destructive actions

```typescript
interface HPCConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}
```

## 📱 Mobile-Specific Components

### HPCMobileNavigation
**Purpose**: Mobile-optimized navigation

```typescript
interface HPCMobileNavigationProps {
  items: Array<{
    id: string;
    label: string;
    icon: string;
    badge?: number;
    active?: boolean;
  }>;
  onItemSelect: (itemId: string) => void;
  position?: 'bottom' | 'top';
  showLabels?: boolean;
}
```

### HPCSwipeableCard
**Purpose**: Touch-friendly card interactions

```typescript
interface HPCSwipeableCardProps {
  children: React.ReactNode;
  leftActions?: Array<{
    label: string;
    icon: string;
    color: string;
    onClick: () => void;
  }>;
  rightActions?: Array<{
    label: string;
    icon: string;
    color: string;
    onClick: () => void;
  }>;
  onSwipe?: (direction: 'left' | 'right') => void;
  disabled?: boolean;
}
```

## 🎯 Specialized Components

### HPCEmojiSelector
**Purpose**: Gamified emotion/mood selection for students

```typescript
interface HPCEmojiSelectorProps {
  emotions: Array<{
    emoji: string;
    label: string;
    value: number;
  }>;
  selected?: string;
  onSelect: (emotion: string, value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  multiSelect?: boolean;
}
```

**Usage Example**:
```json
{
  "emotions": [
    { "emoji": "😊", "label": "Happy", "value": 5 },
    { "emoji": "😐", "label": "Okay", "value": 3 },
    { "emoji": "😔", "label": "Sad", "value": 2 },
    { "emoji": "🤔", "label": "Confused", "value": 2.5 },
    { "emoji": "💪", "label": "Confident", "value": 4.5 }
  ],
  "selected": "😊",
  "size": "lg",
  "showLabels": true,
  "multiSelect": false
}
```

### HPCGoalSetter
**Purpose**: Goal setting interface for students

```typescript
interface HPCGoalSetterProps {
  existingGoals: string[];
  suggestions: string[];
  onGoalsChange: (goals: string[]) => void;
  maxGoals?: number;
  maxLength?: number;
  showSuggestions?: boolean;
  allowCustom?: boolean;
}
```

### HPCEvidenceGallery
**Purpose**: Evidence file display and management

```typescript
interface HPCEvidenceGalleryProps {
  files: Array<{
    id: string;
    filename: string;
    url: string;
    type: string;
    size: number;
    uploaded_at: string;
    description?: string;
  }>;
  onView: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  layout?: 'grid' | 'list';
  showMetadata?: boolean;
}
```

## 🔄 State Management Patterns

### Component State
```typescript
// Local component state for form inputs
const [evaluation, setEvaluation] = useState<Partial<HPCEvaluation>>({
  score: 0,
  qualitative_remark: '',
  confidence_level: 0.8
});

// Validation state
const [validationErrors, setValidationErrors] = useState<string[]>([]);

// Loading states
const [isLoading, setIsLoading] = useState(false);
const [isSaving, setIsSaving] = useState(false);
```

### Global State Integration
```typescript
// Integration with existing Zustand stores
const { user, role } = useAuthStore();
const { fetchHPCData, hpcData, subscribeToHPCUpdates } = useDataStore();

// HPC-specific store
const useHPCStore = create<HPCState>((set, get) => ({
  evaluations: [],
  reports: [],
  parameters: [],
  currentStudent: null,
  
  // Actions
  submitEvaluation: async (evaluation) => { /* ... */ },
  compileReport: async (studentId, termId) => { /* ... */ },
  approveReport: async (reportId, decision) => { /* ... */ }
}));
```

## 🎨 Animation & Interaction Patterns

### Micro-Interactions
```css
/* Hover effects */
.hpc-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

/* Focus states */
.hpc-input:focus {
  transform: scale(1.02);
  transition: transform 0.1s ease;
}

/* Loading animations */
.hpc-loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Page Transitions
```typescript
// Smooth page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

// Component animations
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};
```

This component specification provides a complete blueprint for implementing the HPC frontend system with consistent, accessible, and performant React components that integrate seamlessly with the existing BIG DAY portal architecture.