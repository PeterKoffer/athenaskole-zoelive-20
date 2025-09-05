// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Reads Vite env vars. If they’re missing, we export `null`
 * so the app can gracefully fall back in dev.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (url && anon) {
  supabase = createClient(url, anon);
}

export { supabase };
export default supabase;
