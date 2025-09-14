# HPC Visual Design Tokens

## Overview

This document defines the visual design system for the Holistic Progress Card (HPC) interface, ensuring consistency with the existing BIG DAY portal while establishing HPC-specific design patterns.

## 🎨 Color System

### Primary Color Palette
```css
/* HPC Brand Colors */
:root {
  /* Primary - Used for main actions and navigation */
  --hpc-primary-50: #EFF6FF;
  --hpc-primary-100: #DBEAFE;
  --hpc-primary-200: #BFDBFE;
  --hpc-primary-300: #93C5FD;
  --hpc-primary-400: #60A5FA;
  --hpc-primary-500: #3B82F6;  /* Main brand color */
  --hpc-primary-600: #2563EB;
  --hpc-primary-700: #1D4ED8;
  --hpc-primary-800: #1E40AF;
  --hpc-primary-900: #1E3A8A;

  /* Secondary - Used for supporting elements */
  --hpc-secondary-50: #FAF5FF;
  --hpc-secondary-100: #F3E8FF;
  --hpc-secondary-200: #E9D5FF;
  --hpc-secondary-300: #D8B4FE;
  --hpc-secondary-400: #C084FC;
  --hpc-secondary-500: #A855F7;
  --hpc-secondary-600: #9333EA;
  --hpc-secondary-700: #7C3AED;
  --hpc-secondary-800: #6B21A8;
  --hpc-secondary-900: #581C87;
}
```

### Grade-Specific Colors
```css
/* HPC Grade Color System */
:root {
  /* A+ Grade - Outstanding */
  --hpc-grade-a-plus-bg: #ECFDF5;
  --hpc-grade-a-plus-text: #059669;
  --hpc-grade-a-plus-border: #10B981;

  /* A Grade - Excellent */
  --hpc-grade-a-bg: #F0F9FF;
  --hpc-grade-a-text: #0891B2;
  --hpc-grade-a-border: #06B6D4;

  /* B Grade - Good */
  --hpc-grade-b-bg: #FAF5FF;
  --hpc-grade-b-text: #7C3AED;
  --hpc-grade-b-border: #8B5CF6;

  /* C Grade - Satisfactory */
  --hpc-grade-c-bg: #FFFBEB;
  --hpc-grade-c-text: #D97706;
  --hpc-grade-c-border: #F59E0B;

  /* D Grade - Needs Improvement */
  --hpc-grade-d-bg: #FEF2F2;
  --hpc-grade-d-text: #DC2626;
  --hpc-grade-d-border: #EF4444;
}
```

### Semantic Colors
```css
/* Status and Feedback Colors */
:root {
  /* Success States */
  --hpc-success-50: #F0FDF4;
  --hpc-success-500: #22C55E;
  --hpc-success-600: #16A34A;

  /* Warning States */
  --hpc-warning-50: #FFFBEB;
  --hpc-warning-500: #F59E0B;
  --hpc-warning-600: #D97706;

  /* Error States */
  --hpc-error-50: #FEF2F2;
  --hpc-error-500: #EF4444;
  --hpc-error-600: #DC2626;

  /* Info States */
  --hpc-info-50: #F0F9FF;
  --hpc-info-500: #3B82F6;
  --hpc-info-600: #2563EB;
}
```

### Category Colors
```css
/* Parameter Category Colors */
:root {
  /* Scholastic - Academic subjects */
  --hpc-scholastic-bg: #EFF6FF;
  --hpc-scholastic-text: #1E40AF;
  --hpc-scholastic-accent: #3B82F6;

  /* Co-Scholastic - Arts, sports, activities */
  --hpc-co-scholastic-bg: #FAF5FF;
  --hpc-co-scholastic-text: #7C3AED;
  --hpc-co-scholastic-accent: #A855F7;

  /* Life Skills - Values and behaviors */
  --hpc-life-skills-bg: #ECFDF5;
  --hpc-life-skills-text: #059669;
  --hpc-life-skills-accent: #10B981;

  /* Discipline - Behavioral markers */
  --hpc-discipline-bg: #FEF3C7;
  --hpc-discipline-text: #92400E;
  --hpc-discipline-accent: #F59E0B;
}
```

