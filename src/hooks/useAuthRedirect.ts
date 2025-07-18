
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
      console.log('[useAuthRedirect] Redirecting authenticated user with role:', userRole);
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
          navigate('/');
          break;
      }
    }
  }, [user, userRole, navigate]);
};
