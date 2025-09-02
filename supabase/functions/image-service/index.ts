// supabase/functions/image-service/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { bflGenerateImage } from "../_shared/imageProviders.ts";

/* ---------- helpers ---------- */

function corsHeaders() {
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
    headers: corsHeaders(),
  });
}

function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: corsHeaders(),
  });
}

function handleOptions(req: Request) {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(), status: 204 });
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

  // ── Env
  const supabaseUrl =
    Deno.env.get("SUPABASE_URL") /* cloud */ ?? "http://127.0.0.1:54321"; /* local */

  const srv =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // fallback supported

  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";

  const bflKey = Deno.env.get("BFL_API_KEY");
  const bflBase = Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai";
  const bflModel = Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1";

  console.log("[image-service] hasSRV:", Boolean(srv));
  if (!srv) return bad("Missing SERVICE_ROLE_KEY", 500);
  if (!bflKey) return bad("Missing BFL_API_KEY", 500);

  const supabase = createClient(supabaseUrl, srv, {
    auth: { persistSession: false },
  });

  // ── Body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);
  const universeId = String(body.universeId ?? "default");

  try {
    // 1) Generate image via BFL (blocking)
    const endpoint = `${bflBase}/v1/${bflModel}`;
    console.log(
      "[image-service] submitting to:",
      endpoint,
      "prompt:",
      prompt,
      "w/h:",
      width,
      height,
    );

    const { url: bflUrl } = await bflGenerateImage({
      prompt,
      width,
      height,
      apiKey: bflKey,
      // pass-through fine-tunables if provided:
      negativePrompt: body.negativePrompt,
      seed: body.seed,
      cfgScale: body.cfgScale,
      steps: body.steps,
    });

    // 2) Download bytes from BFL’s delivery URL
    const imgRes = await fetch(bflUrl);
    if (!imgRes.ok)
      return bad(`Failed to fetch generated image: ${imgRes.status}`, 502);

    const arrayBuf = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
    const blob = new Blob([arrayBuf], { type: contentType });

    // 3) Decide extension
    const ext =
      contentType.includes("png") ? "png" :
      contentType.includes("webp") ? "webp" :
      contentType.includes("gif") ? "gif" : "jpg";

    // 4) Upload to Storage
    const path = `${universeId}/${Date.now()}-${slug(prompt)}.${ext}`;
    const up = await supabase.storage.from(bucket).upload(path, blob, {
      contentType,
      upsert: true,
    });
    if (up.error)
      return bad(`Storage upload failed: ${up.error.message}`, 502);

    // 5) Public URL
    const pub = supabase.storage.from(bucket).getPublicUrl(path);

    return ok({
      impl: "bfl-upload-v1",
      width,
      height,
      bflUrl, // debug/reference
      bucket,
      path,
      publicUrl: pub.data.publicUrl,
    });
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 502);
  }
});
