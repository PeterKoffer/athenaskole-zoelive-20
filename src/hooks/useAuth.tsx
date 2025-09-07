// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type Role =
  | "admin"
  | "school_leader"
  | "school_staff"
  | "teacher"
  | "parent"
  | "student"
  | null;

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  userRole: Role;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: Error }>;
  updateUserRole: (next: Role) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function roleFromUser(u: User | null): Role {
  const r =
    (u?.user_metadata as any)?.role ??
    (u as any)?.role ??
    null;
  const allowed = [
    "admin",
    "school_leader",
    "school_staff",
    "teacher",
    "parent",
    "student",
  ];
  return allowed.includes(r) ? (r as Role) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      const sess = data?.session ?? null;
      setSession(sess);
      setUser(sess?.user ?? null);
      setUserRole(roleFromUser(sess?.user ?? null));
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ?? null);
      setUser(sess?.user ?? null);
      setUserRole(roleFromUser(sess?.user ?? null));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      userRole,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
      },
      signInWithPassword: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error } : {};
      },
      updateUserRole: async (next) => {
        setUserRole(next);
        if (user) {
          // skriv til user metadata; Supabase v2 bruger "data" til user_metadata
          await supabase.auth.updateUser({
            data: { ...(user.user_metadata ?? {}), role: next ?? undefined },
          });
          // hent frisk user
          const { data } = await supabase.auth.getUser();
          const refreshed = data?.user ?? null;
          setUser(refreshed);
          setUserRole(roleFromUser(refreshed));
        }
      },
    }),
    [user, session, userRole, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
