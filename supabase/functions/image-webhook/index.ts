// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    return new Response(null, { headers: corsHeaders });
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
      return new Response('OK', { headers: corsHeaders });
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
    
    const storagePath = `${universeId}/${grade}/cover.webp`;
    
    console.log('📁 Uploading to storage:', { storagePath, size: imageBuffer.byteLength });

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('universe-images')
      .upload(storagePath, imageBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('✅ Image uploaded successfully:', storagePath);

    return new Response('OK', { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response('Error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});