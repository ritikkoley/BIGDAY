# HPC Frontend UX Specification

## Overview

The Holistic Progress Card (HPC) frontend system integrates into the existing BIG DAY portal architecture, providing role-based interfaces for multi-stakeholder evaluation, report compilation, and export capabilities.

## 🎯 Design Principles

### Apple-Inspired Design Language
- **Clean, minimalist interfaces** with generous white space
- **Subtle shadows and rounded corners** (16-20px border radius)
- **Smooth animations and micro-interactions**
- **Consistent spacing** using 8px grid system
- **Accessible color contrast** meeting WCAG AA standards

### User Experience Goals
- **Intuitive navigation** within existing portal structure
- **Progressive disclosure** to manage complexity
- **Real-time feedback** for all user actions
- **Mobile-responsive design** for all screen sizes
- **Accessibility-first** approach for inclusive design

## 📱 Page Specifications

### 1. Admin HPC Configuration (/admin/hpc/config)

**Purpose**: Configure HPC parameters, rubrics, and system settings

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Header: HPC System Configuration                            │
├─────────────────────────────────────────────────────────────┤
│ Tabs: Parameters | Rubrics | Weightings | Settings         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────┐ │
│ │ Quick Stats     │ │ Parameters Table                    │ │
│ │ • 17 Parameters │ │ Name | Category | Weight | Status   │ │
│ │ • 6 Categories  │ │ [+] Add Parameter                   │ │
│ │ • 85 Rubrics    │ │                                     │ │
│ └─────────────────┘ └─────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Actions: Export Config | Import Config | Reset Defaults    │
└─────────────────────────────────────────────────────────────┘
```

**Key Components**:
- `HPCParameterTable`: Sortable, filterable parameter list
- `HPCParameterForm`: Modal for creating/editing parameters
- `HPCRubricEditor`: Rich text editor for rubric descriptors
- `HPCWeightingMatrix`: Interactive grid for role weightings
- `HPCAuditLog`: Timeline of configuration changes

**User Flows**:
1. **Add Parameter**: Click [+] → Fill form → Validate → Save → Update table
2. **Edit Rubric**: Select parameter → Open rubric editor → Edit levels → Save version
3. **Adjust Weightings**: Select parameter group → Modify percentages → Validate (sum=100%) → Save

### 2. Teacher Evaluation Input (/teacher/hpc/input/:studentId)

**Purpose**: Teachers input evaluations for assigned students across all parameters

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Student Header: [Photo] Aarav Sharma | Grade 5-A | #DPS001 │
├─────────────────────────────────────────────────────────────┤
│ Progress: 4/6 Parameters Completed ████████░░ 67%          │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────────────────────────────┐ │
│ │ Parameters  │ │ Evaluation Form                         │ │
│ │ ✓ Math      │ │ Mathematics Assessment                  │ │
│ │ ✓ Science   │ │ ┌─────────────────────────────────────┐ │ │
│ │ ○ English   │ │ │ Rating: ⭐⭐⭐⭐⭐ (4.2/5)          │ │ │
│ │ ○ Creativity│ │ │ Grade: A                            │ │ │
│ │ ○ Teamwork  │ │ └─────────────────────────────────────┘ │ │
│ │ ○ Discipline│ │ Qualitative Remark:                    │ │
│ └─────────────┘ │ [Text Area - 200 chars]                │ │
│                 │ Evidence: [Upload] [Gallery]            │ │
│                 │ Confidence: ████████░░ 85%             │ │
│                 │ [Save Draft] [Submit Evaluation]        │ │
│                 └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key Components**:
- `HPCStudentHeader`: Student info card with photo and quick stats
- `HPCProgressTracker`: Visual progress indicator for completion
- `HPCParameterNav`: Left sidebar navigation with completion status
- `HPCEvaluationForm`: Main evaluation input form
- `HPCStarRating`: Accessible star rating component
- `HPCEvidenceUploader`: Drag-drop file upload with preview
- `HPCConfidenceSlider`: Confidence level input

**User Flows**:
1. **Select Student**: From class list → Navigate to evaluation page
2. **Fill Evaluation**: Select parameter → Rate → Add remark → Upload evidence → Save
3. **Submit All**: Complete all parameters → Review summary → Submit for approval

### 3. Student Self-Assessment (/student/hpc/self)

**Purpose**: Students provide self-evaluations and reflections

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ My Progress Card - Self Assessment                          │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "How do you feel about your learning this term?"       │ │
│ │ [Emoji selector: 😊 😐 😔 🤔 💪]                        │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────┐ │
│ │ What I'm Good At│ │ What I Want to Improve              │ │
│ │ • Math puzzles  │ │ • Speaking in class                 │ │
│ │ • Helping       │ │ • Sports activities                 │ │
│ │   friends       │ │ • Time management                   │ │
│ │ • Art projects  │ │                                     │ │
│ └─────────────────┘ └─────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ My Goals for Next Term:                                     │
│ [Text area with character counter: 0/300]                  │
├─────────────────────────────────────────────────────────────┤
│ [Save Draft] [Submit My Assessment]                         │
└─────────────────────────────────────────────────────────────┘
```

