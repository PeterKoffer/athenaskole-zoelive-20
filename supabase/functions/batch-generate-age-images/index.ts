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

function buildAgeGroupPrompt(universeTitle: string, scene: string, ageGroup: 'child' | 'teen' | 'adult', description?: string): AgeGroupPrompt {
  const style = styleByAgeGroup[ageGroup];
  
  const prompt = [
    `Create an engaging educational illustration that directly represents the adventure: ${universeTitle}`,
    description ? `Story context: ${description}` : null,
    `Visual scene: ${scene}`,
    `Target audience: ${ageGroup} learners`,
    `Art style: ${style.positive}`,
    'The image should capture the essence and excitement of this specific learning adventure'
  ].filter(Boolean).join(' — ');

  const negative = [
    style.negative,
    'generic stock photos, unrelated imagery, blurry, watermark, signature, text overlay, misspelled labels, extra fingers, deformed anatomy'
  ].join(', ');

  return {
    prompt,
    negative_prompt: negative,
    size: style.size,
    aspect_ratio: style.ar
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
            const promptSpec = buildAgeGroupPrompt(
              adventure.title, 
              adventure.prompt || adventure.title, 
              ageGroup as any,
              adventure.description
            );
            console.log(`Generating ${ageGroup} image for: ${adventure.title}`);
            
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