import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ComponentSkeleton, lazyPages } from '../components/common/PerformanceUtils';

// Eagerly loaded critical pages (above the fold)
import LandingPage from '../screens/landingpage';
import SignIn from '../screens/Sign-in';
import Signup from '../screens/Signup';

// Lazy loaded pages for better performance
const {
  Dashboard,
  CauseListpage,
  CausedetailPage,
  Donation,
  Profilepage,
  AdminDashboard,
  CartPage
} = lazyPages;

// Additional lazy imports for other pages
const DonationHistory = React.lazy(() => import('../screens/DonationHistory'));
const ProfileSettings = React.lazy(() => import('../screens/profilesettings'));
const MultiDonation = React.lazy(() => import('../screens/MultiDonation'));
const Notificationspage = React.lazy(() => import('../screens/Notificationspage'));
const Desktoppage = React.lazy(() => import('../screens/Desktoppage'));
const CauseReviewPage = React.lazy(() => import('../screens/CauseReviewPage'));
const OrganizerProfilePage = React.lazy(() => import('../screens/OrganizerProfilePage'));
const OrganizerProfileSettings = React.lazy(() => import('../screens/OrganizerProfileSettings'));
const RedirectingModal = React.lazy(() => import('../screens/RedirectingModal'));
const OrganizerSignUpPage = React.lazy(() => import('../screens/OrganizerSignUpPage'));
const CauseCreate = React.lazy(() => import('../screens/CauseCreate'));
const PaymentStatus = React.lazy(() => import('../screens/PaymentStatus'));

/**
 * Optimized App Routes with lazy loading and performance monitoring
 */
export const AppRoutes = () => {
  return (
    <main id="main-content" role="main" className="min-h-screen">
      <Routes>
        {/* Critical routes - loaded immediately */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sign-in" element={<SignIn />} />
        
        {/* Lazy loaded routes with suspense */}
        <Route 
          path="/dashboard" 
          element={
            <Suspense fallback={<ComponentSkeleton className="min-h-screen" />}>
              <Dashboard />
            </Suspense>
          } 
        />
        
        <Route 
          path="/donation" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <Donation />
            </Suspense>
          } 
        />
        
        <Route 
          path="/donationhistory" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <DonationHistory />
            </Suspense>
          } 
        />
        
        <Route 
          path="/profilepage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <Profilepage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/profilesettings" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <ProfileSettings />
            </Suspense>
          } 
        />
        
        <Route 
          path="/cartpage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <CartPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/multidonation" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <MultiDonation />
            </Suspense>
          } 
        />
        
        <Route 
          path="/notificationspage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <Notificationspage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/desktoppage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <Desktoppage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/admindashboard" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <AdminDashboard />
            </Suspense>
          } 
        />
        
        <Route 
          path="/causedetailpage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <CausedetailPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/causes/:id" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <CausedetailPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/causes/create" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <CauseCreate />
            </Suspense>
          } 
        />
        
        <Route 
          path="/causereviewpage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <CauseReviewPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/payment-status" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <PaymentStatus />
            </Suspense>
          } 
        />
        
        <Route 
          path="/organizerprofilepage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <OrganizerProfilePage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/organizersignuppage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <OrganizerSignUpPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/redirectingmodal" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <RedirectingModal />
            </Suspense>
          } 
        />
        
        <Route 
          path="/organizerprofilesettings" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <OrganizerProfileSettings />
            </Suspense>
          } 
        />
        
        <Route 
          path="/causelistpage" 
          element={
            <Suspense fallback={<ComponentSkeleton />}>
              <CauseListpage />
            </Suspense>
          } 
        />
        
        {/* 404 fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;