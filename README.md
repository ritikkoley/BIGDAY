# BIG DAY - Student Management System

A modern, Apple-inspired student management system built with React, TypeScript, and Tailwind CSS.

## Setting Up Your Supabase Project

### 1. Access Your Supabase Project

Your project is already set up at: https://supabase.com/dashboard/project/eaofihviwzrvhabaeuxf

### 2. Run the Migration Script

1. Go to the SQL Editor in your Supabase dashboard
2. Open the file `supabase/migrations/009_fresh_start.sql` from this project
3. Run the entire SQL script to set up your database schema

### 3. Set Up Storage Buckets

1. In your Supabase dashboard, go to Storage
2. Create two new buckets:
   - `study_materials` - For course resources and assignments
   - `profile_images` - For user profile pictures
3. Set the privacy settings as needed (public or authenticated access)

### 4. Deploy Edge Functions

1. In your Supabase dashboard, go to Edge Functions
2. Create three new functions:
   - `bulk-upload-grades`
   - `bulk-upload-attendance`
   - `project-grade`
3. Copy the code from the corresponding files in `supabase/functions/` directory

### 5. Update Environment Variables

Make sure your `.env` file contains the correct Supabase URL and anon key:

```
VITE_SUPABASE_URL=https://eaofihviwzrvhabaeuxf.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

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

- **Database Features**:
  - PostgreSQL with Row Level Security (RLS)
  - Real-time subscriptions with Supabase Realtime
  - Edge Functions for complex operations
  - Storage for files and resources
  - RPC Functions for analytics and projections

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

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

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Or use your existing project at https://supabase.com/dashboard/project/eaofihviwzrvhabaeuxf
   - Get your project URL and anon key from Project Settings > API

4. Create environment file:
```bash
cp .env.example .env
# Add your Supabase URL and anon key to .env
VITE_SUPABASE_URL=https://eaofihviwzrvhabaeuxf.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run database migrations:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Run the migration file `009_fresh_start.sql` from the project

6. Set up Edge Functions:
   - In your Supabase dashboard, go to Edge Functions
   - Create new functions for:
     - `bulk-upload-grades`
     - `bulk-upload-attendance`
     - `project-grade`
   - Copy the code from the project files into each function

7. Start the development server:
```bash
npm run dev
```

8. Open your browser and navigate to `http://localhost:3000`

## Database Setup

The application uses Supabase as the backend with the following tables:

### Core Tables
- **users**: Core user table with roles (student, teacher, admin)
- **groups**: Classes/sections/departments
- **courses**: Courses with subtopics and teacher assignments
- **assessments**: Quizzes, exams, and assignments

### Data Tables
- **grades**: Student scores linked to assessments with percentile rankings
- **attendance**: Per class/session attendance tracking
- **messages**: Teacher-student/class communication system
- **resources**: Study materials metadata with file storage links

### Authentication

The system supports:
- Email/password authentication
- OAuth with Google and Apple
- Role-based access control (RLS)
- Automatic user profile creation

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Students see only their own data
- Teachers see data for their assigned classes
- Admins have full access to all data

### Edge Functions

The application includes three Supabase Edge Functions:
- **bulk-upload-grades**: Process bulk grade uploads for assessments
- **bulk-upload-attendance**: Handle class-wide attendance uploads
- **project-grade**: Advanced grade projection with multiple scenarios

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
├── lib/                # Supabase client and utilities
├── services/           # API service functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── data/               # Sample data for development
├── styles/             # CSS files
└── config/             # Configuration files
supabase/
├── migrations/         # Database migration files
└── functions/          # Edge functions for bulk operations
```

## API Integration

The application integrates with Supabase for:

1. **Authentication**: JWT-based auth with automatic session management
2. **Data Operations**: Real-time CRUD operations with RLS
3. **File Storage**: Secure file uploads for study materials
4. **Realtime**: Live updates for collaborative features
5. **Edge Functions**: Server-side processing for bulk operations

### Key API Services

- `userApi` - User management operations
- `groupApi` - Class/department management
- `courseApi` - Course and curriculum management
- `assessmentApi` - Quiz and exam management
- `gradeApi` - Grade management and analytics
- `attendanceApi` - Attendance tracking and summaries
- `messageApi` - Communication system
- `resourceApi` - File management and downloads
- `analyticsApi` - Performance analytics and insights
- `fileApi` - File upload and storage
- `realtimeApi` - Live data subscriptions

### Data Store

The `dataStore` provides centralized state management for:
- Real-time data synchronization
- Optimistic updates
- Caching and performance optimization
- Bulk operations
- Analytics and reporting

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

## Environment Variables 

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_APP_NAME` - Application name
- `VITE_INSTITUTION_NAME` - Your institution name

## Demo Accounts

After setting up your Supabase project, you can create test accounts:

1. Register accounts with these email patterns:
   - Student: any email not matching the patterns below
   - Teacher: email containing `@teacher.`
   - Admin: email containing `@admin.`

2. The system will automatically assign the appropriate role based on the email pattern.

## Security Features

- Row Level Security (RLS) on all database tables
- JWT-based authentication with automatic refresh
- Role-based access control
- Secure file upload with access policies
- Input validation and sanitization
- Edge function security with service role keys
- Comprehensive audit trails through timestamps