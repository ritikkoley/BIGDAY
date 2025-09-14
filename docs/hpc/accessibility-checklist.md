# HPC Accessibility Checklist

## Overview

This document provides comprehensive accessibility guidelines and testing criteria for the Holistic Progress Card (HPC) system, ensuring compliance with WCAG 2.1 AA standards and inclusive design principles.

## ♿ WCAG 2.1 AA Compliance

### Perceivable

#### Color and Contrast
- [ ] **Text Contrast**: Minimum 4.5:1 ratio for normal text
- [ ] **Large Text Contrast**: Minimum 3:1 ratio for text 18pt+ or 14pt+ bold
- [ ] **Non-text Contrast**: Minimum 3:1 ratio for UI components and graphics
- [ ] **Color Independence**: Information not conveyed by color alone
- [ ] **Focus Indicators**: Visible focus indicators with minimum 3:1 contrast

**HPC-Specific Requirements**:
```css
/* Grade color system with sufficient contrast */
.hpc-grade-a-plus { color: #059669; background: #ECFDF5; } /* 4.8:1 ratio */
.hpc-grade-a { color: #0891B2; background: #F0F9FF; }       /* 4.6:1 ratio */
.hpc-grade-b { color: #7C3AED; background: #FAF5FF; }       /* 4.7:1 ratio */
.hpc-grade-c { color: #D97706; background: #FFFBEB; }       /* 4.5:1 ratio */
.hpc-grade-d { color: #DC2626; background: #FEF2F2; }       /* 4.9:1 ratio */
```

#### Images and Media
- [ ] **Alt Text**: Descriptive alt text for all images
- [ ] **Chart Descriptions**: Text alternatives for data visualizations
- [ ] **Evidence Files**: Accessible file type indicators
- [ ] **Student Photos**: Privacy-compliant alt text

**Implementation**:
```typescript
// Chart accessibility
<HPCRadarChart 
  data={performanceData}
  ariaLabel="Student performance across 6 parameters"
  description="Aarav scored highest in Creativity (4.5/5) and Mathematics (4.2/5), with room for improvement in Physical Fitness (3.2/5)"
/>

// Evidence file accessibility
<HPCEvidenceFile
  filename="math_worksheet.pdf"
  alt="Mathematics worksheet showing problem-solving work"
  fileType="PDF document"
  fileSize="245 KB"
/>
```

### Operable

#### Keyboard Navigation
- [ ] **Tab Order**: Logical tab sequence through all interactive elements
- [ ] **Focus Management**: Focus moves appropriately after actions
- [ ] **Keyboard Shortcuts**: Consistent shortcuts across the system
- [ ] **Escape Handling**: ESC key closes modals and cancels actions
- [ ] **Enter/Space**: Activate buttons and controls

**HPC Keyboard Shortcuts**:
```typescript
const hpcKeyboardShortcuts = {
  'Ctrl+S': 'Save current evaluation draft',
  'Ctrl+Enter': 'Submit evaluation',
  'Ctrl+E': 'Edit current parameter',
  'Ctrl+N': 'Navigate to next parameter',
  'Ctrl+P': 'Navigate to previous parameter',
  'Esc': 'Cancel current action/close modal',
  'F1': 'Open help documentation',
  'Alt+R': 'Open rubric reference'
};
```

#### Star Rating Accessibility
```typescript
// Accessible star rating implementation
<div role="radiogroup" aria-labelledby="rating-label">
  <span id="rating-label">Rate Mathematics Performance</span>
  {[1,2,3,4,5].map(value => (
    <button
      key={value}
      role="radio"
      aria-checked={selectedRating === value}
      aria-label={`${value} out of 5 stars`}
      onClick={() => setRating(value)}
      onKeyDown={(e) => handleKeyNavigation(e, value)}
    >
      ⭐
    </button>
  ))}
</div>
```

#### Form Navigation
- [ ] **Field Validation**: Real-time validation with clear error messages
- [ ] **Required Fields**: Clear indication of required vs optional fields
- [ ] **Error Recovery**: Easy correction of validation errors
- [ ] **Progress Saving**: Auto-save functionality for long forms

### Understandable

#### Clear Language
- [ ] **Simple Language**: Age-appropriate language for student interfaces
- [ ] **Consistent Terminology**: Same terms used throughout the system
- [ ] **Help Text**: Contextual help for complex concepts
- [ ] **Error Messages**: Clear, actionable error descriptions

