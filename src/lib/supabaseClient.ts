// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON as string | undefined;

/**
 * Lazy singleton – vi opretter først klienten, når den bruges.
 * Det forhindrer "supabaseKey is required" ved import-tid,
 * hvis .env.local ikke er på plads endnu.
 */
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

/**
 * Bagudkompatibel default/named export `supabase`.
 * Vi bruger en Proxy, så eksisterende kode der gør `supabase.auth.*`,
 * virker uden at vi skal instantiere før første brug.
 */
const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    // @ts-ignore – videredeleger alt til den rigtige klient
    return (getSupabase() as any)[prop];
  },
});

// Named + default export (dækker de fleste eksisterende imports)
export { supabase };
export default supabase;
