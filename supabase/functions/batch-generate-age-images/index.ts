import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgeGroupPrompt {
  prompt: string;
  negative_prompt: string;
  size: string;
  aspect_ratio: string;
}

// ====== UNIFIED ADVENTURE-SPECIFIC SCENE MAPPING ======
// Same mapping as in image-ensure function for consistency
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
  [/vertical farm|hydroponic|agriculture/i,
    "modern vertical farming facility with LED grow lights, hydroponic towers, nutrient systems"],
  [/negotiation|business deal|contract/i,
    "professional meeting room with presentation boards, conference table, business materials"],
  [/toy|design|prototype|manufacturing/i,
    "product design studio with prototyping equipment, 3D printers, design sketches on walls"],
  [/rocket|launch|engineering|rube goldberg/i,
    "engineering workshop with rocket prototypes, launch equipment, testing apparatus"],
  [/constitution|founding|democracy|government/i,
    "historic meeting hall with period furniture, founding documents, quill pens, colonial architecture"],
];

// ====== AGE-SPECIFIC ADVENTURE PROMPT BUILDER ======
// Age group specific enhancement styles - all use 16:9 for perfect framing
type AgeGroup = 'child' | 'teen' | 'adult';

const ageEnhancements = {
  child: {
    visual: "bright colors, rounded shapes, thick outlines, flat shading, minimal background",
    mood: "joyful, playful, wonder-filled",
    negative: "no realism, no text, no clutter, no scary elements, no violence, no dark themes",
    size: "1536x1024" // 16:9 ratio supported by OpenAI
  },
  teen: {
    visual: "vibrant stylized illustration, soft shading, playful but neat composition",
    mood: "confident, curious, collaborative", 
    negative: "no babyish style, no overly childish cartoon style",
    size: "1536x1024" // 16:9 ratio supported by OpenAI
  },
  adult: {
    visual: "realistic to photorealistic, professional tone, technical overlays ok",
    mood: "focused, sophisticated, achievement-oriented",
    negative: "no childish/kawaii style, no cartoon aesthetics",
    size: "1536x1024" // 16:9 ratio supported by OpenAI
  }
};

function buildUnifiedAdventurePrompt(title: string, ageGroup: AgeGroup): string {
  // Same style & composition as main adventure system
  const STYLE = "cinematic hybrid photoreal with subtle Pixar warmth, global illumination, HDR, gentle film grain, no text or watermarks";
  const COMPOSITION = "wide establishing shot, 16:9 banner, eye-level, rule-of-thirds";
  const SAFE_MARGINS = "keep all key subjects inside central 60% of frame; 8–12% safe margins on all edges; no tight close-ups";
  const COLOR_MOOD = "rich but natural palette; inspiring, capable, modern";

  // Get adventure-specific scene
  const t = title.toLowerCase();
  let scene = "professional real-world environment relevant to the adventure";
  for (const [rx, s] of MAP) if (rx.test(t)) { scene = s; break; }

  // Age-specific enhancements
  const ageConfig = ageEnhancements[ageGroup];
  
  // NO CLASSROOM EVER
  const NEG_PRO = "ABSOLUTELY NO classroom, school desks, chalkboards/whiteboards, lockers, teachers or students";

  return `${STYLE} — ${COMPOSITION} — ${SAFE_MARGINS} — ${COLOR_MOOD} — Adventure: ${title}. Age group: ${ageGroup} learners. Visual style: ${ageConfig.visual}. Mood: ${ageConfig.mood}. Scene: ${scene} — ${NEG_PRO}, ${ageConfig.negative}`;
}

async function buildCinematicAgeGroupPrompt(
  universeTitle: string, 
  universeId: string,
  ageGroup: AgeGroup, 
  description?: string
): Promise<AgeGroupPrompt> {
  
  const ageConfig = ageEnhancements[ageGroup];
  const finalPrompt = buildUnifiedAdventurePrompt(universeTitle, ageGroup);
  
  const baseNegativePrompt = "text, watermark, logo, low-res, blurry, extra fingers, deformed hands, gore, hyperreal skin, sexualized, noisy background, posterized, oversaturated";
  
  return {
    prompt: finalPrompt,
    negative_prompt: baseNegativePrompt + ', uncanny valley, waxy skin, readable text, grade signs, brand logos, classroom, school desks',
    size: ageConfig.size, // All use 1024x576 (16:9) now
    aspect_ratio: '16:9'
  };
}

