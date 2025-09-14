# HPC Frontend File Structure Plan

## Overview

This document outlines the complete file structure for implementing the HPC frontend system within the existing BIG DAY portal architecture.

## 📁 Directory Structure

```
src/
├── components/
│   └── hpc/                           # HPC-specific components
│       ├── admin/                     # Admin configuration components
│       │   ├── HPCConfigurationPanel.tsx
│       │   ├── HPCParameterTable.tsx
│       │   ├── HPCParameterForm.tsx
│       │   ├── HPCRubricEditor.tsx
│       │   ├── HPCWeightingMatrix.tsx
│       │   ├── HPCAuditLog.tsx
│       │   └── index.ts
│       ├── teacher/                   # Teacher evaluation components
│       │   ├── HPCTeacherDashboard.tsx
│       │   ├── HPCEvaluationForm.tsx
│       │   ├── HPCStudentSelector.tsx
│       │   ├── HPCBulkEvaluationForm.tsx
│       │   ├── HPCClassAnalytics.tsx
│       │   └── index.ts
│       ├── student/                   # Student self-assessment components
│       │   ├── HPCStudentDashboard.tsx
│       │   ├── HPCSelfAssessmentForm.tsx
│       │   ├── HPCReflectionForm.tsx
│       │   ├── HPCGoalSetter.tsx
│       │   ├── HPCEmojiSelector.tsx
│       │   └── index.ts
│       ├── parent/                    # Parent feedback components
│       │   ├── HPCParentDashboard.tsx
│       │   ├── HPCParentFeedbackForm.tsx
│       │   ├── HPCChildProgress.tsx
│       │   └── index.ts
│       ├── shared/                    # Shared HPC components
│       │   ├── forms/
│       │   │   ├── HPCStarRating.tsx
│       │   │   ├── HPCParameterCard.tsx
│       │   │   ├── HPCEvidenceUploader.tsx
│       │   │   ├── HPCConfidenceSlider.tsx
│       │   │   └── HPCCharacterCounter.tsx
│       │   ├── display/
│       │   │   ├── HPCRadarChart.tsx
│       │   │   ├── HPCProgressTracker.tsx
│       │   │   ├── HPCGradeIndicator.tsx
│       │   │   ├── HPCPerformanceChart.tsx
│       │   │   └── HPCGrowthTrajectory.tsx
│       │   ├── layout/
│       │   │   ├── HPCStudentHeader.tsx
│       │   │   ├── HPCParameterNavigation.tsx
│       │   │   ├── HPCCard.tsx
│       │   │   ├── HPCBadge.tsx
│       │   │   └── HPCContainer.tsx
│       │   ├── workflow/
│       │   │   ├── HPCApprovalWorkflow.tsx
│       │   │   ├── HPCReviewPanel.tsx
│       │   │   ├── HPCWorkflowStatus.tsx
│       │   │   └── HPCApprovalActions.tsx
│       │   ├── reports/
│       │   │   ├── HPCReportPreview.tsx
│       │   │   ├── HPCReportViewer.tsx
│       │   │   ├── HPCExportActions.tsx
│       │   │   ├── HPCStakeholderFeedback.tsx
│       │   │   └── HPCAchievementsList.tsx
│       │   ├── tables/
│       │   │   ├── HPCEvaluationTable.tsx
│       │   │   ├── HPCReportsTable.tsx
│       │   │   ├── HPCStudentsTable.tsx
│       │   │   └── HPCDataTable.tsx
│       │   ├── search/
│       │   │   ├── HPCSearchBar.tsx
│       │   │   ├── HPCFilterPanel.tsx
│       │   │   └── HPCSearchResults.tsx
│       │   ├── notifications/
│       │   │   ├── HPCNotificationBell.tsx
│       │   │   ├── HPCToastNotification.tsx
│       │   │   └── HPCNotificationCenter.tsx
│       │   └── utils/
│       │       ├── HPCLoadingSpinner.tsx
│       │       ├── HPCErrorBoundary.tsx
│       │       ├── HPCConfirmDialog.tsx
│       │       ├── HPCModal.tsx
│       │       └── HPCTooltip.tsx
│       └── index.ts                   # Main HPC components export
├── pages/
│   └── hpc/                          # HPC page components
│       ├── admin/
│       │   ├── HPCConfigurationPage.tsx
│       │   ├── HPCReviewConsolePage.tsx
│       │   ├── HPCAnalyticsPage.tsx
│       │   └── HPCSystemReportsPage.tsx
│       ├── teacher/
│       │   ├── HPCTeacherDashboardPage.tsx
│       │   ├── HPCEvaluationInputPage.tsx
│       │   ├── HPCClassReportsPage.tsx
│       │   └── HPCTeacherAnalyticsPage.tsx
│       ├── student/
│       │   ├── HPCStudentDashboardPage.tsx
│       │   ├── HPCSelfAssessmentPage.tsx
│       │   └── HPCMyReportsPage.tsx
│       ├── parent/
│       │   ├── HPCParentDashboardPage.tsx
│       │   ├── HPCFeedbackPage.tsx
│       │   └── HPCChildReportsPage.tsx
│       └── shared/
│           ├── HPCReportViewerPage.tsx
│           ├── HPCFeedbackFormPage.tsx
│           └── HPCHelpPage.tsx
├── hooks/
│   └── hpc/                          # HPC-specific hooks
│       ├── useHPCEvaluations.ts
│       ├── useHPCReports.ts
│       ├── useHPCParameters.ts
│       ├── useHPCWorkflow.ts
│       ├── useHPCAnalytics.ts
│       ├── useHPCExport.ts
│       ├── useHPCNotifications.ts
│       └── useHPCRealtime.ts
├── stores/
│   └── hpcStore.ts                   # HPC state management
├── types/
│   └── hpc.ts                        # HPC TypeScript types (already exists)
├── services/
│   └── hpcApi.ts                     # HPC API service (already exists)
├── utils/
│   └── hpc/                          # HPC utility functions
│       ├── hpcValidation.ts
│       ├── hpcFormatting.ts
│       ├── hpcCalculations.ts
│       ├── hpcExport.ts
│       └── hpcConstants.ts
└── styles/
    └── hpc/                          # HPC-specific styles
        ├── components.css
        ├── pages.css
        ├── print.css
        └── animations.css
```

