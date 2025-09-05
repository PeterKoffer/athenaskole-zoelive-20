// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  email?: string;
  role?: string; // "student" | "teacher" | "school_leader" | ...
} | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  signOut: () => Promise<void>;
  setDevUser: (u: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      try {
        // Prøv alias først, fald tilbage til relativ sti hvis alias ikke virker
        let mod: any = null;
        try {
          mod = await import("@/lib/supabaseClient");
        } catch {
          mod = await import("../lib/supabaseClient").catch(() => null);
        }
        const supabase = mod?.supabase ?? mod?.default ?? null;

        if (supabase?.auth) {
          const { data } = await supabase.auth.getSession();
          const sUser = data?.session?.user
            ? { id: data.session.user.id, email: data.session.user.email }
            : null;
          setUser(sUser);

          const { data: sub } = supabase.auth.onAuthStateChange((_evt: any, session: any) => {
            const next = session?.user ? { id: session.user.id, email: session.user.email } : null;
            setUser(next);
            if (next) localStorage.setItem("auth:user", JSON.stringify(next));
            else localStorage.removeItem("auth:user");
          });
          unsub = () => sub?.subscription?.unsubscribe?.();
        } else {
          const raw = localStorage.getItem("auth:user");
          setUser(raw ? JSON.parse(raw) : null);
        }
      } catch {
        const raw = localStorage.getItem("auth:user");
        setUser(raw ? JSON.parse(raw) : null);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      try { unsub?.(); } catch {}
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signOut: async () => {
      try {
        let mod: any = null;
        try {
          mod = await import("@/lib/supabaseClient");
        } catch {
          mod = await import("../lib/supabaseClient").catch(() => null);
        }
        const supabase = mod?.supabase ?? mod?.default ?? null;
        if (supabase?.auth?.signOut) await supabase.auth.signOut();
      } catch {}
      localStorage.removeItem("auth:user");
      setUser(null);
    },
    setDevUser: (u) => {
      if (u) localStorage.setItem("auth:user", JSON.stringify(u));
      else localStorage.removeItem("auth:user");
      setUser(u);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
