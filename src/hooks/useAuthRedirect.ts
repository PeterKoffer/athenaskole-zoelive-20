
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
    console.log('[useAuthRedirect] =================');
    console.log('[useAuthRedirect] Auth loading:', loading);
    console.log('[useAuthRedirect] User:', user?.email);
    console.log('[useAuthRedirect] User role:', userRole);
    console.log('[useAuthRedirect] Current path:', location.pathname);
    console.log('[useAuthRedirect] =================');

    // Don't redirect while still loading
    if (loading) {
      console.log('[useAuthRedirect] Skipping redirect - still loading');
      return;
    }

    // If no user or role, don't redirect (let them stay on current page or go to auth)
    if (!user && !userRole) {
      console.log('[useAuthRedirect] No user and no role - staying put');
      return;
    }

    // Only redirect from auth page or home page - don't interfere with manual navigation
    const shouldRedirect = 
      location.pathname === '/auth' || 
      location.pathname === '/';

    if (!shouldRedirect) {
      console.log('[useAuthRedirect] Not redirecting - user is on valid path:', location.pathname);
      return;
    }

    // Ensure we have a role before redirecting
    if (!userRole) {
      console.log('[useAuthRedirect] No role set yet, waiting...');
      return;
    }

    console.log('[useAuthRedirect] Redirecting user with role:', userRole, 'from:', location.pathname);

    // Redirect based on role
    try {
      switch (userRole) {
        case 'admin':
          navigate('/admin-dashboard', { replace: true });
          break;
        case 'school_leader':
        case 'school_staff':
          navigate('/school-dashboard', { replace: true });
          break;
        case 'teacher':
          navigate('/teacher-dashboard', { replace: true });
          break;
        case 'parent':
          navigate('/parent-dashboard', { replace: true });
          break;
        case 'student':
          navigate('/daily-program', { replace: true });
          break;
        default:
          console.log('[useAuthRedirect] Unknown role, staying on current page');
          break;
      }
    } catch (error) {
      console.error('[useAuthRedirect] Navigation error:', error);
    }
  }, [user, userRole, loading, navigate, location.pathname]);
};