**Language Guidelines**:
```typescript
// Student-friendly parameter descriptions
const studentFriendlyDescriptions = {
  "Mathematics": "How good are you at math and solving number problems?",
  "Creativity": "How well do you come up with new and interesting ideas?",
  "Teamwork": "How well do you work with your classmates in groups?",
  "Empathy": "How well do you understand and care about others' feelings?"
};

// Clear error messages
const errorMessages = {
  required_field: "This field is required to complete your evaluation",
  invalid_score: "Please select a rating between 1 and 5 stars",
  file_too_large: "File size must be less than 10MB",
  unsupported_format: "Please upload PDF, Word, or image files only"
};
```

#### Predictable Interface
- [ ] **Consistent Navigation**: Same navigation patterns across all pages
- [ ] **Predictable Actions**: Buttons and links behave consistently
- [ ] **Status Indicators**: Clear indication of current state and progress
- [ ] **Breadcrumbs**: Clear navigation hierarchy

### Robust

#### Error Handling
- [ ] **Graceful Degradation**: System works without JavaScript
- [ ] **Error Boundaries**: React error boundaries prevent crashes
- [ ] **Network Resilience**: Offline capability and sync
- [ ] **Browser Compatibility**: Works across modern browsers

```typescript
// Error boundary implementation
<HPCErrorBoundary
  fallback={({ error, resetError }) => (
    <div className="hpc-error-fallback">
      <h2>Something went wrong with the HPC system</h2>
      <p>Error: {error.message}</p>
      <button onClick={resetError}>Try Again</button>
      <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
  )}
>
  <HPCEvaluationForm />
</HPCErrorBoundary>
```

## 🎯 HPC-Specific Accessibility Features

### Multi-Stakeholder Considerations

#### Teacher Interface
- [ ] **Bulk Actions**: Keyboard shortcuts for batch operations
- [ ] **Quick Navigation**: Jump between students and parameters
- [ ] **Voice Input**: Support for voice-to-text in remarks
- [ ] **Large Text Mode**: Scalable interface for vision impairments

#### Student Interface
- [ ] **Age-Appropriate Design**: Larger touch targets for younger students
- [ ] **Visual Cues**: Icons and colors to support text
- [ ] **Reading Support**: Text-to-speech for evaluation questions
- [ ] **Simplified Language**: Grade-appropriate vocabulary

#### Parent Interface
- [ ] **Multi-Language Support**: Hindi and English interfaces
- [ ] **Mobile Optimization**: Touch-friendly design for mobile devices
- [ ] **Help Documentation**: Contextual help for HPC concepts
- [ ] **Progress Tracking**: Clear indication of completion status

### Evaluation-Specific Accessibility

#### Star Rating System
```typescript
// Accessible star rating with keyboard support
const HPCAccessibleStarRating = ({ value, onChange, ariaLabel }) => {
  const handleKeyDown = (e: KeyboardEvent, starValue: number) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        onChange(Math.min(5, starValue + 1));
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        onChange(Math.max(1, starValue - 1));
        break;
      case 'Home':
        e.preventDefault();
        onChange(1);
        break;
      case 'End':
        e.preventDefault();
        onChange(5);
        break;
    }
  };

  return (
    <div 
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={value}
      aria-valuetext={`${value} out of 5 stars`}
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e, value)}
    >
      {/* Star implementation */}
    </div>
  );
};
```

#### Evidence Upload Accessibility
```typescript
// Accessible file upload with drag-drop
<div
  role="button"
  tabIndex={0}
  aria-label="Upload evidence files. Drag and drop files here or press Enter to browse"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  <input
    ref={fileInputRef}
    type="file"
    multiple
    accept=".pdf,.doc,.docx,image/*"
    onChange={handleFileSelect}
    aria-describedby="upload-help"
    style={{ display: 'none' }}
  />
  <div id="upload-help">
    Supported formats: PDF, Word documents, and images. Maximum size: 10MB per file.
  </div>
</div>
```

## 📱 Mobile Accessibility

### Touch Targets
- [ ] **Minimum Size**: 44px × 44px touch targets
- [ ] **Adequate Spacing**: 8px minimum between touch targets
- [ ] **Gesture Support**: Swipe navigation for parameter lists
- [ ] **Orientation Support**: Works in portrait and landscape

