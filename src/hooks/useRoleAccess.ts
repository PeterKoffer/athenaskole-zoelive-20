
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const SESSION_ROLE_KEY = "lovable-session-userRole";

export const useRoleAccess = () => {
  const { user } = useAuth();

  // Initialize directly from sessionStorage if available, or null
  const getInitialRole = () => {
    if (typeof window !== "undefined") {
      const sessionRole = sessionStorage.getItem(SESSION_ROLE_KEY);
      if (sessionRole) {
        return sessionRole as UserRole;
      }
    }
    return null;
  };

  const [userRole, setUserRole] = useState<UserRole | null>(getInitialRole);

  useEffect(() => {
    let detectedRole: UserRole | null = null;
    // Try direct from metadata if possible
    if (user?.user_metadata?.role) {
      detectedRole = user.user_metadata.role as UserRole;
      // Persist to sessionStorage if different from what's already there
      if (typeof window !== "undefined") {
        const oldSessionRole = sessionStorage.getItem(SESSION_ROLE_KEY);
        if (oldSessionRole !== detectedRole) {
          sessionStorage.setItem(SESSION_ROLE_KEY, detectedRole);
        }
      }
      setUserRole(detectedRole);
    } else {
      // Fallback: read from sessionStorage
      if (typeof window !== "undefined") {
        const sessionRole = sessionStorage.getItem(SESSION_ROLE_KEY);
        if (sessionRole) {
          setUserRole(sessionRole as UserRole);
        } else {
          // Final fallback: default to student
          setUserRole('student');
        }
      } else {
        setUserRole('student');
      }
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
