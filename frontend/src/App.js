import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard'; // Importing the new Dashboard
import DonationHistory from './screens/DonationHistory';
import SignIn from './screens/Sign-in';
import LandingPage from './screens/landingpage';
import CauseListpage from './screens/CauseListpage';
import Donation from './screens/Donation';
import Profilepage from './screens/Profilepage';
import ProfileSettings from './screens/profilesettings';
import CartPage from './screens/CartPage';
import MultiDonation from './screens/MultiDonation';
import Notificationspage from './screens/Notificationspage';
import Desktoppage from './screens/Desktoppage';
import AdminDashboard from './screens/AdminDashboard';
import CauseReviewPage from './screens/CauseReviewPage';
import OrganizerProfilePage from './screens/OrganizerProfilePage';
import OrganizerProfileSettings from "./screens/OrganizerProfileSettings";
import RedirectingModal from "./screens/RedirectingModal";
import OrganizerSignUpPage from "./screens/OrganizerSignUpPage";
import CausedetailPage from './screens/CausedetailPage'; // Importing CausedetailPage
import CauseCreate from './screens/CauseCreate';
import PaymentStatus from './screens/PaymentStatus';
import { ToastProvider } from './components/Toast/ToastProvider';
import { SkipToMain } from './components/common/AccessibilityUtils';
import SEO from './components/common/SEO';


function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <Router>
          <SkipToMain />
          <SEO />
          <div id="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/landingpage" element={<LandingPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/donationhistory" element={<DonationHistory />} />
              <Route path="/profilepage" element={<Profilepage />} />
              <Route path="/profilesettings" element={<ProfileSettings />} />
              <Route path="/cartpage" element={<CartPage />} />
              <Route path="/multidonation" element={<MultiDonation />} />
              <Route path="/notificationspage" element={<Notificationspage />} />
              <Route path="/desktoppage" element={<Desktoppage />} />
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/causedetailpage" element={<CausedetailPage />} />
              <Route path="/causes/:id" element={<CausedetailPage />} />
              <Route path="/causes/create" element={<CauseCreate />} />
              <Route path="/causereviewpage" element={<CauseReviewPage />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route path="/organizerprofilepage" element={<OrganizerProfilePage />} />
              <Route path="/organizersignuppage" element={<OrganizerSignUpPage />} />
              <Route path="/redirectingmodal" element={<RedirectingModal />} />
              <Route path="/organizerprofilesettings" element={<OrganizerProfileSettings />} />
              <Route path="/causelistpage" element={<CauseListpage />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