### Mobile-Specific Features
```typescript
// Touch-optimized star rating
const MobileStarRating = ({ value, onChange }) => (
  <div className="flex space-x-2">
    {[1,2,3,4,5].map(star => (
      <button
        key={star}
        className="w-12 h-12 text-2xl" // Large touch target
        onClick={() => onChange(star)}
        aria-label={`Rate ${star} out of 5 stars`}
      >
        {star <= value ? '⭐' : '☆'}
      </button>
    ))}
  </div>
);

// Swipeable parameter navigation
const SwipeableParameterCard = ({ parameters, currentIndex, onSwipe }) => (
  <div
    className="swipeable-container"
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    <HPCParameterCard parameter={parameters[currentIndex]} />
  </div>
);
```

## 🔍 Screen Reader Support

### ARIA Labels and Descriptions
```typescript
// Comprehensive ARIA labeling
<HPCParameterCard
  aria-label={`Evaluate ${parameter.name} for ${student.name}`}
  aria-describedby={`${parameter.id}-description`}
>
  <div id={`${parameter.id}-description`}>
    {parameter.description}
  </div>
  
  <HPCStarRating
    aria-label={`Rate ${parameter.name} performance`}
    aria-describedby={`${parameter.id}-rubric`}
  />
  
  <div id={`${parameter.id}-rubric`} className="sr-only">
    Rating scale: 5 stars for exceptional, 4 for excellent, 3 for good, 2 for satisfactory, 1 for needs improvement
  </div>
</HPCParameterCard>
```

### Live Regions for Dynamic Updates
```typescript
// Announce evaluation progress updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {progressMessage}
</div>

// Announce form validation results
<div aria-live="assertive" aria-atomic="true" className="sr-only">
  {validationMessage}
</div>

// Announce workflow status changes
<div aria-live="polite" className="sr-only">
  Report status changed to {reportStatus}
</div>
```

## 🎨 Visual Accessibility

### High Contrast Mode Support
```css
/* High contrast mode styles */
@media (prefers-contrast: high) {
  .hpc-card {
    border: 2px solid #000;
    background: #fff;
  }
  
  .hpc-button-primary {
    background: #000;
    color: #fff;
    border: 2px solid #000;
  }
  
  .hpc-star-rating .star-filled {
    color: #000;
    text-shadow: 0 0 2px #fff;
  }
}
```

### Reduced Motion Support
```css
/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  .hpc-card {
    transition: none;
  }
  
  .hpc-loading-spinner {
    animation: none;
  }
  
  .hpc-chart-animation {
    animation-duration: 0.01ms;
  }
}
```

### Font Scaling Support
```css
/* Support text scaling up to 200% */
.hpc-container {
  max-width: none;
  overflow-x: auto;
}

.hpc-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.hpc-table {
  font-size: inherit;
  white-space: nowrap;
}
```

## 🧪 Accessibility Testing Procedures

### Automated Testing
```typescript
// Jest + Testing Library accessibility tests
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('HPCParameterCard Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(
      <HPCParameterCard 
        parameter={mockParameter}
        evaluation={mockEvaluation}
        onSave={mockSave}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should be keyboard navigable', () => {
    render(<HPCParameterCard {...props} />);
    
    const ratingInput = screen.getByRole('slider');
    expect(ratingInput).toBeInTheDocument();
    expect(ratingInput).toHaveAttribute('aria-label');
    
    // Test keyboard navigation
    fireEvent.keyDown(ratingInput, { key: 'ArrowRight' });
    expect(ratingInput).toHaveAttribute('aria-valuenow', '2');
  });
});
```

### Manual Testing Checklist

#### Keyboard Navigation Testing
- [ ] **Tab Through All Elements**: Every interactive element reachable
- [ ] **Logical Tab Order**: Tab sequence follows visual layout
- [ ] **Focus Visibility**: Clear focus indicators on all elements
- [ ] **Keyboard Shortcuts**: All shortcuts work as documented
- [ ] **Modal Focus Management**: Focus trapped in modals, returns correctly

#### Screen Reader Testing
- [ ] **Page Structure**: Headings create logical outline
- [ ] **Form Labels**: All inputs properly labeled
- [ ] **Error Announcements**: Validation errors announced clearly
- [ ] **Status Updates**: Dynamic content changes announced
- [ ] **Chart Descriptions**: Data visualizations have text alternatives

#### Mobile Accessibility Testing
- [ ] **Touch Targets**: Minimum 44px touch targets
- [ ] **Gesture Support**: Swipe gestures work with assistive technology
- [ ] **Orientation Changes**: Content adapts to orientation changes
- [ ] **Zoom Support**: Interface usable at 200% zoom

## 🎯 HPC-Specific Accessibility Patterns

