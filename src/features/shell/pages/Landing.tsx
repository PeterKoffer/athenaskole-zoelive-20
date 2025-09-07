// src/features/shell/pages/Landing.tsx
import { Link } from "react-router-dom";
// Vi læser auth *inde* i komponenten. Hvis hooket kaster (mangler provider),
// fanger vi det og viser "signed-out" visning i stedet.
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  // default: antag signed-out
  let authed = false;
  let displayName: string | undefined;

  try {
    const { user } = useAuth();
    authed = !!user;

    // Supabase: brug user.user_metadata til visningsnavn
    const meta = (user as any)?.user_metadata ?? {};
    displayName =
      meta.full_name ??
      meta.name ??
      meta.display_name ??
      user?.email ??
      undefined;
  } catch {
    // Hvis useAuth kaster (ingen provider), så fortsæt som signed-out.
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background text-foreground">
      <div className="max-w-2xl w-full space-y-6">
        {/* NELIE visual (fra /public) */}
        <div className="flex justify-center">
          <img
            src="/nelie.png"
            alt="NELIE — the floating tutor"
            className="h-32 w-32 object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold text-center">
          {authed
            ? `Welcome${displayName ? `, ${displayName}` : ""}!`
            : "Welcome to NELIE"}
        </h1>

        {authed ? (
          <div className="flex gap-3 justify-center">
            <Link
              to="/daily-program"
              className="px-4 py-2 rounded-xl border hover:bg-accent"
            >
              Go to Daily Program
            </Link>
            <Link
              to="/training-ground"
              className="px-4 py-2 rounded-xl border hover:bg-accent"
            >
              Training Ground
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p>Sign in to start your personalized journey with NELIE.</p>
            <Link
              to="/auth"
              className="inline-block px-4 py-2 rounded-xl border hover:bg-accent"
            >
              Sign in / Create account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
