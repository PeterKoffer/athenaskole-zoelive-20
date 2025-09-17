// @ts-nocheck
// supabase/functions/image-ensure/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
} as const;

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...CORS, ...(init.headers ?? {}) },
  });

const ok  = (data: unknown, status = 200) => json({ ok: true, data }, { status });
const bad = (msg: string, status = 400) => json({ error: msg }, { status });

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

// keep file paths ASCII-safe; prompts can stay UTF-8
const toAscii = (s: string) =>
  s.normalize("NFKD")
    .replace(/[''‚‛']/g, "'")
    .replace(/[""„‟"]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, " ");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS, status: 204 });
  if (req.method !== "GET" && req.method !== "POST") return bad("Method not allowed", 405);

  // ---- env
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  const srv =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";

  const openaiKey = Deno.env.get("OPENAI_API_KEY");

  console.log("[image-ensure] OpenAI config:", { 
    hasKey: Boolean(openaiKey), 
    keyLength: openaiKey?.length || 0,
  });
  
  if (!srv)      return bad("Missing SERVICE_ROLE_KEY", 500);
  if (!openaiKey) return bad("Missing OPENAI_API_KEY", 500);

  const supa = createClient(supabaseUrl, srv, { auth: { persistSession: false } });

  // ---- inputs (GET or POST)
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  let body: any = {};
  if (req.method === "POST") {
    try { body = await req.json(); } catch { /* ignore */ }
  }

  const universeId = String(body.universeId ?? query.universeId ?? "default");
  const requestedWidth  = Number(body.width  ?? query.width  ?? 1024);
  const requestedHeight = Number(body.height ?? query.height ?? 1024);
  
  // OpenAI gpt-image-1 only supports specific sizes
  const getValidOpenAISize = (w: number, h: number): string => {
    if (w === h) return "1024x1024";
    if (w > h) return "1792x1024";
    return "1024x1792";
  };
  
  const openaiSize = getValidOpenAISize(requestedWidth, requestedHeight);
  const [width, height] = openaiSize.split('x').map(Number);
  const gradeInt = Number.isFinite(Number(body.gradeInt ?? query.gradeInt))
    ? Number(body.gradeInt ?? query.gradeInt)
    : undefined;

  const titleIn = String(body.title ?? query.title ?? "Today's Program");
  
  // Import the new cinematic prompt engine
  const { buildAdventurePrompt } = await import('../../../src/services/imagePromptEngine.ts');
  
  // Build cinematic adventure-specific prompt
  const prompt = buildAdventurePrompt(universeId, titleIn, "cover");

  try {
    console.log("[image-ensure] Starting OpenAI image generation...", { prompt, openaiSize });
    
    // ---- 1) Generate via OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: openaiSize,
        quality: 'standard',
        response_format: 'b64_json'
      }),
    });

    console.log("[image-ensure] OpenAI response status:", openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("[image-ensure] OpenAI API error:", errorText);
      return bad(`OpenAI API failed: ${openaiResponse.status} ${errorText}`, 502);
    }

    const openaiData = await openaiResponse.json();
    console.log("[image-ensure] OpenAI response received, processing...");
    
    if (!openaiData.data || !openaiData.data[0] || !openaiData.data[0].b64_json) {
      console.error("[image-ensure] Invalid OpenAI response format:", openaiData);
      return bad("Invalid OpenAI response format", 502);
    }
    
    const base64Image = openaiData.data[0].b64_json;
    
    // ---- 2) Convert base64 to bytes
    const binaryString = atob(base64Image);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const contentType = "image/png";

    // ---- 3) Decide extension
    const ext =
      contentType.includes("png")  ? "png"  :
      contentType.includes("webp") ? "webp" :
      contentType.includes("gif")  ? "gif"  : "jpg";

    // ---- 4) Upload to Storage
    // Use the expected path format: universeId/gradeInt/cover.webp
    const path = `${universeId}/${gradeInt}/cover.webp`;
    const up = await supa.storage.from(bucket).upload(path, bytes, {
      contentType: "image/webp", // Always save as webp for consistency
      upsert: true,
    });
    if (up.error) return bad(`Storage upload failed: ${up.error.message}`, 502);

    // ---- 5) Public URL
    const pub = supa.storage.from(bucket).getPublicUrl(path);

    return ok({
      impl: "openai-upload-v1",
      width, height,
      bucket, path,
      publicUrl: pub.data.publicUrl,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Surface OpenAI auth errors clearly
    if (/401|403|Not authenticated|Unauthorized/i.test(msg)) {
      return bad(`OpenAI auth failed (check OPENAI_API_KEY): ${msg}`, 502);
    }
    return bad(msg, 502);
  }
});