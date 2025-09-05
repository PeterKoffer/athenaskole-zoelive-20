// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import supabase from "@/lib/supabaseClient";

type AuthUser =
  | {
      id: string;
      email?: string;
      role?: string; // "student" | "teacher" | "school_leader" | ...
    }
  | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  signOut: () => Promise<void>;
  // DEV helper: allows setting a fake user when no backend
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
        if (supabase?.auth) {
          // existing session
          const { data } = await supabase.auth.getSession();
          const sUser = data?.session?.user
            ? { id: data.session.user.id, email: data.session.user.email ?? undefined }
            : null;
          setUser(sUser);

          // listen for auth changes
          const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            const next = session?.user
              ? { id: session.user.id, email: session.user.email ?? undefined }
              : null;
            setUser(next);
            if (next) localStorage.setItem("auth:user", JSON.stringify(next));
            else localStorage.removeItem("auth:user");
          });
          unsub = () => sub?.subscription?.unsubscribe?.();
        } else {
          // fallback: use localStorage (dev only)
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
      try {
        unsub?.();
      } catch {
        /* noop */
      }
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signOut: async () => {
        try {
          if (supabase?.auth?.signOut) await supabase.auth.signOut();
        } catch {
          /* ignore */
        }
        localStorage.removeItem("auth:user");
        setUser(null);
      },
      setDevUser: (u) => {
        if (u) localStorage.setItem("auth:user", JSON.stringify(u));
        else localStorage.removeItem("auth:user");
        setUser(u);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
