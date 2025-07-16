import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { StudentPortal } from './components/portals/StudentPortal';
import { TeacherPortal } from './components/portals/TeacherPortal';
import { AdminPortal } from './components/portals/AdminPortal';

function App() {
  const { user, role, isLoading, initialize } = useAuthStore();
  
  // Initialize auth on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to={`/${role}`} replace />} 
        />
        <Route 
          path="/forgot-password" 
          element={!user ? <ForgotPasswordPage /> : <Navigate to={`/${role}`} replace />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/student/*" 
          element={user && role === 'student' ? <StudentPortal /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/teacher/*" 
          element={user && role === 'teacher' ? <TeacherPortal /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin/*" 
          element={user && role === 'admin' ? <AdminPortal /> : <Navigate to="/login" replace />} 
        />

        {/* Default Redirects */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={`/${role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;