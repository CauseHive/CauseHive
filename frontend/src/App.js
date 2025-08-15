import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './screens/Signup';
import SignIn from './screens/Sign-in';
import LandingPage from './screens/landingpage';
import CauseListpage from './screens/CauseListpage';
import CausedetailPage from './screens/CausedetailPage';
import Donation from './screens/Donation';
import TestRoute from './screens/TestRoute';
import MultiDonation from './screens/MultiDonation';
import CartPage from './screens/CartPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landingpage" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/causedetailpage" element={<CausedetailPage />} />
        <Route path="/causes" element={<CauseListpage />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/multidonation" element={<MultiDonation />} />
        <Route path="/testroute" element={<TestRoute />} />
        <Route path="/cartpage" element={<CartPage />} />
        <Route path="*" element={<Navigate to="/landingpage" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
