
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const SESSION_ROLE_KEY = "lovable-session-userRole";

/**
 * Loads role from Supabase user, sessionStorage or fallback.
 * - Prefers user.user_metadata.role if present (tied to profile/email!)
 * - Persists to sessionStorage for navigation durability.
 * - Falls back to sessionStorage or "student" if truly unavailable.
 */
export const useRoleAccess = () => {
  const { user } = useAuth();

  // Helper to read role from Supabase profile/user metadata
  const getRoleFromUser = (): UserRole | null => {
    if (user?.user_metadata?.role) return user.user_metadata.role as UserRole;
    return null;
  };

  // Helper to read from sessionStorage
  const getRoleFromSession = (): UserRole | null => {
    if (typeof window !== "undefined") {
      const sessionRole = sessionStorage.getItem(SESSION_ROLE_KEY);
      if (sessionRole) return sessionRole as UserRole;
    }
    return null;
  };

  // Initial state setup - prefer Supabase profile if already loaded, else session
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    // At time of first render, user might not be ready - fallback to sessionStorage
    return getRoleFromUser() || getRoleFromSession() || null;
  });

  useEffect(() => {
    // Always prefer role from Supabase user.profile
    const newRole = getRoleFromUser();
    if (newRole) {
      setUserRole(newRole);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_ROLE_KEY, newRole);
      }
    } else {
      // If not logged in or no profile role, fallback to last session or "student"
      const sessionRole = getRoleFromSession();
      if (sessionRole) {
        setUserRole(sessionRole);
      } else {
        setUserRole('student');
      }
    }
  }, [user]);

  // Manual role setter (e.g., from UI role switcher)
  const setUserRoleManually = (role: UserRole) => {
    setUserRole(role);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_ROLE_KEY, role);
    }
  };

  const hasRole = (requiredRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  };

  // Helpers for common role cases
  const isAdmin = (): boolean => userRole === 'admin';
  const isSchoolLeader = (): boolean => userRole === 'school_leader';
  const isSchoolStaff = (): boolean => userRole === 'school_staff';
  const isTeacher = (): boolean => userRole === 'teacher';
  const canAccessAIInsights = (): boolean => hasRole(['admin', 'school_leader']);
  const canAccessSchoolDashboard = (): boolean => hasRole(['admin', 'school_leader', 'school_staff']);

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
