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
  
  // Cinematic prompt generation - COMPREHENSIVE MAPPING FOR ALL ADVENTURES
  const buildCinematicPrompt = (universeId: string, title: string): string => {
    const titleLower = title.toLowerCase();
    const idLower = universeId.toLowerCase();
    
    // Adventure-specific contexts - NO MORE CLASSROOM IMAGES!
    let setting = 'a learning adventure focused on ' + title;
    let environment = 'modern educational workspace';
    let keyElements = 'educational materials, learning tools, collaborative workspace';
    let props = 'learning materials, tools, equipment';
    
    // === BUSINESS & ENTREPRENEURSHIP ===
    if (titleLower.includes('food truck') || titleLower.includes('restaurant') || titleLower.includes('cafe') || titleLower.includes('kitchen') || titleLower.includes('culinary')) {
      setting = 'a bustling food truck operation and commercial kitchen';
      environment = 'vibrant street food scene with cooking equipment and serving areas';
      keyElements = 'food truck, commercial kitchen, fresh ingredients, cooking equipment, happy customers';
      props = 'food truck, grills, fresh vegetables, cooking utensils, menu boards, cash register';
    } else if (titleLower.includes('record label') || titleLower.includes('music studio') || titleLower.includes('band') || titleLower.includes('audio') || titleLower.includes('sound')) {
      setting = 'a professional music recording studio';
      environment = 'state-of-the-art recording facility with mixing boards and sound equipment';
      keyElements = 'recording booth, mixing console, microphones, musical instruments, sound waves';
      props = 'recording equipment, microphones, headphones, musical instruments, vinyl records';
    } else if (titleLower.includes('clothing') || titleLower.includes('fashion') || titleLower.includes('textile') || idLower.includes('clothing')) {
      setting = 'a fashion design studio and manufacturing facility';
      environment = 'creative workspace with mannequins, fabric samples, and sewing equipment';
      keyElements = 'design sketches, fabric swatches, sewing machines, mannequins, clothing displays';
      props = 'mannequins, fabric samples, sewing machines, measuring tape, fashion sketches';
    } else if (titleLower.includes('pet adoption') || titleLower.includes('animal shelter') || titleLower.includes('veterinary') || titleLower.includes('animal care')) {
      setting = 'a modern animal shelter and veterinary facility';
      environment = 'caring environment with kennels, play areas, and medical equipment';
      keyElements = 'animal kennels, happy pets, medical equipment, adoption forms, play areas';
      props = 'dog kennels, pet toys, medical supplies, adoption paperwork, pet carriers';
    } else if (titleLower.includes('movie theater') || titleLower.includes('cinema') || titleLower.includes('film') || titleLower.includes('theater management')) {
      setting = 'a modern movie theater complex';
      environment = 'entertainment venue with screening rooms and concession areas';
      keyElements = 'movie screens, projection equipment, theater seats, film reels, popcorn stands';
      props = 'projectors, film reels, theater seats, popcorn machines, movie posters';
    } else if (titleLower.includes('sports team') || titleLower.includes('athletic') || titleLower.includes('stadium') || titleLower.includes('sports management')) {
      setting = 'a professional sports stadium and training facility';
      environment = 'athletic complex with playing fields, training equipment, and team areas';
      keyElements = 'sports field, stadium seating, training equipment, team jerseys, scoreboards';
      props = 'sports equipment, uniforms, training gear, scoreboards, athletic fields';
    } else if (titleLower.includes('startup') || titleLower.includes('tech company') || titleLower.includes('entrepreneur') || titleLower.includes('business incubator')) {
      setting = 'a modern startup incubator and co-working space';
      environment = 'collaborative workspace with whiteboards, computers, and presentation areas';
      keyElements = 'startup office, brainstorming sessions, pitch presentations, computer workstations';
      props = 'whiteboards, laptops, presentation screens, sticky notes, business charts';
    } else if (titleLower.includes('subscription box') || titleLower.includes('e-commerce') || titleLower.includes('online business')) {
      setting = 'an e-commerce fulfillment center and subscription service facility';
      environment = 'modern warehouse with packaging stations and shipping areas';
      keyElements = 'subscription boxes, packaging stations, inventory shelves, shipping equipment';
      props = 'cardboard boxes, packing materials, shipping labels, warehouse equipment';
    } else if (titleLower.includes('eco-tourism') || titleLower.includes('tourism agency') || titleLower.includes('travel business')) {
      setting = 'an eco-tourism center in a natural setting';
      environment = 'outdoor adventure base with conservation displays and tour equipment';
      keyElements = 'nature trails, tour equipment, conservation displays, outdoor gear';
      props = 'hiking equipment, nature guides, conservation materials, outdoor gear';
    
    // === SCIENCE & TECHNOLOGY ===
    } else if (titleLower.includes('mars') || titleLower.includes('space') || titleLower.includes('lunar') || titleLower.includes('colony') || titleLower.includes('satellite')) {
      setting = 'a space mission control center and astronaut training facility';
      environment = 'futuristic space facility with control panels and space equipment';
      keyElements = 'mission control screens, space suits, rocket models, satellite displays';
      props = 'space suits, control panels, space vehicles, scientific equipment, planet models';
    } else if (titleLower.includes('submarine') || titleLower.includes('ocean') || titleLower.includes('underwater') || titleLower.includes('marine')) {
      setting = 'an underwater research facility and marine laboratory';
      environment = 'marine research center with aquariums and underwater viewing areas';
      keyElements = 'marine specimens, underwater cameras, research equipment, ocean displays';
      props = 'diving equipment, marine specimens, underwater cameras, research tools';
    } else if (titleLower.includes('dinosaur') || titleLower.includes('paleontology') || titleLower.includes('fossil') || titleLower.includes('prehistoric')) {
      setting = 'a paleontology dig site and natural history museum';
      environment = 'excavation site with fossil discoveries and research facilities';
      keyElements = 'fossil excavation, dinosaur bones, research tools, dig site, museum displays';
      props = 'excavation tools, fossil bones, research equipment, dig site markers, museum cases';
    } else if (titleLower.includes('volcano') || titleLower.includes('geological') || titleLower.includes('earthquake') || titleLower.includes('seismology')) {
      setting = 'a volcanic monitoring station and geological research facility';
      environment = 'scientific outpost with monitoring equipment and geological displays';
      keyElements = 'seismic equipment, monitoring displays, geological samples, research stations';
      props = 'seismic instruments, monitoring devices, geological samples, research equipment';
    } else if (titleLower.includes('robot') || titleLower.includes('automation') || titleLower.includes('ai') || titleLower.includes('artificial intelligence')) {
      setting = 'a robotics laboratory and AI development center';
      environment = 'high-tech lab with robotic equipment and computer systems';
      keyElements = 'robotic arms, AI displays, circuit boards, programming interfaces';
      props = 'robots, circuit boards, computers, sensors, mechanical parts, programming displays';
    } else if (titleLower.includes('particle accelerator') || titleLower.includes('physics') || titleLower.includes('quantum') || titleLower.includes('nuclear')) {
      setting = 'a particle physics laboratory';
      environment = 'advanced scientific facility with particle detection equipment';
      keyElements = 'particle accelerator, scientific displays, research equipment, data visualization';
      props = 'scientific instruments, computer displays, research equipment, laboratory tools';
    } else if (titleLower.includes('fusion reactor') || titleLower.includes('energy research') || titleLower.includes('power plant')) {
      setting = 'a clean energy research facility';
      environment = 'advanced energy research center with reactor components and safety systems';
      keyElements = 'energy equipment, control systems, research stations, safety equipment';
      props = 'energy equipment, control panels, safety gear, monitoring equipment';
    
    // === ENGINEERING & CONSTRUCTION ===
    } else if (titleLower.includes('skyscraper') || titleLower.includes('construction') || titleLower.includes('building') || titleLower.includes('architecture')) {
      setting = 'a skyscraper construction site and architectural office';
      environment = 'construction site with cranes and scaffolding, architectural planning areas';
      keyElements = 'construction cranes, building blueprints, hard hats, scaffolding, architectural models';
      props = 'construction equipment, blueprints, hard hats, measuring tools, building models, cranes';
    } else if (titleLower.includes('bridge') || titleLower.includes('civil engineering') || titleLower.includes('infrastructure')) {
      setting = 'a bridge construction site and civil engineering office';
      environment = 'major infrastructure project with engineering equipment';
      keyElements = 'bridge construction, engineering plans, construction vehicles, structural components';
      props = 'engineering blueprints, construction equipment, measuring instruments, safety gear';
    } else if (titleLower.includes('rollercoaster') || titleLower.includes('amusement park') || titleLower.includes('theme park')) {
      setting = 'an amusement park construction site';
      environment = 'theme park with rollercoaster construction and engineering equipment';
      keyElements = 'rollercoaster tracks, construction equipment, safety systems, park attractions';
      props = 'track components, construction tools, safety equipment, engineering plans';
    } else if (titleLower.includes('water park') || titleLower.includes('aquatic') || titleLower.includes('pool design')) {
      setting = 'a water park construction site';
      environment = 'aquatic entertainment complex with water features';
      keyElements = 'water slides, pool systems, safety equipment, aquatic attractions';
      props = 'water slide components, pool equipment, safety gear, construction tools';
    } else if (titleLower.includes('rube goldberg') || titleLower.includes('contraption') || titleLower.includes('mechanical')) {
      setting = 'an engineering workshop with mechanical contraptions';
      environment = 'inventor workshop with pulleys, ramps, and mechanical devices';
      keyElements = 'mechanical contraptions, pulleys, ramps, engineering materials, chain reactions';
      props = 'pulleys, ramps, mechanical parts, engineering tools, contraption components';
    
    // === ARTS & MEDIA ===
    } else if (titleLower.includes('animation') || titleLower.includes('animator') || titleLower.includes('cartoon')) {
      setting = 'a modern animation studio';
      environment = 'creative workspace with drawing tablets, animation software, and storyboards';
      keyElements = 'animation workstations, drawing tablets, storyboards, character designs';
      props = 'digital drawing tablets, animation software, storyboards, character sketches, monitors';
    } else if (titleLower.includes('graphic') || titleLower.includes('logo') || titleLower.includes('design') || titleLower.includes('brand')) {
      setting = 'a graphic design studio';
      environment = 'modern creative workspace with design materials and inspiration boards';
      keyElements = 'design mockups, color palettes, brand materials, computer workstations';
      props = 'design tablets, color wheels, brand boards, computer monitors, design materials';
    } else if (titleLower.includes('comic book') || titleLower.includes('graphic novel') || titleLower.includes('illustration')) {
      setting = 'a comic book studio and illustration workshop';
      environment = 'artistic workspace with drawing materials and comic creation tools';
      keyElements = 'comic pages, illustration boards, drawing tools, character designs';
      props = 'drawing tablets, comic art supplies, illustration tools, character sketches';
    } else if (titleLower.includes('podcast') || titleLower.includes('interview') || titleLower.includes('journalism') || titleLower.includes('radio')) {
      setting = 'a professional podcast studio and newsroom';
      environment = 'broadcast facility with recording equipment and interview setups';
      keyElements = 'podcast microphones, recording booth, interview setup, broadcast equipment';
      props = 'microphones, headphones, recording equipment, interview chairs, broadcast displays';
    } else if (titleLower.includes('video game') || titleLower.includes('game design') || titleLower.includes('gaming') || titleLower.includes('game studio')) {
      setting = 'a video game development studio';
      environment = 'modern game studio with development workstations and testing areas';
      keyElements = 'game development screens, coding workstations, game controllers, testing setups';
      props = 'computers, game controllers, development software, testing equipment, game displays';
    } else if (titleLower.includes('music') || titleLower.includes('composition') || titleLower.includes('musical')) {
      setting = 'a music production studio';
      environment = 'professional recording studio with instruments and mixing equipment';
      keyElements = 'mixing boards, microphones, instruments, sound waves, recording booth';
      props = 'musical instruments, microphones, mixing console, headphones, sound panels';
    } else if (titleLower.includes('broadway') || titleLower.includes('theater') || titleLower.includes('stage') || titleLower.includes('theatrical')) {
      setting = 'a Broadway theater and stage production facility';
      environment = 'theater setting with stage, lighting equipment, and costume areas';
      keyElements = 'theater stage, lighting rigs, costume displays, set pieces, theater seating';
      props = 'stage lighting, costumes, set pieces, theater equipment, performance materials';
    } else if (titleLower.includes('stop-motion') || titleLower.includes('claymation') || titleLower.includes('puppet')) {
      setting = 'a stop-motion animation studio';
      environment = 'specialized studio with puppet sets and animation equipment';
      keyElements = 'puppet sets, animation cameras, puppet characters, miniature props';
      props = 'puppets, miniature sets, animation cameras, puppet-making materials';
    
    // === ADVENTURE & EXPLORATION ===
    } else if (titleLower.includes('safari') || titleLower.includes('wildlife') || titleLower.includes('nature') || titleLower.includes('zoo')) {
      setting = 'a wildlife safari park and conservation center';
      environment = 'natural habitat with wildlife viewing areas and conservation facilities';
      keyElements = 'safari vehicles, wildlife habitats, conservation equipment, animal observation';
      props = 'safari jeeps, binoculars, camera equipment, wildlife tracking gear, conservation tools';
    } else if (titleLower.includes('treasure hunt') || titleLower.includes('archaeology') || titleLower.includes('expedition')) {
      setting = 'an archaeological dig site and treasure hunting expedition';
      environment = 'excavation site with archaeological tools and discovery areas';
      keyElements = 'excavation sites, archaeological tools, treasure maps, discovery equipment';
      props = 'excavation tools, treasure maps, archaeological equipment, discovery artifacts';
    } else if (titleLower.includes('escape room') || idLower.includes('escape-room')) {
      setting = 'a mysterious escape room puzzle chamber';
      environment = 'immersive themed room with locks, puzzles, and hidden compartments';
      keyElements = 'combination locks, puzzle boxes, hidden keys, mysterious symbols, cryptic clues';
      props = 'locked boxes, padlocks, puzzle pieces, magnifying glasses, cipher wheels';
    } else if (titleLower.includes('adventure') || titleLower.includes('quest') || titleLower.includes('exploration')) {
      setting = 'an adventure exploration base camp';
      environment = 'outdoor expedition camp with exploration equipment and maps';
      keyElements = 'expedition tents, exploration maps, adventure gear, discovery equipment';
      props = 'camping gear, maps, compasses, exploration tools, adventure equipment';
    
    // === AGRICULTURE & ENVIRONMENT ===
    } else if (titleLower.includes('vertical farm') || idLower.includes('vertical-farm')) {
      setting = 'a modern vertical farming facility';
      environment = 'indoor hydroponic tower garden with LED grow lights';
      keyElements = 'stacked growing towers, LED panels, nutrient systems, fresh vegetables';
      props = 'hydroponic towers, grow lights, water pumps, pH meters, harvest baskets';
    } else if (titleLower.includes('farm') || titleLower.includes('ranch') || idLower.includes('farm') || idLower.includes('ranch')) {
      setting = 'a traditional farm and ranch operation';
      environment = 'pastoral countryside with barns, fields, and livestock areas';
      keyElements = 'red barn, farmhouse, tractors, crops, farm animals, pastures';
      props = 'wooden barn, farm equipment, hay bales, farm animals, crops, rustic fencing';
    } else if (titleLower.includes('greenhouse') || titleLower.includes('botanical') || titleLower.includes('garden')) {
      setting = 'a botanical greenhouse and garden center';
      environment = 'glass greenhouse with tropical plants and gardening equipment';
      keyElements = 'greenhouse structure, tropical plants, gardening tools, plant displays';
      props = 'gardening tools, plant pots, watering equipment, botanical specimens';
    
    // === AUTOMOTIVE & TRANSPORTATION ===
    } else if (titleLower.includes('self-driving') || titleLower.includes('autonomous') || titleLower.includes('car ai')) {
      setting = 'an autonomous vehicle testing facility';
      environment = 'high-tech automotive lab with self-driving cars and computer systems';
      keyElements = 'autonomous vehicles, AI computer screens, sensor arrays, testing equipment';
      props = 'self-driving cars, computer monitors, LIDAR sensors, cameras, automotive equipment';
    } else if (titleLower.includes('car customization') || titleLower.includes('automotive') || titleLower.includes('garage')) {
      setting = 'an automotive customization shop';
      environment = 'garage workshop with car lifts, tools, and customization equipment';
      keyElements = 'car lifts, automotive tools, custom parts, paint booth, vehicle displays';
      props = 'automotive tools, car parts, paint equipment, diagnostic tools, vehicle lifts';
    
    // === HEALTH & WELLNESS ===
    } else if (titleLower.includes('hospital') || titleLower.includes('medical') || titleLower.includes('healthcare')) {
      setting = 'a modern medical facility';
      environment = 'hospital setting with medical equipment and patient care areas';
      keyElements = 'medical equipment, examination rooms, health monitoring displays';
      props = 'medical instruments, hospital beds, health monitors, medical supplies';
    } else if (titleLower.includes('fitness') || titleLower.includes('gym') || titleLower.includes('wellness')) {
      setting = 'a fitness center and wellness facility';
      environment = 'modern gym with exercise equipment and wellness programs';
      keyElements = 'exercise equipment, fitness areas, wellness programs, training spaces';
      props = 'gym equipment, fitness tools, wellness materials, training apparatus';
    
    // === GOVERNMENT & POLITICS ===
    } else if (titleLower.includes('mayor') || titleLower.includes('politics') || titleLower.includes('government')) {
      setting = 'a city hall and government office';
      environment = 'civic building with government offices and meeting areas';
      keyElements = 'government offices, civic meetings, political displays, public service areas';
      props = 'government documents, civic materials, meeting equipment, political displays';
    } else if (titleLower.includes('law') || titleLower.includes('legal') || titleLower.includes('court') || titleLower.includes('trial')) {
      setting = 'a courthouse and legal facility';
      environment = 'legal setting with courtrooms, law libraries, and research areas';
      keyElements = 'courtroom, legal documents, law books, judicial equipment';
      props = 'legal books, court equipment, legal documents, judicial materials';
    
    // === RETAIL & COMMERCE ===
    } else if (titleLower.includes('shop') || titleLower.includes('store') || titleLower.includes('retail')) {
      setting = 'a modern retail store and shopping center';
      environment = 'commercial space with product displays and customer service areas';
      keyElements = 'product displays, shopping areas, retail equipment, customer service';
      props = 'retail displays, shopping equipment, product samples, customer service tools';
    } else if (titleLower.includes('antique') || titleLower.includes('vintage') || titleLower.includes('collectibles')) {
      setting = 'an antique shop and vintage collectibles store';
      environment = 'nostalgic setting with vintage items and historical displays';
      keyElements = 'antique furniture, vintage collectibles, historical items';
      props = 'antique items, vintage collectibles, historical artifacts, nostalgic decorations';
    } else if (titleLower.includes('sneaker') || titleLower.includes('shoe') || titleLower.includes('footwear')) {
      setting = 'a custom sneaker design studio';
      environment = 'modern footwear design facility with shoe displays and design equipment';
      keyElements = 'sneaker displays, design workstations, shoe-making equipment, custom designs';
      props = 'sneakers, design tools, shoe-making equipment, custom materials';
    
    // === EDUCATION & TRAINING ===
    } else if (titleLower.includes('tutoring') || titleLower.includes('education center') || titleLower.includes('learning center')) {
      setting = 'a modern tutoring and learning center';
      environment = 'educational facility with study areas and learning technology';
      keyElements = 'study areas, educational technology, learning materials, tutoring spaces';
      props = 'educational materials, learning tools, study equipment, teaching aids';
    } else if (titleLower.includes('language') || titleLower.includes('translation') || titleLower.includes('linguistics')) {
      setting = 'a language learning center';
      environment = 'multilingual environment with cultural displays and learning tools';
      keyElements = 'language displays, cultural materials, translation equipment';
      props = 'language materials, cultural artifacts, translation tools, educational displays';
    
    // === TRAVEL & TOURISM ===
    } else if (titleLower.includes('travel') || titleLower.includes('tourism') || titleLower.includes('vacation') || titleLower.includes('trip')) {
      setting = 'a travel agency and tourism center';
      environment = 'travel office with destination displays and planning materials';
      keyElements = 'travel maps, destination photos, planning materials, tourism displays';
      props = 'travel brochures, maps, luggage, travel planning tools, destination materials';
    } else if (titleLower.includes('airline') || titleLower.includes('airport') || titleLower.includes('aviation')) {
      setting = 'an airport terminal and aviation facility';
      environment = 'aviation setting with aircraft terminals and flight operations';
      keyElements = 'aircraft, airport terminals, flight displays, aviation equipment';
      props = 'airplanes, airport equipment, flight materials, aviation tools';
    
    // === MUSEUM & CULTURE ===
    } else if (titleLower.includes('museum') || titleLower.includes('exhibition') || titleLower.includes('gallery')) {
      setting = 'a natural history museum and cultural center';
      environment = 'museum setting with educational displays and interactive exhibits';
      keyElements = 'museum exhibits, display cases, educational materials, interactive displays';
      props = 'museum displays, exhibit materials, educational tools, interactive equipment';
    } else if (titleLower.includes('library') || titleLower.includes('archive') || titleLower.includes('research')) {
      setting = 'a modern library and research facility';
      environment = 'academic setting with books, research materials, and study areas';
      keyElements = 'library shelves, research materials, study areas, academic resources';
      props = 'books, research tools, study equipment, academic materials';
    
    // === MANUFACTURING & PRODUCTION ===
    } else if (titleLower.includes('factory') || titleLower.includes('manufacturing') || titleLower.includes('production')) {
      setting = 'a modern manufacturing facility';
      environment = 'industrial setting with production lines and manufacturing equipment';
      keyElements = 'production lines, manufacturing equipment, quality control stations';
      props = 'industrial equipment, production tools, manufactured goods, safety equipment';
    } else if (titleLower.includes('3d printing') || titleLower.includes('fabrication') || titleLower.includes('prototype')) {
      setting = 'a 3D printing and fabrication lab';
      environment = 'modern fabrication facility with 3D printers and design workstations';
      keyElements = '3D printers, prototype models, design workstations, fabrication tools';
      props = '3D printers, prototype materials, design software, fabrication equipment';
    
    // === SMART HOME & TECHNOLOGY ===
    } else if (titleLower.includes('smart home') || titleLower.includes('home automation') || titleLower.includes('iot')) {
      setting = 'a smart home technology demonstration center';
      environment = 'modern home setting with smart devices and automation systems';
      keyElements = 'smart devices, home automation systems, control panels, connected appliances';
      props = 'smart speakers, automated systems, control interfaces, connected devices';
    } else if (titleLower.includes('computer') || titleLower.includes('pc build') || titleLower.includes('custom computer')) {
      setting = 'a computer assembly and technology workshop';
      environment = 'tech workshop with computer components and assembly stations';
      keyElements = 'computer components, assembly workstations, testing equipment';
      props = 'computer parts, assembly tools, testing equipment, technology components';
    
    // === FALLBACK PATTERNS - More specific than generic classroom ===
    } else if (titleLower.includes('workshop') || titleLower.includes('maker') || titleLower.includes('build')) {
      setting = 'a makerspace workshop';
      environment = 'creative workshop with tools, materials, and building equipment';
      keyElements = 'workshop tools, building materials, fabrication equipment, creative projects';
      props = 'hand tools, building materials, workshop equipment, fabrication tools';
    } else if (titleLower.includes('studio') || titleLower.includes('creative') || titleLower.includes('art')) {
      setting = 'a creative arts studio';
      environment = 'artistic workspace with art supplies and exhibition areas';
      keyElements = 'art supplies, creative materials, studio equipment, artistic displays';
      props = 'art materials, creative tools, studio equipment, artistic supplies';
    } else if (titleLower.includes('lab') || titleLower.includes('laboratory') || titleLower.includes('experiment')) {
      setting = 'a modern research laboratory';
      environment = 'scientific laboratory with research equipment and experimental setups';
      keyElements = 'lab equipment, research displays, experimental apparatus, scientific instruments';
      props = 'laboratory tools, research equipment, scientific instruments, experimental materials';
    } else if (titleLower.includes('center') || titleLower.includes('facility') || titleLower.includes('institute')) {
      setting = 'a specialized learning center';
      environment = 'professional facility with specialized equipment and resources';
      keyElements = 'specialized equipment, professional resources, learning materials';
      props = 'professional tools, specialized equipment, learning resources, facility materials';
    }

    return `Cinematic wide shot of ${setting}. ${environment}. Prominently featuring ${keyElements}. Photorealistic style with ${props} visible in the scene. Vibrant colors, dynamic lighting, engaging composition. No text, no people faces in focus, family-friendly content.`;
  }
    
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
    
    // Gaming & Entertainment  
    } else if (titleLower.includes('escape room') || idLower.includes('escape-room')) {
      setting = 'a mysterious escape room puzzle chamber';
      environment = 'immersive themed room with locks, puzzles, and hidden compartments';
      keyElements = 'combination locks, puzzle boxes, hidden keys, mysterious symbols, cryptic clues';
      props = 'locked boxes, padlocks, puzzle pieces, magnifying glasses, cipher wheels, hidden compartments';
    
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
  }
  
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
    const promptVersion = 'v4'; // Increment when prompt logic changes - FORCE REGENERATION
    const expectedPath = `${universeId}/${gradeInt}/cover.webp`;
    
    console.log("[image-ensure] Checking for existing image at:", expectedPath);
    console.log("[image-ensure] Looking for prompt version:", promptVersion);
    
    // Check if we have a version marker in metadata to know if regeneration is needed
    const { data: existingFile } = await supa.storage.from(bucket).list(`${universeId}/${gradeInt}`, {
      search: `cover.webp`
    });

    if (existingFile && existingFile.length > 0) {
      const file = existingFile[0];
      // Check if file is large enough AND was generated with current prompt version
      const hasCurrentVersion = file.metadata?.promptVersion === promptVersion;
      console.log("[image-ensure] Found existing file with version:", file.metadata?.promptVersion, "need version:", promptVersion);
      
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
    } else {
      console.log("[image-ensure] No existing cover.webp found, will generate new one");
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