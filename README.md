# Student Management System

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

### Default Login Credentials

- **Admin**: admin@school.edu / admin123
- **Teacher**: teacher@school.edu / teacher123  
- **Student**: student@school.edu / student123

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── teacher/        # Teacher-specific components
│   ├── search/         # Search functionality
│   └── ...
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
├── data/               # Sample data for development
├── utils/              # Utility functions
└── styles/             # CSS files
```

## Backend Integration

This project is currently set up with mock data and services. To integrate with your backend:

1. **Authentication**: Update `src/stores/authStore.ts` with your authentication API
2. **Data Operations**: Replace mock implementations in `src/stores/dataStore.ts` with your API calls
3. **Search**: Update `src/stores/searchStore.ts` with your search API
4. **Services**: Replace mock services in `src/services/index.ts` with real API calls

### API Endpoints to Implement

- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout
- `GET /users` - Get users (with role-based filtering)
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /courses` - Get courses
- `POST /courses` - Create course
- `GET /grades` - Get grades
- `POST /grades` - Create grades
- `GET /attendance` - Get attendance
- `POST /attendance` - Create attendance records

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist/` directory

3. Deploy the `dist/` directory to your web server

## Environment Variables

Create a `.env` file based on `.env.example` and configure:

- `VITE_API_BASE_URL` - Your backend API URL
- `VITE_APP_NAME` - Application name
- Other configuration as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.