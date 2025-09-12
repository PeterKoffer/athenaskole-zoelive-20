// src/services/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON as string | undefined;

// Lazy singleton – undgå crash ved import-tid hvis env mangler
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  if (!url || !anon) {
    throw new Error(
      "[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON. " +
      "Create .env.local in project root and restart the dev server."
    );
  }
  _client = createClient(url, anon);
  return _client;
}
