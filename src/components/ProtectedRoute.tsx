
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
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
  const { user, loading: authLoading } = useAuth();
  const { userRole } = useRoleAccess();
  const location = useLocation();

  console.log('[ProtectedRoute] DEBUG:', { 
    user: user?.email, 
    userRole, 
    requireAuth, 
    requiredRole, 
    authLoading,
    pathname: location.pathname,
    userMetadata: user?.user_metadata
  });

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  // If authentication is required but user is not logged in, redirect to auth
  if (requireAuth && !user) {
    console.log('[ProtectedRoute] Redirecting to auth - no user');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Allow authenticated users to access auth page for role switching
  // Only redirect if they came from somewhere other than direct navigation
  if (!requireAuth && user && userRole && location.pathname === '/auth' && location.state?.from) {
    console.log('[ProtectedRoute] User logged in, redirecting from auth page to dashboard for role:', userRole);
    
    // Define target paths for each role
    const targetPaths: Record<string, string> = {
      'admin': '/school-dashboard',
      'school_leader': '/school-dashboard',
      'school_staff': '/school-dashboard',
      'teacher': '/teacher-dashboard',
      'parent': '/parent-dashboard',
      'student': '/adventure'
    };
    
    const targetPath = targetPaths[userRole] || '/adventure';
    console.log('[ProtectedRoute] Redirecting to:', targetPath);
    return <Navigate to={targetPath} replace />;
  }

  // Check role-based access
  if (requiredRole && user && userRole) {
    let hasRequiredRole = false;
    
    if (requiredRole === 'teacher') {
      hasRequiredRole = userRole === 'teacher' || userRole === 'admin' || userRole === 'school_leader';
    } else if (requiredRole === 'school_leader') {
      hasRequiredRole = userRole === 'school_leader' || userRole === 'admin';
    } else {
      hasRequiredRole = userRole === requiredRole || userRole === 'admin';
    }
    
    if (!hasRequiredRole) {
      console.log('[ProtectedRoute] Access denied - insufficient role. User role:', userRole, 'Required:', requiredRole);
      return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
