// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

function sanitizeUrl(u?: string) {
  return (u ?? "").trim().replace(/\/+$/, "");
}

const envUrl  = sanitizeUrl(import.meta.env?.VITE_SUPABASE_URL as string);
const envAnon = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string)?.trim();

// No fallbacks - use environment variables only
const FALLBACK_URL  = "";
const FALLBACK_ANON = "";

const url  = envUrl  || FALLBACK_URL;
const anon = envAnon || FALLBACK_ANON;

if (!url || !anon) {
  console.error("[Supabase] Missing config", { urlPresent: !!url, anonLen: anon ? anon.length : 0 });
  throw new Error("Supabase mangler ENV. Sæt VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env.local og genstart dev-server.");
}

// Sikker debug i dev: tjek at anon key ‘iss’ matcher projektets host
if (import.meta.env?.DEV) {
  try {
    const host = new URL(url).host; // fx yphkfkpfdpdmllotpqua.supabase.co
    const parts = anon.split(".");
    const payloadJson = parts[1]
      ? atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      : "{}";
    const payload = JSON.parse(payloadJson);
    const issHost = payload?.iss ? new URL(payload.iss).host : "n/a";
    console.info("[Supabase]", { urlHost: host, anonLen: anon.length, role: payload?.role, issHost });
  } catch (e) {
    console.warn("[Supabase] Could not parse anon key payload", e);
  }
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});
