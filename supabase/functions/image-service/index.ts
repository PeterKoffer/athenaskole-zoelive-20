// deno-lint-ignore-file no-explicit-any
// Edge function: POST /functions/v1/image-service/generate
// Genererer et billede via Black Forest Labs og uploader til Storage.
// Returnerer stabil public URL (samme bucket/path hver gang).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4?dts";

/* ---------------------------------- CORS ---------------------------------- */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

function bad(msg: string, code = 400) {
  return json({ ok: false, error: msg }, { status: code });
}

/* ------------------------------ util helpers ------------------------------ */

function slug(s: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "cover";
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, max));
const snap32 = (n: number) => Math.round(n / 32) * 32;

/* ------------------------------ BFL (flux-dev) ---------------------------- */

const BFL_OUTPUT = (Deno.env.get("BFL_OUTPUT") || "webp").toLowerCase(); // "webp" | "jpeg"
const BFL_ENDPOINT = "https://api.bfl.ai/v1/flux-dev"; // flux-dev

async function bflStart(prompt: string, width: number, height: number) {
  const apiKey = Deno.env.get("BFL_API_KEY");
  if (!apiKey) throw new Error("Missing BFL_API_KEY");

  const r = await fetch(BFL_ENDPOINT, {
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
      output_format: BFL_OUTPUT, // "webp" (foretrukket) eller "jpeg"
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

    // Find en (første) URL i svaret
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
    if (
      candidate &&
      (status === "ready" || status === "succeeded" || status === "success")
    ) {
      return candidate;
    }
    // Ingen tydelig status, men vi har allerede en URL? Prøv den.
    if (candidate && !status) return candidate;

    await new Promise((s) => setTimeout(s, 1500));
  }

  throw new Error("BFL poll timeout");
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch image failed: ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

/* ------------------------------ Storage upload ---------------------------- */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = Deno.env.get("UNIVERSE_IMAGES_BUCKET") || "universe-images";
const supaSrv = createClient(SUPABASE_URL, SERVICE_ROLE);

function publicUrlFor(path: string) {
  const { data } = supaSrv.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadToStorage(bytes: Uint8Array, path: string, mime: string) {
  const blob = new Blob([bytes], { type: mime });

  const { error } = await supaSrv.storage.from(BUCKET).upload(path, blob, {
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw error;

  return publicUrlFor(path);
}

/* --------------------------------- Server --------------------------------- */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({}, { status: 204 });

  const u = new URL(req.url);
  if (u.pathname.endsWith("/health")) {
    return json({ ok: true, time: new Date().toISOString() });
  }
  if (!u.pathname.endsWith("/generate")) {
    return bad("Not Found", 404);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const universeId: string | undefined =
    body.universeId ?? body.universeID ?? body.id;
  const gradeInt: number | undefined =
    body.gradeInt ?? body.grade ?? body.grade_id;
  const title: string = body.title ?? "Daily Program";

  if (!universeId || typeof gradeInt !== "number") {
    return bad("Missing universeId or gradeInt");
  }

  // Prompt + dimensioner (snap til multipla af 32 + clamp til fornuftigt spænd)
  const prompt: string =
    body.prompt ??
    `${title} — classroom-friendly, minimal, bright, 16:9, clean graphic cover`;

  const wIn = Number(body.width ?? 1216);
  const hIn = Number(body.height ?? 640);
  const width = clamp(snap32(wIn), 256, 1440);
  const height = clamp(snap32(hIn), 256, 1440);

  // Samme filnavn hver gang (stabil URL). Default til webp.
  const ext = BFL_OUTPUT === "jpeg" ? "jpg" : "webp";
  const name = `${slug(title)}.${ext}`;
  const path = `${universeId}/${gradeInt}/${name}`;
  const mime = ext === "jpg" ? "image/jpeg" : "image/webp";

  try {
    // 1) Start + poll BFL
    const start = await bflStart(prompt, width, height);
    const pollingUrl = (start?.polling_url as string | undefined) ?? "";
    if (!pollingUrl) {
      // Ingen job oprettet – returnér stabil public URL (peger på placeholder indtil upload)
      return json({
        ok: false,
        note: "No polling_url from BFL",
        path,
        publicUrl: publicUrlFor(path),
        width,
        height,
      });
    }

    const finalUrl = await bflPoll(pollingUrl);

    // 2) Hent bytes og upload til Storage (samme path → samme public URL)
    const bytes = await fetchBytes(finalUrl);
    const publicUrl = await uploadToStorage(bytes, path, mime);

    return json({
      ok: true,
      source: "bfl",
      path,
      publicUrl,
      width,
      height,
    });
  } catch (e) {
    // Bevar stabil URL (peger på eksisterende placeholder hvis generering fejler).
    return json({
      ok: false,
      error: String(e?.message || e),
      path,
      publicUrl: publicUrlFor(path),
      width,
      height,
    });
  }
});
