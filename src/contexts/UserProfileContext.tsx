import { createContext, useContext } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile } from '@/types/user';

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading, error, updateProfile } = useUserProfile();

  return (
    <UserProfileContext.Provider value={{ profile, loading, error, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfileContext must be used within a UserProfileProvider');
  }
  return context;
};
