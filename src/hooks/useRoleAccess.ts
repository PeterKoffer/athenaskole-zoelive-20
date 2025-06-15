
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const SESSION_ROLE_KEY = "lovable-session-userRole";

export const useRoleAccess = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    let detectedRole: UserRole | null = null;
    // 1. Try direct from metadata
    if (user?.user_metadata?.role) {
      detectedRole = user.user_metadata.role as UserRole;
      // Persist it in sessionStorage for this browser session
      sessionStorage.setItem(SESSION_ROLE_KEY, detectedRole);
    } else {
      // 2. Fallback: try sessionStorage
      const sessionRole = sessionStorage.getItem(SESSION_ROLE_KEY);
      if (sessionRole) {
        detectedRole = sessionRole as UserRole;
      } else {
        // 3. Final fallback: default to student if everything else fails
        detectedRole = 'student';
      }
    }
    setUserRole(detectedRole);
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

