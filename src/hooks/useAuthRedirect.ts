
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

    // Only redirect if user is on auth page and is authenticated
    const currentPath = window.location.pathname;
    if (user && userRole && currentPath === '/auth') {
      console.log('[useAuthRedirect] Redirecting authenticated user from auth page');
      
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
      
      console.log('[useAuthRedirect] Redirecting to', targetPath);
      navigate(targetPath, { replace: true });
    }
  }, [user, userRole, loading, navigate]);
};
