import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, User, Settings, BarChart3, Shield, HelpCircle, Plus, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

// Navigation items for unauthenticated users
const unauthenticatedNavItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    description: 'Discover trending causes'
  },
  {
    label: 'Explore Causes',
    href: '/causes',
    icon: Search,
    description: 'Browse all active campaigns'
  },
];

// Navigation items for authenticated users
const authenticatedMainNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Your activity overview'
  },
  {
    label: 'Explore Causes',
    href: '/causes',
    icon: Search,
    description: 'Browse all active campaigns'
  },
  {
    label: 'Saved Causes',
    href: '/saved',
    icon: Search,
    description: 'Causes you\'re following'
  },
  {
    label: 'Create Cause',
    href: '/causes/create',
    icon: Plus,
    description: 'Start your campaign'
  },
  {
    label: 'My Causes',
    href: '/my-causes',
    icon: BarChart3,
    description: 'Manage your campaigns'
  },
];

const authenticatedBottomNavItems = [
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Your profile settings'
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Account & preferences'
  },
  {
    label: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
    description: 'Get assistance'
  },
];

const adminNavItems = [
  {
    label: 'Admin Panel',
    href: '/admin',
    icon: Shield,
    badge: 'Admin',
    description: 'Platform management'
  },
];

// Logout confirmation modal component
const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Sign Out
        </h3>
        <p className="text-neutral-600 mb-4">
          Are you sure you want to sign out of your account?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export function Sidebar({ isOpen, onClose, onOpen, className }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';
  
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const sidebarRef = useRef(null);

  // Handle click outside to close sidebar when expanded
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    if (!isCollapsed) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCollapsed]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  // Handle sidebar interaction - click anywhere to expand, click outside to collapse
  const handleSidebarClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const NavSection = ({ 
    title, 
    items, 
    className: sectionClassName 
  }) => (
    <div className={cn("space-y-1", sectionClassName)}>
      {title && !isCollapsed && (
        <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {items.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={cn(
              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              "hover:bg-neutral-100 hover:text-neutral-900",
              isActive 
                ? "bg-primary-100 text-primary-700 shadow-sm" 
                : "text-neutral-600",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon className={cn(
              "h-4 w-4 transition-colors flex-shrink-0",
              isActive 
                ? "text-primary-600" 
                : "text-neutral-400 group-hover:text-neutral-600",
              !isCollapsed && "mr-3"
            )} />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={isActive ? "default" : "secondary"} 
                      className="ml-2 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-neutral-500 mt-0.5 group-hover:text-neutral-600">
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );

  // Choose navigation items based on authentication status
  const mainNavItems = isAuthenticated ? authenticatedMainNavItems : unauthenticatedNavItems;
  const bottomNavItems = isAuthenticated ? authenticatedBottomNavItems : [];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        onClick={handleSidebarClick}
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform bg-white shadow-xl transition-all duration-300 ease-in-out border-r border-neutral-200",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-center border-b border-neutral-200 px-4">
          {!isCollapsed && (
            <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <Menu className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-primary-700">CauseHive</span>
            </Link>
          )}
          
          {isCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 cursor-pointer">
              <Menu className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <nav className="space-y-6">
            {/* Main Navigation */}
            <NavSection items={mainNavItems} />

            {isAuthenticated && isAdmin && (
              <>
                <Separator />
                {/* Admin Tools */}
                <NavSection title="Administration" items={adminNavItems} />
              </>
            )}

            {/* Bottom Navigation for authenticated users */}
            {isAuthenticated && bottomNavItems.length > 0 && (
              <>
                <Separator />
                <NavSection items={bottomNavItems} />
              </>
            )}

            {/* Logout button for authenticated users */}
            {isAuthenticated && (
              <>
                <Separator />
                <div className="space-y-1">
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 w-full",
                      "hover:bg-red-50 hover:text-red-700 text-neutral-600",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? "Sign Out" : undefined}
                  >
                    <LogOut className={cn(
                      "h-4 w-4 transition-colors flex-shrink-0",
                      "text-neutral-400 group-hover:text-red-600",
                      !isCollapsed && "mr-3"
                    )} />
                    {!isCollapsed && <span className="flex-1 text-left">Sign Out</span>}
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* User Info Card */}
          {isAuthenticated && user && !isCollapsed && (
            <div className="mt-auto pt-4">
              <div className="card-warm">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      ${user.totalDonated?.toLocaleString() || 0} donated
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between text-xs text-neutral-600">
                  <span>{user.causesSupported || 0} causes supported</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.role || 'user'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed user avatar */}
          {isAuthenticated && user && isCollapsed && (
            <div className="mt-auto pt-4 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}

export default Sidebar;