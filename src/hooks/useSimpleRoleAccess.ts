
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, UserMetadata } from '@/types/auth'; // Import UserMetadata

export const useSimpleRoleAccess = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (loading) return;

    // Simple role determination
    if (user) {
      const metadata = user.user_metadata as UserMetadata | undefined;
      const role = metadata?.role;
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
