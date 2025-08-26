// supabase/functions/image-ensure/index.ts
// Edge Function: ensure a universe cover image exists (generate+upload or placeholder)

type Body = {
  sessionId?: string;
  universeId: string;
  gradeInt: number;
  title?: string;
  prompt?: string;
  minBytes?: number;
  width?: number;
  height?: number;
};

type GenResp = {
  url?: string;          // data URL (e.g., data:image/jpeg;base64,...)
  source?: string;       // optional hint from generator
  error?: string;
};

function getEnv(name: string): string | undefined {
  try {
    return Deno.env.get(name) ?? undefined;
  } catch {
    return undefined;
  }
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // permissive CORS for local dev
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, content-type",
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

function placeholderPath(universeId: string, gradeInt: number, bucket: string) {
  // same object key; caller can tell via "source" whether it's a placeholder
  return `/${bucket}/${universeId}/${gradeInt}/cover.webp`;
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

    // ---- Config (use SB_* fallbacks; SUPABASE_* are blocked by CLI env-file) ----
    const SUPABASE_URL = getEnv("SUPABASE_URL") ?? getEnv("SB_URL") ?? "http://127.0.0.1:54321";
    const SERVICE_KEY =
      getEnv("SUPABASE_SERVICE_ROLE_KEY") ?? getEnv("SB_SERVICE_ROLE_KEY") ?? "";
    const IMAGE_SERVICE_URL =
      getEnv("IMAGE_SERVICE_URL") ?? "http://127.0.0.1:54321/functions/v1/image-service";
    const BUCKET = getEnv("IMAGE_BUCKET") ?? "universe-images";
    const MIN_BYTES_DEFAULT = parseInt(getEnv("PLACEHOLDER_MIN_BYTES") ?? "4096", 10) || 4096;

    const MIN_BYTES = Math.max(
      Number.isFinite(minBytes as number) ? Number(minBytes) : 0,
      MIN_BYTES_DEFAULT
    );

    const objectKey = `${universeId}/${gradeInt}/cover.webp`;
    let source: "image-service" | "placeholder" = "placeholder";
    let bytesLen = 0;

    // ---- Try to generate via image-service ----
    if (IMAGE_SERVICE_URL) {
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
          }),
        });
        if (!r.ok) throw new Error(`image-service bad status: ${r.status}`);

        const j = (await r.json()) as GenResp;
        const dataUrl = j?.url;
        if (typeof dataUrl === "string" && dataUrl.startsWith("data:")) {
          const { mime, bytes } = fromDataUrl(dataUrl);
          if (bytes.byteLength >= MIN_BYTES && /^image\//i.test(mime)) {
            // Upload to Storage
            // @ts-ignore deno/esm import
            const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
            const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
              auth: { persistSession: false },
            });
            const up = await sb.storage.from(BUCKET).upload(objectKey, bytes, {
              contentType: mime, // match the actual MIME returned (jpeg/webp/png…)
              upsert: true,
            });
            if (up.error) throw new Error(`upload error: ${up.error.message}`);
            source = "image-service";
            bytesLen = bytes.byteLength;
          }
        }
      } catch (e) {
        console.warn("[image-ensure] image-service/upload failed:", String(e));
      }
    }

    const path =
      source === "image-service"
        ? `/${BUCKET}/${objectKey}`
        : placeholderPath(universeId, gradeInt, BUCKET);
    if (!bytesLen) bytesLen = MIN_BYTES;

    return json({ ok: true, data: { path, bytes: bytesLen, source }, sessionId: id });
  } catch (e) {
    console.error("[image-ensure] fatal:", e);
    return json({ ok: false, error: String(e) }, 500);
  }
});
