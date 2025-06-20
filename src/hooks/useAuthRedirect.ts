
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

/**
 * Handles automatic redirection after authentication based on user role
 * BLOCKS redirects during active learning sessions to prevent interruption
 */
export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const { userRole, isManualRoleChange } = useRoleAccess();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) {
      console.log('[useAuthRedirect] Skipping redirect - still loading');
      return;
    }

    // CRITICAL: Block ALL redirects during manual role changes
    if (isManualRoleChange()) {
      console.log('[useAuthRedirect] 🚫 BLOCKING redirects - manual role change in progress');
      return;
    }

    // CRITICAL: Block redirects during active learning sessions
    const learningPaths = ['/learn', '/daily-program', '/mathematics', '/english', '/science'];
    const isInLearningSession = learningPaths.some(path => location.pathname.includes(path));
    
    if (isInLearningSession) {
      console.log('[useAuthRedirect] 🚫 BLOCKING redirects - active learning session detected:', location.pathname);
      return;
    }

    // If we're on the auth page, allow role selection
    if (location.pathname === '/auth') {
      console.log('[useAuthRedirect] On auth page - allowing role selection');
      return;
    }

    // For users without authentication who are trying to access learning content, don't redirect away
    if (!user && isInLearningSession) {
      console.log('[useAuthRedirect] No user but in learning session - keeping in session');
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
        // Double-check the manual role change flag and learning session before redirecting
        if (isManualRoleChange()) {
          console.log('[useAuthRedirect] 🚫 LAST MINUTE BLOCK - manual role change detected');
          return;
        }

        const currentPath = window.location.pathname;
        const stillInLearning = learningPaths.some(path => currentPath.includes(path));
        
        if (stillInLearning) {
          console.log('[useAuthRedirect] 🚫 LAST MINUTE BLOCK - learning session detected');
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
