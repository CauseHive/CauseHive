import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './components/Toast/ToastProvider';
import { SkipToMain } from './components/common/AccessibilityUtils';
import SEO from './components/common/SEO';
import AppRoutes from './components/routing/AppRoutes';

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <Router>
          <SkipToMain />
          <SEO />
          <AppRoutes />
        </Router>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;