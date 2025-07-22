
import React, { createContext, useContext } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { UserRole } from '@/types/auth';

interface RoleContextType {
  userRole: UserRole | null;
  setUserRoleManually: (role: UserRole) => void;
  canAccessSchoolDashboard: () => boolean;
  canAccessAIInsights: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const roleAccess = useRoleAccess();
  
  return (
    <RoleContext.Provider value={roleAccess}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
};
