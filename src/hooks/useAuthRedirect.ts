
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

/**
 * Handles automatic redirection after authentication based on user role
 * Also handles navigation after role switching
 */
export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const { userRole } = useRoleAccess();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while still loading or if no user
    if (loading || !user || !userRole) return;

    // Only redirect from auth page, home page, or if we're on a dashboard that doesn't match the current role
    const shouldRedirect = 
      location.pathname === '/auth' || 
      location.pathname === '/' ||
      (location.pathname === '/daily-program' && userRole !== 'student') ||
      (location.pathname === '/school-dashboard' && !['admin', 'school_leader', 'school_staff'].includes(userRole)) ||
      (location.pathname === '/teacher-dashboard' && userRole !== 'teacher') ||
      (location.pathname === '/parent-dashboard' && userRole !== 'parent') ||
      (location.pathname === '/admin-dashboard' && userRole !== 'admin');

    if (!shouldRedirect) return;

    console.log('[useAuthRedirect] Redirecting user with role:', userRole, 'from:', location.pathname);

    // Redirect based on role
    switch (userRole) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'school_leader':
      case 'school_staff':
        navigate('/school-dashboard');
        break;
      case 'teacher':
        navigate('/teacher-dashboard');
        break;
      case 'parent':
        navigate('/parent-dashboard');
        break;
      case 'student':
        navigate('/daily-program');
        break;
      default:
        // Stay on current page if role is unknown
        break;
    }
  }, [user, userRole, loading, navigate, location.pathname]);
};
