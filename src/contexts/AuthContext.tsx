
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useSupabaseAuth } from '@/hooks/useAuth';

// Re-export the auth functionality through a context for consistency
const AuthContext = createContext<ReturnType<typeof useSupabaseAuth> | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useSupabaseAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
