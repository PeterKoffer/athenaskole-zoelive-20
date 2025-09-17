// @ts-nocheck
// supabase/functions/image-ensure/index.ts - SINGLE SOURCE OF TRUTH FOR ALL IMAGES
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// ====== WHITELIST: ONLY THESE TITLES CAN HAVE CLASSROOM IMAGES ======
const CLASSROOM_ALLOWED = [
  /training ground/i,
  /teacher training/i,
  /classroom management/i,
  /education practice/i,
  /pedagogy/i
];

function isClassroomAllowed(title: string): boolean {
  return CLASSROOM_ALLOWED.some(pattern => pattern.test(title));
}

// ====== THE ONLY PROMPT BUILDER IN THE ENTIRE SYSTEM ======
function buildSinglePrompt(title: string, mode: "professional" | "classroom" = "professional"): string {
  const STYLE = "cinematic hybrid photoreal + subtle Pixar warmth, HDR, volumetric light, shallow DOF, filmic color grade, no text/watermarks, no logos";
  
  // Force professional mode if classroom not allowed
  if (mode === "classroom" && !isClassroomAllowed(title)) {
    mode = "professional";
  }

  if (mode === "classroom") {
    return `${STYLE} — bright modern classroom with collaborative learning setup, natural daylight, educational posters, students working together, inspiring atmosphere — NO corporate settings, NO boardrooms`;
  }

  // Professional environments based on adventure title
  const t = title.toLowerCase();
  let scene = "professional modern workspace";
  
  if (/(record label|music|studio|audio)/.test(t)) {
    scene = "modern recording studio with mixing console, sound equipment, acoustic panels";
  } else if (/(graphic|design|agency|branding)/.test(t)) {
    scene = "creative design studio with large monitors, drawing tablets, mood boards";
  } else if (/(robot|ai|tech|programming)/.test(t)) {
    scene = "modern tech lab with computers, robotic equipment, innovation workspace";
  } else if (/(dinosaur|paleo|fossil|expedition)/.test(t)) {
    scene = "paleontology field station with excavation tools, fossil displays, research tent";
  } else if (/(antarctic|ice|polar|climate)/.test(t)) {
    scene = "arctic research station with ice core samples, scientific equipment, snowy landscape";
  } else if (/(marine|ocean|underwater|aquatic)/.test(t)) {
    scene = "marine research facility with aquariums, diving gear, underwater cameras";
  } else if (/(space|satellite|mission|astronaut)/.test(t)) {
    scene = "space mission control center with monitoring screens, satellite displays";
  } else if (/(construction|building|architect)/.test(t)) {
    scene = "construction site office with blueprints, hard hats, building equipment";
  } else if (/(medical|health|clinic|hospital)/.test(t)) {
    scene = "modern medical facility with diagnostic equipment, clean environment";
  } else if (/(sports|team|athletics|fitness)/.test(t)) {
    scene = "professional sports facility with training equipment, performance analytics";
  }

  const ANTI_CLASSROOM = "ABSOLUTELY NO classroom, school desks, chalkboards, whiteboards, lockers, teachers, students, school supplies, educational posters, academic settings";
  
  return `${STYLE} — ${scene} — inspiring professional atmosphere — ${ANTI_CLASSROOM}`;
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
    const requestedMode = String(body.mode ?? query.mode ?? "professional");

    console.log("[image-ensure] SINGLE PROMPT SYSTEM - Looking for:", `${universeId}/${gradeInt}/cover.webp`);
    console.log("[image-ensure] Title:", titleIn, "| Mode requested:", requestedMode);
    console.log("[image-ensure] Classroom allowed:", isClassroomAllowed(titleIn));

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

    // THE ONLY PROMPT BUILDER - NO OTHER PROMPTS ALLOWED
    const finalMode = (requestedMode === "classroom" && isClassroomAllowed(titleIn)) ? "classroom" : "professional";
    const fullPrompt = buildSinglePrompt(titleIn, finalMode);
    
    console.log("[image-ensure] FINAL MODE:", finalMode);
    console.log("[image-ensure] SINGLE PROMPT:", fullPrompt);

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
        size: "1536x1024", // Supported size for gpt-image-1
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