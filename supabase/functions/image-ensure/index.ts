// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const URL = Deno.env.get('SUPABASE_URL')!;
const SRK = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    return new Response('ok', { headers: cors });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: cors });
  }

  try {
    // Require Authorization header
    const auth = req.headers.get('authorization');
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), { status: 401, headers: cors });
    }
    
    const { bucket, path, generateIfMissing, kind } = await req.json();

    if (!bucket || !path) {
      return new Response(JSON.stringify({ error: 'bucket and path are required' }), { status: 400, headers: cors });
    }

    // Service role for Storage operations, verify user JWT
    const supabase = createClient(URL, SRK, { global: { headers: { Authorization: auth } } });
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid/expired JWT' }), { status: 401, headers: cors });
    }

    // Check if file exists
    const dir = path.split('/').slice(0, -1).join('/') || '';
    const filename = path.split('/').pop();
    
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(dir, { search: filename });

    const exists = !listError && files?.some(f => f.name === filename);

    if (exists) {
      console.log(`✅ File exists: ${path}`);
      return new Response(JSON.stringify({ 
        ok: true, 
        path, 
        exists: true 
      }), { status: 200, headers: cors });
    }

    if (!exists && generateIfMissing) {
      console.log(`🎨 Generating ${kind || 'image'}: ${path}`);
      
      // For demo - create a minimal placeholder image
      // In production, this would call your image generation service
      const placeholder = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x20, 0x00, 0x00, 0x00, // File size
        0x57, 0x45, 0x42, 0x50, // "WEBP"
        0x56, 0x50, 0x38, 0x20, // "VP8 "
        0x14, 0x00, 0x00, 0x00, // Chunk size
        0x30, 0x01, 0x00, 0x9D, 0x01, 0x2A, // VP8 header
        0x01, 0x00, 0x01, 0x00, 0x02, 0x00, // VP8 data
        0x34, 0x25, 0xA4, 0x00, 0x03, 0x70, 0x00, 0xFE
      ]);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, placeholder, {
          upsert: true,
          contentType: 'image/webp',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log(`✅ Generated ${kind || 'image'}: ${path}`);
    }

    return new Response(JSON.stringify({ ok: true, path, exists }), { 
      status: 200, headers: cors 
    });

  } catch (error: any) {
    console.error('❌ Image ensure error:', error);
    const message = error instanceof Error ? error.message : String(error);
    
    // Map expected errors to appropriate status codes
    const status = /Not Found|No such file|invalid key/i.test(message) ? 404
                 : /permission|policy|public bucket/i.test(message) ? 403
                 : 500;
    
    return new Response(JSON.stringify({ error: message }), { status, headers: cors });
  }
});