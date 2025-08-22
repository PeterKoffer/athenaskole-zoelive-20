// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { withCors, okCors, json } from "../_shared/cors.ts";

// Helper function to create consistent storage keys
const coverKey = (universeId: string, grade: number) => `${universeId}/${grade}/cover.webp`;
const BUCKET = 'universe-images';


function env(name: string, required = true) {
  const value = Deno.env.get(name);
  if (required && !value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

async function resolveReplicateVersion(token: string) {
  try {
    const explicitVersion = env('REPLICATE_VERSION', false);
    if (explicitVersion) return explicitVersion;

    // Use the stable black-forest-labs/flux-schnell model directly
    return 'black-forest-labs/flux-schnell';
  } catch (error) {
    console.warn('Failed to resolve Replicate version:', error);
    return 'black-forest-labs/flux-schnell';
  }
}

function parseGrade(input?: string | number | null): number | null {
  if (input == null) return null;
  const match = String(input).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function ageToUsGrade(age?: number): number | null {
  return age && age >= 5 && age <= 18 ? Math.max(1, Math.min(12, age - 5)) : null;
}

function resolveLearnerGrade(gradeRaw?: string|number|null, age?: number): number {
  return parseGrade(gradeRaw) || ageToUsGrade(age) || 6;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return okCors(req);
  }

  if (req.method !== 'POST') {
    return json(req, { error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { universeId, universeTitle, subject, scene = 'cover: main activity', grade } = await req.json();

    if (!universeId || !universeTitle) {
      return json(req, { error: 'universeId and universeTitle are required' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient(
      env('SUPABASE_URL'),
      env('SUPABASE_SERVICE_ROLE_KEY')
    );

    let finalGrade = grade;
    
    // If no grade provided, try to get it from user profile
    if (!finalGrade) {
      try {
        const authHeader = req.headers.get('Authorization');
        if (authHeader) {
          const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
          if (user?.user_metadata) {
            finalGrade = resolveLearnerGrade(
              user.user_metadata.grade_level || user.user_metadata.grade,
              user.user_metadata.age
            );
          }
        }
      } catch (error) {
        console.warn('Could not get user profile for grade:', error);
      }
    }

    finalGrade = finalGrade || 6;

    // Check if image already exists using admin client (no public probes)
    const imagePath = coverKey(universeId, finalGrade);
    const prefix = `${universeId}/${finalGrade}`;
    const { data: existingFile, error: listError } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { search: 'cover.webp' });

    if (listError) {
      return json(req, { error: listError.message }, { status: 400 });
    }

    if (existingFile && existingFile.length > 0) {
      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(imagePath);
      
      // Return cache-busted URL
      const imageUrl = `${data.publicUrl}?v=${Date.now()}`;
      
      return json(req, { 
        status: 'exists', 
        imageUrl,
        cached: true 
      });
    }

    // Generate image using Replicate
    const REPLICATE_TOKEN = env('REPLICATE_API_TOKEN');
    const replicateVersion = await resolveReplicateVersion(REPLICATE_TOKEN!);
    
    const prompt = `Create an educational ${scene} image for "${universeTitle}" (${subject || 'educational'} subject) suitable for grade ${finalGrade} students (age ${finalGrade + 5}). 
    
Style: Vibrant, engaging, kid-friendly illustration with bright colors and clear visual elements that would appeal to ${finalGrade + 5}-year-old learners. Clean, modern educational design.

Do NOT include any text, words, titles, logos, labels, or letters in the image.

The image should be inspiring and directly related to the subject matter, showing the main activity or concept in an age-appropriate way.`;

    const webhookUrl = `${env('SUPABASE_URL')}/functions/v1/image-webhook`;
    
    const inputs = {
      prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 4
    };

    console.log('🎨 Queuing image generation:', { universeId, grade: finalGrade, prompt: prompt.substring(0, 100) + '...' });

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: replicateVersion,
        input: inputs,
        webhook: webhookUrl,
        webhook_events_filter: ['completed']
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${response.status} ${error}`);
    }

    const prediction = await response.json();
    console.log('✅ Image generation queued:', prediction.id);

    return json(req, { 
      status: 'queued', 
      predictionId: prediction.id 
    }, { status: 202 });

  } catch (error: any) {
    console.error('❌ Image ensure error:', error);
    const message = error instanceof Error ? error.message : String(error);
    
    // Map expected errors to appropriate status codes
    const status = /Not Found|No such file|invalid key/i.test(message) ? 404
                 : /permission|policy|public bucket/i.test(message) ? 403
                 : 400;
    
    return json(req, { error: message }, { status });
  }
});