## 📄 Component File Specifications

### Core Component Files

#### src/components/hpc/shared/forms/HPCStarRating.tsx
```typescript
/**
 * Accessible star rating component for HPC evaluations
 * 
 * Features:
 * - Keyboard navigation (arrow keys, home/end)
 * - Screen reader support with ARIA labels
 * - Visual grade mapping (stars to A+/A/B/C/D)
 * - Confidence level integration
 * - Touch-optimized for mobile
 * 
 * Props:
 * - value: number (1-5)
 * - onChange: (value: number) => void
 * - readonly?: boolean
 * - size?: 'sm' | 'md' | 'lg'
 * - showGrade?: boolean
 * - ariaLabel?: string
 */
```

#### src/components/hpc/shared/forms/HPCParameterCard.tsx
```typescript
/**
 * Individual parameter evaluation card
 * 
 * Features:
 * - Parameter information display
 * - Integrated rating input
 * - Qualitative remark textarea
 * - Evidence upload section
 * - Confidence level slider
 * - Real-time validation
 * - Auto-save functionality
 * 
 * Props:
 * - parameter: HPCParameter
 * - evaluation?: HPCEvaluation
 * - onSave: (evaluation: Partial<HPCEvaluation>) => Promise<void>
 * - readonly?: boolean
 * - showRubric?: boolean
 */
```

#### src/components/hpc/shared/display/HPCRadarChart.tsx
```typescript
/**
 * Performance visualization radar chart
 * 
 * Features:
 * - Multi-parameter performance display
 * - Accessible chart with text alternatives
 * - Interactive hover states
 * - Export-ready for PDF
 * - Responsive design
 * 
 * Props:
 * - data: Array<{ parameter: string; score: number; maxScore: number }>
 * - size?: number
 * - interactive?: boolean
 * - showLabels?: boolean
 */
```

### Page Component Files

#### src/pages/hpc/teacher/HPCEvaluationInputPage.tsx
```typescript
/**
 * Main teacher evaluation interface
 * 
 * Features:
 * - Student selection and context
 * - Parameter navigation sidebar
 * - Evaluation form with validation
 * - Progress tracking
 * - Bulk actions support
 * - Real-time collaboration indicators
 * 
 * Route: /teacher/hpc/input/:studentId
 * Permissions: Teacher role, assigned to student
 */
```

