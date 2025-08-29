// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

function sanitize(u?: string) {
  return (u ?? "").trim().replace(/\/+$/, "");
}

const url  = sanitize(import.meta.env.VITE_SUPABASE_URL as string);
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!url || !anon) {
  console.error("[Supabase] Missing config", { urlPresent: !!url, anonLen: anon ? anon.length : 0 });
  throw new Error("Supabase ENV mangler. Sæt VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env.local og genstart.");
}

// Sikker debug i dev
if (import.meta.env.DEV) {
  try {
    const host = new URL(url).host;
    const payloadJson = atob(anon.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);
    const issHost = payload?.iss ? new URL(payload.iss).host : "n/a";
    console.info("[Supabase]", { urlHost: host, anonLen: anon.length, role: payload?.role, issHost });
  } catch { /* no-op */ }
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
  // Tving nøgler på alle requests, så signup/signin altid har korrekte headers
  global: {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
  },
});