async function generateImageWithOpenAI(prompt: string, size: string): Promise<string | null> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: size, // Use the size from the prompt spec
        quality: 'high',
        output_format: 'webp',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return null;
    }

    const data = await response.json();
    return data.data?.[0]?.b64_json || null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

async function uploadImageToStorage(
  supabase: any,
  imageData: string,
  path: string,
  adventure: any,
  ageGroup: string,
  promptSpec: AgeGroupPrompt
): Promise<string | null> {
  try {
    // Convert base64 to bytes
    const bytes = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
    
    const { error } = await supabase.storage
      .from('universe-images')
      .upload(path, bytes, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('universe-images')
      .getPublicUrl(path);

    // ====== SAVE TO PICTURE BANK (image_assets table) ======
    try {
      await supabase.from('image_assets').insert({
        storage_path: path,
        adventure_id: adventure.universe_id,
        prompt: promptSpec.prompt,
        negative_prompt: promptSpec.negative_prompt,
        alt_text: `${adventure.title} - ${ageGroup} age group`,
        subjects: [adventure.subject || 'General'],
        tags: [ageGroup, 'adventure-cover', 'generated', '16:9'],
        width: 1536,
        height: 1024,
        bytes: bytes.length,
        mime: 'image/webp',
        provider: 'openai',
        model: 'gpt-image-1',
        style_pack: `adventure-${ageGroup}`,
        consistency_tag: `adventure-${adventure.universe_id}-${ageGroup}`,
        reusable: true,
        created_by: '00000000-0000-0000-0000-000000000000' // System user
      });
      console.log(`✅ Saved ${ageGroup} image to picture bank: ${adventure.title}`);
    } catch (bankError) {
      console.error('⚠️ Failed to save to picture bank:', bankError);
      // Don't fail the whole operation if picture bank save fails
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to storage:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { batchSize = 10, ageGroups = ['child', 'teen', 'adult'] } = await req.json();

    console.log(`Starting batch generation for age groups: ${ageGroups.join(', ')}`);

    // Get adventures without generated images for the specified age groups
    const { data: adventures, error: fetchError } = await supabaseClient
      .from('adventures')
      .select('*')
      .or(ageGroups.map(age => `image_generated_${age}.eq.false`).join(','))
      .limit(batchSize);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${adventures?.length || 0} adventures to process`);

    let processed = 0;
    let successful = 0;
    let failed = 0;

    if (adventures) {
      for (const adventure of adventures) {
        console.log(`Processing adventure: ${adventure.title} (${adventure.universe_id})`);
        
        for (const ageGroup of ageGroups) {
          // Skip if already generated
          if (adventure[`image_generated_${ageGroup}`]) {
            continue;
          }

          try {
            const promptSpec = await buildCinematicAgeGroupPrompt(
              adventure.title, 
              adventure.universe_id,
              ageGroup as any,
              adventure.description
            );
            console.log(`Generating ${ageGroup} image for: ${adventure.title} with cinematic prompt`);
            console.log(`Prompt preview: ${promptSpec.prompt.substring(0, 200)}...`);
            
            const imageData = await generateImageWithOpenAI(promptSpec.prompt, promptSpec.size);
            
            if (imageData) {
              const imagePath = `${adventure.universe_id}/${adventure.grade_int}/${ageGroup}_cover.webp`;
              const imageUrl = await uploadImageToStorage(supabaseClient, imageData, imagePath, adventure, ageGroup, promptSpec);
              
              if (imageUrl) {
                // Update adventure with generated image URL
                const updateData = {
                  [`image_url_${ageGroup}`]: imageUrl,
                  [`image_generated_${ageGroup}`]: true
                };

                const { error: updateError } = await supabaseClient
                  .from('adventures')
                  .update(updateData)
                  .eq('id', adventure.id);

                if (updateError) {
                  console.error('Error updating adventure:', updateError);
                  failed++;
                } else {
                  console.log(`Successfully generated ${ageGroup} image for ${adventure.title}`);
                  successful++;
                }
              } else {
                failed++;
              }
            } else {
              failed++;
            }
          } catch (error) {
            console.error(`Error processing ${ageGroup} for ${adventure.title}:`, error);
            failed++;
          }
        }
        
        processed++;
        
        // Small delay between adventures to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`Batch generation completed: ${successful} successful, ${failed} failed, ${processed} adventures processed`);

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        successful,
        failed,
        ageGroups
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in batch-generate-age-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});