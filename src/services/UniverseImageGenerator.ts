// src/services/UniverseImageGenerator.ts
export type EnsureResult = {
  path: string;
  bytes: number;
  source: "storage" | "placeholder";
  url: string; // full public URL when in storage
};

const BASE =
  (import.meta.env.VITE_SUPABASE_URL as string) || "http://127.0.0.1:54321";
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function publicCoverUrl(path: string) {
  // path looks like: /universe-images/<uuid>/<grade>/cover.webp
  const base = BASE.replace(/\/$/, "");
  return `${base}/storage/v1/object/public${path}`;
}

export async function ensureCover(opts: {
  universeId: string;
  gradeInt: number;
  title?: string;
  bucket?: string;
  objectKey?: string;
  minBytes?: number;
}): Promise<EnsureResult> {
  const {
    universeId,
    gradeInt,
    title,
    bucket = "universe-images",
    objectKey = `${universeId}/${gradeInt}/cover.webp`,
    minBytes = Number(import.meta.env.VITE_PLACEHOLDER_MIN_BYTES ?? 4096),
  } = opts;

  const res = await fetch(`${BASE}/functions/v1/image-ensure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(ANON ? { Authorization: `Bearer ${ANON}` } : {}),
    },
    body: JSON.stringify({ universeId, gradeInt, title, bucket, objectKey, minBytes }),
  });
  if (!res.ok) throw new Error(`image-ensure failed: ${res.status}`);

  const json = await res.json();
  const data = json.data ?? json; // supports either shape

  const result: EnsureResult = {
    path: data.path,
    bytes: Number(data.bytes ?? 0),
    source: (data.source ?? "storage") as "storage" | "placeholder",
    url: publicCoverUrl(data.path),
  };
  return result;
}

// Back-compat alias for older imports
export const ensureDailyProgramCover = ensureCover;
