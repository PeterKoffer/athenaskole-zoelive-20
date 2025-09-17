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

// Age group specific styles
const styleByAgeGroup = {
  child: {
    positive: 'bright saturated colors, cartoon style, simple rounded shapes, thick outlines, smiling characters, playful elements, high contrast, child-friendly illustration, fantasy elements welcome',
    negative: 'no scary elements, no violence, no dark themes, no realistic weapons, no complex details, no tiny text, no adult themes',
    ar: '1:1', size: '1024x1024'
  },
  teen: {
    positive: 'vibrant but balanced colors, stylized realistic illustration, moderate detail level, dynamic compositions, relatable characters, modern aesthetic, engaging visual elements',
    negative: 'no overly childish cartoon style, no adult content, no graphic violence, avoid overly simplistic imagery',
    ar: '16:9', size: '1280x720'
  },
  adult: {
    positive: 'sophisticated color palette, photorealistic or cinematic illustration, professional quality, detailed compositions, mature themes acceptable, documentary style, technical accuracy',
    negative: 'no cartoonish elements, no toy-like appearance, no overly bright colors, avoid childish aesthetics',
    ar: '16:9', size: '1600x900'
  },
};

// Embedded domain detection and prompt generation for edge function
function getDomainFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('food') || titleLower.includes('truck') || titleLower.includes('restaurant'))
    return 'food-truck';
  if (titleLower.includes('vertical') || titleLower.includes('farm') || titleLower.includes('hydroponic'))
    return 'vertical-farm';
  if (titleLower.includes('negotiation') || titleLower.includes('deal') || titleLower.includes('business'))
    return 'negotiation';
  if (titleLower.includes('rocket') || titleLower.includes('water') || titleLower.includes('launch'))
    return 'water-rocket';
  if (titleLower.includes('toy') || titleLower.includes('design') || titleLower.includes('prototype'))
    return 'toy-design';
  if (titleLower.includes('constitution') || titleLower.includes('founding') || titleLower.includes('democracy'))
    return 'constitution';
  
  return 'vertical-farm'; // Default fallback
}

function buildCinematicPrompt(adventureId: string, title: string, ageGroup: string): string {
  const titleLower = title.toLowerCase();
  const idLower = adventureId.toLowerCase();
  
  // Adventure-specific contexts
  let setting = 'a learning adventure focused on ' + title;
  let environment = 'modern educational classroom or learning space';
  let keyElements = 'educational materials, learning tools, collaborative workspace';
  let props = 'learning materials, books, tools, presentation boards';
  
  if (titleLower.includes('vertical farm') || idLower.includes('vertical-farm')) {
    setting = 'a modern vertical farming facility';
    environment = 'indoor hydroponic tower garden with LED grow lights';
    keyElements = 'stacked growing towers, LED panels, nutrient systems, fresh vegetables';
    props = 'hydroponic towers, grow lights, water pumps, pH meters, harvest baskets';
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
  
  // Age-appropriate subject prefixes
  const ageConfig = cinematicStylesByAgeGroup[ageGroup] || cinematicStylesByAgeGroup.teen;
  const subjectPrefix = ageConfig.subjectPrefix;
  
  const consistency = `NELIE-cin-real-01 ${adventureId.replace(/[^a-z0-9]/gi, '-')}`;
  
  return [
    "cinematic stylized realism",
    "high-end animation film aesthetic", 
    "soft PBR materials",
    "depth-of-field bokeh",
    `cinematic establishing shot of ${setting}, showing ${keyElements}`,
    `${subjectPrefix} ${environment}, ${props}`,
    "wide establishing, 35mm anamorphic, eye-level, gentle parallax",
    "golden hour backlight, soft rim, warm bounce",
    ageConfig.colorOverride || "teal & warm amber cinematic grade",
    ageConfig.moodOverride || "hopeful, inviting, educational",
    "age-appropriate, wholesome",
    "no text overlay, no brand logos",
    `CONSISTENCY_TAG: ${consistency}`
  ].join(" — ");
}

async function importPromptEngine() {
  // Return embedded functions instead of trying to import
  return {
    buildImagePrompts: null, // We'll use buildCinematicPrompt instead
    getDomainFromTitle
  };
}

// Age group specific cinematic styles
const cinematicStylesByAgeGroup = {
  child: {
    stylePackId: "kidbook-gouache",
    realismBlend: 0.3, // More stylized for children
    subjectPrefix: "colorful and friendly students discovering",
    moodOverride: "joyful, playful, wonder-filled",
    colorOverride: "bright rainbow colors, warm pastels"
  },
  teen: {
    stylePackId: "cinematic-stylized-realism",
    realismBlend: 0.7, // Balanced realism for teens
    subjectPrefix: "engaged teenage students exploring",
    moodOverride: "confident, curious, collaborative",
    colorOverride: "vibrant but balanced colors"
  },
  adult: {
    stylePackId: "cinematic-stylized-realism",
    realismBlend: 0.9, // High realism for adults
    subjectPrefix: "professional students mastering",
    moodOverride: "focused, sophisticated, achievement-oriented",
    colorOverride: "sophisticated cinematic palette"
  }
};

async function buildCinematicAgeGroupPrompt(
  universeTitle: string, 
  universeId: string,
  ageGroup: 'child' | 'teen' | 'adult', 
  description?: string
): Promise<AgeGroupPrompt> {
  const promptEngine = await importPromptEngine();
  
  // Use embedded cinematic prompt generation
  const { getDomainFromTitle } = promptEngine;
  const style = cinematicStylesByAgeGroup[ageGroup];
  
  // Generate the cinematic prompt directly
  const finalPrompt = buildCinematicPrompt(universeId, universeTitle, ageGroup);
  
  const baseNegativePrompt = "text, watermark, logo, low-res, blurry, extra fingers, deformed hands, gore, hyperreal skin, sexualized, noisy background, posterized, oversaturated";
  
  return {
    prompt: finalPrompt,
    negative_prompt: baseNegativePrompt + ', uncanny valley, waxy skin, readable text, grade signs, brand logos',
    size: ageGroup === 'child' ? '1024x1024' : '1280x720',
    aspect_ratio: ageGroup === 'child' ? '1:1' : '16:9'
  };
  
  // Fallback to enhanced legacy system with cinematic elements
  const legacyStyle = styleByAgeGroup[ageGroup];
  const prompt = [
    'cinematic stylized realism',
    ageGroup === 'child' ? 'children\'s storybook illustration' : 'high-end animation film aesthetic',
    `${cinematicStylesByAgeGroup[ageGroup].subjectPrefix} ${universeTitle} adventure`,
    description ? `Context: ${description}` : null,
    `Target: ${ageGroup} learners`,
    `Style: ${legacyStyle.positive}`,
    'depth-of-field bokeh, age-appropriate, no text overlay',
    `CONSISTENCY_TAG: NELIE-${ageGroup}-${universeTitle.replace(/[^a-z0-9]/gi, '-')}`
  ].filter(Boolean).join(' — ');

  return {
    prompt,
    negative_prompt: legacyStyle.negative + ', uncanny valley, waxy skin, readable text, grade signs, brand logos',
    size: legacyStyle.size,
    aspect_ratio: legacyStyle.ar
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
        size: '1024x1024', // Use consistent size for all age groups
        quality: 'medium',
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
  path: string
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
              const imageUrl = await uploadImageToStorage(supabaseClient, imageData, imagePath);
              
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