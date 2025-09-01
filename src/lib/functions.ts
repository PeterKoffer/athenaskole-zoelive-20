// Minimal, robust helper til Edge Functions
function sanitize(u?: string) { return (u ?? "").trim().replace(/\/+$/, ""); }

const BASE = sanitize(import.meta.env.VITE_SUPABASE_URL as string);
const ANON = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!BASE || !ANON) {
  throw new Error("Supabase ENV mangler. Sæt VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env.local");
}

async function postFunction<T>(path: string, body: any): Promise<T> {
  const url = `${BASE}/functions/v1${path.startsWith("/") ? path : "/" + path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Edge ${path} ${res.status}: ${txt || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// Kaldet vi har brug for lige nu
export async function generateCover(params?: Partial<{
  universeId: string; gradeInt: number; title: string; width: number; height: number;
}>): Promise<string> {
  const payload = {
    universeId: "universe-fallback",
    gradeInt: 5,
    title: "Mathematics Quest 001",
    width: 1024,
    height: 1024,
    ...(params || {}),
  };
  const data = await postFunction<{ url: string }>("/image-service/generate", payload);
  if (!data?.url) throw new Error("Edge returned no url");
  return data.url; // typisk data:... eller en https-URL
}
