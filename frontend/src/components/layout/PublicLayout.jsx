import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { PublicHeader } from './PublicHeader';
import { PublicSidebar } from './PublicSidebar';
import { Footer } from './Footer';

/**
 * PublicLayout - Layout specifically for unauthenticated users
 * Provides a clean, focused experience for public visitors
 */
export function PublicLayout({ 
  children, 
  showSidebar = true, 
  showFooter = true,
  className 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-background">
      <div className="app-background-overlay">
        {/* Public Header - Fixed at top */}
        <PublicHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton={showSidebar}
          className={cn(
            "fixed top-0 right-0 z-30 transition-all duration-300",
            showSidebar ? "left-16" : "left-0"
          )}
        />

        {/* Public Sidebar - Only shows public navigation */}
        {showSidebar && (
          <PublicSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main 
          className={cn(
            "min-h-screen flex flex-col transition-all duration-300 ease-in-out pt-16",
            showSidebar ? "pl-16" : "pl-0",
            className
          )}
        >
          {/* Page Content */}
          <div className="flex-1 px-4 py-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </div>

          {/* Footer - Always shown for public users */}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}

export default PublicLayout;