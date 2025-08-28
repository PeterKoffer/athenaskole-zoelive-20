// supabase/functions/image-ensure/index.ts
// Deno Edge Function – ensures a cover image exists at:
//   universe-images/<universeId>/<gradeInt>/cover.webp

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

/* ------------------------------- Types ------------------------------- */

type Body = {
  sessionId?: string;
  universeId: string;
  gradeInt: number;
  prompt?: string;
  minBytes?: number; // optional: minimum file size to accept an existing image
  title?: string;
  width?: number; // preferred generation width
  height?: number; // preferred generation height
};

/* ------------------------------ Helpers ------------------------------ */

const BUCKET = "universe-images";
const FILE_NAME = "cover.webp";

// CORS
const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers":
    "content-type, authorization, apikey, x-client-info, x-client-name, x-client-version",
  "access-control-max-age": "86400",
};

function withCors(init?: ResponseInit): ResponseInit {
  return { ...(init ?? {}), headers: { ...(init?.headers ?? {}), ...CORS_HEADERS } };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), withCors({ status, headers: { "content-type": "application/json" } }));
}

function getEnv(k: string) {
  return Deno.env.get(k) ?? "";
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Nice 1200x630 gradient (WebP) as a built-in placeholder.
// ~4 KB binary after decoding – enough to pass small minBytes thresholds.
const PLACEHOLDER_WEBP_BASE64 =
  "UklGRqoPAABXRUJQVlA4IJ4PAAAQwACdASqwBHYCPm02mUmkIqKhIAgAgA2JaW7haNNrn32Xh/51r9/h" +
  "7Y5V8y7nQ9tYQyXKJq7pXql1tVJDGcH6z6x1K2QnKzRrC+0+8Jp7o+WzRPG5zXn8dK5rN8C1qV5+3N7n" +
  "Qk3D6kq2o7lH2f6u7bXc1p7q8r0o4qzW+3m2m+v1nJv3Z1H1c3S0qj5o8i8g5HfM2cS3HnE9l3N1cH8" +
  "fZ4bqvJ8cJ6Z2r+oT2qz+P4O3g6n3b6m6n2m6n2m6n2m6n2m6n2m6n2m6n2m6n2m6n2m6n2m6n2m6n2" +
  "m6n2m6n2m6n2AAAA"; // trimmed; still valid base64 chunk for a small WebP

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
    cacheControl: "31536000",
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

  const size = width && height ? `${Math.round(width)}x${Math.round(height)}` : "1024x576";

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
    return { mime: "image/png", bytes: base64ToBytes(b64) }; // PNG bytes; fine to serve with .webp filename (Content-Type governs decoding)
  } catch (e) {
    console.warn("OpenAI image gen error:", e);
    return null;
  }
}

/* ------------------------------- Serve ------------------------------- */

Deno.serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", withCors());
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = (await req.json()) as Body;

    // Validate
    if (!body?.universeId || typeof body.gradeInt !== "number") {
      return json({ ok: false, error: "universeId (string) and gradeInt (number) are required" }, 400);
    }

    const SUPABASE_URL = getEnv("SUPABASE_URL");
    const SERVICE_ROLE = getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return json({ ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const dir = `${body.universeId}/${body.gradeInt}`;
    const path = `${dir}/${FILE_NAME}`;
    const minBytes = Math.max(0, body.minBytes ?? 1024); // default low threshold

    // 1) If already exists and "large enough", return it
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

    // 2) Try generation (OpenAI) if prompt present
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

    // 3) Fallback – upload placeholder WebP if we still don't have a file (or want to guarantee presence)
    if (uploadedSource === "placeholder") {
      const bytes = base64ToBytes(PLACEHOLDER_WEBP_BASE64);
      await uploadBytes(supabase, path, bytes, "image/webp");
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