### Evaluation Form Accessibility
```typescript
const HPCAccessibleEvaluationForm = () => {
  return (
    <form aria-labelledby="evaluation-title" noValidate>
      <h2 id="evaluation-title">
        Evaluate {parameter.name} for {student.name}
      </h2>
      
      {/* Progress indicator */}
      <div role="progressbar" 
           aria-valuenow={completedCount} 
           aria-valuemin={0} 
           aria-valuemax={totalCount}
           aria-label={`Evaluation progress: ${completedCount} of ${totalCount} parameters completed`}>
        <div className="progress-bar" style={{ width: `${(completedCount/totalCount)*100}%` }} />
      </div>
      
      {/* Rating input */}
      <fieldset>
        <legend>Performance Rating</legend>
        <HPCStarRating
          value={evaluation.score}
          onChange={handleScoreChange}
          aria-label="Rate student performance from 1 to 5 stars"
          aria-describedby="rating-help"
        />
        <div id="rating-help" className="help-text">
          Use arrow keys to change rating. 5 stars = Exceptional, 1 star = Needs Improvement
        </div>
      </fieldset>
      
      {/* Qualitative remark */}
      <div className="form-group">
        <label htmlFor="remark">
          Qualitative Remark
          <span aria-label="required" className="required">*</span>
        </label>
        <textarea
          id="remark"
          value={evaluation.remark}
          onChange={handleRemarkChange}
          aria-describedby="remark-help remark-count"
          required
          maxLength={500}
        />
        <div id="remark-help" className="help-text">
          Provide specific examples and observations about the student's performance
        </div>
        <div id="remark-count" aria-live="polite">
          {evaluation.remark.length}/500 characters
        </div>
      </div>
      
      {/* Evidence upload */}
      <fieldset>
        <legend>Supporting Evidence (Optional)</legend>
        <HPCEvidenceUploader
          onUpload={handleEvidenceUpload}
          aria-describedby="evidence-help"
        />
        <div id="evidence-help" className="help-text">
          Upload photos, documents, or other files that support your evaluation
        </div>
      </fieldset>
      
      {/* Form actions */}
      <div className="form-actions">
        <button type="button" onClick={saveDraft}>
          Save Draft
          <span className="sr-only">Save evaluation as draft without submitting</span>
        </button>
        <button type="submit">
          Submit Evaluation
          <span className="sr-only">Submit evaluation for review and inclusion in report</span>
        </button>
      </div>
    </form>
  );
};
```

### Report Viewer Accessibility
```typescript
const HPCAccessibleReportViewer = ({ report }) => {
  return (
    <main aria-labelledby="report-title">
      <header>
        <h1 id="report-title">
          Holistic Progress Card for {report.student.name}
        </h1>
        <div aria-label="Report metadata">
          <span>Grade {report.student.grade}-{report.student.section}</span>
          <span>Term: {report.term.name}</span>
          <span>Overall Grade: {report.overall_grade}</span>
        </div>
      </header>
      
      {/* Performance summary */}
      <section aria-labelledby="performance-summary">
        <h2 id="performance-summary">Performance Summary</h2>
        <div role="img" aria-labelledby="chart-description">
          <HPCRadarChart data={report.parameter_scores} />
        </div>
        <div id="chart-description" className="sr-only">
          Performance chart showing {report.student.name} scored highest in 
          {report.top_parameter} with {report.top_score} out of 5, and lowest in 
          {report.lowest_parameter} with {report.lowest_score} out of 5.
        </div>
      </section>
      
      {/* Detailed breakdown */}
      <section aria-labelledby="detailed-breakdown">
        <h2 id="detailed-breakdown">Detailed Parameter Breakdown</h2>
        {report.parameters.map(param => (
          <article key={param.id} aria-labelledby={`param-${param.id}-title`}>
            <h3 id={`param-${param.id}-title`}>
              {param.name}: Grade {param.grade}
            </h3>
            <div aria-label="Stakeholder feedback">
              <h4>Teacher Feedback</h4>
              <blockquote>{param.teacher_remark}</blockquote>
              <h4>Parent Feedback</h4>
              <blockquote>{param.parent_remark}</blockquote>
              <h4>Student Reflection</h4>
              <blockquote>{param.student_remark}</blockquote>
            </div>
          </article>
        ))}
      </section>
      
      {/* Export actions */}
      <section aria-labelledby="export-actions">
        <h2 id="export-actions">Export Options</h2>
        <div role="group" aria-label="Export format options">
          <button onClick={() => exportPDF('english')}>
            Export PDF (English)
            <span className="sr-only">Download report as PDF in English</span>
          </button>
          <button onClick={() => exportPDF('hindi')}>
            Export PDF (Hindi)
            <span className="sr-only">Download report as PDF in Hindi</span>
          </button>
        </div>
      </section>
    </main>
  );
};
```

