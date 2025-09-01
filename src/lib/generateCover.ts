// src/lib/generateCover.ts
type Payload = {
  universeId: string;
  gradeInt: number;
  title: string;
  width: number;
  height: number;
};

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!PROJECT_URL || !ANON) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

/**
 * Kalder Edge Function og returnerer en URL til billedet (https eller data:).
 * Du kan vise den direkte i <img src={url} />.
 */
export async function generateCover(overrides?: Partial<Payload>): Promise<string> {
  const body: Payload = {
    universeId: "7150d0ee-59cc-40d9-a1f3-b31951bb5b24",
    gradeInt: 5,
    title: "Mathematics Quest 001",
    width: 1024,
    height: 1024,
    ...overrides,
  };

  const res = await fetch(`${PROJECT_URL}/functions/v1/image-service/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const { url } = (await res.json()) as { url: string };
  if (!url) throw new Error("No url returned from image-service");
  return url; // kan være https://... eller data:image/...
}