### Neutral Palette
```css
/* Neutral Colors for Text and Backgrounds */
:root {
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
}
```

## 📝 Typography System

### Font Families
```css
:root {
  /* Primary font stack - matches existing BIG DAY system */
  --hpc-font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  
  /* Monospace for codes and data */
  --hpc-font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  
  /* Display font for headers */
  --hpc-font-display: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### Type Scale
```css
/* Typography Scale */
:root {
  /* Display sizes */
  --hpc-text-display-lg: 3.75rem;    /* 60px - Hero headings */
  --hpc-text-display-md: 3rem;       /* 48px - Page titles */
  --hpc-text-display-sm: 2.25rem;    /* 36px - Section titles */

  /* Heading sizes */
  --hpc-text-h1: 2rem;               /* 32px - Main headings */
  --hpc-text-h2: 1.5rem;             /* 24px - Section headings */
  --hpc-text-h3: 1.25rem;            /* 20px - Subsection headings */
  --hpc-text-h4: 1.125rem;           /* 18px - Card titles */

  /* Body text */
  --hpc-text-lg: 1.125rem;           /* 18px - Large body text */
  --hpc-text-base: 1rem;             /* 16px - Default body text */
  --hpc-text-sm: 0.875rem;           /* 14px - Small text */
  --hpc-text-xs: 0.75rem;            /* 12px - Captions and labels */

  /* Line heights */
  --hpc-leading-tight: 1.25;         /* Headings */
  --hpc-leading-normal: 1.5;         /* Body text */
  --hpc-leading-relaxed: 1.625;      /* Long-form content */
}
```

### Font Weights
```css
:root {
  --hpc-font-thin: 100;
  --hpc-font-light: 300;
  --hpc-font-normal: 400;
  --hpc-font-medium: 500;
  --hpc-font-semibold: 600;
  --hpc-font-bold: 700;
  --hpc-font-extrabold: 800;
  --hpc-font-black: 900;
}
```

## 📏 Spacing System

### Base Grid System
```css
/* 8px Base Grid System */
:root {
  --hpc-space-0: 0;
  --hpc-space-px: 1px;
  --hpc-space-0-5: 0.125rem;         /* 2px */
  --hpc-space-1: 0.25rem;            /* 4px */
  --hpc-space-1-5: 0.375rem;         /* 6px */
  --hpc-space-2: 0.5rem;             /* 8px */
  --hpc-space-2-5: 0.625rem;         /* 10px */
  --hpc-space-3: 0.75rem;            /* 12px */
  --hpc-space-3-5: 0.875rem;         /* 14px */
  --hpc-space-4: 1rem;               /* 16px */
  --hpc-space-5: 1.25rem;            /* 20px */
  --hpc-space-6: 1.5rem;             /* 24px */
  --hpc-space-7: 1.75rem;            /* 28px */
  --hpc-space-8: 2rem;               /* 32px */
  --hpc-space-9: 2.25rem;            /* 36px */
  --hpc-space-10: 2.5rem;            /* 40px */
  --hpc-space-12: 3rem;              /* 48px */
  --hpc-space-14: 3.5rem;            /* 56px */
  --hpc-space-16: 4rem;              /* 64px */
  --hpc-space-20: 5rem;              /* 80px */
  --hpc-space-24: 6rem;              /* 96px */
  --hpc-space-32: 8rem;              /* 128px */
}
```

### Component Spacing
```css
/* Component-specific spacing */
:root {
  --hpc-card-padding: var(--hpc-space-6);
  --hpc-form-gap: var(--hpc-space-4);
  --hpc-button-padding-x: var(--hpc-space-4);
  --hpc-button-padding-y: var(--hpc-space-2);
  --hpc-input-padding: var(--hpc-space-3);
  --hpc-section-gap: var(--hpc-space-8);
}
```

## 🎭 Component Styles

### Card System
```css
/* Base card styles */
.hpc-card {
  background: white;
  border-radius: var(--hpc-radius-lg);
  box-shadow: var(--hpc-shadow-sm);
  border: 1px solid var(--hpc-gray-200);
  padding: var(--hpc-card-padding);
  transition: all 0.2s ease;
}

