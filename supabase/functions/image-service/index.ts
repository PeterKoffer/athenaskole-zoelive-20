// deno-lint-ignore-file no-explicit-any
// Edge function: POST /functions/v1/image-service/generate
// Generates an image via Black Forest Labs, uploads to Storage,
// and returns a stable public URL.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4?dts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json", ...CORS, ...(init.headers ?? {}) },
  });
}
function bad(msg: string, code = 400) { return json({ error: msg }, { status: code }); }

function slug(s: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "cover";
}
const align32 = (n: number) => Math.max(256, Math.min(2048, Math.round(n / 32) * 32));
const cleanPath = (s: string) => (s ?? "").replace(/[^\w\-./]/g, "");

// -------- BFL helpers --------------------------------------------------------

const IMAGE_MODEL = Deno.env.get("IMAGE_MODEL") || "flux-dev";
const BFL_OUTPUT = (Deno.env.get("BFL_OUTPUT") || "webp").toLowerCase(); // 'webp' or 'jpeg'

async function bflStart(prompt: string, width: number, height: number) {
  const apiKey = Deno.env.get("BFL_API_KEY");
  if (!apiKey) throw new Error("Missing BFL_API_KEY");

  const endpoint = `https://api.bfl.ai/v1/${IMAGE_MODEL}`;
  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", "x-key": apiKey },
    body: JSON.stringify({
      prompt, width, height,
      steps: 28, guidance: 3, prompt_upsampling: false,
      output_format: BFL_OUTPUT, // 'webp' or 'jpeg'
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    throw new Error(`BFL start failed: ${r.status} ${detail}`);
  }
  return await r.json();
}

async function bflPoll(pollingUrl: string, timeoutMs = 60_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const r = await fetch(pollingUrl);
    if (!r.ok) throw new Error(`BFL poll failed: ${r.status}`);
    const j = await r.json().catch(() => ({}));

    // Find a URL string in the response (http(s) or data:)
    let candidate: string | undefined;
    const scan = (v: any) => {
      if (!v) return;
      if (typeof v === "string" && /^(https?:\/\/|data:image\/)/i.test(v)) {
        candidate ??= v;
      } else if (Array.isArray(v)) v.forEach(scan);
      else if (typeof v === "object") Object.values(v).forEach(scan);
    };
    scan(j);

    const status = String(j?.status ?? j?.state ?? "").toLowerCase();
    if (candidate && (status === "ready" || status === "succeeded" || status === "success")) return candidate;
    if (candidate && !status) return candidate; // some responses omit status

    await new Promise((s) => setTimeout(s, 1500));
  }
  throw new Error("BFL poll timeout");
}

function dataUrlToBytes(dataUrl: string) {
  const m = dataUrl.match(/^data:(.*?);base64,(.*)$/i);
  if (!m) throw new Error("Invalid data URL from BFL");
  const mime = m[1] || "application/octet-stream";
  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { mime, bytes };
}

async function fetchBytes(url: string): Promise<{ bytes: Uint8Array; mime?: string }> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch image failed: ${r.status}`);
  const mime = r.headers.get("content-type") || undefined;
  const bytes = new Uint8Array(await r.arrayBuffer());
  return { bytes, mime };
}

// -------- Storage upload -----------------------------------------------------

async function uploadToStorage(bytes: Uint8Array, path: string, mime: string) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const BUCKET = Deno.env.get("UNIVERSE_IMAGES_BUCKET") || "universe-images";

  const supa = createClient(SUPABASE_URL, SERVICE_ROLE);
  const blob = new Blob([bytes], { type: mime });

  const { error } = await supa.storage.from(BUCKET).upload(path, blob, {
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw error;

  const { data } = supa.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// -------- HTTP handler -------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({}, { status: 204 });

  const u = new URL(req.url);
  if (!u.pathname.endsWith("/generate")) return bad("Not Found", 404);

  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }

  const universeIdRaw: string | undefined = body.universeId ?? body.universeID ?? body.id;
  const universeId = cleanPath(universeIdRaw || "");
  const gradeInt: number | undefined = body.gradeInt ?? body.grade ?? body.grade_id;
  const title: string = body.title ?? "Daily Program";
  const prompt: string = body.prompt ?? `${title} — classroom-friendly, minimal, bright, 16:9, clean graphic cover`;

  const width: number = align32(body.width ?? 1200);
  const height: number = align32(body.height ?? 630);
  if (!universeId || typeof gradeInt !== "number") return bad("Missing universeId or gradeInt");

  // File naming (defaults to .webp unless BFL_OUTPUT === 'jpeg')
  let ext = BFL_OUTPUT === "jpeg" ? "jpg" : "webp";
  let mime = ext === "jpg" ? "image/jpeg" : "image/webp";
  const name = `${slug(title)}.${ext}`;
  const path = `${universeId}/${gradeInt}/${name}`;

  try {
    // 1) Start BFL job
    const start = await bflStart(prompt, width, height);
    const pollingUrl = (start?.polling_url as string | undefined) || undefined;

    // 2) Resolve final image ref (poll if needed; else scan immediate payload)
    let finalRef: string | undefined;
    if (pollingUrl) {
      finalRef = await bflPoll(pollingUrl);
    } else {
      const scan = (v: any): string | undefined => {
        if (!v) return;
        if (typeof v === "string" && /^(https?:\/\/|data:image\/)/i.test(v)) return v;
        if (Array.isArray(v)) for (const x of v) { const r = scan(x); if (r) return r; }
        if (typeof v === "object") for (const x of Object.values(v)) { const r = scan(x); if (r) return r; }
      };
      finalRef = scan(start);
    }
    if (!finalRef) return json({ fallback: true, note: "No polling_url or image ref from BFL", path });

    // 3) Obtain bytes and honor actual MIME
    let bytes: Uint8Array;
    if (/^data:image\//i.test(finalRef)) {
      const dec = dataUrlToBytes(finalRef);
      bytes = dec.bytes;
      if (dec.mime === "image/jpeg") { ext = "jpg"; mime = "image/jpeg"; }
      if (dec.mime === "image/webp")  { ext = "webp"; mime = "image/webp"; }
    } else {
      const fetched = await fetchBytes(finalRef);
      bytes = fetched.bytes;
      const ct = (fetched.mime || "").toLowerCase();
      if (ct.includes("jpeg")) { ext = "jpg"; mime = "image/jpeg"; }
      if (ct.includes("webp")) { ext = "webp"; mime = "image/webp"; }
    }

    // If extension changed due to MIME, adjust path & name
    const finalName = `${slug(title)}.${ext}`;
    const finalPath = `${universeId}/${gradeInt}/${finalName}`;

    // 4) Upload to Storage (public bucket) and return the URL
    const publicUrl = await uploadToStorage(bytes, finalPath, mime);
    return json({ ok: true, publicUrl, path: finalPath, width, height, model: IMAGE_MODEL });
  } catch (e) {
    return json({ ok: false, error: String(e?.message || e), path }, { status: 500 });
  }
});
