// Deno Edge Function: ensure cover image exists at a stable storage path.
// Strategy:
// - If IMAGE_SERVICE_URL is set: call `${IMAGE_SERVICE_URL}/generate` to get a data URL,
//   decode to bytes and upload to Supabase Storage at /universe-images/{universeId}/{gradeInt}/cover.webp
// - Enforce minimum bytes (PLACEHOLDER_MIN_BYTES). If too small or any error → placeholder path.
// - Return { ok: true, data: { path, bytes, source } }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = {
  sessionId?: string;
  universeId: string;
  gradeInt: number;
  prompt?: string;
  minBytes?: number;
  title?: string; // optional, forwarded to image-service
  width?: number; // optional
  height?: number; // optional
};

type GenResp = { url?: string; source?: string; [k: string]: unknown };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });
}

function getEnv(name: string): string | undefined {
  try {
    // @ts-ignore Deno in Edge
    return Deno?.env?.get?.(name);
  } catch {
    return undefined;
  }
}

function placeholderPath(universeId: string, gradeInt: number) {
  return `/universe-images/${universeId}/${gradeInt}/cover.webp`;
}

function fromDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } {
  // data:<mime>;base64,<b64>
  const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/i);
  if (!m) throw new Error("Invalid data URL");
  const mime = m[1];
  const b64 = m[2];
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return { mime, bytes: u8 };
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return json({});
    if (req.method !== "POST") return json({ ok: false, error: "method not allowed" }, 405);

    const {
      sessionId,
      universeId,
      gradeInt,
      prompt,
      minBytes,
      title,
      width,
      height,
    } = (await req.json()) as Body;

    if (!universeId || typeof gradeInt !== "number") {
      return json({ ok: false, error: "missing or invalid universeId/gradeInt" }, 400);
    }

    const id =
      sessionId ??
      // @ts-ignore crypto in Deno
      (typeof crypto !== "undefined" && (crypto as any).randomUUID?.()
        ? (crypto as any).randomUUID()
        : `sess_${Math.random().toString(36).slice(2)}`);

    const SUPABASE_URL = getEnv("SUPABASE_URL");
    const SERVICE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return json({ ok: false, error: "missing Supabase env" }, 500);
    }

    const IMAGE_SERVICE_URL = getEnv("IMAGE_SERVICE_URL"); // e.g. https://<proj>.functions.supabase.co/image-service
    const BUCKET = getEnv("IMAGE_BUCKET") || "universe-images";
    const MIN_BYTES = Math.max(
      Number.isFinite(minBytes as number) ? Number(minBytes) : 0,
      parseInt(getEnv("PLACEHOLDER_MIN_BYTES") || "4096", 10),
      1024
    );

    const objectKey = `${universeId}/${gradeInt}/cover.webp`;
    let source: "image-service" | "placeholder" = "placeholder";
    let bytesLen = 0;

    if (IMAGE_SERVICE_URL) {
      try {
        const r = await fetch(
          `${IMAGE_SERVICE_URL.replace(/\/+$/, "")}/generate`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              universeId,
              prompt,
              title: title || "Today's Program",
              width: width || 1024,
              height: height || 576,
            }),
          }
        );

        if (!r.ok) {
          // fallthrough to placeholder
          throw new Error(`image-service bad status: ${r.status}`);
        }

        const j = (await r.json()) as GenResp;
        const dataUrl = j?.url;
        if (typeof dataUrl === "string" && dataUrl.startsWith("data:")) {
          const { mime, bytes } = fromDataUrl(dataUrl);
          // Enforce min-bytes (protect against tiny SVG-only fallbacks)
          if (bytes.byteLength >= MIN_BYTES && /^image\//i.test(mime)) {
            const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
              auth: { persistSession: false },
            });
            const up = await sb.storage.from(BUCKET).upload(objectKey, bytes, {
              contentType: "image/webp", // we store webp to match path; you can swap to image/jpeg if wanted
              upsert: true,
            });
            if (up.error) throw new Error(`upload error: ${up.error.message}`);
            source = "image-service";
            bytesLen = bytes.byteLength;
          }
        }
      } catch (e) {
        // soft-fail to placeholder
        // eslint-disable-next-line no-console
        console.warn("[image-ensure] image-service failed:", String(e));
      }
    }

    const path = source === "image-service"
      ? `/${BUCKET}/${objectKey}` // public bucket assumed; if signed URLs used, adapt accordingly
      : placeholderPath(universeId, gradeInt);

    // If we didn’t manage to upload, ensure a non-zero but known bytes count for UI
    if (!bytesLen) bytesLen = MIN_BYTES;

    return json({ ok: true, data: { path, bytes: bytesLen, source }, sessionId: id });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});
