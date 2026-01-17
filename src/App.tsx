import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages (currently existing)
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Admin = React.lazy(() => import('./pages/Admin'));
const NewsletterArchive = React.lazy(() => import('./pages/NewsletterArchive'));
const Unsubscribe = React.lazy(() => import('./pages/Unsubscribe'));
const Subscribe = React.lazy(() => import('./pages/Subscribe'));
const SystemDesign = React.lazy(() => import('./pages/SystemDesign'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-gray-600 text-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin-only route wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/newsletter" replace />;
  }

  return <>{children}</>;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes - Newsletter is now the main landing page */}
          <Route path="/" element={<Home />} />
          <Route path="/newsletter" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/newsletters" element={<NewsletterArchive />} />
          <Route path="/system-design" element={<SystemDesign />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;