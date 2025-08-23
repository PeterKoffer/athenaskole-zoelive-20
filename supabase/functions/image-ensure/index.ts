// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const URL = Deno.env.get('SUPABASE_URL')!;
const SRK = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create consistent storage keys
const coverKey = (universeId: string, grade: number) => `${universeId}/${grade}/cover.webp`;
const BUCKET = 'universe-images';

// 1x1 PNG placeholder (much better than 4-byte RIFF)
const PLACEHOLDER_PNG_BASE64 = 
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

function b64ToBytes(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}


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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405, 
      headers: { ...CORS, 'Content-Type': 'application/json' } 
    });
  }

  const auth = req.headers.get('authorization') || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!jwt) {
    return new Response(JSON.stringify({ error: 'Missing JWT' }), { 
      status: 401, 
      headers: { ...CORS, 'Content-Type': 'application/json' } 
    });
  }

  // Admin-klient til at verificere token og skrive til storage
  const admin = createClient(URL, SRK);

  // Verificér at JWT er gyldig og tilhører en bruger
  const { data: userData, error: authErr } = await admin.auth.getUser(jwt);
  if (authErr || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Invalid JWT' }), { 
      status: 401, 
      headers: { ...CORS, 'Content-Type': 'application/json' } 
    });
  }

  try {
    const { bucket, path, generateIfMissing = true, minBytes = 128 } = await req.json();
    
    if (!bucket || !path) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'bucket and path required' 
      }), { 
        status: 400, 
        headers: { ...CORS, 'Content-Type': 'application/json' } 
      });
    }

    // Check if file exists and get its size
    const { data: downloadData, error: downloadError } = await admin.storage
      .from(bucket)
      .download(path);

    let exists = false;
    let size = 0;

    if (!downloadError && downloadData) {
      exists = true;
      size = (await downloadData.arrayBuffer()).byteLength;
      console.log(`📏 File exists: ${path}, size: ${size} bytes`);
    }

    // If file doesn't exist or is too small (corrupt), create proper placeholder
    if ((!exists || size < minBytes) && generateIfMissing) {
      console.log(`🎨 ${exists ? 'Replacing corrupt' : 'Creating'} image: ${path}`);
      
      const placeholderBytes = b64ToBytes(PLACEHOLDER_PNG_BASE64);
      
      const { error: uploadError } = await admin.storage
        .from(bucket)
        .upload(path, placeholderBytes, {
          upsert: true,
          contentType: 'image/png',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log(`✅ ${exists ? 'Replaced corrupt' : 'Generated'} image: ${path} (${placeholderBytes.length} bytes)`);
      
      return new Response(JSON.stringify({ 
        ok: true, 
        path, 
        exists: true,
        created: !exists,
        size: placeholderBytes.length
      }), { 
        status: 200, 
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      ok: true, 
      path, 
      exists,
      size 
    }), { 
      status: 200, 
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('image-ensure error', e);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: String(e?.message ?? e) 
    }), { 
      status: 500, 
      headers: { ...CORS, 'Content-Type': 'application/json' } 
    });
  }
});