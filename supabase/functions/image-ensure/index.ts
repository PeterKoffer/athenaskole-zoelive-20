// supabase/functions/image-ensure/index.ts
// Ensures a cover image exists at: universe-images/<universeId>/<gradeInt>/<title|cover>.webp
// Provider order: Black Forest Labs (BFL) → OpenAI → 1x1 placeholder
// Idempotent, CORS-safe. Returns { ok, source, path, publicUrl, bytes }.

import { createClient } from "npm:@supabase/supabase-js@2";

/* ------------------------------- Types ------------------------------- */

type Body = {
  universeId: string;
  gradeInt: number;
  title?: string;      // default "cover"
  prompt?: string;     // if absent, we build a simple prompt
  minBytes?: number;   // accept existing file if >= this size (default 1024)
  width?: number;      // preferred width
  height?: number;     // preferred height
};

/* ------------------------------ Constants ---------------------------- */

const BUCKET = "universe-images";

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers":
    "content-type, authorization, apikey, x-key, x-client-info, x-client-name, x-client-version",
  "access-control-max-age": "86400",
};

const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

/* ------------------------------ Utils -------------------------------- */

function withCors(init?: ResponseInit): ResponseInit {
  return { ...(init ?? {}), headers: { ...(init?.headers ?? {}), ...CORS_HEADERS } };
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), withCors({ status, headers: { "content-type": "application/json" } }));
}
const env = (k: string) => Deno.env.get(k) ?? "";

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function downloadSize(supabase: ReturnType<typeof createClient>, path: string) {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) return null;
  return (await data.arrayBuffer()).byteLength;
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
function publicUrlFor(supabase: ReturnType<typeof createClient>, path: string) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
function aspectFromWH(w?: number, h?: number) {
  if (!w || !h) return "16:9";
  return `${Math.round(w)}:${Math.round(h)}`; // BFL accepterer aspect_ratio som "W:H"
}

/* ---------------------------- Providers ------------------------------ */

// Black Forest Labs – direkte API (primær)
// Docs: https://docs.bfl.ai/quick_start/generating_images (POST, poll polling_url, download result.sample)
async function tryGenerateWithBFL(prompt: string, width?: number, height?: number) {
  const BFL_KEY = env("BFL_API_KEY");
  if (!BFL_KEY) return null;

  const base = env("BFL_API_BASE") || "https://api.eu.bfl.ai"; // EU for GDPR; kan sættes til https://api.bfl.ai
  const route = env("BFL_ROUTE") || "flux-pro-1.1";            // fx flux-pro, flux-pro-1.1, flux-dev, flux-kontext-pro
  const submitUrl = `${base}/v1/${route}`;

  try {
    const submit = await fetch(submitUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-key": BFL_KEY, // BFL auth header
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: aspectFromWH(width, height),
      }),
    });
    if (!submit.ok) {
      console.warn("BFL submit failed:", submit.status, await submit.text());
      return null;
    }
    const s = await submit.json();
    const pollingUrl = s?.polling_url as string | undefined;
    if (!pollingUrl) return null;

    // Poll indtil status "Ready" (signed URL i result.sample – gyldig i ~10 min)
    const started = Date.now();
    const TIMEOUT_MS = 60_000;
    while (Date.now() - started < TIMEOUT_MS) {
      await new Promise((r) => setTimeout(r, 1200));
      const poll = await fetch(pollingUrl, {
        headers: { accept: "application/json", "x-key": BFL_KEY },
      });
      if (!poll.ok) {
        console.warn("BFL poll failed:", poll.status, await poll.text());
        return null;
      }
      const j = await poll.json();
      const status = j?.status as string;
      if (status === "Ready") {
        const sampleUrl = j?.result?.sample as string | undefined;
        if (!sampleUrl) return null;

        const img = await fetch(sampleUrl);
        if (!img.ok) return null;
        const mime = img.headers.get("content-type") || "image/png";
        const bytes = new Uint8Array(await img.arrayBuffer());
        return { mime, bytes };
      }
      if (status === "Error" || status === "Failed") {
        console.warn("BFL generation failed:", j);
        return null;
      }
    }
  } catch (e) {
    console.warn("BFL error:", e);
    return null;
  }
  return null;
}

// OpenAI fallback (valgfrit)
async function tryGenerateWithOpenAI(prompt: string, width?: number, height?: number) {
  const OPENAI_API_KEY = env("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) return null;

  const size = width && height ? `${Math.round(width)}x${Math.round(height)}` : "1024x576";
  try {
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size, response_format: "b64_json" }),
    });
    if (!resp.ok) {
      console.warn("OpenAI image gen failed:", resp.status, await resp.text());
      return null;
    }
    const j = await resp.json();
    const b64 = j?.data?.[0]?.b64_json as string | undefined;
    if (!b64) return null;
    return { mime: "image/png", bytes: base64ToBytes(b64) };
  } catch (e) {
    console.warn("OpenAI image gen error:", e);
    return null;
  }
}

/* -------------------------------- Serve ------------------------------ */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, withCors({ status: 204 }));
  if (req.method !== "POST")   return json({ error: "Method not allowed" }, 405);

  try {
    const body = (await req.json()) as Body;
    if (!body?.universeId || typeof body.gradeInt !== "number") {
      return json({ ok: false, error: "universeId (string) and gradeInt (number) are required" }, 400);
    }

    const SUPABASE_URL = env("SUPABASE_URL");
    const SERVICE_ROLE = env("SUPABASE_SERVICE_ROLE_KEY") || env("SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return json({ ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }, 500);
    }
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const title = (body.title?.trim() || "cover").replace(/\.(png|jpg|jpeg|webp)$/i, "");
    const path  = `${body.universeId}/${body.gradeInt}/${title}.webp`;
    const minBytes = Math.max(0, body.minBytes ?? 1024);

    // 1) Returnér eksisterende hvis stor nok
    const existing = await downloadSize(supabase, path);
    if (existing !== null && existing >= minBytes) {
      return json({ ok: true, existed: true, source: "existing", path, publicUrl: publicUrlFor(supabase, path), bytes: existing });
    }

    // 2) Generér med BFL → 3) OpenAI → 4) placeholder
    let uploadedSource: "bfl" | "openai" | "placeholder" = "placeholder";
    let uploadedBytes = 0;

    const prompt = body.prompt || `Cover for grade ${body.gradeInt}: ${title}`;

    const rBfl = await tryGenerateWithBFL(prompt, body.width, body.height);
    if (rBfl) {
      await uploadBytes(supabase, path, rBfl.bytes, rBfl.mime);
      uploadedSource = "bfl";
      uploadedBytes  = rBfl.bytes.byteLength;
    } else {
      const rOai = await tryGenerateWithOpenAI(prompt, body.width, body.height);
      if (rOai) {
        await uploadBytes(supabase, path, rOai.bytes, rOai.mime);
        uploadedSource = "openai";
        uploadedBytes  = rOai.bytes.byteLength;
      } else {
        const bytes = base64ToBytes(TINY_PNG_BASE64);
        await uploadBytes(supabase, path, bytes, "image/png");
        uploadedSource = "placeholder";
        uploadedBytes  = bytes.byteLength;
      }
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
