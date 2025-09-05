// @ts-nocheck
// supabase/functions/image-service/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

  console.log("[image-service] hasSRV:", Boolean(srv));
  console.log("[image-service] openaiKey exists:", Boolean(openaiApiKey), "length:", openaiApiKey?.length || 0);
  if (!srv) return bad("Missing SERVICE_ROLE_KEY", 500);
  if (!openaiApiKey) return bad("Missing OPENAI_API_KEY", 500);

  const supabase = createClient(supabaseUrl, srv, { auth: { persistSession: false } });

  // — Body
  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);
  const universeId = String(body.universeId ?? "default");

  try {
    // 1) Generate via OpenAI
    console.log("[image-service] submitting to OpenAI, prompt:", prompt, "w/h:", width, height);

    let imageBytes: Uint8Array;
    try {
      const result = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt,
          size: `${width}x${height}`,
          output_format: 'webp',
          quality: 'high',
          n: 1,
        }),
      });

      if (!result.ok) {
        const errorText = await result.text();
        throw new Error(`OpenAI API error: ${result.status} ${errorText}`);
      }

      const data = await result.json();
      const imageB64 = data.data[0].b64_json;
      imageBytes = Uint8Array.from(atob(imageB64), c => c.charCodeAt(0));
      console.log("[image-service] OpenAI generation successful, bytes:", imageBytes.length);
    } catch (openaiError) {
      console.error("[image-service] OpenAI API error:", openaiError);
      return bad(`OpenAI API error: ${openaiError instanceof Error ? openaiError.message : String(openaiError)}`, 502);
    }

    // 2) Create blob from bytes
    const contentType = "image/webp";
    const blob = new Blob([imageBytes], { type: contentType });

    // 3) Extension
    const ext = "webp";

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
      impl: "openai-upload-v1",
      width, height,
      bucket,
      path: tsPath,             // timestamped record
      coverPath,                // canonical path the UI can always load
      publicUrl: pub.data.publicUrl,
    });
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 502);
  }
});
