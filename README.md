# BIG DAY - Educational Dashboard System

A comprehensive educational management system with role-based access for students, teachers, and administrators. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Student Features
- **Home Dashboard**: View upcoming assessments, timetable, and messages
- **Progress Tracking**: Visual representation of learning progress by subtopic
- **Performance Analysis**: Grade projections, study plans, and historic performance
- **Attendance Monitoring**: Track attendance rates with future projections
- **Study Vault**: Access course materials and submit assignments

### Teacher Features
- **Dashboard**: Overview of upcoming classes, pending tasks, and student submissions
- **Attendance Management**: Take and track student attendance
- **Grading System**: Grade assignments individually or in bulk
- **Resource Management**: Share learning materials with students
- **Messaging**: Communicate with students and classes
- **Performance Analytics**: Monitor class performance and identify at-risk students

### Admin Features
- **Performance Overview**: Monitor institution-wide performance metrics
- **Department Management**: Track department performance and resource allocation
- **User Management**: Add, edit, and manage users
- **Reports**: Generate and download system reports

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Database & Auth**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bigday
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file based on `.env.example`
   - Add your Supabase URL and anon key

4. Run the development server:
```bash
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/`
3. Set up storage buckets for resources
4. Deploy the Edge Functions in `supabase/functions/`

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/           # Admin-specific components
│   ├── teacher/         # Teacher-specific components
│   ├── student/         # Student-specific components
│   ├── auth/            # Authentication components
│   ├── search/          # Search functionality
│   ├── performance/     # Performance analytics
│   └── portals/         # Main portal components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and Supabase client
├── stores/              # Zustand state stores
├── types/               # TypeScript type definitions
├── context/             # React context providers
└── styles/              # CSS files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Demo Accounts

The application includes demo accounts for testing:

- **Student**: student@dpsb.edu / student123
- **Teacher**: teacher@dpsb.edu / teacher123
- **Admin**: admin@dpsb.edu / admin123

## License

This project is licensed under the MIT License.