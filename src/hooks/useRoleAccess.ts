
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const SESSION_ROLE_KEY = "lovable-session-userRole";
const MANUAL_ROLE_CHANGE_FLAG = "lovable-manual-role-change";

export const useRoleAccess = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

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
    if (typeof window !== "undefined") {
      const flag = sessionStorage.getItem(MANUAL_ROLE_CHANGE_FLAG);
      return flag === "true";
    }
    return false;
  };

  const clearManualRoleChangeFlag = () => {
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
      if (sessionRole) {
        debugLog("Using session role:", sessionRole);
        setUserRole(sessionRole);
        return;
      }
      
      if (profileRole) {
        debugLog("Using profile role:", profileRole);
        setUserRole(profileRole);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_ROLE_KEY, profileRole);
        }
        return;
      }
      
      // Default for authenticated users without role
      debugLog("Setting default role for authenticated user");
      setUserRole("student");
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_ROLE_KEY, "student");
      }
      return;
    }

    // For unauthenticated users, set school_leader for testing
    debugLog("Setting school_leader for unauthenticated user");
    setUserRole("school_leader");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_ROLE_KEY, "school_leader");
    }
  }, [user, loading]);

  const setUserRoleManually = (role: UserRole) => {
    debugLog("MANUAL ROLE CHANGE:", role, "- Setting flag to prevent auto-redirects");
    
    // Set flag to prevent automatic redirects
    if (typeof window !== "undefined") {
      sessionStorage.setItem(MANUAL_ROLE_CHANGE_FLAG, "true");
    }
    
    setUserRole(role);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_ROLE_KEY, role);
    }

    // Clear the flag after a short delay to allow navigation to complete
    setTimeout(() => {
      clearManualRoleChangeFlag();
      debugLog("Manual role change flag cleared");
    }, 2000);
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
