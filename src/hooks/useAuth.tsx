
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { name?: string; age?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (newRole: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider render - User:', user?.email, 'Loading:', loading);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session?.user?.email || 'No user');
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    
    console.log('Sign in successful:', data.user?.email);
  };

  const signUp = async (email: string, password: string, metadata?: { name?: string; age?: string }) => {
    console.log('Attempting to sign up:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    
    console.log('Sign up successful:', data.user?.email);
  };

  const signOut = async () => {
    console.log('Signing out user:', user?.email);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    setUser(null);
    console.log('Sign out successful');
  };

  const updateUserRole = async (newRole: string) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    console.log('Updating user role from', user.user_metadata?.role, 'to', newRole);
    
    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        role: newRole
      }
    });
    
    if (error) {
      console.error('Update user role error:', error);
      throw error;
    }
    
    console.log('User role updated successfully:', data.user?.user_metadata?.role);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUserRole }}>
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
