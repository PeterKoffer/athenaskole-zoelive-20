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

// ====== ADVENTURE-AWARE, BANNER-SAFE PROMPT BUILDER ======
type PromptInput = {
  title: string;              // "Launch a Non-Profit Organization"
  subject?: string;           // "Civics", "Life Skills", etc.
  tags?: string[];            // ["Grade 6-8","Project-based"]
  mode?: "pro" | "classroom"; // classroom only if allow-listed elsewhere
};

// keyword → scene snippets (zero classrooms)
const MAP: Array<[RegExp, string]> = [
  [/record label|music (producer|studio)/i,
    "modern recording studio, mixing console, microphones on boom arms, acoustic panels"],
  [/graphic design|design agency|branding|poster|logo/i,
    "creative design studio, large monitors with vector tools, drawing tablets, mood boards"],
  [/self[- ]?driv|autonom|robot|ai lab/i,
    "robotics lab with LiDAR rigs and a test vehicle on a garage bay track"],
  [/non[- ]?profit|nonprofit|ngo|charit/i,
    "non-profit operations hub with donor dashboards on screens, project pinboard, volunteer kits"],
  [/dinosaur|paleo|jurassic|safari/i,
    "field research outpost at a dinosaur park, safety railings, dig crates, lush foliage"],
  [/miniature city|urban plan|city planner/i,
    "urban planning studio with a detailed scale model city and zoning maps"],
  [/construction|skyscraper|civil|bridge/i,
    "active construction site with tower cranes, scaffolding, and blueprints on a table"],
  [/news|journalis|podcast|broadcast/i,
    "newsroom / podcast studio with cameras, boom mics, light panels, editing bays"],
  [/kitchen|culinary|restaurant|food truck/i,
    "professional kitchen line with stainless counters and the pass"],
  [/earthquake|seismic|tremor|geological/i,
    "seismology research lab with earthquake monitoring equipment, seismographs, geological rock samples"],
  [/national park|park manager|conservation/i,
    "park ranger station with trail maps, wildlife monitoring equipment, conservation research center"],
  [/anti.?bullying|campaign|advocacy|social.?change/i,
    "community outreach center with campaign materials, advocacy posters, meeting space with presentation boards"],
  [/budget|financial|accounting|economics/i,
    "modern financial planning office with charts, calculators, budget spreadsheets on monitors"],
];

function buildAdventurePrompt({ title, subject, tags = [], mode = "pro" }: PromptInput): string {
  // NELIE Cinemagic v1.1 - cinematic toy-photorealistic style
  const STYLE =
    "NELIE Cinemagic v1.1 — cinematic toy-photorealistic 3D render, soft dreamy magical atmosphere, warm golden-hour lighting with gentle rim light, shallow depth of field, creamy bokeh, subtle volumetric light rays and dust motes, PBR materials with fine micro-roughness and subsurface scattering, pastel filmic color grading, slight bloom and vignette, professional composition, subject tack-sharp / background softly blurred, clean Pixar/Laika-inspired look, ultra-detailed textures, no text or watermark — NELIE Cinemagic v1.1";
  const COMPOSITION =
    "wide establishing shot, 16:9 banner, eye-level, rule-of-thirds";
  const SAFE_MARGINS =
    "keep all key subjects inside central 60% of frame; 8–12% safe margins on all edges; no tight close-ups";
  const COLOR_MOOD =
    "warm, safe, wonder";
  const DIVERSITY =
    "All human subjects are school-age children or teenagers (6–16), age-appropriate clothing and proportions, inclusive and diverse mix of races and cultures, friendly and safe tone. No adults unless explicitly specified. No anthropomorphic animals, no mascots, no dolls or puppets";

  // negative rules (NELIE Cinemagic v1.1 compatible)
  const NEG_PRO =
    "blurry, noisy, low-res, harsh shadows, oversaturated, fisheye, extreme wide-angle distortion, motion blur, horror, gore, violence, creepy, sexualized, text, logo, watermark, cluttered background, jpeg artifacts, extra fingers/limbs, deformed hands, adults (unless specified), anthropomorphic animals, mascots, furries, dolls, puppets, classroom, school desks, chalkboards/whiteboards, lockers, adult teachers, adult professionals, NO adults over 18 years old";

  const NEG_CLASSROOM =
    "blurry, noisy, low-res, harsh shadows, oversaturated, fisheye, extreme wide-angle distortion, motion blur, horror, gore, violence, creepy, sexualized, text, logo, watermark, cluttered background, jpeg artifacts, extra fingers/limbs, deformed hands, anthropomorphic animals, mascots, furries, dolls, puppets, no boardrooms, no factories, no hospitals, no construction sites";

  const t = title.toLowerCase();
  let scene = "professional real-world environment relevant to the adventure";
  for (const [rx, s] of MAP) if (rx.test(t)) { scene = s; break; }

  const subjectHint = subject ? `Subject: ${subject}. ` : "";
  const tagHint = tags.length ? `Tags: ${tags.join(", ")}. ` : "";

  if (mode === "classroom") {
    // server should already gate this by allowlist
    const CLASSROOM_SCENE =
      "bright, modern classroom; collaborative tables; learning posters; natural daylight; friendly atmosphere";
    return `${STYLE} — ${COMPOSITION} — ${SAFE_MARGINS} — ${COLOR_MOOD} — ${DIVERSITY} — Adventure: ${title}. ${subjectHint}${tagHint}${CLASSROOM_SCENE} — ${NEG_CLASSROOM}`;
  }

  // pro (default) — adventure-specific, classroom-proof
  return `${STYLE} — ${COMPOSITION} — ${SAFE_MARGINS} — ${COLOR_MOOD} — ${DIVERSITY} — Adventure: ${title}. ${subjectHint}${tagHint}${scene} — ${NEG_PRO}`;
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
        console.log("[image-ensure] Found existing file with version: undefined need version: v5-nelie");
        // Force regeneration with new NELIE Cinemagic v1.1 style
      } else {
        console.log("[image-ensure] No existing cover.webp found, will generate new one");
      }
    } catch (e) {
      console.log("[image-ensure] Error checking existing files:", e);
    }

    console.log("[image-ensure] No suitable existing image found, generating new one...");

    // THE ONLY PROMPT BUILDER - NO OTHER PROMPTS ALLOWED
    const finalMode = (requestedMode === "classroom" && isClassroomAllowed(titleIn)) ? "classroom" : "pro";
    
    // Convert universe ID to proper title for adventure-specific prompts
    const adventureTitle = titleIn === "cover" ? 
      universeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
      titleIn;
    
    const fullPrompt = buildAdventurePrompt({
      title: adventureTitle,
      subject: body.subject ?? query.subject,
      tags: body.tags ?? query.tags ?? [],
      mode: finalMode
    });
    
    console.log("[image-ensure] ===== PROMPT DETAILS =====");
    console.log("[image-ensure] Title:", titleIn);
    console.log("[image-ensure] Universe ID:", universeId);
    console.log("[image-ensure] Requested Mode:", requestedMode);
    console.log("[image-ensure] Final Mode:", finalMode);
    console.log("[image-ensure] Classroom Allowed:", isClassroomAllowed(titleIn));
    console.log("[image-ensure] ===== FULL PROMPT BEING SENT TO OPENAI =====");
    console.log("[image-ensure] PROMPT:", fullPrompt);
    console.log("[image-ensure] ===== END PROMPT =====");

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
        size: "1536x1024", // True 16:9 ratio for perfect banner framing (OpenAI supported)
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