.hpc-card:hover {
  box-shadow: var(--hpc-shadow-md);
  transform: translateY(-1px);
}

.hpc-card--elevated {
  box-shadow: var(--hpc-shadow-lg);
}

.hpc-card--interactive {
  cursor: pointer;
}

.hpc-card--interactive:hover {
  box-shadow: var(--hpc-shadow-xl);
  transform: translateY(-2px);
}
```

### Button System
```css
/* Button variants */
.hpc-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--hpc-space-2);
  padding: var(--hpc-button-padding-y) var(--hpc-button-padding-x);
  border-radius: var(--hpc-radius-md);
  font-weight: var(--hpc-font-medium);
  font-size: var(--hpc-text-sm);
  line-height: 1.25;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.hpc-button--primary {
  background: var(--hpc-primary-500);
  color: white;
}

.hpc-button--primary:hover {
  background: var(--hpc-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--hpc-shadow-md);
}

.hpc-button--secondary {
  background: var(--hpc-gray-100);
  color: var(--hpc-gray-700);
  border: 1px solid var(--hpc-gray-300);
}

.hpc-button--ghost {
  background: transparent;
  color: var(--hpc-gray-600);
}

.hpc-button--danger {
  background: var(--hpc-error-500);
  color: white;
}
```

### Form Elements
```css
/* Input styles */
.hpc-input {
  width: 100%;
  padding: var(--hpc-input-padding);
  border: 1px solid var(--hpc-gray-300);
  border-radius: var(--hpc-radius-md);
  font-size: var(--hpc-text-base);
  line-height: var(--hpc-leading-normal);
  transition: all 0.2s ease;
  background: white;
}

