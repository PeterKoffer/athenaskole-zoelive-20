
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

export const useRoleAccess = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.role) {
      setUserRole(user.user_metadata.role as UserRole);
    } else {
      // Default role for users without explicit role metadata
      setUserRole('student');
    }
  }, [user]);

  const hasRole = (requiredRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  };

  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  const isSchoolLeader = (): boolean => {
    return userRole === 'school_leader';
  };

  const isSchoolStaff = (): boolean => {
    return userRole === 'school_staff';
  };

  const isTeacher = (): boolean => {
    return userRole === 'teacher';
  };

  const canAccessAIInsights = (): boolean => {
    return hasRole(['admin', 'school_leader']);
  };

  const canAccessSchoolDashboard = (): boolean => {
    return hasRole(['admin', 'school_leader', 'school_staff']);
  };

  return {
    userRole,
    hasRole,
    isAdmin,
    isSchoolLeader,
    isSchoolStaff,
    isTeacher,
    canAccessAIInsights,
    canAccessSchoolDashboard
  };
};
