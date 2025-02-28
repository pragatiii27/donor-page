import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Donor Pages
import DonorDashboard from './pages/donor/Dashboard';
import DonationForm from './pages/donor/DonationForm';
import TrackDonation from './pages/donor/TrackDonation';
import InstituteList from './pages/donor/InstituteList';
import VolunteerOpportunities from './pages/donor/VolunteerOpportunities';

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requiredRole?: string;
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/register/:role" element={<Register />} />
      
      {/* Donor Routes */}
      <Route 
        path="/donor/dashboard" 
        element={
          <ProtectedRoute requiredRole="donor">
            <DonorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/donor/donate" 
        element={
          <ProtectedRoute requiredRole="donor">
            <DonationForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/donor/tracking" 
        element={
          <ProtectedRoute requiredRole="donor">
            <TrackDonation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/donor/institutes" 
        element={
          <ProtectedRoute requiredRole="donor">
            <InstituteList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/donor/volunteer" 
        element={
          <ProtectedRoute requiredRole="donor">
            <VolunteerOpportunities />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect to home for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;