**Key Components**:
- `HPCEmojiSelector`: Gamified emotion/feeling selector
- `HPCStrengthsWeaknesses`: Dual-column strength/improvement areas
- `HPCGoalSetter`: Goal input with character limits
- `HPCReflectionPrompts`: Age-appropriate reflection questions

### 4. Parent/Peer Feedback Form (/hpc/feedback/:studentId)

**Purpose**: Lightweight feedback collection from parents and peers

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Feedback for: Aarav Sharma (Grade 5-A)                     │
├─────────────────────────────────────────────────────────────┤
│ Your Role: ○ Parent ○ Peer ○ Family Member                 │
├─────────────────────────────────────────────────────────────┤
│ Please share your observations:                             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Teamwork & Collaboration                                │ │
│ │ Rating: ⭐⭐⭐⭐⭐                                        │ │
│ │ Comment: [Text area - 150 chars]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Empathy & Caring                                        │ │
│ │ Rating: ⭐⭐⭐⭐⭐                                        │ │
│ │ Comment: [Text area - 150 chars]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [Submit Feedback]                                           │
└─────────────────────────────────────────────────────────────┘
```

**Key Components**:
- `HPCRoleSelector`: Role identification for feedback context
- `HPCFeedbackCard`: Parameter-specific feedback input
- `HPCQuickRating`: Simplified rating interface
- `HPCCharacterCounter`: Real-time character count feedback

### 5. Review & Approval Console (/admin/hpc/review/:studentId)

**Purpose**: Multi-step approval workflow for report publication

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ HPC Review Console - Aarav Sharma                          │
├─────────────────────────────────────────────────────────────┤
│ Status: Under Review | Version: 1.2 | Due: 2 days         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────┐ │
│ │ Raw Evaluations │ │ Compiled Report Preview             │ │
│ │                 │ │                                     │ │
│ │ Teacher Input:  │ │ Overall Grade: A                    │ │
│ │ • Math: 4.2/5   │ │ Overall Score: 4.15                 │ │
│ │ • Art: 4.5/5    │ │                                     │ │
│ │                 │ │ [Radar Chart]                       │ │
│ │ Parent Input:   │ │                                     │ │
│ │ • Math: 4.0/5   │ │ Strengths:                          │ │
│ │ • Empathy: 4.5  │ │ • Mathematical reasoning            │ │
│ │                 │ │ • Creative expression               │ │
│ │ Student Self:   │ │                                     │ │
│ │ • Goals set     │ │ Growth Areas:                       │ │
│ │ • Reflections   │ │ • Physical fitness                  │ │
│ └─────────────────┘ └─────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Reviewer Comments: [Text area]                              │
│ Actions: [Request Revision] [Approve] [Publish]             │
└─────────────────────────────────────────────────────────────┘
```

**Key Components**:
- `HPCReviewSideBySide`: Split view for raw data and compiled preview
- `HPCWorkflowStatus`: Visual workflow progress indicator
- `HPCReviewerActions`: Action buttons with confirmation dialogs
- `HPCCommentThread`: Threaded comments for revision requests

