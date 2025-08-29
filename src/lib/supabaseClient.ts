// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

function sanitize(u?: string) { return (u ?? "").trim().replace(/\/+$/, ""); }

const url  = sanitize(import.meta.env.VITE_SUPABASE_URL as string);
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!url || !anon) {
  console.error("[Supabase] Missing config", { urlPresent: !!url, anonLen: anon ? anon.length : 0 });
  throw new Error("Supabase ENV mangler. Sæt VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env.local og genstart.");
}

if (import.meta.env.DEV) {
  try {
    const host = new URL(url).host;
    const payload = JSON.parse(atob(anon.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const issHost = payload?.iss ? new URL(payload.iss).host : "n/a";
    console.info("[Supabase]", { urlHost: host, anonLen: anon.length, role: payload?.role, issHost });
  } catch {}
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
  global: {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
    fetch: async (input, init) => {
      const urlStr = typeof input === "string" ? input : input.toString();
      if (import.meta.env.DEV && urlStr.includes("/auth/v1/")) {
        const h = new Headers(init?.headers);
        console.info("[Supabase fetch]", urlStr.split("/auth/v1/")[1], {
          apikeyLen: (h.get("apikey") || "").length,
          hasAuth: !!h.get("authorization"),
        });
      }
      return fetch(input as any, init as any);
    },
  },
});
