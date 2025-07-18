
import { AuthProvider as BaseAuthProvider } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <BaseAuthProvider>{children}</BaseAuthProvider>;
};
