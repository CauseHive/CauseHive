import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useDonationCart } from '../../contexts/DonationCartContext';

// Navigation items for public (unauthenticated) users
const publicNavItems = [
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
  {
    label: 'Donation Cart',
    href: '/cart',
    icon: Heart,
    description: 'Review your donations'
  },
];

/**
 * PublicSidebar - Sidebar specifically for unauthenticated users
 * Only shows public navigation items and encourages sign up
 */
export function PublicSidebar({ isOpen, onClose, className }) {
  const location = useLocation();
  const { totalItems } = useDonationCart();
  
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  const handleSidebarClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const NavSection = ({ items, className: sectionClassName }) => (
    <div className={cn("space-y-1", sectionClassName)}>
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
                  {item.href === '/cart' && totalItems > 0 && (
                    <span className="ml-2 bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                      {totalItems}
                    </span>
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
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
            {/* Public Navigation */}
            <NavSection items={publicNavItems} />
          </nav>

          {/* Sign Up Promotion - Only when expanded */}
          {!isCollapsed && (
            <div className="mt-auto pt-4">
              <div className="card-warm">
                <div className="text-center">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Join CauseHive
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Create an account to save causes, track donations, and start your own campaigns.
                  </p>
                  <div className="space-y-2">
                    <Button asChild className="w-full btn-primary" size="sm">
                      <Link to="/register">
                        Sign Up Free
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link to="/login">
                        Log In
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed sign up prompt */}
          {isCollapsed && (
            <div className="mt-auto pt-4 flex justify-center">
              <Link to="/register">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium hover:bg-primary-200 transition-colors">
                  +
                </div>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default PublicSidebar;