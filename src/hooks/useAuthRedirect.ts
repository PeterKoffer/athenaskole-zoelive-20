
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useRoleAccess } from './useRoleAccess';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { userRole } = useRoleAccess();

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) return;

    // Don't redirect from auth page - allow users to change roles
    const currentPath = window.location.pathname;
    if (currentPath === '/auth') {
      console.log('[useAuthRedirect] Not redirecting from auth page - allowing role selection');
      return;
    }

    // Only redirect if user is authenticated and on a page that should redirect
    if (user && userRole && currentPath !== '/auth') {
      console.log('[useAuthRedirect] User authenticated, checking if redirect needed', { userRole, currentPath });
      
      // Define target paths for each role
      const targetPaths: Record<string, string> = {
        'admin': '/school-dashboard',
        'school_leader': '/school-dashboard',
        'school_staff': '/school-dashboard',
        'teacher': '/teacher-dashboard',
        'parent': '/parent-dashboard',
        'student': '/daily-program'
      };
      
      const targetPath = targetPaths[userRole] || '/profile';
      
      // Only redirect if current path doesn't match the expected role path
      if (currentPath !== targetPath && currentPath === '/') {
        console.log('[useAuthRedirect] Redirecting to', targetPath, 'for role', userRole);
        navigate(targetPath, { replace: true });
      }
    }
  }, [user, userRole, loading, navigate]);
};
