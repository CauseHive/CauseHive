import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { DonationCartProvider } from './contexts/DonationCartContext';
import { SavedCausesProvider } from './contexts/SavedCausesContext';
import { SearchAnalyticsProvider } from './contexts/SearchAnalyticsContext';
import AppLayout from './components/layout/AppLayout';
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
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import DashboardPage from './pages/DashboardPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import DonationCartPage from './pages/DonationCartPage';
import CheckoutPage from './pages/CheckoutPage';
import DonationSuccessPage from './pages/DonationSuccessPage';
import MyTestimonialsPage from './pages/MyTestimonialsPage';
import SearchAnalyticsPage from './pages/SearchAnalyticsPage';

// Simple test pages to verify layout works
function HomePage() {
  return <LandingPage />;
}

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchAnalyticsProvider>
          <SavedCausesProvider>
            <DonationCartProvider>
              <Router>
                <Routes>
                  {/* Auth routes without AppLayout */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<SignupPage />} />
                  
                  {/* App routes with AppLayout */}
                  <Route path="/*" element={
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/causes" element={<CausesListPage />} />
                      <Route path="/causes/:id" element={<CauseDetailPage />} />
                      <Route path="/search/analytics" element={<SearchAnalyticsPage />} />
                      <Route path="/donation/result" element={<DonationResultPage />} />
                      <Route path="/cart" element={<DonationCartPage />} />
                      <Route path="/cart/checkout" element={<CheckoutPage />} />
                      <Route path="/donation/success" element={<DonationSuccessPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/my-testimonials" element={<MyTestimonialsPage />} />
                      <Route path="/donations" element={<DonationHistoryPage />} />
                      <Route path="/profile/settings" element={<ProfileSettingsPage />} />
                      <Route path="/profile" element={<ProfileSettingsPage />} />
                      <Route path="/saved" element={<SavedCausesPage />} />
                      <Route path="/my-causes" element={<MyCausesPage />} />
                      <Route path="/causes/create" element={<CreateCausePage />} />
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/settings" element={<ProfileSettingsPage />} />
                      <Route path="/help" element={<HelpSupportPage />} />
                      {/* Legal pages */}
                      <Route path="/terms" element={<TermsConditionsPage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/refund" element={<RefundPolicyPage />} />
                      <Route path="/cookies" element={<CookiePolicyPage />} />
                    </Routes>
                  </AppLayout>
                } />
              </Routes>
            </Router>
          </DonationCartProvider>
        </SavedCausesProvider>
        </SearchAnalyticsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;