.hpc-input:focus {
  outline: none;
  border-color: var(--hpc-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.hpc-input--error {
  border-color: var(--hpc-error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Textarea styles */
.hpc-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: var(--hpc-font-primary);
}

/* Select styles */
.hpc-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}
```

## ⭐ Star Rating System

### Visual Design
```css
/* Star rating component */
.hpc-star-rating {
  display: flex;
  gap: var(--hpc-space-1);
  align-items: center;
}

.hpc-star {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--hpc-gray-300);
}

.hpc-star--filled {
  color: #FCD34D; /* Golden yellow */
}

.hpc-star--hover {
  color: #FBBF24;
  transform: scale(1.1);
}

.hpc-star--large {
  width: 32px;
  height: 32px;
}

.hpc-star--small {
  width: 16px;
  height: 16px;
}

/* Accessibility enhancements */
.hpc-star:focus {
  outline: 2px solid var(--hpc-primary-500);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Grade Mapping
```css
/* Visual grade indicators */
.hpc-grade-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--hpc-space-2);
  padding: var(--hpc-space-1) var(--hpc-space-3);
  border-radius: var(--hpc-radius-full);
  font-weight: var(--hpc-font-medium);
  font-size: var(--hpc-text-sm);
}

.hpc-grade-indicator--a-plus {
  background: var(--hpc-grade-a-plus-bg);
  color: var(--hpc-grade-a-plus-text);
  border: 1px solid var(--hpc-grade-a-plus-border);
}

.hpc-grade-indicator--a {
  background: var(--hpc-grade-a-bg);
  color: var(--hpc-grade-a-text);
  border: 1px solid var(--hpc-grade-a-border);
}
```

## 📊 Chart Design System

### Radar Chart Styling
```css
/* Radar chart design tokens */
:root {
  --hpc-chart-primary: var(--hpc-primary-500);
  --hpc-chart-secondary: var(--hpc-secondary-500);
  --hpc-chart-grid: var(--hpc-gray-200);
  --hpc-chart-text: var(--hpc-gray-600);
  --hpc-chart-background: white;
}

.hpc-radar-chart {
  background: var(--hpc-chart-background);
  border-radius: var(--hpc-radius-lg);
  padding: var(--hpc-space-4);
}

.hpc-chart-legend {
  display: flex;
  justify-content: center;
  gap: var(--hpc-space-4);
  margin-top: var(--hpc-space-4);
}

.hpc-chart-legend-item {
  display: flex;
  align-items: center;
  gap: var(--hpc-space-2);
  font-size: var(--hpc-text-sm);
  color: var(--hpc-gray-600);
}
```

### Progress Indicators
```css
/* Progress bar styles */
.hpc-progress {
  width: 100%;
  height: 8px;
  background: var(--hpc-gray-200);
  border-radius: var(--hpc-radius-full);
  overflow: hidden;
}

.hpc-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--hpc-primary-500), var(--hpc-primary-400));
  border-radius: var(--hpc-radius-full);
  transition: width 0.3s ease;
}

.hpc-progress--success .hpc-progress-bar {
  background: linear-gradient(90deg, var(--hpc-success-500), var(--hpc-success-400));
}

.hpc-progress--warning .hpc-progress-bar {
  background: linear-gradient(90deg, var(--hpc-warning-500), var(--hpc-warning-400));
}
```

## 🎯 Border Radius System

```css
:root {
  --hpc-radius-none: 0;
  --hpc-radius-sm: 0.25rem;          /* 4px */
  --hpc-radius-md: 0.5rem;           /* 8px */
  --hpc-radius-lg: 0.75rem;          /* 12px */
  --hpc-radius-xl: 1rem;             /* 16px */
  --hpc-radius-2xl: 1.5rem;          /* 24px */
  --hpc-radius-full: 9999px;         /* Fully rounded */
}
```

## 🌊 Shadow System

```css
:root {
  --hpc-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --hpc-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --hpc-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --hpc-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --hpc-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --hpc-shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
```

## 🎨 Component-Specific Styles

### Parameter Cards
```css
.hpc-parameter-card {
  background: white;
  border-radius: var(--hpc-radius-xl);
  border: 1px solid var(--hpc-gray-200);
  padding: var(--hpc-space-6);
  transition: all 0.2s ease;
}

.hpc-parameter-card:hover {
  border-color: var(--hpc-primary-300);
  box-shadow: var(--hpc-shadow-md);
}

.hpc-parameter-card--completed {
  border-color: var(--hpc-success-300);
  background: var(--hpc-success-50);
}

.hpc-parameter-card--pending {
  border-color: var(--hpc-warning-300);
  background: var(--hpc-warning-50);
}
```

### Evidence Gallery
```css
.hpc-evidence-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--hpc-space-4);
}

.hpc-evidence-item {
  aspect-ratio: 1;
  border-radius: var(--hpc-radius-lg);
  overflow: hidden;
  border: 2px solid var(--hpc-gray-200);
  transition: all 0.2s ease;
  cursor: pointer;
}

.hpc-evidence-item:hover {
  border-color: var(--hpc-primary-300);
  transform: scale(1.02);
}

.hpc-evidence-item--image {
  background-size: cover;
  background-position: center;
}

.hpc-evidence-item--document {
  background: var(--hpc-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
```

### Stakeholder Feedback
```css
.hpc-feedback-section {
  border-left: 4px solid var(--hpc-primary-500);
  padding-left: var(--hpc-space-4);
  margin: var(--hpc-space-4) 0;
}

.hpc-feedback-section--teacher {
  border-left-color: var(--hpc-primary-500);
}

.hpc-feedback-section--parent {
  border-left-color: var(--hpc-secondary-500);
}

.hpc-feedback-section--peer {
  border-left-color: var(--hpc-success-500);
}

.hpc-feedback-section--self {
  border-left-color: var(--hpc-warning-500);
}
```

## 🌙 Dark Mode Support

```css
/* Dark mode color overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --hpc-bg-primary: #1F2937;
    --hpc-bg-secondary: #374151;
    --hpc-text-primary: #F9FAFB;
    --hpc-text-secondary: #D1D5DB;
    --hpc-border-primary: #4B5563;
  }

  .hpc-card {
    background: var(--hpc-bg-secondary);
    border-color: var(--hpc-border-primary);
    color: var(--hpc-text-primary);
  }

  .hpc-input {
    background: var(--hpc-bg-primary);
    border-color: var(--hpc-border-primary);
    color: var(--hpc-text-primary);
  }
}
```

## 📱 Responsive Design Tokens

### Breakpoints
```css
:root {
  --hpc-breakpoint-sm: 640px;
  --hpc-breakpoint-md: 768px;
  --hpc-breakpoint-lg: 1024px;
  --hpc-breakpoint-xl: 1280px;
  --hpc-breakpoint-2xl: 1536px;
}
```

### Responsive Spacing
```css
/* Responsive spacing adjustments */
@media (max-width: 768px) {
  :root {
    --hpc-card-padding: var(--hpc-space-4);
    --hpc-section-gap: var(--hpc-space-6);
  }
  
  .hpc-parameter-card {
    padding: var(--hpc-space-4);
  }
  
  .hpc-star {
    width: 28px;
    height: 28px;
  }
}
```

## 🎭 Animation System

### Transition Tokens
```css
:root {
  --hpc-transition-fast: 0.15s ease;
  --hpc-transition-normal: 0.2s ease;
  --hpc-transition-slow: 0.3s ease;
  --hpc-transition-bounce: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Micro-Interactions
```css
/* Hover animations */
.hpc-interactive:hover {
  transform: translateY(-1px);
  transition: transform var(--hpc-transition-fast);
}

/* Click animations */
.hpc-interactive:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
}

/* Loading animations */
@keyframes hpc-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hpc-loading {
  animation: hpc-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Success animations */
@keyframes hpc-success-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.hpc-success-animation {
  animation: hpc-success-bounce 0.3s ease;
}
```

## 🎯 Icon System

### Icon Guidelines
```css
/* Icon sizing */
:root {
  --hpc-icon-xs: 12px;
  --hpc-icon-sm: 16px;
  --hpc-icon-md: 20px;
  --hpc-icon-lg: 24px;
  --hpc-icon-xl: 32px;
}

/* Icon colors */
.hpc-icon {
  width: var(--hpc-icon-md);
  height: var(--hpc-icon-md);
  color: currentColor;
}

.hpc-icon--primary { color: var(--hpc-primary-500); }
.hpc-icon--secondary { color: var(--hpc-secondary-500); }
.hpc-icon--success { color: var(--hpc-success-500); }
.hpc-icon--warning { color: var(--hpc-warning-500); }
.hpc-icon--error { color: var(--hpc-error-500); }
```

### HPC-Specific Icons
```typescript
// Icon mapping for HPC system
const hpcIcons = {
  // Parameters
  mathematics: 'Calculator',
  science: 'Microscope', 
  creativity: 'Palette',
  teamwork: 'Users',
  empathy: 'Heart',
  discipline: 'Shield',
  
  // Actions
  evaluate: 'Edit3',
  review: 'Eye',
  approve: 'CheckCircle',
  reject: 'XCircle',
  export: 'Download',
  
  // Status
  draft: 'FileText',
  pending: 'Clock',
  approved: 'CheckCircle2',
  published: 'Share',
  
  // Evidence
  upload: 'Upload',
  image: 'Image',
  document: 'FileText',
  video: 'Video'
};
```

## 📋 Layout Patterns

### Grid Systems
```css
/* HPC-specific grid layouts */
.hpc-grid-parameters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--hpc-space-6);
}

