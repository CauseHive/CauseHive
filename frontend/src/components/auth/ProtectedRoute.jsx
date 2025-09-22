import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute component ensures only authenticated users can access certain routes.
 * It redirects unauthenticated users to the login page, preserving the intended destination.
 */
export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading: isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // Note: The user object from the backend needs to have a `role` property for this to work.
  if (adminOnly && user?.role !== 'admin' && user?.role !== 'moderator') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * PublicRoute component is for pages that should only be seen by unauthenticated users (e.g., login, signup).
 * It redirects authenticated users to the dashboard.
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, loading: isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
