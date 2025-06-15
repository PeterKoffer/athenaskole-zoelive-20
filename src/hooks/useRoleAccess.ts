import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const SESSION_ROLE_KEY = "lovable-session-userRole";

/**
 * Loads and persists the *last known valid* role for navigation durability.
 * - Always prefers user.user_metadata.role if present (profile from Supabase)
 * - Otherwise, falls back to last persisted sessionStorage role
 * - *Never downgrades* to "student" during navigation if prior valid role exists.
 * - Only falls back to "student" if both user and saved session role are missing.
 */
export const useRoleAccess = () => {
  const { user } = useAuth();

  // Get role from user profile
  const getRoleFromUser = (): UserRole | null => {
    const meta = user?.user_metadata;
    if (meta?.role) return meta.role as UserRole;
    return null;
  };

  // Get role from sessionStorage
  const getRoleFromSession = (): UserRole | null => {
    if (typeof window !== "undefined") {
      const sessionRole = sessionStorage.getItem(SESSION_ROLE_KEY) as UserRole | null;
      if (sessionRole) return sessionRole;
    }
    return null;
  };

  // Setup role, but NEVER lose a privileged role when navigating.
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const userMetaRole = getRoleFromUser();
    if (userMetaRole) return userMetaRole;
    const saved = getRoleFromSession();
    return saved || null;
  });

  useEffect(() => {
    // 1. Get the current role from Supabase user profile if available
    const profileRole = getRoleFromUser();

    if (profileRole) {
      setUserRole(profileRole);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_ROLE_KEY, profileRole);
      }
      return;
    }

    // 2. Otherwise use the last session storage role
    const priorSessionRole = getRoleFromSession();
    if (priorSessionRole) {
      // Don't auto downgrade to student if previously leader/admin
      if (userRole !== priorSessionRole) {
        setUserRole(priorSessionRole);
      }
      // Keep highest role sticky
      return;
    }

    // 3. If signed out or no profile, clear session, fall back ONLY NOW to student
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_ROLE_KEY);
    }
    setUserRole('student');
  // Intentionally depend on "user" only - this ensures we sync up on auth change
  // and avoid unnecessary resets
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Manual "role switcher"
  const setUserRoleManually = (role: UserRole) => {
    setUserRole(role);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_ROLE_KEY, role);
    }
  };

  const hasRole = (requiredRoles: UserRole[]): boolean =>
    !!userRole && requiredRoles.includes(userRole);

  // Convenient role checks
  const isAdmin = () => userRole === 'admin';
  const isSchoolLeader = () => userRole === 'school_leader';
  const isSchoolStaff = () => userRole === 'school_staff';
  const isTeacher = () => userRole === 'teacher';
  const canAccessAIInsights = () => hasRole(['admin', 'school_leader']);
  const canAccessSchoolDashboard = () => hasRole(['admin', 'school_leader', 'school_staff']);

  return {
    userRole,
    setUserRoleManually,
    hasRole,
    isAdmin,
    isSchoolLeader,
    isSchoolStaff,
    isTeacher,
    canAccessAIInsights,
    canAccessSchoolDashboard
  };
};
