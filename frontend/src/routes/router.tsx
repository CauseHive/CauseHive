import { createBrowserRouter, Navigate } from 'react-router-dom'
import React, { Suspense } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/routes/util/ProtectedRoute'
import LoadingScreen from '@/components/ui/loading-screen'
import RouteErrorBoundary from '@/routes/RouteErrorBoundary'
import { lazyWithRetry } from '@/lib/lazyWithRetry'
import UserLayout from '@/components/layout/UserLayout'

const HomePage = lazyWithRetry(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const LoginPage = lazyWithRetry(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const SignupPage = lazyWithRetry(() => import('@/pages/auth/SignupPage').then(m => ({ default: m.SignupPage })))
const CausesPage = lazyWithRetry(() => import('@/pages/causes/CausesPage').then(m => ({ default: m.CausesPage })))
const CauseDetailsPage = lazyWithRetry(() => import('@/pages/causes/CauseDetailsPage').then(m => ({ default: m.CauseDetailsPage })))
const CreateCausePage = lazyWithRetry(() => import('@/pages/causes/CreateCausePage').then(m => ({ default: m.default })))
const CartPage = lazyWithRetry(() => import('@/pages/cart/CartPage').then(m => ({ default: m.CartPage })))
const DonationsPage = lazyWithRetry(() => import('@/pages/donations/DonationsPage').then(m => ({ default: m.DonationsPage })))
const ProfilePage = lazyWithRetry(() => import('@/pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })))
const AdminDashboardPage = lazyWithRetry(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const PaymentCallbackPage = lazyWithRetry(() => import('@/pages/payments/PaymentCallbackPage').then(m => ({ default: m.PaymentCallbackPage })))
const PasswordResetRequestPage = lazyWithRetry(() => import('@/pages/auth/PasswordResetRequestPage').then(m => ({ default: m.PasswordResetRequestPage })))
const PasswordResetConfirmPage = lazyWithRetry(() => import('@/pages/auth/PasswordResetConfirmPage').then(m => ({ default: m.PasswordResetConfirmPage })))
const NotFoundPage = lazyWithRetry(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))
const NotificationsPage = lazyWithRetry(() => import('@/pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })))
const WithdrawalsPage = lazyWithRetry(() => import('@/pages/withdrawals/WithdrawalsPage').then(m => ({ default: m.WithdrawalsPage })))
const DashboardPage = lazyWithRetry(() => import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.default })))
const SettingsPage = lazyWithRetry(() => import('@/pages/settings/SettingsPage').then(m => ({ default: m.default })))
const TermsPage = lazyWithRetry(() => import('@/pages/info/TermsPage').then(m => ({ default: m.default })))
const PrivacyPage = lazyWithRetry(() => import('@/pages/info/PrivacyPage').then(m => ({ default: m.default })))
const HowItWorksPage = lazyWithRetry(() => import('@/pages/info/HowItWorksPage').then(m => ({ default: m.default })))
const FaqPage = lazyWithRetry(() => import('@/pages/info/FaqPage').then(m => ({ default: m.default })))
const ContactPage = lazyWithRetry(() => import('@/pages/info/ContactPage').then(m => ({ default: m.default })))
const EmailVerificationPage = lazyWithRetry(() => import('@/pages/auth/EmailVerificationPage'))
const GoogleCallbackPage = lazyWithRetry(() => import('@/pages/auth/GoogleCallbackPage'))

export const router = createBrowserRouter([
  {
    path: '/',
      element: <AppLayout />,
      errorElement: <RouteErrorBoundary />,
    children: [
        { index: true, element: <Suspense fallback={<LoadingScreen />}><HomePage /></Suspense> },
        { path: 'login', element: <Suspense fallback={<LoadingScreen />}><LoginPage /></Suspense> },
        { path: 'signup', element: <Suspense fallback={<LoadingScreen />}><SignupPage /></Suspense> },
        { path: 'auth/google/callback', element: <Suspense fallback={<LoadingScreen />}><GoogleCallbackPage /></Suspense> },
        { path: 'password-reset', element: <Suspense fallback={<LoadingScreen />}><PasswordResetRequestPage /></Suspense> },
        { path: 'password-reset/confirm', element: <Suspense fallback={<LoadingScreen />}><PasswordResetConfirmPage /></Suspense> },
        { path: 'reset-password-confirm/:uid/:token', element: <Suspense fallback={<LoadingScreen />}><PasswordResetConfirmPage /></Suspense> },
        { path: 'payment/callback', element: <Suspense fallback={<LoadingScreen />}><PaymentCallbackPage /></Suspense> },
        { path: 'causes', element: <Suspense fallback={<LoadingScreen />}><CausesPage /></Suspense> },
        { path: 'causes/create', element: <Suspense fallback={<LoadingScreen />}><CreateCausePage /></Suspense> },
        { path: 'causes/:id', element: <Suspense fallback={<LoadingScreen />}><CauseDetailsPage /></Suspense> },
      // Public info pages
      { path: 'terms', element: <Suspense fallback={<LoadingScreen />}><TermsPage /></Suspense> },
      { path: 'privacy', element: <Suspense fallback={<LoadingScreen />}><PrivacyPage /></Suspense> },
      { path: 'how-it-works', element: <Suspense fallback={<LoadingScreen />}><HowItWorksPage /></Suspense> },
      { path: 'faq', element: <Suspense fallback={<LoadingScreen />}><FaqPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<LoadingScreen />}><ContactPage /></Suspense> },

      // Email verification route
      { path: 'verify-email/:uidb64/:token', element: <Suspense fallback={<LoadingScreen />}><EmailVerificationPage /></Suspense> },
      
      // Back-compat: redirect old paths into the new /app area
      { path: 'dashboard', element: <Navigate to="/app" replace /> },
      { path: 'cart', element: <Navigate to="/app/cart" replace /> },
      { path: 'donations', element: <Navigate to="/app/donations" replace /> },
      { path: 'profile', element: <Navigate to="/app/profile" replace /> },
      { path: 'notifications', element: <Navigate to="/app/notifications" replace /> },
      { path: 'withdrawals', element: <Navigate to="/app/withdrawals" replace /> },

      // Authenticated app area with sidebar and yes
      { path: 'app', element: (
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      ), children: [
        { index: true, element: <Suspense fallback={<LoadingScreen />}><DashboardPage /></Suspense> },
        { path: 'dashboard', element: <Suspense fallback={<LoadingScreen />}><DashboardPage /></Suspense> },
        { path: 'causes', element: <Suspense fallback={<LoadingScreen />}><CausesPage /></Suspense> },
        { path: 'causes/create', element: <Suspense fallback={<LoadingScreen />}><CreateCausePage /></Suspense> },
        { path: 'donations', element: <Suspense fallback={<LoadingScreen />}><DonationsPage /></Suspense> },
        { path: 'cart', element: <Suspense fallback={<LoadingScreen />}><CartPage /></Suspense> },
        { path: 'profile', element: <Suspense fallback={<LoadingScreen />}><ProfilePage /></Suspense> },
        { path: 'settings', element: <Suspense fallback={<LoadingScreen />}><SettingsPage /></Suspense> },
        { path: 'notifications', element: <Suspense fallback={<LoadingScreen />}><NotificationsPage /></Suspense> },
        { path: 'withdrawals', element: <Suspense fallback={<LoadingScreen />}><WithdrawalsPage /></Suspense> },
      ] },
      { path: 'admin', element: (
        <ProtectedRoute role="admin">
            <Suspense fallback={<LoadingScreen />}><AdminDashboardPage /></Suspense>
        </ProtectedRoute>
      ) },
      { path: '*', element: <Suspense fallback={<LoadingScreen />}><NotFoundPage /></Suspense> }
    ]
  }
])
