import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from './Breadcrumbs';

export function AppLayout({ 
  children, 
  showSidebar = true, 
  showBreadcrumbs = true,
  className 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-background">
      <div className="app-background-overlay">
        {/* Header - Fixed at top with proper positioning */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton={showSidebar}
          className={cn(
            "fixed top-0 right-0 z-30 transition-all duration-300",
            showSidebar ? "left-16" : "left-0" // Sidebar is now only 16 (4rem) wide when collapsed
          )}
        />

      {/* Sidebar - Fixed on left */}
      {showSidebar && (
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
        />
      )}

      {/* Main Content - Scrollable with fixed sidebar */}
      <main 
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300 ease-in-out pt-16",
          showSidebar ? "pl-16" : "pl-0", // Only 16 for collapsed sidebar
          className
        )}
      >
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="bg-white border-b border-neutral-200 px-4 py-3 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <Breadcrumbs />
            </div>
          </div>
        )}

        {/* Page Content - Properly centered */}
        <div className="flex-1 px-4 py-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export default AppLayout;