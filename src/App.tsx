import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

import api from './utils/api'; // Import API for logout

import Website from './components/Website'; 
import Dashboard from './components/Dashboard';
import Team from './components/Team';
import Leads from './components/Leads';
import Pipeline from './components/Pipeline';
import Contacts from './components/Contacts';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import NotFound from './components/NotFound';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Logs from './components/Logs';
import Tasks from './components/Tasks';
import ResetPassword from './components/ResetPassword'; 

// --- SECURITY COMPONENT: Inactivity Handler ---
const InactivityHandler = () => {
    const navigate = useNavigate();
    // 14 Minutes warning, 15 Minutes Logout
    const TIMEOUT_MS = 15 * 60 * 1000; 

    useEffect(() => {
        // FIX: Use 'number' instead of 'NodeJS.Timeout' for browser compatibility
        let idleTimer: number;

        const logoutUser = async () => {
            console.log("User inactive. Logging out...");
            try { await api.post('/auth/logout'); } catch(e) {}
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            window.location.href = '/login'; // Force reload/redirect
        };

        const resetTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);
            // FIX: Use 'window.setTimeout' to force browser API
            idleTimer = window.setTimeout(logoutUser, TIMEOUT_MS);
        };

        // Listen for user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer);

        resetTimer(); // Start timer immediately

        return () => {
            if (idleTimer) clearTimeout(idleTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [navigate]);

    return null; 
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userRole, setUserRole] = useState<string>(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || 'Guest';
  });

  useEffect(() => {
    const checkAuth = () => {
        const auth = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(auth);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || 'Guest');
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // --- UPDATED: Role-Based Protected Route ---
  // Using 'any' for children to prevent strict typing issues during build
  const ProtectedRoute = ({ children, allowedRoles }: { children: any, allowedRoles?: string[] }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    // If specific roles are required, check if user has one of them
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect unauthorized users to a safe default page
        return <Navigate to="/dashboard" replace />; 
    }
    
    return children;
  };

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff' },
          success: { style: { background: 'green' } },
          error: { style: { background: 'red' } },
        }}
      />
      
      {/* Only run inactivity handler if logged in */}
      {isAuthenticated && <InactivityHandler />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Website />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Universal Protected Routes (Accessible by all logged-in users) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Role-Specific Routes */}
        <Route path="/pipeline" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Sales Rep']}><Pipeline /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Sales Rep']}><Leads /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Team /></ProtectedRoute>} />
        
        {/* Support & Admin Routes */}
        <Route path="/contacts" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Support']}><Contacts /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Support']}><Tasks /></ProtectedRoute>} />
        
        {/* Admin Only Routes */}
        <Route path="/analytics" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Analytics /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute allowedRoles={['Admin', 'Administrator']}><Logs /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;