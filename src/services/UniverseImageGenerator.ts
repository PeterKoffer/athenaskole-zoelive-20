// src/services/UniverseImageGenerator.ts
type EnsureResp = { ok: boolean; data?: { path: string; source: string; bytes: number } };

const SB_URL = import.meta.env.VITE_SUPABASE_URL as string;
const FUNCTIONS_BASE =
  (import.meta.env.VITE_FUNCTIONS_BASE as string) || SB_URL;

const ENSURE_URL = `${FUNCTIONS_BASE}/functions/v1/image-ensure`;
const GENERATE_URL = `${FUNCTIONS_BASE}/functions/v1/image-service/generate`;

export function publicCoverUrl(path: string) {
  return `${SB_URL}/storage/v1/object/public${path}`;
}

export async function ensureDailyProgramCover(opts: {
  universeId: string;
  gradeInt: number;
  title: string;
  width?: number;
  height?: number;
  bucket?: string;
}) {
  const bucket = opts.bucket ?? "universe-images";
  const objectKey = `${opts.universeId}/${opts.gradeInt}/cover.webp`;
  const minBytes = Number(import.meta.env.VITE_PLACEHOLDER_MIN_BYTES ?? 4096);

  const ensureBody = {
    universeId: opts.universeId,
    gradeInt: opts.gradeInt,
    title: opts.title,
    bucket,
    objectKey,
    minBytes,
  };

  const ensure1: EnsureResp = await fetch(ENSURE_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(ensureBody),
  }).then(r => r.json());

  if (ensure1?.data?.source !== "storage") {
    await fetch(GENERATE_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        universeId: opts.universeId,
        title: opts.title,
        width: opts.width ?? 1024,
        height: opts.height ?? 576,
        bucket,
        objectKey,
      }),
    });

    const ensure2: EnsureResp = await fetch(ENSURE_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(ensureBody),
    }).then(r => r.json());

    const path = ensure2?.data?.path ?? ensure1?.data?.path;
    return publicCoverUrl(path!);
  }

  return publicCoverUrl(ensure1.data!.path);
}
