import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DonationCartProvider } from './contexts/DonationCartContext';
import { SavedCausesProvider } from './contexts/SavedCausesContext';
import { SearchAnalyticsProvider } from './contexts/SearchAnalyticsContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';
import SmartLayout from './components/layout/SmartLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import CausesListPage from './pages/CausesListPage';
import CauseDetailPage from './pages/CauseDetailPage';
import DonationResultPage from './pages/DonationResultPage';
import DonationHistoryPage from './pages/DonationHistoryPage';
import SavedCausesPage from './pages/SavedCausesPage';
import MyCausesPage from './pages/MyCausesPage';
import CreateCausePage from './pages/CreateCausePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import DashboardPage from './pages/DashboardPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import DonationCartPage from './pages/DonationCartPage';
import CheckoutPage from './pages/CheckoutPage';
import DonationSuccessPage from './pages/DonationSuccessPage';
import SystemStatusPage from './pages/SystemStatusPage';
import ErrorTestPage from './pages/ErrorTestPage';
import MyTestimonialsPage from './pages/MyTestimonialsPage';
import SearchAnalyticsPage from './pages/SearchAnalyticsPage';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary level="app" name="App Root">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SearchAnalyticsProvider>
            <SavedCausesProvider>
              <DonationCartProvider>
                <Router>
                  <ErrorBoundary level="page" name="Routes">
                    <Routes>
                  {/* Public routes - accessible only to unauthenticated users */}
                  <Route path="/login" element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } />
                  <Route path="/register" element={
                    <PublicRoute>
                      <SignupPage />
                    </PublicRoute>
                  } />

                  {/* Public content routes - accessible to everyone, smart layout based on auth status */}
                  <Route path="/" element={
                    <SmartLayout>
                      <LandingPage />
                    </SmartLayout>
                  } />
                  <Route path="/causes" element={
                    <SmartLayout>
                      <CausesListPage />
                    </SmartLayout>
                  } />
                  <Route path="/causes/:id" element={
                    <SmartLayout>
                      <CauseDetailPage />
                    </SmartLayout>
                  } />
                  <Route path="/cart" element={
                    <SmartLayout>
                      <DonationCartPage />
                    </SmartLayout>
                  } />
                  <Route path="/cart/checkout" element={
                    <SmartLayout>
                      <CheckoutPage />
                    </SmartLayout>
                  } />
                  <Route path="/donation/success" element={
                    <SmartLayout>
                      <DonationSuccessPage />
                    </SmartLayout>
                  } />

                  {/* Legal pages - accessible to everyone with public layout */}
                  <Route path="/terms" element={
                    <PublicLayout>
                      <TermsConditionsPage />
                    </PublicLayout>
                  } />
                  <Route path="/privacy" element={
                    <PublicLayout>
                      <PrivacyPolicyPage />
                    </PublicLayout>
                  } />
                  <Route path="/refund" element={
                    <PublicLayout>
                      <RefundPolicyPage />
                    </PublicLayout>
                  } />
                  <Route path="/cookies" element={
                    <PublicLayout>
                      <CookiePolicyPage />
                    </PublicLayout>
                  } />
                  <Route path="/system-status" element={
                    <PublicLayout>
                      <SystemStatusPage />
                    </PublicLayout>
                  } />
                  <Route path="/error-test" element={
                    <PublicLayout>
                      <ErrorTestPage />
                    </PublicLayout>
                  } />

                  {/* Protected routes - accessible only to authenticated users */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DashboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/search/analytics" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SearchAnalyticsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/donation/result" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DonationResultPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/my-testimonials" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <MyTestimonialsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/donations" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DonationHistoryPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ErrorBoundary>
                          <ProfilePage />
                        </ErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ErrorBoundary>
                          <SettingsPage />
                        </ErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/saved" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SavedCausesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/my-causes" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ErrorBoundary>
                          <MyCausesPage />
                        </ErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/causes/create" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ErrorBoundary>
                          <CreateCausePage />
                        </ErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />

                  <Route path="/help" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <HelpSupportPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />

                  {/* Admin routes - require admin role */}
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AppLayout>
                        <ErrorBoundary>
                          <AdminDashboardPage />
                        </ErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                </Routes>
                  </ErrorBoundary>
              </Router>
            </DonationCartProvider>
          </SavedCausesProvider>
        </SearchAnalyticsProvider>
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;