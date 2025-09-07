// src/pages/Auth.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

export default function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  // Hvis man allerede er logget ind, så send videre til appen
  useEffect(() => {
    if (user) {
      const next =
        new URLSearchParams(location.search).get("next") || "/daily-program";
      navigate(next, { replace: true });
    }
  }, [user, location.search, navigate]);

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setSending(false);
    if (error) {
      alert(error.message);
    } else {
      alert("Tjek din e-mail for et magisk login-link.");
    }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) alert(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        <form onSubmit={signInWithEmail} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full border rounded px-3 py-2"
          >
            {sending ? "Sender link..." : "Send magic link"}
          </button>
        </form>

        <div className="text-center text-sm">eller</div>

        <button
          onClick={signInWithGoogle}
          className="w-full border rounded px-3 py-2"
        >
          Fortsæt med Google
        </button>
      </div>
    </div>
  );
}
