// src/lib/supabaseClient.ts
// Minimal og sikker initialisering. Virker også hvis env mangler.
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    console.warn(
      "[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY mangler - kører i dev/offline-mode."
    );
    return null;
  }

  // Late import så pakken ikke kræves hvis man kører uden Supabase
  const { createClient } = (await import('@supabase/supabase-js')) as typeof import('@supabase/supabase-js');
  client = createClient(url, anon);
  return client;
}

// Kompat navn hvis noget kode tidligere importerede { supabase }
export const supabase = await (async () => getSupabase())();
export default supabase;
