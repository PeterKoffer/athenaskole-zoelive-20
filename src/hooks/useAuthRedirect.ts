
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

/**
 * Handles automatic redirection after authentication based on user role
 * ALLOWS unauthenticated users to access learning content as guests
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

    // CRITICAL: ALWAYS allow learning content for guests and authenticated users
    const learningPaths = ['/learn', '/daily-program', '/mathematics', '/english', '/science'];
    const isInLearningSession = learningPaths.some(path => location.pathname.includes(path));
    
    if (isInLearningSession) {
      console.log('[useAuthRedirect] ✅ ALLOWING learning session access:', location.pathname);
      return;
    }

    // If we're on the auth page, allow role selection
    if (location.pathname === '/auth') {
      console.log('[useAuthRedirect] On auth page - allowing role selection');
      return;
    }

    // Only auto-redirect authenticated users with roles from the home page
    // Add additional check to prevent infinite loops
    if (location.pathname === '/' && user && userRole && !loading) {
      console.log('[useAuthRedirect] ✅ Auto-redirecting authenticated user from home page');

      // Single redirect call without delays to prevent loops
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
    }
  }, [user?.id, userRole, loading, location.pathname, navigate]); // Fixed dependency array to prevent infinite loops

  // Removed isManualRoleChange from dependencies to prevent infinite re-renders
};
