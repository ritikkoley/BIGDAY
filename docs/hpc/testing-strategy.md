# HPC Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the Holistic Progress Card (HPC) system, covering unit tests, integration tests, accessibility tests, and end-to-end user scenarios.

## 🧪 Testing Pyramid

### Unit Tests (70% of test coverage)
**Purpose**: Test individual components and functions in isolation

**Scope**:
- Component rendering and props validation
- Hook functionality and state management
- Utility function correctness
- Validation logic accuracy
- Calculation algorithms

**Tools**: Jest, React Testing Library, @testing-library/user-event

### Integration Tests (20% of test coverage)
**Purpose**: Test component interactions and data flow

**Scope**:
- Form submission workflows
- API integration patterns
- Real-time subscription handling
- State management across components
- Error boundary behavior

**Tools**: Jest, React Testing Library, MSW (Mock Service Worker)

### End-to-End Tests (10% of test coverage)
**Purpose**: Test complete user workflows

**Scope**:
- Teacher evaluation submission
- Student self-assessment completion
- Report approval workflow
- PDF export functionality
- Multi-stakeholder collaboration

**Tools**: Playwright, Cypress (alternative)

## 🎯 Component Testing Specifications

### HPCStarRating Component Tests

```typescript
// tests/hpc/components/HPCStarRating.test.tsx
describe('HPCStarRating', () => {
  const defaultProps = {
    value: 3,
    max: 5,
    onChange: jest.fn(),
    ariaLabel: 'Rate performance'
  };

  describe('Rendering', () => {
    test('renders correct number of stars', () => {
      render(<HPCStarRating {...defaultProps} />);
      expect(screen.getAllByRole('button')).toHaveLength(5);
    });

    test('displays current value correctly', () => {
      render(<HPCStarRating {...defaultProps} value={4} showValue />);
      expect(screen.getByText('4/5')).toBeInTheDocument();
    });

    test('shows grade when enabled', () => {
      render(<HPCStarRating {...defaultProps} value={4.2} showGrade />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('calls onChange when star is clicked', () => {
      const onChange = jest.fn();
      render(<HPCStarRating {...defaultProps} onChange={onChange} />);
      
      fireEvent.click(screen.getAllByRole('button')[3]); // 4th star
      expect(onChange).toHaveBeenCalledWith(4);
    });

    test('supports keyboard navigation', () => {
      const onChange = jest.fn();
      render(<HPCStarRating {...defaultProps} onChange={onChange} />);
      
      const ratingGroup = screen.getByRole('radiogroup');
      fireEvent.keyDown(ratingGroup, { key: 'ArrowRight' });
      expect(onChange).toHaveBeenCalledWith(4);
      
      fireEvent.keyDown(ratingGroup, { key: 'Home' });
      expect(onChange).toHaveBeenCalledWith(1);
      
      fireEvent.keyDown(ratingGroup, { key: 'End' });
      expect(onChange).toHaveBeenCalledWith(5);
    });

    test('does not call onChange when readonly', () => {
      const onChange = jest.fn();
      render(<HPCStarRating {...defaultProps} onChange={onChange} readonly />);
      
      fireEvent.click(screen.getAllByRole('button')[0]);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      render(<HPCStarRating {...defaultProps} />);
      
      const ratingGroup = screen.getByRole('radiogroup');
      expect(ratingGroup).toHaveAttribute('aria-label', 'Rate performance');
      
      const stars = screen.getAllByRole('radio');
      expect(stars[0]).toHaveAttribute('aria-label', '1 out of 5 stars');
      expect(stars[3]).toHaveAttribute('aria-checked', 'true');
    });

    test('meets color contrast requirements', async () => {
      const { container } = render(<HPCStarRating {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### HPCParameterCard Component Tests

```typescript
// tests/hpc/components/HPCParameterCard.test.tsx
describe('HPCParameterCard', () => {
  const mockParameter = {
    id: 'hpc-param-001',
    name: 'Mathematics',
    category: 'scholastic',
    description: 'Mathematical reasoning and problem-solving',
    weightage: 0.20
  };

  const mockEvaluation = {
    id: 'eval-001',
    score: 4.2,
    grade: 'A',
    qualitative_remark: 'Excellent problem-solving skills',
    confidence_level: 0.95
  };

  describe('Form Validation', () => {
    test('validates required fields', async () => {
      const onSave = jest.fn();
      render(
        <HPCParameterCard 
          parameter={mockParameter}
          onSave={onSave}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/rating is required/i)).toBeInTheDocument();
        expect(screen.getByText(/remark is required/i)).toBeInTheDocument();
      });

      expect(onSave).not.toHaveBeenCalled();
    });

    test('validates remark length', async () => {
      render(<HPCParameterCard parameter={mockParameter} onSave={jest.fn()} />);
      
      const remarkInput = screen.getByLabelText(/qualitative remark/i);
      fireEvent.change(remarkInput, { target: { value: 'Too short' } });
      
      await waitFor(() => {
        expect(screen.getByText(/minimum 10 characters/i)).toBeInTheDocument();
      });
    });

    test('validates score range', async () => {
      render(<HPCParameterCard parameter={mockParameter} onSave={jest.fn()} />);
      
      // Try to set invalid score
      const ratingInput = screen.getByRole('radiogroup');
      fireEvent.keyDown(ratingInput, { key: 'ArrowUp' }); // Beyond max
      
      await waitFor(() => {
        expect(screen.getByText(/score must be between 1 and 5/i)).toBeInTheDocument();
      });
    });
  });

  describe('Auto-save Functionality', () => {
    test('auto-saves draft after delay', async () => {
      jest.useFakeTimers();
      const onSave = jest.fn();
      
      render(<HPCParameterCard parameter={mockParameter} onSave={onSave} />);
      
      const remarkInput = screen.getByLabelText(/qualitative remark/i);
      fireEvent.change(remarkInput, { target: { value: 'This is a test remark' } });
      
      // Fast-forward time to trigger auto-save
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            qualitative_remark: 'This is a test remark',
            status: 'draft'
          })
        );
      });
      
      jest.useRealTimers();
    });
  });
});
```

## 🔄 Integration Testing Scenarios

### Teacher Evaluation Workflow Test

```typescript
// tests/hpc/integration/teacher-evaluation-flow.test.tsx
describe('Teacher Evaluation Workflow', () => {
  beforeEach(() => {
    // Setup mock API responses
    server.use(
      rest.get('/api/hpc/parameters', (req, res, ctx) => {
        return res(ctx.json({ success: true, data: mockParameters }));
      }),
      rest.post('/api/hpc/evaluations', (req, res, ctx) => {
        return res(ctx.json({ success: true, data: mockEvaluation }));
      })
    );
  });

  test('complete teacher evaluation submission', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/teacher/hpc/input/hpc-student-001']}>
        <HPCEvaluationInputPage />
      </MemoryRouter>
    );

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
    });

    // Select first parameter
    await user.click(screen.getByText('Mathematics'));

    // Fill out evaluation
    const ratingButtons = screen.getAllByRole('radio');
    await user.click(ratingButtons[3]); // 4 stars

    const remarkInput = screen.getByLabelText(/qualitative remark/i);
    await user.type(remarkInput, 'Excellent mathematical reasoning and problem-solving ability');

    // Set confidence level
    const confidenceSlider = screen.getByRole('slider', { name: /confidence/i });
    fireEvent.change(confidenceSlider, { target: { value: '95' } });

    // Submit evaluation
    await user.click(screen.getByRole('button', { name: /submit evaluation/i }));

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/evaluation submitted successfully/i)).toBeInTheDocument();
    });

    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/hpc/evaluations',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            student_id: 'hpc-student-001',
            parameter_id: 'hpc-param-001',
            score: 4,
            qualitative_remark: 'Excellent mathematical reasoning and problem-solving ability',
            confidence_level: 0.95,
            status: 'submitted'
          })
        })
      );
    });
  });

  test('handles network errors gracefully', async () => {
    // Mock network error
    server.use(
      rest.post('/api/hpc/evaluations', (req, res, ctx) => {
        return res.networkError('Network error');
      })
    );

    const user = userEvent.setup();
    render(<HPCEvaluationInputPage />);

    // Fill and submit form
    await user.click(screen.getByText('Mathematics'));
    await user.click(screen.getAllByRole('radio')[3]);
    await user.type(screen.getByLabelText(/remark/i), 'Test remark');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});
