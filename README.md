# BIG DAY - Student Management System

A modern, Apple-inspired student management system built with React, TypeScript, and Tailwind CSS.

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
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Database**: PostgreSQL with Row Level Security (RLS)

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

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key

4. Create environment file:
```bash
cp .env.example .env
# Add your Supabase URL and anon key to .env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run database migrations:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration files in `supabase/migrations/` in order

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000`

## Database Setup

The application uses Supabase as the backend with the following core tables:

- **users**: Core user table with roles (student, teacher, admin)
- **groups**: Classes/sections/departments
- **courses**: Courses with subtopics and teacher assignments
- **assessments**: Quizzes, exams, and assignments

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
├── types/              # TypeScript type definitions
├── data/               # Sample data for development
├── utils/              # Utility functions
├── styles/             # CSS files
└── config/             # Configuration files
supabase/
├── migrations/         # Database migration files
└── functions/          # Edge functions (future)
```

## API Integration

The application integrates with Supabase for:

1. **Authentication**: JWT-based auth with automatic session management
2. **Data Operations**: Real-time CRUD operations with RLS
3. **File Storage**: Secure file uploads for study materials
4. **Realtime**: Live updates for collaborative features

### Key API Services

- `userApi` - User management operations
- `groupApi` - Class/department management
- `courseApi` - Course and curriculum management
- `assessmentApi` - Quiz and exam management
- `fileApi` - File upload and storage
- `realtimeApi` - Live data subscriptions

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

## Security Features

- Row Level Security (RLS) on all database tables
- JWT-based authentication with automatic refresh
- Role-based access control
- Secure file upload with access policies
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Deployment

The application can be deployed to:
- Netlify (recommended for frontend)
- Vercel
- Any static hosting provider

## License

This project is licensed under the MIT License.