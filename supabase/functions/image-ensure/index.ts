// supabase/functions/image-ensure/index.ts
// Orchestrator for cover images: calls image-service, validates bytes, uploads to Storage.
// Virker både lokalt (CLI) og i cloud (Supabase deploy).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/** ---------- Utils ---------- */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS, ...extra },
  });
}

function getEnv(name: string): string | undefined {
  try {
    // @ts-ignore Deno types i Edge runtime
    if (typeof Deno !== "undefined" && Deno?.env?.get) return Deno.env.get(name) || undefined;
  } catch {}
  return undefined;
}

function placeholderPath(universeId: string, gradeInt: number) {
  return `/universe-images/${universeId}/${gradeInt}/cover.webp`;
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

/** ---------- Env handling (lokal + cloud) ---------- */
/* I lokal CLI accepteres ikke SUPABASE_* via --env-file.
   Derfor understøtter vi SB_URL + SB_SERVICE_ROLE_KEY som aliaser i dev.
   I cloud bruger vi de “rigtige” SUPABASE_* secrets. */

const SUPA_URL =
  getEnv("SUPABASE_URL") ?? getEnv("SB_URL") ?? "http://127.0.0.1:54321";
const SERVICE_KEY =
  getEnv("SUPABASE_SERVICE_ROLE_KEY") ?? getEnv("SB_SERVICE_ROLE_KEY") ?? "";
const IMAGE_SVC_URL =
  getEnv("IMAGE_SERVICE_URL") ?? "http://127.0.0.1:54321/functions/v1/image-service";
const BUCKET = getEnv("IMAGE_BUCKET") || "universe-images";
const MIN_BYTES_DEFAULT = parseInt(getEnv("PLACEHOLDER_MIN_BYTES") ?? "4096", 10) || 4096;
const LOG_LEVEL = (getEnv("LOG_LEVEL") ?? "info").toLowerCase();

/** ---------- Types ---------- */

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
  | { url: string; source: "bfl" | "fallback"; error?: string }
  | { url?: string; [k: string]: unknown };

/** ---------- Handler ---------- */

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
      ((crypto as any)?.randomUUID?.() ?? `sess_${Math.random().toString(36).slice(2)}`);

    // Beregn minimum bytes for at acceptere billedet
    const MIN_BYTES = Math.max(
      Number.isFinite(minBytes as number) ? Number(minBytes) : 0,
      MIN_BYTES_DEFAULT
    );

    const objectKey = `${universeId}/${gradeInt}/cover.webp`;
    let source: "image-service" | "placeholder" = "placeholder";
    let bytesLen = 0;

    if (IMAGE_SVC_URL) {
      try {
        const r = await fetch(`${IMAGE_SVC_URL.replace(/\/+$/, "")}/generate`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            universeId,
            prompt,
            title: title || "Today's Program",
            width: width || 1024,
            height: height || 576,
          }),
        });

        if (!r.ok) throw new Error(`image-service bad status: ${r.status}`);

        const j = (await r.json()) as GenResp;
        const dataUrl = (j as any)?.url;

        if (typeof dataUrl === "string" && dataUrl.startsWith("data:")) {
          const { mime, bytes } = fromDataUrl(dataUrl);

          if (LOG_LEVEL === "debug") {
            console.log(
              "[image-ensure] generated",
              JSON.stringify({ mime, size: bytes.byteLength, source: (j as any)?.source || "unknown" })
            );
          }

          // Accepter kun rigtige billeder over mindste størrelse
          if (bytes.byteLength >= MIN_BYTES && /^image\//i.test(mime)) {
            const sb = createClient(SUPA_URL, SERVICE_KEY, { auth: { persistSession: false } });

            const up = await sb.storage.from(BUCKET).upload(objectKey, bytes, {
              // Vi holder sti/extension som .webp for at matche UI, selv hvis kilde er jpeg
              contentType: "image/webp",
              upsert: true,
            });
            if (up.error) throw new Error(`upload error: ${up.error.message}`);

            source = "image-service";
            bytesLen = bytes.byteLength;
          } else if (LOG_LEVEL === "debug") {
            console.log(
              "[image-ensure] rejected image",
              JSON.stringify({ reason: "too-small-or-not-image", size: bytes.byteLength, MIN_BYTES, mime })
            );
          }
        } else if (LOG_LEVEL === "debug") {
          console.log("[image-ensure] no data URL from image-service", j);
        }
      } catch (e) {
        console.warn("[image-ensure] image-service failed:", String(e));
      }
    }

    const path =
      source === "image-service" ? `/${BUCKET}/${objectKey}` : placeholderPath(universeId, gradeInt);
    if (!bytesLen) bytesLen = MIN_BYTES;

    return json({ ok: true, data: { path, bytes: bytesLen, source }, sessionId: id });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});