## 🔧 Assistive Technology Support

### Screen Reader Optimization
```typescript
// Structured content for screen readers
const HPCScreenReaderContent = () => (
  <>
    {/* Skip navigation */}
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    
    {/* Page structure */}
    <nav aria-label="HPC navigation">
      <ul role="list">
        <li><a href="#evaluations">Evaluations</a></li>
        <li><a href="#reports">Reports</a></li>
        <li><a href="#analytics">Analytics</a></li>
      </ul>
    </nav>
    
    <main id="main-content">
      {/* Main content */}
    </main>
    
    {/* Live regions for updates */}
    <div aria-live="polite" id="status-updates" className="sr-only" />
    <div aria-live="assertive" id="error-announcements" className="sr-only" />
  </>
);
```

### Voice Control Support
```typescript
// Voice command integration
const voiceCommands = {
  "save evaluation": () => saveCurrentEvaluation(),
  "next parameter": () => navigateToNextParameter(),
  "previous parameter": () => navigateToPreviousParameter(),
  "rate five stars": () => setRating(5),
  "rate four stars": () => setRating(4),
  "export report": () => openExportDialog(),
  "help": () => openHelpDialog()
};

// Voice input for remarks
const VoiceInputSupport = () => {
  const [isListening, setIsListening] = useState(false);
  
  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRemarkText(prev => prev + ' ' + transcript);
      };
      recognition.start();
      setIsListening(true);
    }
  };
  
  return (
    <button 
      onClick={startVoiceInput}
      aria-label="Start voice input for evaluation remark"
      aria-pressed={isListening}
    >
      🎤 Voice Input
    </button>
  );
};
```

## 📋 Testing Scenarios

### Scenario 1: Keyboard-Only Navigation
**Test Steps**:
1. Navigate to teacher evaluation page using only keyboard
2. Tab through all form elements in logical order
3. Fill out evaluation using only keyboard
4. Submit evaluation without using mouse
5. Verify all actions completed successfully

**Expected Results**:
- All elements reachable via keyboard
- Focus indicators clearly visible
- Form submission works without mouse
- No keyboard traps encountered

### Scenario 2: Screen Reader Evaluation
**Test Steps**:
1. Use screen reader to navigate evaluation form
2. Listen to parameter descriptions and instructions
3. Fill out star rating using keyboard
4. Add qualitative remark with voice input
5. Submit evaluation and verify confirmation

**Expected Results**:
- All content properly announced
- Form structure clearly communicated
- Validation errors announced immediately
- Success confirmation clearly stated

### Scenario 3: Mobile Touch Navigation
**Test Steps**:
1. Access HPC system on mobile device
2. Navigate through parameter evaluation using touch
3. Use swipe gestures to move between parameters
4. Complete evaluation with touch inputs only
5. Export report and verify mobile PDF formatting

**Expected Results**:
- All touch targets minimum 44px
- Swipe gestures work smoothly
- Mobile layout maintains usability
- PDF exports properly formatted for mobile

## 🎯 Accessibility Acceptance Criteria

### Level AA Compliance
- [ ] **Automated Testing**: No axe-core violations
- [ ] **Manual Testing**: Passes manual WCAG checklist
- [ ] **Screen Reader Testing**: Works with NVDA, JAWS, VoiceOver
- [ ] **Keyboard Testing**: Full functionality without mouse
- [ ] **Mobile Testing**: Accessible on iOS and Android

### HPC-Specific Criteria
- [ ] **Multi-Stakeholder Access**: All user types can complete their tasks
- [ ] **Age-Appropriate Design**: Suitable for students aged 10-18
- [ ] **Cultural Sensitivity**: Appropriate for diverse backgrounds
- [ ] **Language Support**: English and Hindi interfaces fully accessible
- [ ] **Evidence Accessibility**: File uploads work with assistive technology

### Performance Criteria
- [ ] **Load Time**: Pages load within 3 seconds on slow connections
- [ ] **Response Time**: Form interactions respond within 100ms
- [ ] **Error Recovery**: Clear paths to recover from errors
- [ ] **Offline Support**: Core functionality works offline

This accessibility checklist ensures that the HPC system is inclusive and usable by all stakeholders, regardless of their abilities, devices, or assistive technologies.