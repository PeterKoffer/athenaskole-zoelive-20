// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ---------- ENV + utils ---------- */

function sanitize(u?: string) {
  return (u ?? "").trim().replace(/\/+$/, "");
}

const url = sanitize(import.meta.env.VITE_SUPABASE_URL as string);
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!url || !anon) {
  console.error("[Supabase] Missing config", {
    urlPresent: !!url,
    anonLen: anon ? anon.length : 0,
  });
  throw new Error(
    "Supabase ENV mangler. Sæt VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env.local og genstart."
  );
}

// Lille helper til Edge Functions med valgfri subpath.
// Eksempel: edgePath("image-service/generate")
// -> https://<ref>.supabase.co/functions/v1/image-service/generate
export function edgePath(path: string) {
  return `${url}/functions/v1/${path.replace(/^\/+/, "")}`;
}

/* ---------- Client ---------- */

export const supabase: SupabaseClient = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
  global: {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
    fetch: async (input, init) => {
      const s = typeof input === "string" ? input : input.toString();
      if (import.meta.env.DEV && s.includes("/auth/v1/")) {
        const h = new Headers(init?.headers);
        console.info("[Supabase fetch]", s.split("/auth/v1/")[1], {
          apikeyLen: (h.get("apikey") || "").length,
          hasAuth: !!h.get("authorization"),
        });
      }
      return fetch(input as any, init as any);
    },
  },
});

// Udskriv lidt nyttig DEV-info én gang (sikkert i både browser/Node)
if (
  import.meta.env.DEV &&
  typeof atob === "function" && // findes i browser/Node 20+ (polyfill i ældre tests)
  typeof URL === "function"
) {
  try {
    const host = new URL(url).host;
    const payload = JSON.parse(
      atob(anon.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    const issHost = payload?.iss ? new URL(payload.iss).host : "n/a";
    console.info("[Supabase]", {
      urlHost: host,
      anonLen: anon.length,
      role: payload?.role,
      issHost,
    });
  } catch {
    // ignore
  }
}

/* ---------- Edge Function helpers ---------- */

type Json =
  | Record<string, any>
  | Array<any>
  | string
  | number
  | boolean
  | null;

export async function invokeEdge<T = any>(
  path: string,
  body?: Json,
  init?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: Record<string, string>;
  }
): Promise<T> {
  const method = init?.method ?? (body != null ? "POST" : "GET");
  const res = await fetch(edgePath(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      ...(init?.headers ?? {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  if (!res.ok) {
    // Prøv at parse JSON-fejl, ellers returnér rå tekst
    try {
      const parsed = JSON.parse(text);
      throw new Error(
        `HTTP ${res.status}: ${parsed.error ?? parsed.message ?? text}`
      );
    } catch {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // nogle functions returnerer plain text
    return text as unknown as T;
  }
}

/* ---------- Image generation (cover) ---------- */

export type GenerateCoverPayload = {
  universeId: string;
  gradeInt: number;
  title: string;
  width: number;
  height: number;
};

/**
 * Kalder Edge Function (fx 'image-service/generate') og returnerer en URL:
 *  - foretrukket: https://... (hvis function uploader til Storage)
 *  - fallback: data:image/... (kan vises direkte i <img src={url} />)
 */
export async function generateCover(
  overrides?: Partial<GenerateCoverPayload>,
  functionPath = "image-service/generate"
): Promise<string> {
  const payload: GenerateCoverPayload = {
    universeId: "7150d0ee-59cc-40d9-a1f3-b31951bb5b24",
    gradeInt: 5,
    title: "Mathematics Quest 001",
    width: 1024,
    height: 1024,
    ...(overrides ?? {}),
  };

  const data = await invokeEdge<{ url?: string; error?: string }>(
    functionPath,
    payload
  );
  if (!data?.url) throw new Error(data?.error || "Function returned no 'url'");
  return data.url;
}

/* ---------- Eksplicit re-eksport af ENV (nogle steder er det rart) ---------- */
export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = anon;

/* ---------- Default export for convenience ---------- */
export default supabase;
