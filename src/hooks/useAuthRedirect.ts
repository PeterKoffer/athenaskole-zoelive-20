
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

/**
 * Handles automatic redirection after authentication based on user role
 */
export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const { userRole } = useRoleAccess();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while still loading or if no user
    if (loading || !user || !userRole) return;

    // Only redirect from auth page or home page
    if (location.pathname !== '/auth' && location.pathname !== '/') return;

    console.log('[useAuthRedirect] Redirecting user with role:', userRole);

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
