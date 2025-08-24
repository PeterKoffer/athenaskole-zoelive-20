// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Make it work in both Vite (browser) and Node (tsx) by falling back to process.env
const VITE =
  typeof import.meta !== "undefined" && (import.meta as any)?.env
    ? (import.meta as any).env
    : ({} as Record<string, string | undefined>);

const SUPABASE_URL =
  VITE.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  VITE.VITE_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[supabaseClient] Missing env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or export them in your shell)."
  );
}

export const supabase = createClient(
  String(SUPABASE_URL ?? ""),
  String(SUPABASE_ANON_KEY ?? "")
);
