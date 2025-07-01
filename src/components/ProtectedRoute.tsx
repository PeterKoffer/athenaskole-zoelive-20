
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRole
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  // If authentication is required but user is not logged in, redirect to auth
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is logged in but trying to access auth page, redirect to home
  if (!requireAuth && user && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }

  // Check role-based access (simplified - in a real app you'd check against user roles)
  if (requiredRole && user) {
    // For now, just allow access - role checking would be implemented with proper user roles
    console.log(`Role-based access check for: ${requiredRole}`);
  }

  return <>{children}</>;
};

export default ProtectedRoute;
