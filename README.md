# BIG DAY - Student Management System

A modern, Apple-inspired student management system built with React, TypeScript, and Tailwind CSS. This application uses mock data for demonstration purposes.

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

## Key Features

### Student Features:
- Real-time timetable view with upcoming assessments
- Grade projection system with multiple scenarios
- Subtopic performance tracking with trend analysis
- Attendance warnings with risk assessment
- Real-time messaging system

### Teacher Features:
- Dashboard with at-risk students and top performers
- Bulk grading system with Excel upload
- Resource management with file uploads
- Messaging system with templates
- Quiz creation and management
- Performance analytics dashboard

### Admin Features:
- User management system
- Performance analytics and reporting
- Department oversight
- System-wide metrics and insights

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── teacher/        # Teacher-specific components
│   ├── student/        # Student-specific components
│   ├── auth/           # Authentication components
│   ├── search/         # Search functionality  
│   ├── performance/    # Performance analytics
│   └── portals/        # Main portal components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── services/           # API service functions (mock implementations)
├── types/              # TypeScript type definitions
├── data/               # Sample data for development
├── config/             # Configuration files
├── context/            # React context providers
└── styles/             # CSS files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests with Vitest

## Demo Accounts

The application includes demo accounts for testing:

- **Student**: student@dpsb.edu / student123
- **Teacher**: teacher@dpsb.edu / teacher123
- **Admin**: admin@dpsb.edu / admin123

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist/` directory

3. Deploy the `dist/` directory to your web server

## Features Overview

### Authentication System
- Role-based access control (Student, Teacher, Admin)
- Secure login with demo accounts
- Password reset functionality
- Session management

### Student Portal
- **Dashboard**: Overview of classes, assignments, and messages
- **Grades**: Detailed grade reports with distribution charts
- **Attendance**: Real-time attendance tracking with warnings
- **Study Vault**: Access to course materials and assignments
- **Performance**: AI-powered insights and grade projections

### Teacher Portal
- **Dashboard**: Class overview and pending tasks
- **Attendance**: Digital attendance taking and management
- **Grading**: Individual and bulk grade entry systems
- **Resources**: Course material management and sharing
- **Messages**: Communication with students using templates
- **Quizzes**: Quiz creation and management tools

### Admin Portal
- **Overview**: System-wide performance metrics
- **User Management**: Add, edit, and manage users
- **Performance Analytics**: Detailed teacher performance reviews
- **Reports**: Generate and download system reports
- **Settings**: System configuration and preferences

## Design Philosophy

The application follows Apple's design principles:
- Clean, minimalist interface
- Consistent spacing and typography
- Smooth animations and transitions
- Intuitive user experience
- Responsive design for all devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.