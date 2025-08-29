// deno-lint-ignore-file no-explicit-any
// Edge function: POST /functions/v1/image-service/generate
// Genererer et billede via Black Forest Labs og uploader til Storage.
// Returnerer stabil public URL, så klienten altid kan vise samme sti.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4?dts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...CORS,
      ...(init.headers ?? {}),
    },
  });
}
function bad(msg: string, code = 400) { return json({ error: msg }, { status: code }); }

function slug(s: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "cover";
}

// ---- BFL helpers ------------------------------------------------------------

const IMAGE_MODEL = Deno.env.get("IMAGE_MODEL") || "flux-dev";
const BFL_OUTPUT = (Deno.env.get("BFL_OUTPUT") || "webp").toLowerCase(); // 'webp' eller 'jpeg'

async function bflStart(prompt: string, width: number, height: number) {
  const apiKey = Deno.env.get("BFL_API_KEY");
  if (!apiKey) throw new Error("Missing BFL_API_KEY");

  // flux-dev endpoint
  const endpoint = "https://api.bfl.ai/v1/flux-dev";

  const r = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-key": apiKey,
    },
    body: JSON.stringify({
      prompt,
      width,
      height,
      steps: 28,
      guidance: 3,
      prompt_upsampling: false,
      output_format: BFL_OUTPUT, // 'webp' (foretrukket) eller 'jpeg'
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

    // Find en URL til billedet i svaret
    let candidate: string | undefined;
    const scan = (v: any) => {
      if (!v) return;
      if (typeof v === "string" && /^https?:\/\//i.test(v)) {
        if (!candidate) candidate = v;
      } else if (Array.isArray(v)) v.forEach(scan);
      else if (typeof v === "object") Object.values(v).forEach(scan);
    };
    scan(j);

    const status = String(j?.status ?? j?.state ?? "").toLowerCase();
    if (candidate && (status === "ready" || status === "succeeded" || status === "success")) {
      return candidate;
    }
    if (candidate && !status) return candidate; // prøv hvis vi allerede har en URL

    await new Promise((s) => setTimeout(s, 1500));
  }

  throw new Error("BFL poll timeout");
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch image failed: ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

// ---- Storage upload ---------------------------------------------------------

async function uploadToStorage(bytes: Uint8Array, path: string, mime: string) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const BUCKET = Deno.env.get("UNIVERSE_IMAGES_BUCKET") || "universe-images";

  const supa = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Brug Blob for korrekt content-type
  const blob = new Blob([bytes], { type: mime });

  const { error } = await supa.storage.from(BUCKET).upload(path, blob, {
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw error;

  const { data } = supa.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---- HTTP handler -----------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({}, { status: 204 });

  const u = new URL(req.url);
  if (!(u.pathname.endsWith("/generate"))) {
    return bad("Not Found", 404);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const universeId: string | undefined = body.universeId ?? body.universeID ?? body.id;
  const gradeInt: number | undefined = body.gradeInt ?? body.grade ?? body.grade_id;
  const title: string = body.title ?? "Daily Program";
  const prompt: string = body.prompt ?? `${title} — classroom-friendly, minimal, bright, 16:9, clean graphic cover`;
  const width: number = Math.max(256, Math.min(body.width ?? 1200, 2048));
  const height: number = Math.max(256, Math.min(body.height ?? 630, 2048));

  if (!universeId || typeof gradeInt !== "number") {
    return bad("Missing universeId or gradeInt");
  }

  // Ensartet filnavn – hold det i .webp som standard
  const ext = BFL_OUTPUT === "jpeg" ? "jpg" : "webp";
  const name = `${slug(title)}.${ext}`;
  const path = `${universeId}/${gradeInt}/${name}`;
  const mime = ext === "jpg" ? "image/jpeg" : "image/webp";

  try {
    // 1) Start + poll BFL
    const start = await bflStart(prompt, width, height);
    const pollingUrl = start?.polling_url as string | undefined;
    if (!pollingUrl) {
      // Kan ske ved fejl eller rate limit – returnér intet, så `image-ensure` beholder placeholder
      return json({ fallback: true, note: "No polling_url from BFL", path });
    }
    const finalUrl = await bflPoll(pollingUrl);

    // 2) Hent bytes og upload til Storage
    const bytes = await fetchBytes(finalUrl);
    const publicUrl = await uploadToStorage(bytes, path, mime);

    return json({ ok: true, publicUrl, path });
  } catch (e) {
    return json({ ok: false, error: String(e?.message || e), path }, { status: 500 });
  }
});
