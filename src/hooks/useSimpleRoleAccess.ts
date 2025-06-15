
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

export const useSimpleRoleAccess = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (loading) return;

    // Simple role determination
    if (user) {
      const role = user.user_metadata?.role as UserRole;
      setUserRole(role || 'student');
    } else {
      // For testing, default to school_leader when not authenticated
      setUserRole('school_leader');
    }
  }, [user, loading]);

  const canAccessSchoolDashboard = () => {
    return userRole && ['admin', 'school_leader', 'school_staff'].includes(userRole);
  };

  return {
    userRole,
    loading: loading || userRole === null,
    canAccessSchoolDashboard
  };
};
