// src/pages/Auth.tsx
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

let SupabaseAuth: any = null;
try {
  // virker hvis @supabase/auth-ui-react er installeret (den var det i main)
  SupabaseAuth = require("@supabase/auth-ui-react").Auth;
} catch {}

export default function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    // Hvis man allerede er logget ind, så videre til daily-program
    navigate("/daily-program", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {SupabaseAuth ? (
          <SupabaseAuth supabaseClient={supabase} providers={["google"]} />
        ) : (
          <p>
            Supabase Auth UI mangler. Installer med:
            <code> npm i @supabase/auth-ui-react @supabase/auth-ui-shared </code>
          </p>
        )}
      </div>
    </div>
  );
}
