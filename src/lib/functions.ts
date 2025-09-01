// src/lib/image.ts
// Minimal, robust helper til Edge Functions
// (virker i Vite/React-klienten)

/// <reference types="vite/client" />

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

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

async function postFunction<T extends Json>(path: string, body: Json): Promise<T> {
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
    // Prøv at udtrække en mere brugbar fejltekst
    let detail = "";
    try {
      const txt = await res.text();
      detail = txt || res.statusText;
    } catch {
      detail = res.statusText;
    }
    throw new Error(`Edge ${path} ${res.status}: ${detail}`);
  }

  return (await res.json()) as T;
}

// ---------- Public API ----------

export type GenerateCoverParams = Partial<{
  universeId: string;
  gradeInt: number;
  title: string;
  width: number;
  height: number;
}>;

export interface GenerateCoverResponse {
  url: string; // data: URL eller https-URL
}

// Kaldet vi har brug for lige nu
export async function generateCover(params?: GenerateCoverParams): Promise<string> {
  const payload: Required<GenerateCoverParams> = {
    universeId: "universe-fallback",
    gradeInt: 5,
    title: "Mathematics Quest 001",
    width: 1024,
    height: 1024,
    ...(params || {}),
  };

  const data = await postFunction<GenerateCoverResponse>("/image-service/generate", payload);

  if (!data?.url) {
    throw new Error("Edge returned no url");
  }
  return data.url; // typisk data:... eller en https-URL
}

// Valgfrit: lille sundhedstjek du kan kalde fra Console/knap
export async function pingImageService(): Promise<boolean> {
  try {
    await postFunction("/image-service/ping", {});
    return true;
  } catch {
    return false;
  }
}
