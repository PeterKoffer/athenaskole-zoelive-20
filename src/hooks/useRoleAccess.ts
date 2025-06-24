
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const SESSION_ROLE_KEY = "lovable-session-userRole";
const MANUAL_ROLE_CHANGE_FLAG = "lovable-manual-role-change";

export const useRoleAccess = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isManuallyChangingRole, setIsManuallyChangingRole] = useState(false);

  const debugLog = (...args: any[]) => {
    console.log("[useRoleAccess]", ...args);
  };

  const getRoleFromUser = (): UserRole | null => {
    const meta = user?.user_metadata;
    if (meta?.role) return meta.role as UserRole;
    return null;
  };

  const getRoleFromSession = (): UserRole | null => {
    if (typeof window !== "undefined") {
      const val = sessionStorage.getItem(SESSION_ROLE_KEY) as UserRole | null;
      if (val) return val;
    }
    return null;
  };

  const isManualRoleChange = (): boolean => {
    // Check both the state and the session storage flag
    if (isManuallyChangingRole) return true;
    
    if (typeof window !== "undefined") {
      const flag = sessionStorage.getItem(MANUAL_ROLE_CHANGE_FLAG);
      return flag === "true";
    }
    return false;
  };

  const clearManualRoleChangeFlag = () => {
    setIsManuallyChangingRole(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(MANUAL_ROLE_CHANGE_FLAG);
    }
  };

  useEffect(() => {
    if (loading) {
      debugLog("Auth still loading, waiting...");
      return;
    }

    const sessionRole = getRoleFromSession();
    const profileRole = getRoleFromUser();

    debugLog("Session role:", sessionRole, "Profile role:", profileRole, "User:", user?.email);

    if (user) {
      // If we have a profile role and no session role, use the profile role
      if (profileRole && !sessionRole) {
        debugLog("Using profile role from metadata:", profileRole);
        setUserRole(profileRole);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_ROLE_KEY, profileRole);
        }
        return;
      }

      // If we have a session role, use it (but not during manual changes)
      if (sessionRole && !isManualRoleChange()) {
        debugLog("Using session role:", sessionRole);
        setUserRole(sessionRole);
        return;
      }

      // Don't auto-set role if we're in the middle of a manual change
      if (isManualRoleChange()) {
        debugLog("Manual role change in progress, keeping current role");
        return;
      }
      
      // Default for authenticated users without role
      if (!sessionRole && !profileRole) {
        debugLog("Setting default role for authenticated user");
        setUserRole("student");
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_ROLE_KEY, "student");
        }
      }
      return;
    }

    // For unauthenticated users, clear any role
    debugLog("No authenticated user - clearing role");
    setUserRole(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_ROLE_KEY);
    }
  }, [user, loading, isManuallyChangingRole]);

  const setUserRoleManually = (role: UserRole) => {
    debugLog("🔄 MANUAL ROLE CHANGE TO:", role, "- BLOCKING all auto-redirects");
    
    // Set both flags immediately to prevent any redirects
    setIsManuallyChangingRole(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(MANUAL_ROLE_CHANGE_FLAG, "true");
    }
    
    // Update the role
    setUserRole(role);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_ROLE_KEY, role);
    }

    // Clear the flags after a shorter delay for better UX
    setTimeout(() => {
      clearManualRoleChangeFlag();
      debugLog("✅ Manual role change complete - auto-redirects re-enabled");
    }, 1000); // Reduced from 3000 to 1000ms
  };

  const hasRole = (requiredRoles: UserRole[]): boolean => {
    const result = !!userRole && requiredRoles.includes(userRole);
    debugLog("hasRole check:", requiredRoles, "current role:", userRole, "result:", result);
    return result;
  };

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
    canAccessSchoolDashboard,
    isManualRoleChange,
    clearManualRoleChangeFlag,
  };
};