### 6. Report Viewer & Export (/reports/hpc/:studentId/:reportId)

**Purpose**: Final report presentation with export capabilities

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ [School Logo] Delhi Public School, Bhilai                  │
│ HOLISTIC PROGRESS CARD - Term 1, 2024-25                   │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ Student: Aarav Sharma                      │
│ │[Student Pic]│ Grade: 5-A | Admission: DPS2024001        │
│ │             │ Overall Grade: A (4.15/5.0)               │
│ └─────────────┘                                             │
├─────────────────────────────────────────────────────────────┤
│ SCHOLASTIC PERFORMANCE                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Mathematics        │ A  │ 4.2 │ Excellent reasoning     │ │
│ │ Science           │ A  │ 4.0 │ Strong lab skills       │ │
│ │ English           │ B+ │ 3.8 │ Good communication      │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ CO-SCHOLASTIC ACTIVITIES                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Radar Chart: Creativity, Arts, Sports, Health]        │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ LIFE SKILLS & VALUES                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Teamwork: A | Empathy: A+ | Leadership: B+             │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ STAKEHOLDER FEEDBACK                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Teacher: "Shows exceptional creativity..."              │ │
│ │ Parent: "Helpful and caring at home..."                │ │
│ │ Self: "I want to improve in sports..."                 │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Actions: [Print] [Export PDF] [Share] [Download]           │
└─────────────────────────────────────────────────────────────┘
```

**Key Components**:
- `HPCReportHeader`: School branding and student identification
- `HPCScholasticTable`: Academic performance summary
- `HPCRadarChart`: Visual co-scholastic performance
- `HPCStakeholderFeedback`: Multi-source feedback compilation
- `HPCExportActions`: Export and sharing controls

## 🧩 Component Inventory

### Core Input Components

#### HPCStarRating
```typescript
interface HPCStarRatingProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
}
```

#### HPCParameterCard
```typescript
interface HPCParameterCardProps {
  parameter: HPCParameter;
  evaluation?: HPCEvaluation;
  rubric?: HPCRubric[];
  onSave: (evaluation: Partial<HPCEvaluation>) => Promise<void>;
  readonly?: boolean;
  showEvidence?: boolean;
}
```

#### HPCEvidenceUploader
```typescript
interface HPCEvidenceUploaderProps {
  existingFiles: string[];
  onUpload: (files: File[]) => Promise<string[]>;
  acceptTypes: string[];
  maxFiles?: number;
  maxSize?: number;
}
```

### Display Components

#### HPCRadarChart
```typescript
interface HPCRadarChartProps {
  data: Array<{
    parameter: string;
    score: number;
    maxScore: number;
  }>;
  size?: number;
  colors?: string[];
  showLabels?: boolean;
}
```

#### HPCReportPreview
```typescript
interface HPCReportPreviewProps {
  report: HPCReport;
  mode: 'preview' | 'print' | 'export';
  language?: 'english' | 'hindi';
  includeCharts?: boolean;
}
```

### Administrative Components

#### HPCParameterTable
```typescript
interface HPCParameterTableProps {
  parameters: HPCParameter[];
  onEdit: (parameter: HPCParameter) => void;
  onDelete: (parameterId: string) => void;
  onToggleActive: (parameterId: string, active: boolean) => void;
  sortBy?: string;
  filterBy?: string;
}
```

#### HPCRubricEditor
```typescript
interface HPCRubricEditorProps {
  parameterId: string;
  rubrics: HPCRubric[];
  onSave: (rubrics: HPCRubric[]) => Promise<void>;
  version: number;
  language?: 'english' | 'hindi';
}
```

## 🔄 User Flow Diagrams

### Teacher Evaluation Flow
```
Teacher Login → Select Class → Choose Student → 
View Parameters → Fill Evaluations → Upload Evidence → 
Save Draft → Review Summary → Submit → Notification Sent
```

### Student Self-Assessment Flow
```
Student Login → HPC Self-Assessment → 
Emoji Mood Selector → Strengths/Weaknesses → 
Goal Setting → Reflection Writing → 
Preview → Submit → Confirmation
```

### Report Approval Flow
```
Draft Report → Class Teacher Review → 
Add Comments → Approve/Reject → 
Principal Review → Final Approval → 
Publish → Stakeholder Notifications → 
Export Available
```

## 📊 Data Flow Architecture

### Evaluation Collection
```
Multiple Stakeholders → Individual Evaluations → 
Validation Layer → Database Storage → 
Real-time Updates → Progress Tracking
```

### Report Compilation
```
Raw Evaluations → Aggregation Engine → 
Weightage Application → Grade Calculation → 
Summary Generation → Draft Report → 
Approval Workflow → Published Report
```

### Export Pipeline
```
Published Report → Template Selection → 
Language Choice → PDF Generation → 
Download/Share → Analytics Tracking
```

## 🎨 Visual Design Tokens

### Color Palette
```css
/* Primary Colors */
--hpc-primary: #2563EB;      /* Blue - main actions */
--hpc-secondary: #7C3AED;    /* Purple - secondary actions */
--hpc-success: #059669;      /* Green - success states */
--hpc-warning: #D97706;      /* Orange - warnings */
--hpc-error: #DC2626;        /* Red - errors */

