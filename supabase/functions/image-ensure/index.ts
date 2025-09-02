// supabase/functions/image-ensure/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { bflGenerateImage } from "../_shared/imageProviders.ts";

/* ---------- helpers ---------- */
function ok(data: unknown, status = 200) {
  return new Response(JSON.stringify({ ok: true, data }), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers":
        "authorization, x-client-info, apikey, content-type",
      "access-control-allow-methods": "GET,POST,OPTIONS",
    },
  });
}
function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers":
        "authorization, x-client-info, apikey, content-type",
      "access-control-allow-methods": "GET,POST,OPTIONS",
    },
  });
}
function handleOptions(req: Request) {
  if (req.method === "OPTIONS") return ok({});
  return null;
}
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

// normalize titles like "Today's Program" → "Todays Program"
function ascii(s: string) {
  return s
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "");
}

/* ---------- handler ---------- */
Deno.serve(async (req) => {
  const pre = handleOptions(req);
  if (pre) return pre;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  // env
  const supabaseUrl =
    Deno.env.get("SUPABASE_URL") /* cloud */ ?? "http://127.0.0.1:54321"; /* local */
  const srv =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";

  const bflKey = Deno.env.get("BFL_API_KEY");
  const bflBase = Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai";
  const bflModel = Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1";

  // quick visibility while debugging (remove later if noisy)
  console.log("[image-ensure] hasSRV:", Boolean(srv),
              "hasBFL:", Boolean(bflKey),
              "base:", bflBase, "model:", bflModel);

  if (!srv) return bad("Missing SERVICE_ROLE_KEY", 500);
  if (!bflKey) return bad("Missing BFL_API_KEY", 500);

  const supabase = createClient(supabaseUrl, srv, { auth: { persistSession: false } });

  // body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const universeId = String(body.universeId ?? "default");
  const title = ascii(String(body.title ?? body.prompt ?? "Today's Program"));
  const width = Number(body.width ?? 1216);
  const height = Number(body.height ?? 640);
  const gradeInt = Number(body.gradeInt ?? 8);

  // Build a decent default prompt if caller didn't provide one
  const prompt =
    String(body.prompt) ||
    `${title}, engaging classroom cover image for grade ${gradeInt}, vibrant, friendly, clean composition`;

  try {
    // 1) Generate via BFL (returns delivery URL)
    console.log("[image-ensure] generating via BFL…");
    const { url: bflUrl } = await bflGenerateImage({
      prompt,
      width,
      height,
      apiKey: bflKey,
      negativePrompt: body.negativePrompt,
      seed: body.seed,
      cfgScale: body.cfgScale,
      steps: body.steps,
    });

    // 2) Download bytes from the delivery URL
    const imgRes = await fetch(bflUrl);
    if (!imgRes.ok) return bad(`Fetch generated image failed: ${imgRes.status}`, 502);
    const bytes = new Uint8Array(await imgRes.arrayBuffer());
    const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
    const ext =
      contentType.includes("png") ? "png" :
      contentType.includes("webp") ? "webp" :
      contentType.includes("gif") ? "gif" : "jpg";

    // 3) Upload to Storage
    const path = `${universeId}/${Date.now()}-${slug(title)}.${ext}`;
    const up = await supabase.storage.from(bucket).upload(path, bytes, {
      contentType,
      upsert: true,
    });
    if (up.error) return bad(`Storage upload failed: ${up.error.message}`, 502);

    const pub = supabase.storage.from(bucket).getPublicUrl(path);

    return ok({
      impl: "ensure-bfl-upload-v1",
      bucket,
      path,
      publicUrl: pub.data.publicUrl,
      width,
      height,
      // keep the original BFL URL around for debugging if you want
      bflUrl,
    });
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 502);
  }
});