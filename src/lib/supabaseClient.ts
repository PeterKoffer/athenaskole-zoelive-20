import { createClient } from "@supabase/supabase-js";

// Works in both Vite (browser) and Node/tsx (scripts)
const viteEnv =
  typeof import.meta !== "undefined" && (import.meta as any)?.env
    ? (import.meta as any).env
    : undefined;

const SUPABASE_URL =
  viteEnv?.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  viteEnv?.VITE_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[supabaseClient] Missing Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). " +
      "Edge calls will fail, but callers should handle fallback."
  );
}

export const supabase = createClient(
  SUPABASE_URL ?? "https://example.invalid",
  SUPABASE_ANON_KEY ?? "anon.invalid",
  { auth: { persistSession: false } }
);