#### src/pages/hpc/admin/HPCReviewConsolePage.tsx
```typescript
/**
 * Administrative review and approval interface
 * 
 * Features:
 * - Side-by-side raw data and compiled preview
 * - Approval workflow management
 * - Comment threading
 * - Quality indicators
 * - Batch approval actions
 * 
 * Route: /admin/hpc/review/:studentId
 * Permissions: Admin role or assigned reviewer
 */
```

## 🔧 Hook Specifications

### src/hooks/hpc/useHPCEvaluations.ts
```typescript
/**
 * Hook for managing HPC evaluations
 * 
 * Features:
 * - CRUD operations for evaluations
 * - Real-time updates via Supabase subscriptions
 * - Validation and error handling
 * - Auto-save functionality
 * - Optimistic updates
 * 
 * Returns:
 * - evaluations: HPCEvaluation[]
 * - submitEvaluation: (evaluation: Partial<HPCEvaluation>) => Promise<void>
 * - updateEvaluation: (id: string, updates: Partial<HPCEvaluation>) => Promise<void>
 * - deleteEvaluation: (id: string) => Promise<void>
 * - isLoading: boolean
 * - error: string | null
 */
```

### src/hooks/hpc/useHPCReports.ts
```typescript
/**
 * Hook for managing HPC reports
 * 
 * Features:
 * - Report compilation and management
 * - Approval workflow handling
 * - Export functionality
 * - Analytics integration
 * - Real-time status updates
 * 
 * Returns:
 * - reports: HPCReport[]
 * - compileReport: (studentId: string, termId: string) => Promise<string>
 * - approveReport: (reportId: string, decision: string) => Promise<void>
 * - exportReport: (reportId: string, options: ExportOptions) => Promise<string>
 * - isCompiling: boolean
 * - error: string | null
 */
```

### src/hooks/hpc/useHPCRealtime.ts
```typescript
/**
 * Hook for real-time HPC updates
 * 
 * Features:
 * - WebSocket subscription management
 * - Live evaluation updates
 * - Workflow status changes
 * - Collaborative editing indicators
 * - Notification handling
 * 
 * Returns:
 * - subscribeToEvaluations: (studentId: string) => void
 * - subscribeToReports: (reportId: string) => void
 * - subscribeToWorkflow: (reportId: string) => void
 * - unsubscribeAll: () => void
 * - connectionStatus: 'connected' | 'disconnected' | 'reconnecting'
 */
```

## 🗂️ Store Structure

### src/stores/hpcStore.ts
```typescript
/**
 * Zustand store for HPC state management
 * 
 * State:
 * - parameters: HPCParameter[]
 * - evaluations: HPCEvaluation[]
 * - reports: HPCReport[]
 * - currentStudent: Student | null
 * - currentTerm: AcademicTerm | null
 * - workflow: HPCApprovalWorkflow[]
 * - notifications: HPCNotification[]
 * 
 * Actions:
 * - fetchParameters: () => Promise<void>
 * - submitEvaluation: (evaluation: HPCEvaluation) => Promise<void>
 * - compileReport: (studentId: string, termId: string) => Promise<void>
 * - approveReport: (reportId: string, decision: string) => Promise<void>
 * - exportReport: (reportId: string, options: ExportOptions) => Promise<void>
 * - subscribeToUpdates: (filters: any) => void
 * - clearNotifications: () => void
 */
```

## 🎨 Style Files

### src/styles/hpc/components.css
```css
/**
 * HPC component-specific styles
 * 
 * Includes:
 * - Parameter cards and forms
 * - Star rating components
 * - Evidence upload areas
 * - Progress indicators
 * - Grade badges and indicators
 * - Chart containers
 */
```

### src/styles/hpc/pages.css
```css
/**
 * HPC page layout styles
 * 
 * Includes:
 * - Page containers and grids
 * - Navigation layouts
 * - Dashboard layouts
 * - Report viewer layouts
 * - Mobile responsive adjustments
 */
```

### src/styles/hpc/print.css
```css
/**
 * Print and PDF export styles
 * 
 * Includes:
 * - A4 page layout
 * - Print-optimized typography
 * - Chart print styles
 * - Signature block layouts
 * - Page break controls
 */
```

## 🧪 Test Files

### tests/hpc/components/
```
HPCStarRating.test.tsx           # Star rating component tests
HPCParameterCard.test.tsx        # Parameter card tests
HPCEvaluationForm.test.tsx       # Evaluation form tests
HPCReportViewer.test.tsx         # Report viewer tests
HPCApprovalWorkflow.test.tsx     # Workflow component tests
```

