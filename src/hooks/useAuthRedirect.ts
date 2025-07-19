
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useRoleAccess } from './useRoleAccess';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useRoleAccess();

  useEffect(() => {
    if (user && userRole) {
      console.log('[useAuthRedirect] Checking redirect for authenticated user with role:', userRole);
      
      // Get current path to avoid unnecessary redirects
      const currentPath = window.location.pathname;
      
      // Define target paths for each role
      const targetPaths: Record<string, string> = {
        'admin': '/admin-dashboard',
        'school_leader': '/school-dashboard',
        'school_staff': '/school-dashboard',
        'teacher': '/teacher-dashboard',
        'parent': '/parent-dashboard',
        'student': '/daily-program'
      };
      
      const targetPath = targetPaths[userRole] || '/';
      
      // Only redirect if user is not already on the correct page
      if (currentPath !== targetPath) {
        console.log('[useAuthRedirect] Redirecting from', currentPath, 'to', targetPath);
        navigate(targetPath);
      } else {
        console.log('[useAuthRedirect] User already on correct page:', currentPath);
      }
    }
  }, [user, userRole, navigate]);
};
