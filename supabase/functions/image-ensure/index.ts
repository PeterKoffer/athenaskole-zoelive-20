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
  
  // Cinematic prompt generation (embedded for edge function)
  const buildCinematicPrompt = (universeId: string, title: string): string => {
    const titleLower = title.toLowerCase();
    const idLower = universeId.toLowerCase();
    
    // Adventure-specific contexts
    let setting = 'a learning adventure focused on ' + title;
    let environment = 'modern educational classroom or learning space';
    let keyElements = 'educational materials, learning tools, collaborative workspace';
    let props = 'learning materials, books, tools, presentation boards';
    
    // Graphics, Animation & Design
    if (titleLower.includes('infographic') || titleLower.includes('animator') || titleLower.includes('animation')) {
      setting = 'a modern animation and design studio';
      environment = 'creative workspace with multiple monitors, drawing tablets, and design software';
      keyElements = 'computer workstations, drawing tablets, colorful graphics on screens, animation timelines';
      props = 'digital drawing tablets, multiple monitors, design software interfaces, color palettes, stylus pens';
    } else if (titleLower.includes('graphic') || titleLower.includes('logo') || titleLower.includes('brand')) {
      setting = 'a graphic design studio';
      environment = 'modern creative workspace with design materials and inspiration boards';
      keyElements = 'design mockups, color swatches, typography samples, brand identity materials';
      props = 'design tablets, color wheels, font samples, logo sketches, brand boards';
    
    // Automotive & AI
    } else if (titleLower.includes('self-driving') || titleLower.includes('autonomous') || titleLower.includes('car ai') || titleLower.includes('vehicle ai')) {
      setting = 'an autonomous vehicle testing facility and AI development center';
      environment = 'high-tech automotive lab with self-driving cars and computer vision displays';
      keyElements = 'autonomous vehicles, AI computer screens, sensor arrays, camera systems, radar displays';
      props = 'self-driving cars, computer monitors with AI code, LIDAR sensors, cameras, automotive equipment';
    } else if (titleLower.includes('robot') || titleLower.includes('automation') || titleLower.includes('ai')) {
      setting = 'a robotics laboratory or automation facility';
      environment = 'modern tech lab with robotic equipment and programming stations';
      keyElements = 'robotic arms, circuit boards, programming interfaces, mechanical components';
      props = 'robots, circuit boards, computers, sensors, mechanical parts, programming displays';
    
    // Agriculture & Farming
    } else if (titleLower.includes('vertical farm') || idLower.includes('vertical-farm')) {
      setting = 'a modern vertical farming facility';
      environment = 'indoor hydroponic tower garden with LED grow lights';
      keyElements = 'stacked growing towers, LED panels, nutrient systems, fresh vegetables';
      props = 'hydroponic towers, grow lights, water pumps, pH meters, harvest baskets';
    } else if (titleLower.includes('farm') || titleLower.includes('ranch') || idLower.includes('farm') || idLower.includes('ranch')) {
      setting = 'a traditional farm or ranch operation';
      environment = 'pastoral countryside with farmhouse, barns, fields, and livestock areas';
      keyElements = 'red barn, farmhouse, tractors, crops, farm animals, pastures, fence lines';
      props = 'wooden barn, farm equipment, hay bales, farm animals, crops in fields, rustic fencing';
    
    // Science & Technology
    } else if (titleLower.includes('satellite') || titleLower.includes('space') || titleLower.includes('network')) {
      setting = 'a mission control center or satellite facility';
      environment = 'high-tech control room with screens showing orbital paths and communications';
      keyElements = 'satellite dishes, orbital displays, communication arrays, mission control screens';
      props = 'control panels, satellite models, orbital maps, communication equipment, radar dishes';
    } else if (titleLower.includes('skyscraper') || titleLower.includes('construction') || titleLower.includes('building') || titleLower.includes('architecture')) {
      setting = 'a skyscraper construction site and architectural planning office';
      environment = 'construction site with cranes and scaffolding, or architectural firm with building models';
      keyElements = 'construction cranes, building blueprints, hard hats, scaffolding, architectural models';
      props = 'construction equipment, blueprints, hard hats, measuring tools, building models, cranes';
    } else if (titleLower.includes('water rocket') || titleLower.includes('rocket') || titleLower.includes('rube goldberg')) {
      setting = 'a rocket launch competition area or engineering workshop';
      environment = 'outdoor launch field with safety equipment and measuring tools, or indoor workshop with engineering materials';
      keyElements = 'rockets, launch pads, trajectory paths, measuring equipment, engineering contraptions';
      props = 'rockets, launch pads, safety goggles, measuring tapes, engineering materials, pulleys, ramps';
    } else if (titleLower.includes('robot') || titleLower.includes('automation') || titleLower.includes('ai')) {
      setting = 'a robotics laboratory or automation facility';
      environment = 'modern tech lab with robotic equipment and programming stations';
      keyElements = 'robotic arms, circuit boards, programming interfaces, mechanical components';
      props = 'robots, circuit boards, computers, sensors, mechanical parts, programming displays';
    
    // Business & Economics
    } else if (titleLower.includes('negotiation') || idLower.includes('negotiation')) {
      setting = 'a business negotiation workshop';
      environment = 'professional meeting room or classroom setup';
      keyElements = 'meeting tables, presentation boards, handshake moments, business materials';
      props = 'meeting tables, chairs, notebooks, presentation materials, name tags';
    } else if (titleLower.includes('startup') || titleLower.includes('entrepreneur') || titleLower.includes('business')) {
      setting = 'a modern startup incubator or co-working space';
      environment = 'open collaborative workspace with whiteboards and presentation areas';
      keyElements = 'brainstorming sessions, pitch presentations, business plans, team collaboration';
      props = 'whiteboards, laptops, presentation screens, sticky notes, business charts';
    } else if (titleLower.includes('market') || titleLower.includes('economics') || titleLower.includes('trade')) {
      setting = 'a bustling marketplace or trading floor';
      environment = 'active commercial environment with vendors and buyers';
      keyElements = 'market stalls, price displays, trading activities, commercial exchanges';
      props = 'market stalls, price tags, calculators, goods displays, cash registers';
    
    // History & Culture
    } else if (titleLower.includes('constitutional') || idLower.includes('constitution')) {
      setting = 'a historical constitutional convention';
      environment = 'colonial-style meeting hall with period furniture';
      keyElements = 'colonial architecture, founding documents, quill pens, historical furniture';
      props = 'wooden desks, quill pens, parchment, candles, colonial chairs';
    } else if (titleLower.includes('history') || titleLower.includes('museum') || titleLower.includes('artifact')) {
      setting = 'a historical research center or museum';
      environment = 'archive room with historical documents and artifacts';
      keyElements = 'historical documents, artifacts, research materials, preservation equipment';
      props = 'old documents, magnifying glasses, archive boxes, historical artifacts, research desks';
    } else if (titleLower.includes('cultural') || titleLower.includes('exchange') || titleLower.includes('international')) {
      setting = 'an international cultural center';
      environment = 'multicultural space with flags, maps, and cultural displays';
      keyElements = 'world maps, cultural artifacts, international flags, language materials';
      props = 'world globes, cultural items, language books, international flags, communication devices';
    
    // Arts & Media
    } else if (titleLower.includes('music') || titleLower.includes('sound') || titleLower.includes('audio')) {
      setting = 'a music production studio';
      environment = 'professional recording studio with instruments and mixing equipment';
      keyElements = 'mixing boards, microphones, instruments, sound waves, recording booth';
      props = 'musical instruments, microphones, mixing console, headphones, sound panels';
    } else if (titleLower.includes('film') || titleLower.includes('video') || titleLower.includes('cinema')) {
      setting = 'a film production studio';
      environment = 'movie set with cameras, lighting, and film equipment';
      keyElements = 'film cameras, lighting rigs, director chairs, film reels, movie screens';
      props = 'film cameras, lighting equipment, clapperboards, film reels, editing screens';
    } else if (titleLower.includes('podcast') || titleLower.includes('interview') || titleLower.includes('journalism')) {
      setting = 'a podcast studio or newsroom';
      environment = 'professional broadcast studio with recording equipment';
      keyElements = 'microphones, soundproofing, recording equipment, interview setup';
      props = 'professional microphones, headphones, recording devices, soundproof panels, interview table';
    
    // Manufacturing & Design
    } else if (titleLower.includes('toy line') || titleLower.includes('toy') || titleLower.includes('product design')) {
      setting = 'a toy design and manufacturing workshop';
      environment = 'creative design studio with prototyping materials';
      keyElements = 'toy prototypes, design sketches, colorful materials, craft supplies';
      props = 'craft materials, design tools, toy prototypes, sketch pads, markers';
    } else if (titleLower.includes('fashion') || titleLower.includes('textile') || titleLower.includes('clothing')) {
      setting = 'a fashion design atelier';
      environment = 'design studio with mannequins, fabric samples, and sewing equipment';
      keyElements = 'dress forms, fabric swatches, fashion sketches, sewing machines';
      props = 'mannequins, fabric rolls, sewing machines, design sketches, measuring tools';
    
    // Food & Culinary
    } else if (titleLower.includes('restaurant') || titleLower.includes('culinary') || titleLower.includes('chef')) {
      setting = 'a professional kitchen or culinary school';
      environment = 'modern commercial kitchen with cooking stations and equipment';
      keyElements = 'cooking stations, professional equipment, fresh ingredients, plated dishes';
      props = 'chef knives, cooking pans, fresh ingredients, plated food, kitchen equipment';
    } else if (titleLower.includes('nutrition') || titleLower.includes('food science') || titleLower.includes('diet')) {
      setting = 'a nutrition laboratory or health clinic';
      environment = 'clean laboratory with food analysis equipment and health materials';
      keyElements = 'laboratory equipment, nutritional charts, healthy foods, analysis tools';
      props = 'microscopes, nutritional charts, fresh produce, measuring scales, lab equipment';
    
    // Sports & Recreation
    } else if (titleLower.includes('sports') || titleLower.includes('athletics') || titleLower.includes('fitness')) {
      setting = 'a modern sports facility or training center';
      environment = 'athletic facility with training equipment and sports fields';
      keyElements = 'sports equipment, training gear, athletic fields, fitness machines';
      props = 'sports balls, fitness equipment, training cones, athletic gear, scoreboards';
    
    // Environment & Sustainability
    } else if (titleLower.includes('environment') || titleLower.includes('sustainability') || titleLower.includes('green')) {
      setting = 'an environmental research center';
      environment = 'eco-friendly facility with renewable energy and natural elements';
      keyElements = 'solar panels, wind turbines, green plants, recycling systems, natural lighting';
      props = 'solar panels, plants, recycling bins, environmental charts, renewable energy displays';
    
    // Transportation & Logistics  
    } else if (titleLower.includes('transport') || titleLower.includes('logistics') || titleLower.includes('delivery')) {
      setting = 'a modern logistics center or transportation hub';
      environment = 'warehouse with automated systems and delivery trucks';
      keyElements = 'conveyor belts, delivery trucks, shipping containers, tracking systems';
      props = 'packages, trucks, conveyor systems, shipping labels, logistics screens';
    } else if (titleLower.includes('aviation') || titleLower.includes('airport') || titleLower.includes('flight')) {
      setting = 'an airport or aviation facility';
      environment = 'modern airport with aircraft and control systems';
      keyElements = 'airplanes, control towers, runways, flight displays, aviation equipment';
      props = 'aircraft, flight schedules, aviation instruments, airport equipment, control panels';
    
    // Gaming & Interactive
    } else if (titleLower.includes('game') || titleLower.includes('gaming') || titleLower.includes('interactive')) {
      setting = 'a game development studio';
      environment = 'creative workspace with multiple monitors and gaming setups';
      keyElements = 'gaming computers, development tools, game art, testing stations';
      props = 'gaming monitors, keyboards, game controllers, development software, concept art';
    }
    
    if (titleLower.includes('vertical farm') || idLower.includes('vertical-farm')) {
      setting = 'a modern vertical farming facility';
      environment = 'indoor hydroponic tower garden with LED grow lights';
      keyElements = 'stacked growing towers, LED panels, nutrient systems, fresh vegetables';
      props = 'hydroponic towers, grow lights, water pumps, pH meters, harvest baskets';
    } else if (titleLower.includes('farm') || titleLower.includes('ranch') || idLower.includes('farm') || idLower.includes('ranch')) {
      setting = 'a traditional farm or ranch operation';
      environment = 'pastoral countryside with farmhouse, barns, fields, and livestock areas';
      keyElements = 'red barn, farmhouse, tractors, crops, farm animals, pastures, fence lines';
      props = 'wooden barn, farm equipment, hay bales, farm animals, crops in fields, rustic fencing';
    } else if (titleLower.includes('negotiation') || idLower.includes('negotiation')) {
      setting = 'a business negotiation workshop';
      environment = 'professional meeting room or classroom setup';
      keyElements = 'meeting tables, presentation boards, handshake moments, business materials';
      props = 'meeting tables, chairs, notebooks, presentation materials, name tags';
    } else if (titleLower.includes('toy line') || idLower.includes('toy') || titleLower.includes('design')) {
      setting = 'a toy design and manufacturing workshop';
      environment = 'creative design studio with prototyping materials';
      keyElements = 'toy prototypes, design sketches, colorful materials, craft supplies';
      props = 'craft materials, design tools, toy prototypes, sketch pads, markers';
    } else if (titleLower.includes('water rocket') || idLower.includes('rocket') || titleLower.includes('rube goldberg')) {
      setting = 'a rocket launch competition area or engineering workshop';
      environment = 'outdoor launch field with safety equipment and measuring tools, or indoor workshop with engineering materials';
      keyElements = 'rockets, launch pads, trajectory paths, measuring equipment, engineering contraptions';
      props = 'rockets, launch pads, safety goggles, measuring tapes, engineering materials, pulleys, ramps';
    } else if (titleLower.includes('constitutional') || idLower.includes('constitution')) {
      setting = 'a historical constitutional convention';
      environment = 'colonial-style meeting hall with period furniture';
      keyElements = 'colonial architecture, founding documents, quill pens, historical furniture';
      props = 'wooden desks, quill pens, parchment, candles, colonial chairs';
    }
    
    const consistency = `NELIE-cin-real-01 ${universeId.replace(/[^a-z0-9]/gi, '-')}`;
    
    return [
      "cinematic stylized realism",
      "high-end animation film aesthetic", 
      "soft PBR materials",
      "depth-of-field bokeh",
      `cinematic establishing shot of ${setting}, showing ${keyElements}`,
      `${environment}, ${props}`,
      "wide establishing, 35mm anamorphic, eye-level, gentle parallax",
      "golden hour backlight, soft rim, warm bounce",
      "teal & warm amber cinematic grade",
      "hopeful, inviting, educational",
      "age-appropriate, wholesome",
      "no text overlay, no brand logos",
      `CONSISTENCY_TAG: ${consistency}`
    ].join(" — ");
  };
  
  const prompt = buildCinematicPrompt(universeId, titleIn);
  
  // DEBUG: Log what we're generating for
  console.log("[image-ensure] Adventure details:", { 
    universeId, 
    titleIn, 
    titleLower: titleIn.toLowerCase(),
    idLower: universeId.toLowerCase()
  });

  try {
    // ---- 3) Check if image exists in storage first (with version check)
    const promptVersion = 'v3'; // Increment when prompt logic changes
    const expectedPath = `${universeId}/${gradeInt}/cover.webp`;
    
    console.log("[image-ensure] Checking for existing image at:", expectedPath);
    
    // Check if we have a version marker in metadata to know if regeneration is needed
    const { data: existingFile } = await supa.storage.from(bucket).list(`${universeId}/${gradeInt}`, {
      search: `cover.webp`
    });

    if (existingFile && existingFile.length > 0) {
      const file = existingFile[0];
      // Check if file is large enough AND was generated with current prompt version
      const hasCurrentVersion = file.metadata?.promptVersion === promptVersion;
      if (file.metadata?.size && file.metadata.size >= minBytes && hasCurrentVersion) {
        console.log("[image-ensure] Found existing image with correct version, returning:", expectedPath);
        const { data: publicUrl } = supa.storage.from(bucket).getPublicUrl(expectedPath);
        return good({
          impl: "storage-existing",
          width: width,
          height: height, 
          bucket,
          path: expectedPath,
          publicUrl: publicUrl.publicUrl
        });
      } else {
        console.log("[image-ensure] Existing image outdated or too small, regenerating...");
      }
    }

    console.log("[image-ensure] No suitable existing image found, generating new one...");
    console.log("[image-ensure] Full prompt being sent:", prompt);
    
    // Check if this looks like a generic prompt (debugging)
    if (prompt.includes('learning adventure focused on') && !prompt.includes('autonomous') && !prompt.includes('animation') && !prompt.includes('farm')) {
      console.log("[image-ensure] WARNING: Using generic fallback prompt! This shouldn't happen for specific adventures.");
    }
    
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
    // Add version metadata to track when images need regeneration
    const path = `${universeId}/${gradeInt}/cover.webp`;
    const up = await supa.storage.from(bucket).upload(path, bytes, {
      contentType: "image/webp", // Always save as webp for consistency
      upsert: true,
      metadata: {
        promptVersion: promptVersion, // Track version for cache invalidation
        generatedAt: new Date().toISOString(),
        adventureSpecific: true
      }
    });
    const up = await supa.storage.from(bucket).upload(path, bytes, {
      contentType: "image/webp", // Always save as webp for consistency
      upsert: true,
      metadata: {
        promptVersion: promptVersion, // Track version for cache invalidation
        generatedAt: new Date().toISOString(),
        adventureSpecific: true
      }
    });
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