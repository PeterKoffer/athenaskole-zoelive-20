// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Hvis envs mangler, eksporterer vi en noop-klient så appen ikke crasher under build.
let supabase: SupabaseClient | null = null;

if (url && anon) {
  supabase = createClient(url, anon);
} else {
  // Minimal no-op facsimile, så imports ikke fejler i Vite
  supabase = {
    auth: {
      async getSession() { return { data: { session: null } } as any },
      onAuthStateChange() { return { data: { subscription: { unsubscribe(){} } } } as any },
      async signOut() { /* noop */ },
    },
  } as any;
}

export { supabase };
export default supabase;
