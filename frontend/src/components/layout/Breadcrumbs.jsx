import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

// Route-to-breadcrumb mapping
const getRouteBreadcrumbs = (isAuthenticated) => ({
  '/': [{ label: 'Home', current: true }],
  '/causes': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Explore Causes', current: true }
  ],
  '/causes/create': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Explore Causes', href: '/causes' },
    { label: 'Start a Cause', current: true }
  ],
  '/dashboard': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Dashboard', current: true }
  ],
  '/my-causes': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Causes', current: true }
  ],
  '/donations': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Donations', current: true }
  ],
  '/saved': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Saved Causes', current: true }
  ],
  '/settings': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', current: true }
  ],
  '/admin': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Admin Panel', current: true }
  ],
  '/help': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Help & Support', current: true }
  ],
  '/login': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Sign In', current: true }
  ],
  '/register': [
    { label: 'Home', href: isAuthenticated ? '/dashboard' : '/' },
    { label: 'Get Started', current: true }
  ],
});

function generateBreadcrumbsFromPath(pathname, isAuthenticated) {
  const routeBreadcrumbs = getRouteBreadcrumbs(isAuthenticated);
  
  // Check for exact match first
  if (routeBreadcrumbs[pathname]) {
    return routeBreadcrumbs[pathname];
  }

  // Generate breadcrumbs for dynamic routes
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', href: '/' }];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convert segment to readable label
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Handle specific dynamic routes
    if (segment === 'cause' || segment === 'causes') {
      if (segments[index + 1] && !isNaN(Number(segments[index + 1]))) {
        label = 'Cause Details';
      } else if (segments[index + 1] === 'edit') {
        label = 'Edit Cause';
      }
    }

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      current: isLast,
    });
  });

  return breadcrumbs;
}

export function Breadcrumbs({ items, className }) {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname, isAuthenticated);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-neutral-400 mx-2" />
            )}
            
            {item.current ? (
              <span 
                className="font-medium text-neutral-900"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  "text-neutral-600 hover:text-neutral-900 transition-colors",
                  index === 0 && "flex items-center"
                )}
              >
                {index === 0 && (
                  <Home className="h-4 w-4 mr-1" />
                )}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;