```

### Report Compilation Test

```typescript
// tests/hpc/integration/report-compilation.test.tsx
describe('Report Compilation', () => {
  test('compiles report from multiple evaluations', async () => {
    const mockEvaluations = [
      {
        parameter_id: 'hpc-param-001',
        evaluator_role: 'teacher',
        score: 4.2,
        weightage: 0.7
      },
      {
        parameter_id: 'hpc-param-001', 
        evaluator_role: 'parent',
        score: 4.0,
        weightage: 0.2
      },
      {
        parameter_id: 'hpc-param-001',
        evaluator_role: 'self',
        score: 3.8,
        weightage: 0.1
      }
    ];

    server.use(
      rest.post('/functions/v1/hpc/compile-report', (req, res, ctx) => {
        return res(ctx.json({
          success: true,
          report_id: 'hpc-report-001',
          compilation_stats: {
            total_evaluations: 3,
            parameters_covered: 1,
            stakeholder_coverage: 100,
            quality_score: 0.95
          }
        }));
      })
    );

    const { result } = renderHook(() => useHPCReports());

    await act(async () => {
      await result.current.compileReport('hpc-student-001', 'term-2025-1');
    });

    expect(result.current.reports).toHaveLength(1);
    expect(result.current.reports[0].overall_score).toBeCloseTo(4.12); // Weighted average
  });
});
```

## ♿ Accessibility Testing

### Automated Accessibility Tests

```typescript
// tests/hpc/accessibility/automated-a11y.test.tsx
describe('HPC Accessibility', () => {
  test('HPCEvaluationForm has no accessibility violations', async () => {
    const { container } = render(
      <HPCEvaluationForm 
        parameter={mockParameter}
        onSave={jest.fn()}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('HPCReportViewer meets accessibility standards', async () => {
    const { container } = render(
      <HPCReportViewer report={mockReport} />
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-labels': { enabled: true }
      }
    });

    expect(results).toHaveNoViolations();
  });
});
```

### Keyboard Navigation Tests

```typescript
// tests/hpc/accessibility/keyboard-navigation.test.tsx
describe('Keyboard Navigation', () => {
  test('star rating navigable with keyboard', async () => {
    const onChange = jest.fn();
    render(<HPCStarRating value={3} onChange={onChange} />);

    const ratingGroup = screen.getByRole('radiogroup');
    ratingGroup.focus();

    // Test arrow key navigation
    fireEvent.keyDown(ratingGroup, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(4);

    fireEvent.keyDown(ratingGroup, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(2);

    // Test home/end keys
    fireEvent.keyDown(ratingGroup, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(1);

    fireEvent.keyDown(ratingGroup, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  test('evaluation form tab order is logical', () => {
    render(<HPCEvaluationForm parameter={mockParameter} onSave={jest.fn()} />);

    const tabbableElements = screen.getAllByRole('button')
      .concat(screen.getAllByRole('textbox'))
      .concat(screen.getAllByRole('slider'));

    // Verify tab order matches visual layout
    tabbableElements.forEach((element, index) => {
      expect(element).toHaveAttribute('tabIndex', index === 0 ? '0' : '-1');
    });
  });

  test('modal focus management works correctly', async () => {
    const user = userEvent.setup();
    
    render(<HPCParameterForm onClose={jest.fn()} />);

    // Focus should be trapped in modal
    const modal = screen.getByRole('dialog');
    const firstInput = within(modal).getAllByRole('textbox')[0];
    const lastButton = within(modal).getAllByRole('button').slice(-1)[0];

    // Tab from last element should cycle to first
    lastButton.focus();
    await user.tab();
    expect(firstInput).toHaveFocus();

    // Shift+Tab from first element should go to last
    await user.tab({ shift: true });
    expect(lastButton).toHaveFocus();
  });
});
```

### Screen Reader Tests

```typescript
// tests/hpc/accessibility/screen-reader.test.tsx
describe('Screen Reader Support', () => {
  test('announces form validation errors', async () => {
    const user = userEvent.setup();
    render(<HPCEvaluationForm parameter={mockParameter} onSave={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Check for live region announcements
    const errorRegion = screen.getByRole('alert');
    expect(errorRegion).toHaveTextContent(/rating is required/i);
    expect(errorRegion).toHaveAttribute('aria-live', 'assertive');
  });

  test('provides chart descriptions for screen readers', () => {
    render(<HPCRadarChart data={mockChartData} />);

    const chartDescription = screen.getByText(/performance chart showing/i);
    expect(chartDescription).toHaveClass('sr-only');
    
    const chart = screen.getByRole('img');
    expect(chart).toHaveAttribute('aria-describedby');
  });

  test('announces progress updates', async () => {
    const { rerender } = render(
      <HPCProgressTracker completed={2} total={6} />
    );

    const progressRegion = screen.getByRole('progressbar');
    expect(progressRegion).toHaveAttribute('aria-valuenow', '2');
    expect(progressRegion).toHaveAttribute('aria-valuemax', '6');

    // Update progress
    rerender(<HPCProgressTracker completed={3} total={6} />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveTextContent(/3 of 6 parameters completed/i);
  });
});
```

## 🔄 End-to-End Testing Scenarios

### Complete Teacher Evaluation Flow

```typescript
// tests/hpc/e2e/teacher-evaluation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Teacher Evaluation Flow', () => {
  test('teacher can complete full evaluation cycle', async ({ page }) => {
    // Login as teacher
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'teacher@dpsb.edu');
    await page.fill('[data-testid="password"]', 'teacher123');
    await page.click('[data-testid="login-button"]');

    // Navigate to HPC evaluations
    await page.click('[data-testid="hpc-tab"]');
    await expect(page).toHaveURL('/teacher/hpc/dashboard');

    // Select student for evaluation
    await page.click('[data-testid="student-aarav-sharma"]');
    await expect(page).toHaveURL('/teacher/hpc/input/hpc-student-001');

    // Verify student header information
    await expect(page.locator('[data-testid="student-name"]')).toHaveText('Aarav Sharma');
    await expect(page.locator('[data-testid="student-grade"]')).toHaveText('Grade 5-A');

    // Select Mathematics parameter
    await page.click('[data-testid="parameter-mathematics"]');

    // Fill out evaluation
    await page.click('[data-testid="star-4"]'); // 4 out of 5 stars
    await page.fill('[data-testid="qualitative-remark"]', 
      'Aarav demonstrates excellent mathematical reasoning and problem-solving skills. He consistently scores high on assessments and helps his classmates understand difficult concepts.');

    // Set confidence level
    await page.fill('[data-testid="confidence-slider"]', '95');

    // Upload evidence
    await page.setInputFiles('[data-testid="evidence-upload"]', 'test-files/math-assessment.pdf');
    await expect(page.locator('[data-testid="uploaded-file"]')).toContainText('math-assessment.pdf');

    // Save draft first
    await page.click('[data-testid="save-draft"]');
    await expect(page.locator('[data-testid="save-status"]')).toHaveText('Draft saved');

    // Submit evaluation
    await page.click('[data-testid="submit-evaluation"]');
    await expect(page.locator('[data-testid="success-message"]')).toHaveText('Evaluation submitted successfully');

    // Verify progress update
    await expect(page.locator('[data-testid="progress-indicator"]')).toHaveText('1 of 6 parameters completed');

    // Verify parameter marked as completed
    await expect(page.locator('[data-testid="parameter-mathematics"]')).toHaveClass(/completed/);
  });

  test('teacher can use bulk evaluation features', async ({ page }) => {
    await page.goto('/teacher/hpc/bulk-evaluation');

    // Select multiple students
    await page.check('[data-testid="student-checkbox-001"]');
    await page.check('[data-testid="student-checkbox-002"]');
    await page.check('[data-testid="student-checkbox-003"]');

    // Select parameter
    await page.selectOption('[data-testid="parameter-select"]', 'hpc-param-001');

    // Use template for bulk input
    await page.click('[data-testid="use-template"]');
    await page.fill('[data-testid="template-remark"]', 'Shows good understanding of mathematical concepts');

    // Apply to all selected students
    await page.click('[data-testid="apply-template"]');

    // Verify all students have template applied
    const studentRows = page.locator('[data-testid^="student-row-"]');
    await expect(studentRows).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      await expect(studentRows.nth(i).locator('[data-testid="remark-input"]'))
        .toHaveValue('Shows good understanding of mathematical concepts');
    }

    // Submit bulk evaluations
    await page.click('[data-testid="submit-bulk"]');
    await expect(page.locator('[data-testid="bulk-success"]'))
      .toHaveText('3 evaluations submitted successfully');
  });
});
```

### Student Self-Assessment Flow

```typescript
// tests/hpc/e2e/student-self-assessment.spec.ts
test.describe('Student Self-Assessment', () => {
  test('student can complete self-assessment', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'student@dpsb.edu');
    await page.fill('[data-testid="password"]', 'student123');
    await page.click('[data-testid="login-button"]');

    // Navigate to self-assessment
    await page.click('[data-testid="hpc-tab"]');
    await page.click('[data-testid="self-assessment-link"]');

    // Select mood emoji
    await page.click('[data-testid="emoji-confident"]'); // 💪
    await expect(page.locator('[data-testid="selected-mood"]')).toHaveText('Confident');

    // Fill strengths
    await page.fill('[data-testid="strengths-input"]', 
      'I am good at solving math puzzles and helping my friends when they don\'t understand something. I also like drawing and making art projects.');

    // Fill improvement areas
    await page.fill('[data-testid="improvements-input"]',
      'I want to get better at sports and speaking in front of the class without feeling nervous.');

    // Set goals
    await page.click('[data-testid="add-goal"]');
    await page.fill('[data-testid="goal-input-0"]', 'Improve physical fitness');
    await page.click('[data-testid="add-goal"]');
    await page.fill('[data-testid="goal-input-1"]', 'Help more classmates');

    // Preview reflection
    await page.click('[data-testid="preview-reflection"]');
    await expect(page.locator('[data-testid="preview-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-content"]')).toContainText('I am good at solving math puzzles');

    // Submit assessment
    await page.click('[data-testid="close-preview"]');
    await page.click('[data-testid="submit-assessment"]');

    // Verify confirmation
    await expect(page.locator('[data-testid="submission-success"]'))
      .toHaveText('Your self-assessment has been submitted successfully!');
  });
});
```

### Report Approval Workflow

```typescript
// tests/hpc/e2e/approval-workflow.spec.ts
test.describe('Report Approval Workflow', () => {
  test('complete approval workflow from draft to published', async ({ page }) => {
    // Login as class teacher (first approver)
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'teacher@dpsb.edu');
    await page.fill('[data-testid="password"]', 'teacher123');
    await page.click('[data-testid="login-button"]');

    // Navigate to review console
    await page.goto('/admin/hpc/review/hpc-student-001');

    // Verify report details
    await expect(page.locator('[data-testid="student-name"]')).toHaveText('Aarav Sharma');
    await expect(page.locator('[data-testid="report-status"]')).toHaveText('Under Review');
    await expect(page.locator('[data-testid="overall-grade"]')).toHaveText('A');

    // Review raw evaluations
    await page.click('[data-testid="view-raw-evaluations"]');
    await expect(page.locator('[data-testid="teacher-evaluation"]')).toContainText('Excellent mathematical reasoning');
    await expect(page.locator('[data-testid="parent-evaluation"]')).toContainText('Shows strong interest at home');

    // Add reviewer comments
    await page.fill('[data-testid="reviewer-comments"]', 
      'Report is comprehensive and accurately reflects student performance. All stakeholder inputs are well-documented.');

    // Approve report
    await page.click('[data-testid="approve-button"]');
    await expect(page.locator('[data-testid="approval-success"]'))
      .toHaveText('Report approved and forwarded to principal');

    // Verify workflow advancement
    await expect(page.locator('[data-testid="workflow-step-1"]')).toHaveClass(/completed/);
    await expect(page.locator('[data-testid="workflow-step-2"]')).toHaveClass(/active/);

    // Login as principal (second approver)
    await page.click('[data-testid="logout"]');
    await page.fill('[data-testid="email"]', 'admin@dpsb.edu');
    await page.fill('[data-testid="password"]', 'admin123');
    await page.click('[data-testid="login-button"]');

    // Navigate back to review console
    await page.goto('/admin/hpc/review/hpc-student-001');

    // Final approval
    await page.click('[data-testid="final-approve-button"]');
    await expect(page.locator('[data-testid="publish-success"]'))
      .toHaveText('Report published successfully');

    // Verify final status
    await expect(page.locator('[data-testid="report-status"]')).toHaveText('Published');
    await expect(page.locator('[data-testid="export-actions"]')).toBeVisible();
  });

  test('handles approval rejection workflow', async ({ page }) => {
    await page.goto('/admin/hpc/review/hpc-student-002');

    // Reject report with comments
    await page.fill('[data-testid="reviewer-comments"]', 
      'Please provide more detailed evidence for creativity assessment. Parent feedback is missing for teamwork parameter.');
    
    await page.click('[data-testid="reject-button"]');
    
    // Verify rejection handling
    await expect(page.locator('[data-testid="rejection-success"]'))
      .toHaveText('Report returned to teacher for revision');
    
    await expect(page.locator('[data-testid="report-status"]')).toHaveText('Needs Revision');
  });
});
```

## 📊 Performance Testing

### Load Testing Scenarios

```typescript
// tests/hpc/performance/load-testing.test.ts
describe('HPC Performance', () => {
  test('handles multiple concurrent evaluations', async () => {
    const startTime = performance.now();
    
    // Simulate 50 concurrent evaluation submissions
    const promises = Array.from({ length: 50 }, (_, i) => 
      submitEvaluation({
        student_id: `student-${i}`,
        parameter_id: 'hpc-param-001',
        score: 4.0,
        qualitative_remark: 'Test evaluation remark'
      })
    );

    const results = await Promise.allSettled(promises);
    const endTime = performance.now();

    // Verify performance requirements
    expect(endTime - startTime).toBeLessThan(5000); // Under 5 seconds
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(50);
  });

  test('report compilation performance', async () => {
    const startTime = performance.now();
    
    // Compile report with 17 parameters, 4 stakeholders each
    const reportId = await compileReport('hpc-student-001', 'term-2025-1');
    
    const endTime = performance.now();
    
    // Verify compilation time under 3 seconds
    expect(endTime - startTime).toBeLessThan(3000);
    expect(reportId).toBeDefined();
  });

  test('PDF export performance', async () => {
    const startTime = performance.now();
    
    const pdfUrl = await exportReportToPDF('hpc-report-001', {
      language: 'english',
      include_charts: true,
      include_signatures: true
    });
    
    const endTime = performance.now();
    
    // Verify export time under 10 seconds
    expect(endTime - startTime).toBeLessThan(10000);
    expect(pdfUrl).toMatch(/\.pdf$/);
  });
});
```

## 🎯 User Acceptance Testing

### Teacher UAT Scenarios

```typescript
// tests/hpc/uat/teacher-scenarios.test.ts
describe('Teacher User Acceptance', () => {
  test('Teacher can evaluate 30 students efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/teacher/hpc/bulk-evaluation');
    
    // Select all students in class
    await page.click('[data-testid="select-all-students"]');
    await expect(page.locator('[data-testid="selected-count"]')).toHaveText('30 students selected');
    
    // Select parameter
    await page.selectOption('[data-testid="parameter-select"]', 'Mathematics');
    
    // Use quick evaluation mode
    await page.click('[data-testid="quick-mode"]');
    
    // Apply bulk rating
    await page.click('[data-testid="bulk-rating-4"]'); // 4 stars for all
    
    // Add common remark
    await page.fill('[data-testid="bulk-remark"]', 
      'Students show good understanding of mathematical concepts covered this term.');
    
    // Submit bulk evaluation
    await page.click('[data-testid="submit-bulk"]');
    
    await expect(page.locator('[data-testid="bulk-success"]'))
      .toHaveText('30 evaluations submitted successfully');
    
    const endTime = Date.now();
    
    // Verify efficiency - should complete in under 2 minutes
    expect(endTime - startTime).toBeLessThan(120000);
  });

  test('Teacher can handle evaluation conflicts', async ({ page }) => {
    await page.goto('/teacher/hpc/input/hpc-student-001');
    
    // Start evaluation
    await page.click('[data-testid="parameter-mathematics"]');
    await page.fill('[data-testid="qualitative-remark"]', 'Starting evaluation...');
    
    // Simulate another teacher editing same evaluation
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('hpc-conflict', {
        detail: {
          type: 'concurrent_edit',
          evaluator: 'Dr. Sarah Johnson',
          timestamp: new Date().toISOString()
        }
      }));
    });
    
    // Verify conflict notification
    await expect(page.locator('[data-testid="conflict-warning"]'))
      .toHaveText('Dr. Sarah Johnson is also editing this evaluation');
    
    // Verify save is disabled during conflict
    await expect(page.locator('[data-testid="save-button"]')).toBeDisabled();
    
    // Resolve conflict
    await page.click('[data-testid="resolve-conflict"]');
    await expect(page.locator('[data-testid="save-button"]')).toBeEnabled();
  });
});
```

### Student UAT Scenarios

```typescript
// tests/hpc/uat/student-scenarios.test.ts
describe('Student User Acceptance', () => {
  test('Grade 5 student can complete age-appropriate self-assessment', async ({ page }) => {
    await page.goto('/student/hpc/self');
    
    // Verify age-appropriate interface
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('Tell us about your learning journey');
    
    // Select mood with emoji
    await page.click('[data-testid="emoji-happy"]');
    await expect(page.locator('[data-testid="mood-feedback"]'))
      .toHaveText('Great! You\'re feeling positive about learning');
    
    // Fill strengths with character guidance
    const strengthsInput = page.locator('[data-testid="strengths-input"]');
    await strengthsInput.fill('I like math puzzles and helping friends');
    
    await expect(page.locator('[data-testid="character-count"]'))
      .toHaveText('42/200 characters');
    
    // Set goals with suggestions
    await page.click('[data-testid="goal-suggestion-fitness"]');
    await page.click('[data-testid="goal-suggestion-reading"]');
    
    await expect(page.locator('[data-testid="selected-goals"]'))
      .toContainText('Improve physical fitness');
    
    // Preview before submission
    await page.click('[data-testid="preview-assessment"]');
    await expect(page.locator('[data-testid="preview-modal"]')).toBeVisible();
    
    // Submit assessment
    await page.click('[data-testid="submit-assessment"]');
    await expect(page.locator('[data-testid="success-animation"]')).toBeVisible();
  });
});
```

## 📱 Mobile Testing Strategy

### Responsive Design Tests

```typescript
// tests/hpc/mobile/responsive.test.ts
describe('Mobile Responsiveness', () => {
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(viewport => {
    test(`HPC interface works on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/teacher/hpc/input/hpc-student-001');

      // Verify responsive layout
      if (viewport.width < 768) {
        // Mobile layout
        await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
        await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeHidden();
      } else {
        // Desktop layout
        await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeVisible();
        await expect(page.locator('[data-testid="mobile-nav"]')).toBeHidden();
      }

      // Verify touch targets on mobile
      if (viewport.width < 768) {
        const touchTargets = page.locator('[data-testid^="touch-target-"]');
        const count = await touchTargets.count();
        
        for (let i = 0; i < count; i++) {
          const target = touchTargets.nth(i);
          const box = await target.boundingBox();
          expect(box?.width).toBeGreaterThanOrEqual(44);
          expect(box?.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });
});
```

### Touch Interaction Tests

```typescript
// tests/hpc/mobile/touch-interactions.test.ts
describe('Touch Interactions', () => {
  test('swipe navigation works on parameter cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/teacher/hpc/input/hpc-student-001');

    // Verify swipe navigation
    const parameterCard = page.locator('[data-testid="parameter-card"]');
    
    // Swipe left to next parameter
    await parameterCard.hover();
    await page.mouse.down();
    await page.mouse.move(-100, 0);
    await page.mouse.up();
    
    await expect(page.locator('[data-testid="active-parameter"]'))
      .toHaveText('Creativity & Innovation');
    
    // Swipe right to previous parameter
    await parameterCard.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0);
    await page.mouse.up();
    
    await expect(page.locator('[data-testid="active-parameter"]'))
      .toHaveText('Mathematics');
  });
});
```

## 🔍 Data Validation Testing

### Input Validation Tests

```typescript
// tests/hpc/validation/input-validation.test.tsx
describe('HPC Input Validation', () => {
  test('validates evaluation score boundaries', () => {
    const validation = validateEvaluationScore(6); // Invalid - above max
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Score must be between 1 and 5');

    const validScore = validateEvaluationScore(4.2);
    expect(validScore.isValid).toBe(true);
  });

  test('validates qualitative remark requirements', () => {
    const shortRemark = validateQualitativeRemark('Too short');
    expect(shortRemark.isValid).toBe(false);
    expect(shortRemark.errors).toContain('Remark must be at least 10 characters');

    const validRemark = validateQualitativeRemark('This is a comprehensive evaluation remark with sufficient detail');
    expect(validRemark.isValid).toBe(true);
  });

  test('validates evidence file types and sizes', () => {
    const invalidFile = new File(['content'], 'test.exe', { type: 'application/exe' });
    const validation = validateEvidenceFile(invalidFile);
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('File type not supported');

    const validFile = new File(['content'], 'evidence.pdf', { type: 'application/pdf' });
    const validValidation = validateEvidenceFile(validFile);
    expect(validValidation.isValid).toBe(true);
  });
});
```

## 📋 Manual Testing Checklists

### Teacher Evaluation Checklist
- [ ] Can access assigned students only
- [ ] Parameter list shows correct assignments
- [ ] Star rating works with mouse and keyboard
- [ ] Qualitative remarks save automatically
- [ ] Evidence upload supports all file types
- [ ] Confidence slider updates correctly
- [ ] Validation prevents invalid submissions
- [ ] Progress tracker updates in real-time
- [ ] Bulk evaluation features work efficiently
- [ ] Can save drafts and return later

### Student Self-Assessment Checklist
- [ ] Age-appropriate language and interface
- [ ] Emoji selector works on touch devices
- [ ] Text areas have character limits
- [ ] Goal setting with suggestions works
- [ ] Preview shows accurate reflection
- [ ] Submission confirmation is clear
- [ ] Can only access own assessment
- [ ] Mobile interface is fully functional

### Report Viewer Checklist
- [ ] Report displays all evaluation data
- [ ] Charts render correctly
- [ ] Stakeholder feedback is organized
- [ ] Export options work properly
- [ ] PDF maintains formatting
- [ ] Print styles are optimized
- [ ] Mobile view is readable
- [ ] Accessibility features work

### Admin Configuration Checklist
- [ ] Can create and edit parameters
- [ ] Rubric editor saves versions correctly
- [ ] Weightings validate to 100%
- [ ] Audit log shows all changes
- [ ] Export/import functions work
- [ ] Bulk operations complete successfully
- [ ] System reports generate accurately

## 🎯 Acceptance Criteria

### Functional Acceptance
- [ ] All user roles can complete their assigned tasks
- [ ] Evaluation aggregation produces correct results
- [ ] Approval workflow enforces proper authorization
- [ ] Reports compile all data accurately
- [ ] Export generates properly formatted outputs
- [ ] Real-time updates work reliably across sessions

### Performance Acceptance
- [ ] Page load times under 2 seconds
- [ ] Form submissions under 1 second
- [ ] Report compilation under 5 seconds
- [ ] PDF generation under 10 seconds
- [ ] Real-time updates under 500ms latency
- [ ] Mobile performance matches desktop

### Accessibility Acceptance
- [ ] WCAG 2.1 AA compliance verified
- [ ] Full keyboard navigation support
- [ ] Screen reader compatibility confirmed
- [ ] Color contrast requirements met
- [ ] Mobile accessibility standards met

### Security Acceptance
- [ ] Role-based access controls enforced
- [ ] Data privacy rules implemented
- [ ] Input sanitization prevents XSS
- [ ] File upload security validated
- [ ] API authorization working correctly

This comprehensive testing strategy ensures that the HPC system meets all functional, performance, accessibility, and security requirements while providing a robust foundation for ongoing maintenance and enhancement.