.hpc-grid-evaluations {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--hpc-space-8);
}

.hpc-grid-reports {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--hpc-space-4);
}

/* Mobile adaptations */
@media (max-width: 768px) {
  .hpc-grid-evaluations {
    grid-template-columns: 1fr;
  }
  
  .hpc-grid-parameters {
    grid-template-columns: 1fr;
  }
}
```

### Flexbox Patterns
```css
/* Common flex layouts */
.hpc-flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hpc-flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hpc-flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--hpc-space-3);
}
```

## 🎨 Print Styles

### PDF Export Optimization
```css
/* Print-specific styles */
@media print {
  .hpc-report {
    font-size: 12pt;
    line-height: 1.4;
    color: black;
    background: white;
  }
  
  .hpc-page-break {
    page-break-before: always;
  }
  
  .hpc-no-print {
    display: none;
  }
  
  .hpc-chart {
    max-width: 100%;
    height: auto;
  }
  
  .hpc-signature-block {
    margin-top: 2cm;
    border-top: 1px solid black;
    padding-top: 1cm;
  }
}

/* A4 page layout */
@page {
  size: A4;
  margin: 2cm;
}
```

## 🌍 Multi-Language Support

### Text Direction Support
```css
/* RTL language support (future) */
[dir="rtl"] .hpc-card {
  text-align: right;
}

