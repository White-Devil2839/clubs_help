import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import InstitutionSignup from './pages/InstitutionSignup';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Institution from './pages/Institution';
import Landing from './pages/Landing';

import GlobalLogin from './pages/GlobalLogin';
import GlobalRegister from './pages/GlobalRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import ProtectedRoute from './components/ProtectedRoute';

// Wrapper for routes that need the Layout (Navbar)
const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            {/* Global Route */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<GlobalLogin />} />
          <Route path="/register" element={<GlobalRegister />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/institution/signup" element={<InstitutionSignup />} />

          {/* Tenant Routes */}
          <Route path="/:institutionCode/login" element={<Login />} />
          <Route path="/:institutionCode/register" element={<Register />} />

          {/* Protected Routes with Layout */}
          <Route element={<LayoutWrapper />}>
            <Route element={<ProtectedRoute />}>
                <Route path="/:institutionCode/dashboard" element={<Dashboard />} />
                <Route path="/:institutionCode/admin" element={<AdminDashboard />} />
                <Route path="/:institutionCode/clubs" element={<Clubs />} />
                <Route path="/:institutionCode/clubs/:clubId" element={<ClubDetails />} />
                <Route path="/:institutionCode/events" element={<Events />} />
                <Route path="/:institutionCode/profile" element={<Profile />} />
                <Route path="/:institutionCode/institution" element={<Institution />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
