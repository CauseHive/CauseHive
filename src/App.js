import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './screens/Signup';
import SignIn from './screens/Sign-in';
import LandingPage from './screens/landingpage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landingpage" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/landingpage" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;

