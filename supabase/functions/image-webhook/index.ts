// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders, okCors, json } from "../_shared/cors.ts";

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

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return okCors();
  }

  if (req.method !== 'POST') {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const webhook = await req.json();
    console.log('📨 Image webhook received:', { 
      id: webhook.id, 
      status: webhook.status,
      hasOutput: !!webhook.output 
    });

    if (webhook.status !== 'succeeded' || !webhook.output?.[0]) {
      console.log('⚠️ Webhook not successful or no output:', webhook.status);
      return json({ ok: true, message: 'Webhook ignored' });
    }

    const imageUrl = webhook.output[0];
    console.log('🖼️ Processing image:', imageUrl);

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Initialize Supabase client
    const supabase = createClient(
      env('SUPABASE_URL'),
      env('SUPABASE_SERVICE_ROLE_KEY')
    );

    // Extract metadata from webhook to determine storage path
    const universeId = webhook.input?.prompt?.match(/for "([^"]+)"/)?.[1] || 'unknown';
    const gradeMatch = webhook.input?.prompt?.match(/grade (\d+)/);
    const grade = gradeMatch ? parseInt(gradeMatch[1]) : 6;
    
    // Use coverKey helper for consistent path
    const storagePath = coverKey(universeId, grade);
    
    console.log('📁 Uploading to storage:', { storagePath, size: imageBuffer.byteLength });

    // Upload to Supabase Storage with proper cache headers and content type
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, imageBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000, immutable',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get cache-busted URL after successful upload
    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);
    const finalUrl = `${data.publicUrl}?v=${Date.now()}`;

    console.log('✅ Image uploaded successfully:', finalUrl);

    return json({ ok: true, url: finalUrl });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return json({ ok: false, error: String(error) }, { status: 500 });
  }
});