[dir="rtl"] .hpc-star-rating {
  flex-direction: row-reverse;
}

/* Language-specific typography */
.hpc-text--hindi {
  font-family: 'Noto Sans Devanagari', var(--hpc-font-primary);
  line-height: var(--hpc-leading-relaxed);
}

.hpc-text--english {
  font-family: var(--hpc-font-primary);
  line-height: var(--hpc-leading-normal);
}
```

## 🎪 State Variations

### Loading States
```css
.hpc-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: hpc-skeleton-loading 1.5s infinite;
}

@keyframes hpc-skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Error States
```css
.hpc-error-state {
  text-align: center;
  padding: var(--hpc-space-8);
  color: var(--hpc-error-600);
}

.hpc-error-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--hpc-space-4);
  color: var(--hpc-error-400);
}
```

### Empty States
```css
.hpc-empty-state {
  text-align: center;
  padding: var(--hpc-space-12);
  color: var(--hpc-gray-500);
}

.hpc-empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--hpc-space-4);
  color: var(--hpc-gray-300);
}
```

## 🎯 Usage Examples

### Parameter Card Implementation
```css
.hpc-parameter-card {
  background: white;
  border-radius: var(--hpc-radius-xl);
  border: 1px solid var(--hpc-gray-200);
  padding: var(--hpc-space-6);
  transition: all var(--hpc-transition-normal);
}

.hpc-parameter-card:hover {
  border-color: var(--hpc-primary-300);
  box-shadow: var(--hpc-shadow-md);
  transform: translateY(-1px);
}

.hpc-parameter-card--scholastic {
  border-left: 4px solid var(--hpc-scholastic-accent);
}

.hpc-parameter-card--co-scholastic {
  border-left: 4px solid var(--hpc-co-scholastic-accent);
}

.hpc-parameter-card--life-skills {
  border-left: 4px solid var(--hpc-life-skills-accent);
}
```

### Report Header Styling
```css
.hpc-report-header {
  background: linear-gradient(135deg, var(--hpc-primary-50), var(--hpc-secondary-50));
  border-radius: var(--hpc-radius-2xl);
  padding: var(--hpc-space-8);
  margin-bottom: var(--hpc-space-8);
  border: 1px solid var(--hpc-primary-200);
}

.hpc-school-logo {
  width: 80px;
  height: 80px;
  border-radius: var(--hpc-radius-lg);
  border: 2px solid white;
  box-shadow: var(--hpc-shadow-md);
}

.hpc-student-photo {
  width: 120px;
  height: 120px;
  border-radius: var(--hpc-radius-full);
  border: 4px solid white;
  box-shadow: var(--hpc-shadow-lg);
}
```

This comprehensive design token system ensures visual consistency across the entire HPC system while maintaining accessibility and responsive design principles. The tokens integrate seamlessly with the existing BIG DAY design system while establishing HPC-specific patterns for evaluation interfaces and report presentation.