
import { useState, useEffect } from 'react';
import { UserRole } from '@/types/auth';

interface RoleAccessState {
  userRole: UserRole | null;
  setUserRoleManually: (role: UserRole) => void;
  clearRole: () => void;
}

export const useRoleAccess = (): RoleAccessState => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const setUserRoleManually = (role: UserRole) => {
    console.log('[useRoleAccess] Setting role manually:', role);
    setUserRole(role);
    localStorage.setItem('selectedRole', role);
  };

  const clearRole = () => {
    console.log('[useRoleAccess] Clearing role');
    setUserRole(null);
    localStorage.removeItem('selectedRole');
  };

  useEffect(() => {
    // Check for stored role on mount
    const storedRole = localStorage.getItem('selectedRole') as UserRole;
    if (storedRole) {
      console.log('[useRoleAccess] Found stored role:', storedRole);
      setUserRole(storedRole);
    }
  }, []);

  return {
    userRole,
    setUserRoleManually,
    clearRole
  };
};
