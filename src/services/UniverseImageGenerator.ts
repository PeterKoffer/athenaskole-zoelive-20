// src/services/UniverseImageGenerator.ts

type EnsureArgs = {
  universeId: string;
  gradeInt: number;
  title?: string;
  minBytes?: number;
};

type EnsureResp =
  | { url: string; source: "storage" }
  | { url: string; source: "placeholder" };

/**
 * Calls the Edge Function `image-ensure`.
 * - If the image exists in Storage, returns its public URL.
 * - If not, returns a simple SVG data URL as a placeholder.
 *
 * NOTE: Generating + uploading a real image when missing requires a server-side
 * action using the service role key. This client function does NOT upload.
 */
export async function ensureDailyProgramCover({
  universeId,
  gradeInt,
  title = "Today's Program",
  minBytes = 4096,
}: EnsureArgs): Promise<EnsureResp> {
  const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL ?? "http://127.0.0.1:54321";

  const body = {
    universeId,
    gradeInt,
    title,
    bucket: "universe-images",
    objectKey: `${universeId}/${gradeInt}/cover.webp`,
    minBytes,
  };

  const res = await fetch(`${SUPABASE_URL}/functions/v1/image-ensure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // When running `supabase functions serve --no-verify-jwt` the auth header is optional,
      // but sending anon is fine if you have it in env:
      ...(import.meta.env.VITE_SUPABASE_ANON_KEY
        ? { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
        : {}),
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.ok !== true) {
    throw new Error(json?.message ?? "image-ensure failed");
  }

  const path: string = json.data.path;
  const source: "storage" | "placeholder" = json.data.source;

  if (source === "storage" && path.startsWith("/universe-images/")) {
    return {
      source: "storage",
      url: `${SUPABASE_URL}/storage/v1/object/public${path}`,
    };
  }

  // Fallback placeholder (simple SVG data URL) when the storage image doesn't exist yet.
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576">
       <rect width="100%" height="100%" fill="#e8edf7"/>
       <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle"
             font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
             font-size="56" fill="#222"> ${title} </text>
       <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
             font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
             font-size="28" fill="#555"> Grade ${gradeInt} </text>
     </svg>`
  );

  return { source: "placeholder", url: `data:image/svg+xml;utf8,${svg}` };
}
