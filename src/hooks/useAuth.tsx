// src/hooks/useAuth.tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  quickSignIn?: (role: "admin" | "teacher" | "student") => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  // noops – bliver overskrevet i provider
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Init session + subscribe to changes
  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);

      const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession ?? null);
        setUser(newSession?.user ?? null);
      });
      unsub = () => sub.subscription.unsubscribe();
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error; // fang i UI og vis besked "Forkert email/kodeord"
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
  }, []);

  // Valgfri quick logins – ret emails/passwords til jeres testbrugere
  const quickSignIn = useCallback(async (role: "admin" | "teacher" | "student") => {
    const DEMO = {
      admin:   { email: "admin@example.com",   password: "Pass1234!" },
      teacher: { email: "teacher@example.com", password: "Pass1234!" },
      student: { email: "student@example.com", password: "Pass1234!" },
    } as const;
    const creds = DEMO[role];
    const { error } = await supabase.auth.signInWithPassword(creds);
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, session, loading, signIn, signOut, quickSignIn,
  }), [user, session, loading, signIn, signOut, quickSignIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
