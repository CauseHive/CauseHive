import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AppLayout from './AppLayout';
import PublicLayout from './PublicLayout';

/**
 * SmartLayout component that renders different layouts based on authentication status
 * - For authenticated users: Uses AppLayout with authenticated header/sidebar
 * - For unauthenticated users: Uses PublicLayout with public header/sidebar
 */
export function SmartLayout({ children, ...props }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Use appropriate layout based on authentication status
  if (isAuthenticated) {
    return <AppLayout {...props}>{children}</AppLayout>;
  } else {
    return <PublicLayout {...props}>{children}</PublicLayout>;
  }
}

export default SmartLayout;