/* Grade Colors */
--hpc-grade-a-plus: #059669; /* Green - A+ */
--hpc-grade-a: #0891B2;      /* Cyan - A */
--hpc-grade-b: #7C3AED;      /* Purple - B */
--hpc-grade-c: #D97706;      /* Orange - C */
--hpc-grade-d: #DC2626;      /* Red - D */

/* Neutral Colors */
--hpc-gray-50: #F9FAFB;
--hpc-gray-100: #F3F4F6;
--hpc-gray-200: #E5E7EB;
--hpc-gray-300: #D1D5DB;
--hpc-gray-400: #9CA3AF;
--hpc-gray-500: #6B7280;
--hpc-gray-600: #4B5563;
--hpc-gray-700: #374151;
--hpc-gray-800: #1F2937;
--hpc-gray-900: #111827;
```

### Typography Scale
```css
/* Headings */
--hpc-text-h1: 2rem;         /* 32px - Page titles */
--hpc-text-h2: 1.5rem;       /* 24px - Section headers */
--hpc-text-h3: 1.25rem;      /* 20px - Subsection headers */
--hpc-text-h4: 1.125rem;     /* 18px - Card titles */

/* Body Text */
--hpc-text-base: 1rem;       /* 16px - Body text */
--hpc-text-sm: 0.875rem;     /* 14px - Small text */
--hpc-text-xs: 0.75rem;      /* 12px - Captions */

/* Font Weights */
--hpc-font-light: 300;
--hpc-font-normal: 400;
--hpc-font-medium: 500;
--hpc-font-semibold: 600;
--hpc-font-bold: 700;
```

### Spacing System
```css
/* 8px Grid System */
--hpc-space-1: 0.25rem;      /* 4px */
--hpc-space-2: 0.5rem;       /* 8px */
--hpc-space-3: 0.75rem;      /* 12px */
--hpc-space-4: 1rem;         /* 16px */
--hpc-space-6: 1.5rem;       /* 24px */
--hpc-space-8: 2rem;         /* 32px */
--hpc-space-12: 3rem;        /* 48px */
--hpc-space-16: 4rem;        /* 64px */
```

### Component Styles
```css
/* Cards */
.hpc-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: var(--hpc-space-6);
  border: 1px solid var(--hpc-gray-200);
}

/* Buttons */
.hpc-button-primary {
  background: var(--hpc-primary);
  color: white;
  padding: var(--hpc-space-3) var(--hpc-space-6);
  border-radius: 0.75rem;
  font-weight: var(--hpc-font-medium);
  transition: all 0.2s ease;
}

/* Form Inputs */
.hpc-input {
  border: 1px solid var(--hpc-gray-300);
  border-radius: 0.5rem;
  padding: var(--hpc-space-3);
  font-size: var(--hpc-text-base);
  transition: border-color 0.2s ease;
}

