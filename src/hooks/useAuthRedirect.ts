
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

/**
 * Handles automatic redirection after authentication based on user role
 * Only redirects from auth page - does not interfere with manual navigation or role switching
 */
export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const { userRole, isManualRoleChange } = useRoleAccess();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('[useAuthRedirect] =================');
    console.log('[useAuthRedirect] Auth loading:', loading);
    console.log('[useAuthRedirect] User:', user?.email);
    console.log('[useAuthRedirect] User role:', userRole);
    console.log('[useAuthRedirect] Current path:', location.pathname);
    console.log('[useAuthRedirect] Is manual role change:', isManualRoleChange());
    console.log('[useAuthRedirect] =================');

    // Don't redirect while still loading
    if (loading) {
      console.log('[useAuthRedirect] Skipping redirect - still loading');
      return;
    }

    // CRITICAL: Completely block all redirects during manual role changes
    if (isManualRoleChange()) {
      console.log('[useAuthRedirect] 🚫 BLOCKING ALL REDIRECTS - manual role change in progress');
      return;
    }

    // If we're on the auth page and the user is trying to switch roles, don't redirect
    if (location.pathname === '/auth') {
      console.log('[useAuthRedirect] On auth page - allowing role selection');
      return;
    }

    // If no user or role, don't redirect (let them stay on current page or go to auth)
    if (!user && !userRole) {
      console.log('[useAuthRedirect] No user and no role - staying put');
      return;
    }

    // Only auto-redirect authenticated users with roles from the home page
    if (location.pathname === '/' && user && userRole) {
      console.log('[useAuthRedirect] ✅ Auto-redirecting authenticated user from home page');

      // Add a delay to ensure manual role change flags are processed
      setTimeout(() => {
        // Double-check the manual role change flag before redirecting
        if (isManualRoleChange()) {
          console.log('[useAuthRedirect] 🚫 LAST MINUTE BLOCK - manual role change detected');
          return;
        }

        // Redirect based on role
        try {
          switch (userRole) {
            case 'admin':
              console.log('[useAuthRedirect] Redirecting to admin dashboard');
              navigate('/admin-dashboard', { replace: true });
              break;
            case 'school_leader':
            case 'school_staff':
              console.log('[useAuthRedirect] Redirecting to school dashboard');
              navigate('/school-dashboard', { replace: true });
              break;
            case 'teacher':
              console.log('[useAuthRedirect] Redirecting to teacher dashboard');
              navigate('/teacher-dashboard', { replace: true });
              break;
            case 'parent':
              console.log('[useAuthRedirect] Redirecting to parent dashboard');
              navigate('/parent-dashboard', { replace: true });
              break;
            case 'student':
              console.log('[useAuthRedirect] Redirecting to daily program');
              navigate('/daily-program', { replace: true });
              break;
            default:
              console.log('[useAuthRedirect] Unknown role, staying on current page');
              break;
          }
        } catch (error) {
          console.error('[useAuthRedirect] Navigation error:', error);
        }
      }, 100);
    }
  }, [user, userRole, loading, navigate, location.pathname, isManualRoleChange]);
};
