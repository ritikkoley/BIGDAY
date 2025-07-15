# BIG DAY - Student Management System

A modern, Apple-inspired student management system built with React, TypeScript, and Tailwind CSS. This version uses mock data instead of a Supabase backend.

## Features

- **Student Portal**: View grades, attendance, performance analytics, and study materials
- **Teacher Portal**: Manage classes, grade assignments, track attendance, and communicate with students
- **Admin Portal**: Oversee system-wide performance, manage users, and generate reports
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Full dark mode support with smooth transitions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Apple-inspired design system

### New Features Added:
- **Student Features**:
  - Real-time timetable view with upcoming assessments
  - Grade projection system with multiple scenarios
  - Subtopic performance tracking with trend analysis
  - Attendance warnings with risk assessment
  - Real-time messaging system

- **Teacher Features**:
  - Dashboard with at-risk students and top performers
  - Bulk grading system with Excel upload
  - Resource management with file uploads
  - Messaging system with templates
  - Quiz creation and management
  - Performance analytics dashboard

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd student-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── teacher/        # Teacher-specific components
│   ├── student/        # Student-specific components
│   ├── auth/           # Authentication components
│   ├── search/         # Search functionality  
│   └── performance/    # Performance analytics
│   └── ...
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── services/           # API service functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── data/               # Sample data for development
├── styles/             # CSS files
└── config/             # Configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests with Vitest

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist/` directory

3. Deploy the `dist/` directory to your web server

## Demo Accounts