.hpc-input:focus {
  border-color: var(--hpc-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

## ♿ Accessibility Specifications

### Keyboard Navigation
- **Tab Order**: Logical flow through all interactive elements
- **Focus Indicators**: Clear visual focus states for all controls
- **Keyboard Shortcuts**: 
  - `Ctrl+S`: Save draft
  - `Ctrl+Enter`: Submit evaluation
  - `Esc`: Close modals/cancel actions

### Screen Reader Support
- **ARIA Labels**: All interactive elements properly labeled
- **Live Regions**: Dynamic content updates announced
- **Chart Descriptions**: Text alternatives for visual charts
- **Form Validation**: Error messages clearly associated with inputs

### Visual Accessibility
- **Color Contrast**: Minimum 4.5:1 ratio for all text
- **Color Independence**: Information not conveyed by color alone
- **Text Scaling**: Support up to 200% zoom without horizontal scrolling
- **Motion Preferences**: Respect `prefers-reduced-motion`

## 📱 Responsive Design Breakpoints

```css
/* Mobile First Approach */
--hpc-breakpoint-sm: 640px;   /* Small tablets */
--hpc-breakpoint-md: 768px;   /* Tablets */
--hpc-breakpoint-lg: 1024px;  /* Small desktops */
--hpc-breakpoint-xl: 1280px;  /* Large desktops */
```

### Mobile Adaptations
- **Collapsible navigation** for parameter lists
- **Swipe gestures** for parameter navigation
- **Touch-optimized controls** (minimum 44px touch targets)
- **Simplified layouts** with stacked components

## 🔔 Real-Time Features

### Live Updates
- **Evaluation Progress**: Real-time completion tracking
- **Collaborative Editing**: Show when others are editing
- **Workflow Status**: Live approval status updates
- **Notifications**: Toast messages for important events

### WebSocket Channels
```typescript
// Evaluation updates
supabase.channel('hpc-evaluations')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'hpc_evaluations',
    filter: `student_id=eq.${studentId}`
  }, handleEvaluationUpdate)

// Report status changes  
supabase.channel('hpc-reports')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public', 
    table: 'hpc_reports',
    filter: `id=eq.${reportId}`
  }, handleReportStatusUpdate)
```

## 🧪 Testing Strategy

### Unit Tests
- **Component Rendering**: All components render without errors
- **Props Validation**: Correct prop types and required fields
- **Event Handling**: User interactions trigger correct callbacks
- **Accessibility**: ARIA attributes and keyboard navigation

### Integration Tests
- **Evaluation Flow**: Complete teacher evaluation submission
- **Approval Workflow**: Multi-step approval process
- **Report Generation**: Evaluation aggregation and compilation
- **Export Functionality**: PDF generation and download

### Manual QA Checklist
- [ ] Teacher can complete evaluation for all parameters
- [ ] Student self-assessment saves and submits correctly
- [ ] Parent feedback form validates relationship
- [ ] Approval workflow progresses through all steps
- [ ] Report preview matches compiled data
- [ ] PDF export maintains formatting and includes all sections
- [ ] Real-time updates work across multiple browser tabs
- [ ] Mobile interface is fully functional

## 📋 Acceptance Criteria

### Functional Requirements
- [ ] All stakeholder roles can input evaluations
- [ ] Aggregation logic produces correct weighted scores
- [ ] Approval workflow enforces proper authorization
- [ ] Reports compile all evaluation data accurately
- [ ] Export generates print-ready PDFs
- [ ] Real-time updates work reliably

### Performance Requirements
- [ ] Page load times under 2 seconds
- [ ] Evaluation submission under 1 second
- [ ] Report compilation under 5 seconds
- [ ] PDF generation under 10 seconds
- [ ] Real-time updates under 500ms latency

### Accessibility Requirements
- [ ] WCAG AA compliance for all interfaces
- [ ] Full keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Mobile touch accessibility
- [ ] Color-blind friendly design

This comprehensive specification provides the foundation for implementing a complete, CBSE-compliant HPC system that integrates seamlessly with the existing BIG DAY portal while maintaining the highest standards of usability, accessibility, and performance.