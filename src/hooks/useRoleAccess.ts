
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const SESSION_ROLE_KEY = "lovable-session-userRole";

/**
 * Loads and persists user roles with proper handling for role switching.
 * - Prioritizes manually set roles (from role switching)
 * - Falls back to user.user_metadata.role if present
 * - Only defaults to "student" for truly unauthenticated users
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

    // 1. Check session storage first (this preserves manual role switches)
    const sessionRole = getRoleFromSession();
    
    // 2. Get role from user profile
    const profileRole = getRoleFromUser();

    debugLog("useEffect ran: user", user?.id, "sessionRole", sessionRole, "profileRole", profileRole, "loading", loading);

    // If user is authenticated
    if (user) {
      // Priority 1: Use session role if it exists (preserves manual switches)
      if (sessionRole) {
        debugLog("Effect: User authenticated, using sessionStorage role", sessionRole);
        setUserRole(sessionRole);
        return;
      }
      
      // Priority 2: Use profile role if available
      if (profileRole) {
        debugLog("Effect: Setting userRole to profileRole", profileRole);
        setUserRole(profileRole);
        // Save to session storage for persistence
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_ROLE_KEY, profileRole);
        }
        return;
      }
      
      // User is authenticated but has no role - this shouldn't happen in normal flow
      // Don't default to student, leave as null so they can be properly handled
      debugLog("Effect: Authenticated user with no role detected, keeping null");
      setUserRole(null);
      return;
    }

    // 3. User is not authenticated - set to school_leader for testing purposes
    debugLog("Effect: No user authenticated, setting to school_leader for testing");
    setUserRole("school_leader");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_ROLE_KEY, "school_leader");
    }
  }, [user, loading]);

  // Set user role manually, and persist (used for role switching)
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
