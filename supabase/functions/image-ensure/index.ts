// supabase/functions/image-ensure/index.ts
// Deno Edge Function: ensure a universe cover exists in Storage.
// - Calls image-service/generate to create an image
// - Uploads to Storage at `${BUCKET}/${universeId}/${gradeInt}/cover.webp`
// - Falls back to a placeholder path if generation/upload fails

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = {
  sessionId?: string;
  universeId?: string;
  gradeInt?: number;
  prompt?: string;
  minBytes?: number;
  title?: string;
  width?: number;
  height?: number;
};

type GenResp =
  | { url: string; source?: string; error?: string } // data URL fallback
  | { path?: string; bucket?: string; objectKey?: string; error?: string }; // if service stores for us

const LOG_LEVEL = (Deno.env.get("LOG_LEVEL") || "info").toLowerCase();

function log(...args: unknown[]) {
  if (LOG_LEVEL === "debug") console.log("[image-ensure]", ...args);
}

function getEnv(name: string): string | undefined {
  return (
    Deno.env.get(name) ||
    Deno.env.get(`SB_${name}`) // not used, but keeps the intent clear
  );
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function fromDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } {
  const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/i);
  if (!m) throw new Error("Invalid data URL");
  const mime = m[1];
  const bin = atob(m[2]);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return { mime, bytes: u8 };
}

function placeholderPath(universeId: string, gradeInt: number) {
  return `/placeholders/${universeId}/${gradeInt}/cover.svg`;
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return json({});
    if (req.method !== "POST") return json({ ok: false, error: "method not allowed" }, 405);

    const { sessionId, universeId, gradeInt, prompt, minBytes, title, width, height } =
      (await req.json()) as Body;

    if (!universeId || typeof gradeInt !== "number") {
      return json({ ok: false, error: "missing or invalid universeId/gradeInt" }, 400);
    }

    const id =
      sessionId ??
      ((crypto as any)?.randomUUID?.() ?? `sess_${Math.random().toString(36).slice(2)}`);

    const SUPABASE_URL =
      getEnv("SUPABASE_URL") ?? getEnv("SB_URL") ?? "http://127.0.0.1:54321";
    const SERVICE_KEY =
      getEnv("SUPABASE_SERVICE_ROLE_KEY") ?? getEnv("SB_SERVICE_ROLE_KEY") ?? "";
    const IMAGE_SERVICE_URL =
      getEnv("IMAGE_SERVICE_URL") ??
      "http://127.0.0.1:54321/functions/v1/image-service";
    const BUCKET = getEnv("IMAGE_BUCKET") || "universe-images";

    const MIN_BYTES =
      Math.max(
        Number.isFinite(minBytes as number) ? Number(minBytes) : 0,
        parseInt(getEnv("PLACEHOLDER_MIN_BYTES") || "4096", 10),
      ) || 4096;

    const objectKey = `${universeId}/${gradeInt}/cover.webp`;
    let source: "image-service" | "placeholder" = "placeholder";
    let bytesLen = 0;

    // First try to have image-service generate (and possibly store) the image.
    // Newer image-service expects bucket/objectKey.
    try {
      const r = await fetch(`${IMAGE_SERVICE_URL.replace(/\/+$/, "")}/generate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          universeId,
          prompt,
          title: title || "Today's Program",
          width: width || 1024,
          height: height || 576,
          bucket: BUCKET,
          objectKey, // tell image-service where to write
        }),
      });

      if (!r.ok) throw new Error(`image-service bad status: ${r.status}`);
      const j = (await r.json()) as GenResp;

      // Case A: service already stored it (preferred)
      if (!j.error && (j as any).bucket && (j as any).objectKey) {
        source = "image-service";
        bytesLen = MIN_BYTES; // we don’t know the exact size; report at least MIN_BYTES
      }

      // Case B: service returned a data URL – we upload it ourselves.
      else if (!j.error && (j as any).url?.startsWith?.("data:")) {
        const { mime, bytes } = fromDataUrl((j as any).url);
        if (bytes.byteLength >= MIN_BYTES && /^image\//i.test(mime)) {
          const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
          const up = await sb.storage.from(BUCKET).upload(objectKey, bytes, {
            contentType: "image/webp",
            upsert: true,
          });
          if (up.error) throw new Error(`upload error: ${up.error.message}`);
          source = "image-service";
          bytesLen = bytes.byteLength;
        } else {
          log("image-service returned too-small or invalid data URL, falling back.");
        }
      }

      // Case C: service errored — carry on to placeholder.
      else if (j.error) {
        log("image-service error:", j.error);
      }
    } catch (e) {
      log("image-service request failed:", String(e));
    }

    const path =
      source === "image-service" ? `/${BUCKET}/${objectKey}` : placeholderPath(universeId, gradeInt);
    if (!bytesLen) bytesLen = MIN_BYTES;

    return json({ ok: true, data: { path, bytes: bytesLen, source }, sessionId: id });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});
