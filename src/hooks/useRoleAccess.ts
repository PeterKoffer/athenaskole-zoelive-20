
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
  const { user, loading } = useAuth();

  // Helper: logging, for debugging if needed
  const debugLog = (...args: any[]) => {
    console.log("[useRoleAccess]", ...args);
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
    // Don't initialize with any role - wait for useEffect
    debugLog("Init: waiting for auth to load");
    return null;
  });

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (loading) {
      debugLog("useEffect: auth still loading, waiting...");
      return;
    }

    // 1. Try the freshest user profile first
    const profileRole = getRoleFromUser();

    debugLog("useEffect ran: user", user?.id, "profileRole", profileRole, "loading", loading);

    if (profileRole) {
      debugLog("Effect: Setting userRole to profileRole", profileRole);
      setUserRole(profileRole);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_ROLE_KEY, profileRole);
      }
      return;
    }

    // 2. If user is authenticated but no role in metadata, check session storage
    if (user) {
      const priorSessionRole = getRoleFromSession();
      if (priorSessionRole) {
        debugLog("Effect: User authenticated, using sessionStorage role", priorSessionRole);
        setUserRole(priorSessionRole);
        return;
      }
      
      // User is authenticated but has no role - this shouldn't happen in normal flow
      // Don't default to student, leave as null so they can be properly redirected
      debugLog("Effect: Authenticated user with no role detected, keeping null");
      setUserRole(null);
      return;
    }

    // 3. User is not authenticated - fall back to student for guest access
    debugLog("Effect: No user authenticated, setting to student");
    setUserRole("student");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_ROLE_KEY, "student");
    }
  }, [user, loading]);

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
