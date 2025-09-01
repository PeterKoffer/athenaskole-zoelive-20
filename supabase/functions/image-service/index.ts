// supabase/functions/image-service/index.ts
// Edge Function: generate via BFL and upload to Storage

import { bflGenerateImageInline } from "../_shared/imageProviders.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const CORS_HEADERS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
} as const;

function ok(data: unknown, status = 200) {
  return new Response(JSON.stringify({ ok: true, data }), { status, headers: CORS_HEADERS });
}
function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), { status, headers: CORS_HEADERS });
}
function handleOptions(req: Request) {
  if (req.method === "OPTIONS") return new Response("{}", { headers: CORS_HEADERS });
  return null;
}

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  // Parse body
  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }

  // Inputs
  const provider = (Deno.env.get("IMAGE_PROVIDER") || "bfl").toLowerCase();
  if (provider !== "bfl") return bad("Replicate provider not configured yet", 501);

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);
  const universeId = String(body.universeId ?? "default");

  // BFL config
  const apiBase = Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai";
  const model = Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1";
  const apiKey = Deno.env.get("BFL_API_KEY");
  if (!apiKey) return bad("Missing BFL_API_KEY", 500);

  const endpoint = `${apiBase}/v1/${model}`;
  console.info("[image-service] submitting to:", endpoint, "prompt:", prompt, "w/h:", width, height);

  // Generate image via BFL
  const { url } = await bflGenerateImageInline({ apiKey, endpoint, prompt, width, height });

  // Storage config
  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  const serviceRole = Deno.env.get("SERVICE_ROLE_KEY");

  // Hvis ikke SERVICE_ROLE_KEY er sat, falder vi pænt tilbage til inline-respons
  if (!serviceRole) {
    return ok({ impl: "bfl-inline-v1", endpoint, url, width, height });
  }

  // Upload til Storage med service role
  const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  // Hent billedbytes fra BFL delivery URL
  const imgRes = await fetch(url);
  if (!imgRes.ok) return bad(`Failed to fetch image: ${imgRes.status}`, 502);
  const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
  const bytes = new Uint8Array(await imgRes.arrayBuffer());

  // Gem i bucket
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${contentType.includes("png") ? "png" : "jpg"}`;
  const path = `${universeId}/${filename}`;

  const up = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType,
    upsert: true,
  });
  // @ts-ignore supabase-js on deno returns { data, error }
  if (up.error) return bad(`Upload error: ${up.error.message}`, 502);

  const pub = supabase.storage.from(bucket).getPublicUrl(path);

  return ok({
    impl: "bfl-upload-v1",
    provider,
    endpoint,
    sourceUrl: url,
    bucket,
    path,
    publicUrl: pub.data.publicUrl,
    width,
    height,
  });
});
