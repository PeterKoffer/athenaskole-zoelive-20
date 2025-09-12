// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON as string | undefined;

/** Lazy singleton – opretter først klienten, når den bruges */
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  if (!url || !anon) {
    throw new Error(
      "[lib/supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON. " +
      "Create .env.local in project root and restart the dev server."
    );
  }
  _client = createClient(url, anon);
  return _client;
}

/** Bagudkompatibel `supabase`-export via Proxy */
const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    // @ts-ignore
    return (getSupabase() as any)[prop];
  },
});

export { supabase };
export default supabase;
