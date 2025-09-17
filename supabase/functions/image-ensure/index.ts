// @ts-nocheck
// supabase/functions/image-ensure/index.ts - Fixed quality param for gpt-image-1
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Prompt building system - NO CLASSROOMS!
const STYLE_PACK = "cinematic hybrid photoreal + pixar-like, high dynamic range, volumetric light, shallow depth of field, ultra-detailed, filmic color grade, no text overlay, no watermark, no logos";
const NEGATIVE = "NO classroom, NO school interior, NO desks, NO chalkboard, NO whiteboard, NO children, NO teacher, NO clipart, NO flat icon style, NO 3D word art, NO school supplies, NO academic setting";

type Scene = { scene: string; props: string };
const SCENE_MAP: Record<string, Scene> = {
  "graphic-agency": {
    scene: "modern graphic design studio, large monitors with design software, drawing tablets, moodboards, color swatch walls",
    props: "sketchpads, pens, logo drafts, light from big windows, indoor plants",
  },
  "dinosaur-park": {
    scene: "prehistoric safari outpost, jungle foliage, electric fence vista, paleontology field station",
    props: "field kits, binoculars, bone casts, muddy tracks, research tent",
  },
  "sports-team": {
    scene: "professional sports management office, team tactics board, performance analytics screens",
    props: "team jerseys, strategy charts, fitness data, stadium model",
  },
  "soundproof-room": {
    scene: "acoustics lab with anechoic wedges, microphones and SPL meters",
    props: "signal generator screen with waveforms, tripod stands, sound equipment",
  },
  "generic-professional": {
    scene: "real-world professional environment relevant to the topic",
    props: "authentic tools and materials, subtle depth haze, natural light",
  },
};

function inferKey(title: string): string {
  const t = title.toLowerCase();
  if (/(graphic|design|branding|logo|agency)/.test(t)) return "graphic-agency";
  if (/(dinosaur|safari|paleo|jurassic|prehistoric)/.test(t)) return "dinosaur-park";
  if (/(sports|team|manage|professional sports)/.test(t)) return "sports-team";
  if (/(soundproof|acoustic|anechoic|audio lab)/.test(t)) return "soundproof-room";
  return "generic-professional";
}

function buildCinematicPrompt(title: string): string {
  const key = inferKey(title);
  const scene = SCENE_MAP[key] ?? SCENE_MAP["generic-professional"];
  return `${STYLE_PACK} — ${scene.scene} — ${scene.props} — mood: adventurous, inspiring — ${NEGATIVE}`;
}

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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS, status: 204 });
  
  // Health check endpoint
  const url = new URL(req.url);
  if (req.method === "GET" && url.pathname.endsWith("/health")) {
    return json({ ok: true, ts: Date.now(), service: "image-ensure" });
  }
  
  if (req.method !== "GET" && req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Environment setup
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const bucket = Deno.env.get("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    console.log("[image-ensure] OpenAI config:", { 
      hasKey: Boolean(openaiKey), 
      keyLength: openaiKey?.length || 0,
    });
    
    if (!serviceRoleKey) return json({ ok: false, error: "Missing SERVICE_ROLE_KEY" }, { status: 500 });
    if (!openaiKey) return json({ ok: false, error: "Missing OPENAI_API_KEY" }, { status: 500 });

    const supa = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    // Parse inputs (GET or POST)
    const query = Object.fromEntries(url.searchParams.entries());
    let body: any = {};
    if (req.method === "POST") {
      try { body = await req.json(); } catch { /* ignore */ }
    }

    const universeId = String(body.universeId ?? query.universeId ?? "default");
    const gradeInt = Number.isFinite(Number(body.gradeInt ?? query.gradeInt)) 
      ? Number(body.gradeInt ?? query.gradeInt) 
      : 6;
    const titleIn = String(body.title ?? query.title ?? "cover");

    console.log("[image-ensure] Looking for prompt version: v4");
    console.log("[image-ensure] Checking for existing image at:", `${universeId}/${gradeInt}/cover.webp`);
    console.log("[image-ensure] Adventure details:", {
      universeId,
      titleIn,
      titleLower: titleIn.toLowerCase(),
      idLower: universeId.toLowerCase()
    });

    const objectPath = `${universeId}/${gradeInt}/cover.webp`;

    // Check for existing image first
    try {
      const { data: files, error: listError } = await supa.storage
        .from(bucket)
        .list(`${universeId}/${gradeInt}`, { limit: 100 });

      if (listError) throw new Error(`List error: ${listError.message}`);
      
      const existingFile = files?.find(f => f.name === "cover.webp");
      if (existingFile) {
        console.log("[image-ensure] Found existing file with version: undefined need version: v4");
        // For now, let's regenerate to ensure we get the new style
      } else {
        console.log("[image-ensure] No existing cover.webp found, will generate new one");
      }
    } catch (e) {
      console.log("[image-ensure] Error checking existing files:", e);
    }

    console.log("[image-ensure] No suitable existing image found, generating new one...");

    // Build the prompt using our classroom-free system
    const fullPrompt = buildCinematicPrompt(titleIn);
    
    console.log("[image-ensure] Full prompt being sent:", fullPrompt);

    // Generate image with OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
        quality: "high",
        output_format: "webp",
      }),
    });

    console.log("[image-ensure] OpenAI response status:", openaiResponse.status);
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${errorText}`);
    }

    console.log("[image-ensure] OpenAI response received, processing...");
    
    const openaiData = await openaiResponse.json();
    
    if (!openaiData.data?.[0]?.b64_json) {
      throw new Error("No image data received from OpenAI");
    }

    // Convert base64 to Uint8Array
    const base64Data = openaiData.data[0].b64_json;
    const binaryString = atob(base64Data);
    const imageBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      imageBytes[i] = binaryString.charCodeAt(i);
    }

    const minBytes = 12000; // Minimum size to avoid broken images
    if (imageBytes.byteLength < minBytes) {
      throw new Error(`Generated image too small: ${imageBytes.byteLength} bytes`);
    }

    // Upload to Supabase Storage
    const { error: uploadError } = await supa.storage
      .from(bucket)
      .upload(objectPath, imageBytes, {
        contentType: "image/webp",
        upsert: true,
        cacheControl: "31536000"
      });

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supa.storage
      .from(bucket)
      .getPublicUrl(objectPath);

    return json({
      ok: true,
      path: objectPath,
      url: publicUrlData.publicUrl,
      bytes: imageBytes.byteLength,
      source: "openai",
      cache: "MISS"
    });

  } catch (error: any) {
    console.error("[image-ensure] Fatal error:", error);
    // Return JSON error instead of 502 to prevent UI breaks
    return json({ 
      ok: false, 
      error: String(error?.message ?? error),
      source: "error" 
    }, { status: 500 });
  }
});