### tests/hpc/hooks/
```
useHPCEvaluations.test.ts        # Evaluations hook tests
useHPCReports.test.ts            # Reports hook tests
useHPCWorkflow.test.ts           # Workflow hook tests
useHPCRealtime.test.ts           # Real-time hook tests
```

### tests/hpc/integration/
```
teacher-evaluation-flow.test.tsx  # End-to-end teacher flow
student-assessment-flow.test.tsx  # End-to-end student flow
approval-workflow.test.tsx        # Approval process tests
report-export.test.tsx           # Export functionality tests
```

### tests/hpc/accessibility/
```
keyboard-navigation.test.tsx      # Keyboard accessibility tests
screen-reader.test.tsx           # Screen reader tests
color-contrast.test.tsx          # Visual accessibility tests
mobile-accessibility.test.tsx    # Mobile accessibility tests
```

## 📚 Documentation Files

### docs/hpc/
```
frontend-spec.md                 # Complete UX specification (already created)
hpc-api-contract.md             # API contract documentation (already created)
component-specifications.md     # Component specs (already created)
demo-pages-specification.md     # Demo pages and sample data (already created)
accessibility-checklist.md      # Accessibility guidelines (already created)
visual-design-tokens.md         # Design system tokens (already created)
file-structure-plan.md          # This file
testing-strategy.md             # Testing approach and scenarios
deployment-guide.md             # Deployment and integration guide
```

### storybook/hpc/
```
admin-configuration.stories.tsx  # Admin config component stories
teacher-evaluation.stories.tsx   # Teacher evaluation stories
student-assessment.stories.tsx   # Student self-assessment stories
report-viewer.stories.tsx        # Report viewer stories
shared-components.stories.tsx    # Shared component stories
```

## 🔧 Utility Files

### src/utils/hpc/hpcValidation.ts
```typescript
/**
 * HPC validation utilities
 * 
 * Functions:
 * - validateEvaluation(evaluation: HPCEvaluation): ValidationResult
 * - validateScore(score: number): boolean
 * - validateRemark(remark: string): boolean
 * - validateEvidence(files: File[]): ValidationResult
 * - validateReportCompleteness(evaluations: HPCEvaluation[]): boolean
 */
```

### src/utils/hpc/hpcFormatting.ts
```typescript
/**
 * HPC formatting utilities
 * 
 * Functions:
 * - formatGrade(score: number): string
 * - formatScore(score: number): string
 * - formatDate(date: string): string
 * - formatFileSize(bytes: number): string
 * - formatPercentile(percentile: number): string
 */
```

### src/utils/hpc/hpcCalculations.ts
```typescript
/**
 * HPC calculation utilities
 * 
 * Functions:
 * - calculateWeightedScore(evaluations: HPCEvaluation[], weights: Record<string, number>): number
 * - calculateOverallGrade(parameterScores: Record<string, number>, weights: Record<string, number>): string
 * - calculatePercentile(score: number, allScores: number[]): number
 * - calculateGrowthTrajectory(historicalScores: number[]): GrowthTrend
 * - identifyStrengths(parameterScores: Record<string, number>): string[]
 * - identifyGrowthAreas(parameterScores: Record<string, number>): string[]
 */
```

### src/utils/hpc/hpcExport.ts
```typescript
/**
 * HPC export utilities
 * 
 * Functions:
 * - generateReportHTML(report: HPCReport, options: ExportOptions): string
 * - generateReportPDF(reportHTML: string, options: PDFOptions): Promise<Blob>
 * - exportToCSV(data: any[], filename: string): void
 * - exportToJSON(data: any, filename: string): void
 * - generateShareableLink(reportId: string): string
 */
```

### src/utils/hpc/hpcConstants.ts
```typescript
/**
 * HPC system constants
 * 
 * Constants:
 * - GRADE_SCALE: Record<string, { min: number; max: number; description: string }>
 * - PARAMETER_CATEGORIES: string[]
 * - EVALUATOR_ROLES: string[]
 * - WORKFLOW_STATUSES: string[]
 * - FILE_TYPES: Record<string, string[]>
 * - VALIDATION_RULES: Record<string, any>
 */
```

## 🎯 Integration Points

