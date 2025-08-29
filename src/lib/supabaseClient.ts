// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

function sanitize(u?: string) {
  return (u ?? "").trim().replace(/\/+$/, "");
}

const url  = sanitize(import.meta.env.VITE_SUPABASE_URL as string);
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!url || !anon) {
  console.error("[Supabase] Missing config", { urlPresent: !!url, anonLen: anon ? anon.length : 0 });
  throw new Error("Supabase ENV mangler. Tilføj VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env.local og genstart dev.");
}

// Sikker debug i dev: tjek at issHost matcher projektets host
if (import.meta.env.DEV) {
  try {
    const host = new URL(url).host;
    const parts = anon.split(".");
    const payloadJson = parts[1] ? atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")) : "{}";
    const payload = JSON.parse(payloadJson);
    const issHost = payload?.iss ? new URL(payload.iss).host : "n/a";
    console.info("[Supabase]", { urlHost: host, anonLen: anon.length, role: payload?.role, issHost });
  } catch {}
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
  // 👇 Gør det umuligt at “miste” nøglerne i request headers
  global: {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
  },
});
