import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  // ✅ useAuth is called inside the component (under the provider)
  const { user, isLoading, signIn, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Welcome to Athena Skole</h1>

      {user ? (
        <>
          <p className="text-lg">Signed in as <span className="font-medium">{user.email ?? user.id}</span></p>
          <div className="flex gap-3">
            <Link to="/daily-program" className="underline">Go to Daily Program</Link>
            <Link to="/training-ground" className="underline">Training Ground</Link>
            <button
              className="border px-3 py-2 rounded"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-lg">You’re not signed in.</p>
          <div className="flex gap-3">
            <Link to="/auth" className="underline">Open Sign-in</Link>
            <button
              className="border px-3 py-2 rounded"
              onClick={() => signIn?.()}
            >
              Quick Sign-in
            </button>
          </div>
        </>
      )}
    </main>
  );
}
