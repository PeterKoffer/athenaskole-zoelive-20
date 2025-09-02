// @ts-nocheck
// supabase/functions/image-ensure/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { bflGenerateImage } from "../_shared/imageProviders.ts";

/* ---------- helpers ---------- */

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
} as const;

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...CORS, ...(init.headers ?? {}) },
  });
}

const ok  = (data: unknown, status = 200) => json({ ok: true, data }, { status });
const bad = (msg: string, status = 400) => json({ error: msg }, { status });

const handleOptions = (req: Request) =>
  req.method === "OPTIONS" ? new Response("ok", { headers: CORS, status: 204 }) : null;

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

/** Make sure weird quotes/long dashes don't upset any encoders. */
const toAscii = (s: string) =>
  s.normalize("NFKD")
    .replace(/[''‚‛']/g, "'")
    .replace(/[""„‟"]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/[^\x00-\x7F]/g, " ");

/* ---------- handler ---------- */

Deno.serve(async (req) => {
  const pre = handleOptions(req);
  if (pre) return pre;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  // Body
  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON"); }

  // Env
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  const srv =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!srv) return bad("Missing SERVICE_ROLE_KEY", 500);

  const bucket   = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";
  const bflKey   = Deno.env.get("BFL_API_KEY");
  const bflBase  = Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai";
  const bflModel = Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1";
  if (!bflKey) return bad("Missing BFL_API_KEY", 500);

  const supabase = createClient(supabaseUrl, srv, { auth: { persistSession: false } });

  // Inputs
  const width      = Math.max(16, Math.min(4096, Number(body.width  ?? 1216)));
  const height     = Math.max(16, Math.min(4096, Number(body.height ??  640)));
  const gradeInt   = Number.isFinite(body.gradeInt) ? Number(body.gradeInt) : undefined;
  const universeId = String(body.universeId ?? "default");
  const titleIn    = String(body.title ?? "Today's Program");

  // Safe prompt (ASCII-only is safest for external APIs that choke on Latin-1)
  const prompt = toAscii(
    body.title
      ? titleIn
      : `Engaging classroom cover image${gradeInt ? ` for grade ${gradeInt}` : ""}, vibrant, friendly, clean composition`
  );

  // 1) Generate via BFL
  const { url: bflUrl } = await bflGenerateImage({
    prompt, width, height, apiKey: bflKey,
    negativePrompt: body.negativePrompt,
    seed: body.seed,
    cfgScale: body.cfgScale,
    steps: body.steps,
  });

  // 2) Download bytes
  const resp = await fetch(bflUrl);
  if (!resp.ok) return bad(`BFL delivered ${resp.status}`, 502);
  const bytes = new Uint8Array(await resp.arrayBuffer());
  const contentType = resp.headers.get("content-type") ?? "image/jpeg";

  // 3) Choose extension
  const ext =
    contentType.includes("png")  ? "png"  :
    contentType.includes("webp") ? "webp" :
    contentType.includes("gif")  ? "gif"  : "jpg";

  // 4) Upload to Storage
  const path = `${universeId}/${Date.now()}-${slug(titleIn)}.${ext}`;
  const up = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType,
    upsert: true,
  });
  if (up.error) return bad(`Storage upload failed: ${up.error.message}`, 502);

  // 5) Public URL
  const pub = supabase.storage.from(bucket).getPublicUrl(path);

  return ok({
    impl: "image-ensure@upload-v1",
    base: bflBase,
    model: bflModel,
    bflUrl,                 // for debugging
    bucket, path,
    width, height,
    publicUrl: pub.data.publicUrl,
  });
});