// @ts-nocheck
// supabase/functions/image-service/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { bflGenerateImage } from "../_shared/imageProviders.ts";

/* ---------- helpers ---------- */

function headers() {
  return {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers":
      "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS",
  } as const;
}
function ok(data: unknown, status = 200) {
  return new Response(JSON.stringify({ ok: true, data }), {
    status,
    headers: headers(),
  });
}
function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: headers(),
  });
}
function handleOptions(req: Request) {
  if (req.method === "OPTIONS") return new Response(null, { headers: headers(), status: 204 });
  return null;
}
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

/* ---------- main ---------- */

Deno.serve(async (req) => {
  // CORS / preflight
  const pre = handleOptions(req);
  if (pre) return pre;

  if (req.method !== "POST") return bad("Method not allowed", 405);

  // — Env
  const supabaseUrl =
    Deno.env.get("SUPABASE_URL") /* cloud */ ?? "http://127.0.0.1:54321"; /* local */

  const srv =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";

  const bflKey = Deno.env.get("BFL_API_KEY");
  const bflBase = Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai";
  const bflModel = Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1";

  console.log("[image-service] hasSRV:", Boolean(srv));
  if (!srv) return bad("Missing SERVICE_ROLE_KEY", 500);
  if (!bflKey) return bad("Missing BFL_API_KEY", 500);

  const supabase = createClient(supabaseUrl, srv, { auth: { persistSession: false } });

  // — Body
  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);
  const universeId = String(body.universeId ?? "default");

  try {
    // 1) Generate via BFL
    const endpoint = `${bflBase}/v1/${bflModel}`;
    console.log("[image-service] submitting to:", endpoint, "prompt:", prompt, "w/h:", width, height);

    const { url: bflUrl } = await bflGenerateImage({
      prompt, width, height, apiKey: bflKey,
      endpoint,
      negativePrompt: body.negativePrompt,
      seed: body.seed,
      cfgScale: body.cfgScale,
      steps: body.steps,
    });

    // 2) Download bytes
    const imgRes = await fetch(bflUrl);
    if (!imgRes.ok) return bad(`Failed to fetch generated image: ${imgRes.status}`, 502);

    const arrayBuf = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
    const blob = new Blob([arrayBuf], { type: contentType });

    // 3) Extension
    const ext =
      contentType.includes("png") ? "png" :
      contentType.includes("webp") ? "webp" :
      contentType.includes("gif") ? "gif" : "jpg";

    // 4) Upload timestamped AND canonical "cover"
    const tsPath = `${universeId}/${Date.now()}-${slug(prompt)}.${ext}`;
    const coverPath = `${universeId}/cover.${ext}`; // <- what the UI expects

    const up1 = await supabase.storage.from(bucket).upload(tsPath, blob, {
      contentType, upsert: true,
    });
    if (up1.error) return bad(`Storage upload (history) failed: ${up1.error.message}`, 502);

    const up2 = await supabase.storage.from(bucket).upload(coverPath, blob, {
      contentType, upsert: true,
    });
    if (up2.error) return bad(`Storage upload (cover) failed: ${up2.error.message}`, 502);

    // Public URL (canonical)
    const pub = supabase.storage.from(bucket).getPublicUrl(coverPath);

    return ok({
      impl: "bfl-upload-v1",
      width, height,
      bflUrl,                   // original delivery URL (debug)
      bucket,
      path: tsPath,             // timestamped record
      coverPath,                // canonical path the UI can always load
      publicUrl: pub.data.publicUrl,
    });
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 502);
  }
});
