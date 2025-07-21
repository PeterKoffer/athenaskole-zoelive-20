
import { useState, useEffect } from 'react';
import { UserRole } from '@/types/auth';
import { useAuth } from './useAuth';

export const useRoleAccess = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (user) {
      // Default to student role if none specified
      const role = user.user_metadata?.role || 'student';
      setUserRole(role as UserRole);
    } else {
      setUserRole(null);
    }
  }, [user]);

  const setUserRoleManually = (role: UserRole) => {
    console.log('[useRoleAccess] Setting role manually:', role);
    setUserRole(role);
  };

  const canAccessSchoolDashboard = () => {
    return userRole === 'admin' || userRole === 'school_leader' || userRole === 'school_staff';
  };

  const canAccessAIInsights = () => {
    return userRole === 'admin' || userRole === 'school_leader';
  };

  return {
    userRole,
    setUserRoleManually,
    canAccessSchoolDashboard,
    canAccessAIInsights
  };
};
