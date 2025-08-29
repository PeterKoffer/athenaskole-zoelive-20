// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

function sanitizeUrl(u?: string) {
  return (u ?? "").trim().replace(/\/+$/, "");
}

const envUrl  = sanitizeUrl(import.meta.env?.VITE_SUPABASE_URL as string);
const envAnon = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string)?.trim();

// (VALGFRIT – midlertidig fallback, kun til fejlsøgning)
// Udfyld KUN disse to linjer hvis du vil teste uden .env.local
const FALLBACK_URL  = "https://yphkfkpfdpdmllotpqua.supabase.co"; // fx "https://yphkfkpfdpdmllotpqua.supabase.co"
const FALLBACK_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaGtma3BmZHBkbWxsb3RwcXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcxNTksImV4cCI6MjA2Mzk5MzE1OX0.hqyZ2nk3dqMx8rX9tdM1H4XF9wZ9gvaRor-6i5AyCy8"; // fx "eyJhbGciOiJIUzI1NiIs..."

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
