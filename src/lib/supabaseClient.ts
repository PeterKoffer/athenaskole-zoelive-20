// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

function sanitizeUrl(u?: string) {
  return (u ?? "").trim().replace(/\/+$/, "");
}

const envUrl  = sanitizeUrl(import.meta.env?.VITE_SUPABASE_URL as string);
const envAnon = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string)?.trim();

// (VALGFRIT) – udfyld KUN hvis du vil have hardcoded fallback i fx Lovable preview
const FALLBACK_URL  = ""; // fx "https://yphkfkpfdpdmllotpqua.supabase.co"
const FALLBACK_ANON = ""; // fx "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." (anon key)

const url  = envUrl  || FALLBACK_URL;
const anon = envAnon || FALLBACK_ANON;

if (!url || !anon) {
  // Gør fejlen tydelig i dev – så slipper du for “Invalid API key” senere
  // (Vi logger kun længden af nøglen for ikke at eksponere den)
  console.error("[Supabase] Missing config",
    { urlPresent: !!url, anonLen: anon ? anon.length : 0 }
  );
  throw new Error(
    "Supabase config mangler. Sæt VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env.local og genstart dev-serveren."
  );
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});
