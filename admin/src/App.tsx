import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Artists from './pages/Artists';
import Srefs from './pages/Srefs';
import './index.css'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter basename="/admin">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/categories" replace />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:id/:subName" element={<CategoryDetail />} />
              <Route path="artists" element={<Artists />} />
              <Route path="srefs" element={<Srefs />} />
              {/* Other routes can be added here */}
              <Route path="*" element={<div className="p-8 text-center text-gray-500">页面开发中...</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
