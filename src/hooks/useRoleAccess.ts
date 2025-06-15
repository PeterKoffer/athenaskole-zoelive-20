
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const SESSION_ROLE_KEY = "lovable-session-userRole";

/**
 * Loads and persists the *last known valid* role for navigation durability.
 * - Always prefers user.user_metadata.role if present (profile from Supabase)
 * - Otherwise, falls back to last persisted sessionStorage role
 * - *Never downgrades* to "student" during navigation if prior valid role exists.
 * - Only falls back to "student" if both user and saved session role are missing (i.e., signed out, or truly no assigned role).
 */
export const useRoleAccess = () => {
  const { user } = useAuth();

  // Helper: logging, for debugging if needed
  const debugLog = (...args: any[]) => {
    // Uncomment to debug:
    // console.log("[useRoleAccess]", ...args);
  };

  // Role from live user object
  const getRoleFromUser = (): UserRole | null => {
    const meta = user?.user_metadata;
    debugLog("getRoleFromUser:", meta?.role, meta);
    if (meta?.role) return meta.role as UserRole;
    return null;
  };

  // Role from sessionStorage
  const getRoleFromSession = (): UserRole | null => {
    if (typeof window !== "undefined") {
      const val = sessionStorage.getItem(SESSION_ROLE_KEY) as UserRole | null;
      debugLog("getRoleFromSession:", val);
      if (val) return val;
    }
    return null;
  };

  // The role state (null at first; updated after user or session storage checked)
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    // Try in priority order:
    const fromUser = getRoleFromUser();
    if (fromUser) {
      debugLog("Init: using userMetaRole", fromUser);
      return fromUser;
    }
    const fromSession = getRoleFromSession();
    if (fromSession) {
      debugLog("Init: using sessionStorage role", fromSession);
      return fromSession;
    }
    // Don't default to student yet; wait for useEffect!
    debugLog("Init: no role found, returning null");
    return null;
  });

  useEffect(() => {
    // 1. Try the freshest user profile
    const profileRole = getRoleFromUser();

    debugLog("useEffect ran: user", user, "profileRole", profileRole);

    if (profileRole) {
      debugLog("Effect: Setting userRole to profileRole", profileRole);
      setUserRole(profileRole);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_ROLE_KEY, profileRole);
      }
      return;
    }

    // 2. Otherwise use the last session storage role
    const priorSessionRole = getRoleFromSession();
    if (priorSessionRole) {
      if (userRole !== priorSessionRole) {
        debugLog("Effect: Restoring role from sessionStorage", priorSessionRole);
        setUserRole(priorSessionRole);
      }
      return;
    }

    // 3. If user *really* has no role and nothing in session => guest fallback: "student"
    // Only set student if actually not authenticated OR everything else cleared.
    if (!user) {
      debugLog("Effect: No user/role/session, fallback to 'student'");
      setUserRole("student");
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_ROLE_KEY, "student");
      }
    } else {
      // We're signed in but no role from profile or session: don't force "student", just null!
      debugLog("Effect: Authenticated but NO role detected, setting userRole to null");
      setUserRole(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Set user role manually, and persist
  const setUserRoleManually = (role: UserRole) => {
    debugLog("setUserRoleManually:", role);
    setUserRole(role);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_ROLE_KEY, role);
    }
  };

  /**
   * Checks if current role matches any in a list.
   */
  const hasRole = (requiredRoles: UserRole[]): boolean =>
    !!userRole && requiredRoles.includes(userRole);

  // Shortcuts for convenience
  const isAdmin = () => userRole === 'admin';
  const isSchoolLeader = () => userRole === 'school_leader';
  const isSchoolStaff = () => userRole === 'school_staff';
  const isTeacher = () => userRole === 'teacher';
  const canAccessAIInsights = () => hasRole(['admin', 'school_leader']);
  const canAccessSchoolDashboard = () => hasRole(['admin', 'school_leader', 'school_staff']);

  debugLog("Returned userRole:", userRole);

  return {
    userRole,
    setUserRoleManually,
    hasRole,
    isAdmin,
    isSchoolLeader,
    isSchoolStaff,
    isTeacher,
    canAccessAIInsights,
    canAccessSchoolDashboard,
  };
};
