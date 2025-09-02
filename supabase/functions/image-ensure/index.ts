// supabase/functions/image-ensure/index.ts
// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

// --- helpers ---------------------------------------------------------------

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
};

const ok = (data: unknown, status = 200) =>
  new Response(JSON.stringify({ ok: true, data }), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });

const bad = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });

// normalize curly quotes / dashes so we never hit Latin-1 encoding paths
const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–‐−]/g, "-")
    .trim();

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

// --- handler ---------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return bad("Method not allowed", 405);

  // Env
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  const srv =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";

  // Use the KNOWN working BFL endpoint
  const bflEndpoint =
    Deno.env.get("BFL_API_URL") ??
    `${Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai"}/v1/${
      Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1"
    }`;
  const bflKey = Deno.env.get("BFL_API_KEY");

  if (!srv) return bad("Missing SERVICE_ROLE_KEY", 500);
  if (!bflKey) return bad("Missing BFL_API_KEY", 500);

  const supabase = createClient(supabaseUrl, srv, { auth: { persistSession: false } });

  // Body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const universeId = String(body.universeId ?? "default");
  const width = Number(body.width ?? 1216);
  const height = Number(body.height ?? 640);
  const prompt = normalize(String(body.title ?? body.prompt ?? "Cover image"));

  // Build BFL payload (pass through tunables if present)
  const payload: Record<string, unknown> = { prompt, width, height };
  if (body.negativePrompt) payload["negative_prompt"] = body.negativePrompt;
  if (body.seed !== undefined) payload["seed"] = body.seed;
  if (body.cfgScale !== undefined) payload["cfg_scale"] = body.cfgScale;
  if (body.steps !== undefined) payload["steps"] = body.steps;

  // 1) Generate via BFL (blocking)
  const res = await fetch(bflEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${bflKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    return bad(`BFL ${res.status}: ${txt || res.statusText}`, 502);
  }
  const json = await res.json().catch(() => ({} as any));

  // Common result shapes; take the first URL we find
  const candidates = [
    json?.url,
    json?.image?.url,
    ...(Array.isArray(json?.data) ? json.data.map((x: any) => x?.url) : []),
    ...(Array.isArray(json?.output) ? json.output : []),
    ...(Array.isArray(json?.images) ? json.images.map((x: any) => x?.url ?? x) : []),
  ].filter(Boolean);
  const delivery = String(candidates[0] ?? "");
  if (!/^https?:\/\//i.test(delivery)) return bad("BFL response missing image URL", 502);

  // 2) Download bytes
  const imgRes = await fetch(delivery);
  if (!imgRes.ok) return bad(`Failed to fetch generated image: ${imgRes.status}`, 502);
  const bytes = new Uint8Array(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";

  // 3) Decide extension
  const ext =
    contentType.includes("png") ? "png" :
    contentType.includes("webp") ? "webp" :
    contentType.includes("gif") ? "gif" : "jpg";

  // 4) Upload to Storage
  const path = `${universeId}/${Date.now()}-${slug(prompt)}.${ext}`;
  const up = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType,
    upsert: true,
  });
  if (up.error) return bad(`Storage upload failed: ${up.error.message}`, 502);

  // 5) Public URL
  const pub = supabase.storage.from(bucket).getPublicUrl(path);

  return ok({
    impl: "image-ensure-v1",
    width,
    height,
    bflEndpoint,
    delivery,
    bucket,
    path,
    publicUrl: pub.data.publicUrl,
  });
});
