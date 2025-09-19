import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute component ensures only authenticated users can access certain routes
 * Redirects unauthenticated users to login with return path
 */
export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (adminOnly && user?.role !== 'admin' && user?.role !== 'moderator') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * PublicRoute component ensures only unauthenticated users see certain routes
 * Redirects authenticated users away from login/signup pages
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard from login/signup pages
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;