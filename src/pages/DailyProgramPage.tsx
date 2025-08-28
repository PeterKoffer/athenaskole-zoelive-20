// supabase/functions/image-ensure/index.ts
// Ensures a cover image exists at: universe-images/<universeId>/<gradeInt>/<title|cover>.webp
// CORS-safe, idempotent, and returns a stable public URL.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

/* ------------------------------- Types ------------------------------- */

type Body = {
  sessionId?: string;
  universeId: string;
  gradeInt: number;
  title?: string;      // default "cover"
  prompt?: string;     // used if OPENAI_API_KEY is present
  minBytes?: number;   // accept existing file if >= this size (default 1024)
  width?: number;      // preferred gen width
  height?: number;     // preferred gen height
};

/* ------------------------------ Constants ---------------------------- */

const BUCKET = "universe-images";

// CORS headers for browser preflight + responses
const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers":
    "content-type, authorization, apikey, x-client-info, x-client-name, x-client-version",
  "access-control-max-age": "86400",
};

// Tiny 1x1 transparent PNG. We'll store it at path ending with .webp
// (that's fine: clients obey the response Content-Type header).
const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

/* ------------------------------ Utilities --------------------------- */

function withCors(init?: ResponseInit): ResponseInit {
  return { ...(init ?? {}), headers: { ...(init?.headers ?? {}), ...CORS_HEADERS } };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), withCors({ status, headers: { "content-type": "application/json" } }));
}

function getEnv(key: string): string {
  return Deno.env.get(key) ?? "";
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function downloadSize(
  supabase: ReturnType<typeof createClient>,
  path: string
): Promise<number | null> {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) return null;
  const ab = await data.arrayBuffer();
  return ab.byteLength;
}

async function uploadBytes(
  supabase: ReturnType<typeof createClient>,
  path: string,
  bytes: Uint8Array,
  contentType: string
) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    upsert: true,
    contentType,
    cacheControl: "31536000, immutable",
  });
  if (error) throw error;
}

function publicUrlFor(
  supabase: ReturnType<typeof createClient>,
  path: string
): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function tryGenerateWithOpenAI(prompt: string, width?: number, height?: number) {
  const OPENAI_API_KEY = getEnv("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) return null;

  const size =
    width && height ? `${Math.round(width)}x${Math.round(height)}` : "1024x576";

  try {
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size,
        response_format: "b64_json",
      }),
    });

    if (!resp.ok) {
      console.warn("OpenAI image gen failed:", resp.status, await resp.text());
      return null;
    }

    const j = await resp.json();
    const b64 = j?.data?.[0]?.b64_json as string | undefined;
    if (!b64) return null;

    return { mime: "image/png", bytes: base64ToBytes(b64) }; // serve as PNG
  } catch (e) {
    console.warn("OpenAI image gen error:", e);
    return null;
  }
}

/* -------------------------------- Serve ----------------------------- */

Deno.serve(async (req) => {
  // Preflight for browsers
  if (req.method === "OPTIONS") {
    return new Response(null, withCors({ status: 204 }));
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = (await req.json()) as Body;

    // Validate input
    if (!body?.universeId || typeof body.gradeInt !== "number") {
      return json({ ok: false, error: "universeId (string) and gradeInt (number) are required" }, 400);
    }

    const SUPABASE_URL = getEnv("SUPABASE_URL");
    const SERVICE_ROLE = getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return json({ ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const title = (body.title?.trim() || "cover").replace(/\.(png|jpg|jpeg|webp)$/i, "");
    const path = `${body.universeId}/${body.gradeInt}/${title}.webp`;
    const minBytes = Math.max(0, body.minBytes ?? 1024);

    // 1) Return existing if it's large enough
    const size = await downloadSize(supabase, path);
    if (size !== null && size >= minBytes) {
      return json({
        ok: true,
        existed: true,
        source: "existing",
        path,
        publicUrl: publicUrlFor(supabase, path),
        bytes: size,
      });
    }

    // 2) Try generate with OpenAI if prompt + key exist
    let uploadedSource: "openai" | "placeholder" = "placeholder";
    let uploadedBytes = 0;

    if (body.prompt) {
      const gen = await tryGenerateWithOpenAI(body.prompt, body.width, body.height);
      if (gen) {
        await uploadBytes(supabase, path, gen.bytes, gen.mime);
        uploadedSource = "openai";
        uploadedBytes = gen.bytes.byteLength;
      }
    }

    // 3) Fallback: upload tiny PNG so URL always works
    if (uploadedSource === "placeholder") {
      const bytes = base64ToBytes(TINY_PNG_BASE64);
      await uploadBytes(supabase, path, bytes, "image/png");
      uploadedBytes = bytes.byteLength;
    }

    return json({
      ok: true,
      existed: false,
      source: uploadedSource,
      path,
      publicUrl: publicUrlFor(supabase, path),
      bytes: uploadedBytes,
    });
  } catch (err) {
    console.error("image-ensure error:", err);
    return json({ ok: false, error: String(err) }, 400);
  }
});
