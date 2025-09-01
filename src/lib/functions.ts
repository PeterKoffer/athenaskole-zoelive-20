// src/lib/functions.ts
// Small, robust helpers to call Supabase Edge Functions from the client (Vite/React).

/// <reference types="vite/client" />

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

// --- Utils -------------------------------------------------------------------

function sanitize(u?: string) {
  return (u ?? "").trim().replace(/\/+$/, "");
}

const BASE = sanitize(import.meta.env.VITE_SUPABASE_URL as string);
const ANON = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!BASE || !ANON) {
  throw new Error(
    "Supabase ENV mangler. Sæt VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env.local"
  );
}

if (import.meta.env.DEV) {
  try {
    const host = new URL(BASE).host;
    console.info("[Supabase Edge]", { host, anonLen: ANON.length });
  } catch {
    /* noop */
  }
}

async function postFunction<T = any>(path: string, body?: Json): Promise<T> {
  const url = `${BASE}/functions/v1${path.startsWith("/") ? path : "/" + path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify(body ?? {}),
  });

  if (!res.ok) {
    // Try to surface a useful error message from the function
    let detail = "";
    try {
      detail = (await res.text()) || res.statusText;
    } catch {
      detail = res.statusText;
    }
    throw new Error(`Edge ${path} ${res.status}: ${detail}`);
  }

  return (await res.json()) as T;
}

// --- Public API ---------------------------------------------------------------

export type ImageParams = Partial<{
  universeId: string;
  gradeInt: number;
  title: string;
  width: number;
  height: number;
}>;

const DEFAULTS: Required<ImageParams> = {
  universeId: "universe-fallback",
  gradeInt: 5,
  title: "Mathematics Quest 001",
  width: 1024,
  height: 1024,
} as const;

/**
 * Calls the **new** routed service: /functions/v1/image-service/generate
 * Usually returns `{ url: string }` (can be data: or https).
 */
export async function generateCover(params?: ImageParams): Promise<string> {
  const payload = { ...DEFAULTS, ...(params || {}) };
  const data = await postFunction<{ url?: string }>(
    "/image-service/generate",
    payload
  );
  if (!data?.url) throw new Error("Edge returned no url");
  return data.url;
}

/**
 * Calls the **existing** function name route: /functions/v1/image-ensure
 * Typically returns `{ publicUrl: string }` but we also accept `{ url }`.
 */
export async function ensureCover(params?: ImageParams): Promise<string> {
  const payload = { ...DEFAULTS, ...(params || {}) };
  const data = await postFunction<{ publicUrl?: string; url?: string }>(
    "/image-ensure",
    payload
  );
  const u = data?.publicUrl || data?.url;
  if (!u) throw new Error("Edge returned no public URL");
  return u;
}
