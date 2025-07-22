
import { useState, useEffect } from 'react';
import { UserRole } from '@/types/auth';
import { useAuth } from './useAuth';

export const useRoleAccess = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [manualRole, setManualRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (user) {
      // If there's a manually set role, use that instead of metadata
      if (manualRole) {
        setUserRole(manualRole);
      } else {
        // Normalize role value from metadata
        const rawRole = user.user_metadata?.role || 'student';
        const normalized =
          typeof rawRole === 'string'
            ? (rawRole.toLowerCase().trim() as UserRole)
            : 'student';
        setUserRole(normalized);
      }
    } else {
      setUserRole(null);
      setManualRole(null);
    }
  }, [user, manualRole]);

  const setUserRoleManually = (role: UserRole) => {
    console.log('[useRoleAccess] Setting role manually:', role);
    setManualRole(role);
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
