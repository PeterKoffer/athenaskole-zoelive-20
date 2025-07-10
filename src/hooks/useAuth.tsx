import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔑 Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔑 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔑 Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('🔑 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Attempting sign in for:', email);
    setLoading(true);
    
    // Clean the password to remove any extra spaces
    const cleanPassword = password.trim();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: cleanPassword,
    });
    
    if (error) {
      console.error('🔑 Sign in error:', error);
      setLoading(false);
      throw error;
    }
    
    console.log('🔑 Sign in successful:', data.user?.email);
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('🔑 Attempting sign up for:', email);
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error('🔑 Sign up error:', error);
      setLoading(false);
      throw error;
    }
    
    console.log('🔑 Sign up successful:', data.user?.email);
    setLoading(false);
  };

  const signOut = async () => {
    console.log('🔑 Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('🔑 Sign out error:', error);
      throw error;
    }
    console.log('🔑 Sign out successful');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut 
    }}>
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
