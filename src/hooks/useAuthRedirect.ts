
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

    // If no user or role, don't redirect (let them stay on current page or go to auth)
    if (!user && !userRole) {
      console.log('[useAuthRedirect] No user and no role - staying put');
      return;
    }

    // CRITICAL: Only redirect from the auth page
    // This hook should NEVER interfere with any other navigation
    if (location.pathname !== '/auth') {
      console.log('[useAuthRedirect] SKIPPING - Not on auth page, current path:', location.pathname);
      return;
    }

    // Ensure we have a role before redirecting
    if (!userRole) {
      console.log('[useAuthRedirect] No role set yet, waiting...');
      return;
    }

    console.log('[useAuthRedirect] ✅ PROCEEDING with redirect - user with role:', userRole, 'from auth page');

    // Add a small delay to ensure manual role change flags are processed
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
            console.log('[useAuthRedirect] Unknown role, staying on auth page');
            break;
        }
      } catch (error) {
        console.error('[useAuthRedirect] Navigation error:', error);
      }
    }, 100); // Small delay to ensure flags are processed
  }, [user, userRole, loading, navigate, location.pathname, isManualRoleChange]);
};