### Portal Integration
```typescript
// src/components/portals/AdminPortal.tsx
// Add HPC tab to existing admin navigation
const adminTabs = [
  // ... existing tabs
  { key: 'hpc', label: 'HPC System', component: HPCAdminDashboard }
];

// src/components/portals/TeacherPortal.tsx  
// Add HPC tab to existing teacher navigation
const teacherTabs = [
  // ... existing tabs
  { key: 'hpc', label: 'HPC Evaluations', component: HPCTeacherDashboard }
];

// src/components/portals/StudentPortal.tsx
// Add HPC tab to existing student navigation
const studentTabs = [
  // ... existing tabs
  { key: 'hpc', label: 'My Progress Card', component: HPCStudentDashboard }
];
```

### Route Integration
```typescript
// src/App.tsx
// Add HPC routes to existing routing structure
<Routes>
  {/* Existing routes */}
  
  {/* HPC Routes */}
  <Route path="/admin/hpc/*" element={<HPCAdminRoutes />} />
  <Route path="/teacher/hpc/*" element={<HPCTeacherRoutes />} />
  <Route path="/student/hpc/*" element={<HPCStudentRoutes />} />
  <Route path="/parent/hpc/*" element={<HPCParentRoutes />} />
  <Route path="/reports/hpc/*" element={<HPCReportRoutes />} />
  <Route path="/hpc/feedback/*" element={<HPCFeedbackRoutes />} />
</Routes>
```

## 📦 Package Dependencies

### Additional Dependencies Needed
```json
{
  "dependencies": {
    "@visx/group": "^3.0.0",
    "@visx/scale": "^3.0.0", 
    "@visx/heatmap": "^3.0.0",
    "react-dropzone": "^14.2.3",
    "react-chartjs-2": "^5.2.0",
    "chart.js": "^4.2.1",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "react-speech-recognition": "^3.10.0",
    "react-hotkeys-hook": "^4.4.1"
  },
  "devDependencies": {
    "@storybook/addon-a11y": "^7.6.0",
    "jest-axe": "^8.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0"
  }
}
```

## 🚀 Implementation Phases

### Phase 1: Core Components (Week 1)
- [ ] HPCStarRating
- [ ] HPCParameterCard  
- [ ] HPCEvaluationForm
- [ ] HPCStudentHeader
- [ ] HPCProgressTracker

### Phase 2: Display Components (Week 2)
- [ ] HPCRadarChart
- [ ] HPCReportPreview
- [ ] HPCGradeIndicator
- [ ] HPCPerformanceChart
- [ ] HPCStakeholderFeedback

### Phase 3: Administrative Components (Week 3)
- [ ] HPCParameterTable
- [ ] HPCRubricEditor
- [ ] HPCConfigurationPanel
- [ ] HPCApprovalWorkflow
- [ ] HPCReviewPanel

### Phase 4: Pages and Integration (Week 4)
- [ ] Teacher evaluation pages
- [ ] Student self-assessment pages
- [ ] Admin configuration pages
- [ ] Report viewer pages
- [ ] Portal integration

### Phase 5: Testing and Polish (Week 5)
- [ ] Unit tests for all components
- [ ] Integration tests for workflows
- [ ] Accessibility testing
- [ ] Performance optimization
- [ ] Documentation completion

## 📋 File Creation Checklist

### Component Files
- [ ] All shared components created with proper TypeScript interfaces
- [ ] Role-specific components implemented
- [ ] Layout components for consistent structure
- [ ] Utility components for common patterns

### Page Files  
- [ ] All page components created with proper routing
- [ ] Demo data integration for testing
- [ ] Error boundaries and loading states
- [ ] Mobile responsive layouts

### Hook Files
- [ ] Custom hooks for HPC operations
- [ ] Real-time subscription management
- [ ] State management integration
- [ ] Error handling and validation

### Style Files
- [ ] Component-specific CSS modules
- [ ] Page layout styles
- [ ] Print and export styles
- [ ] Animation and transition styles

### Test Files
- [ ] Unit tests for all components
- [ ] Integration tests for user flows
- [ ] Accessibility tests
- [ ] Performance tests

### Documentation Files
- [ ] Component documentation with examples
- [ ] API integration guides
- [ ] Testing strategies and scenarios
- [ ] Deployment and maintenance guides

This file structure provides a comprehensive foundation for implementing the HPC frontend system while maintaining clean separation of concerns, reusability, and integration with the existing BIG DAY portal architecture.