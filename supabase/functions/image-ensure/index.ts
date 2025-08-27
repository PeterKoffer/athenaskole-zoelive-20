// @ts-nocheck
// supabase/functions/image-ensure/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type Body = {
  sessionId?: string;
  universeId: string;
  gradeInt: number;
  prompt?: string;
  minBytes?: number;
  title?: string;
  width?: number;
  height?: number;
};

function getEnv(k: string) {
  return Deno.env.get(k) ?? "";
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-allow-methods": "POST, OPTIONS",
    },
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
  return `/placeholders/${universeId}/${gradeInt}.svg`;
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return json({});
    if (req.method !== "POST") {
      return json({ ok: false, error: "method not allowed" }, 405);
    }

    const { sessionId, universeId, gradeInt, prompt, minBytes, title, width, height } =
      (await req.json()) as Body;

    if (!universeId || typeof gradeInt !== "number") {
      return json({ ok: false, error: "missing or invalid universeId/gradeInt" }, 400);
    }

    const id =
      sessionId ??
      ((crypto as any)?.randomUUID?.() ?? `sess_${Math.random().toString(36).slice(2)}`);

    // env
    const SUPABASE_URL = getEnv("SB_URL") || getEnv("SUPABASE_URL") || "http://127.0.0.1:54321";
    const SERVICE_KEY =
      getEnv("SB_SERVICE_ROLE_KEY") || getEnv("SUPABASE_SERVICE_ROLE_KEY") || "";
    const IMAGE_SERVICE_URL =
      getEnv("IMAGE_SERVICE_URL") || "http://127.0.0.1:54321/functions/v1/image-service";
    const BUCKET = getEnv("IMAGE_BUCKET") || "universe-images";
    const MIN_BYTES_DEFAULT = parseInt(getEnv("PLACEHOLDER_MIN_BYTES") || "4096", 10) || 4096;
    const MIN_BYTES = Math.max(
      Number.isFinite(minBytes as number) ? Number(minBytes) : 0,
      MIN_BYTES_DEFAULT
    );

    const objectKey = `${universeId}/${gradeInt}/cover.webp`;

    let source: "image-service" | "placeholder" = "placeholder";
    let bytesLen = 0;
    let path = placeholderPath(universeId, gradeInt);

    // Call generator WITH bucket+objectKey so it can store for us.
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
          objectKey,
        }),
      });
      if (!r.ok) throw new Error(`image-service status ${r.status}`);

      const j = (await r.json()) as any;

      if (typeof j?.path === "string") {
        // generator uploaded to storage
        path = j.path.startsWith("/") ? j.path : `/${j.path}`;
        source = "image-service";
        bytesLen = Number(j?.bytes) || MIN_BYTES;
      } else if (typeof j?.url === "string" && j.url.startsWith("data:")) {
        // generator returned data URL -> upload here
        const { mime, bytes } = fromDataUrl(j.url);
        if (bytes.byteLength >= MIN_BYTES && /^image\//i.test(mime)) {
          const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
          const up = await sb.storage.from(BUCKET).upload(objectKey, bytes, {
            contentType: mime,
            upsert: true,
          });
          if (up.error) throw new Error(`upload error: ${up.error.message}`);
          path = `/${BUCKET}/${objectKey}`;
          source = "image-service";
          bytesLen = bytes.byteLength;
        }
      }
    } catch (e) {
      console.warn("[image-ensure] generator failed:", String(e));
    }

    if (!bytesLen) bytesLen = MIN_BYTES;

    return json({ ok: true, data: { path, bytes: bytesLen, source }, sessionId: id });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});
