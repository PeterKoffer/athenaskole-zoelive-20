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
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: CORS });
  }

  const auth = req.headers.get('authorization') || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!jwt) {
    return new Response(JSON.stringify({ error: 'Missing JWT' }), { status: 401, headers: CORS });
  }

  // Admin-klient til at verificere token og skrive til storage
  const admin = createClient(URL, SRK);

  // Verificér at JWT er gyldig og tilhører en bruger
  const { data: userData, error: authErr } = await admin.auth.getUser(jwt);
  if (authErr || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Invalid JWT' }), { status: 401, headers: CORS });
  }

  try {
    const { bucket, path, generateIfMissing = true, contentType = 'image/webp' } = await req.json();
    
    if (!bucket || !path) {
      return new Response(JSON.stringify({ error: 'bucket and path required' }), { status: 400, headers: CORS });
    }

    const folder = path.split('/').slice(0, -1).join('/');
    const filename = path.split('/').pop();

    const { data: listing, error: listErr } = await admin
      .storage.from(bucket)
      .list(folder || '', { search: filename });

    const exists = !listErr && listing?.some(f => f.name === filename);

    if (exists) {
      console.log(`✅ File exists: ${path}`);
      return new Response(JSON.stringify({ 
        ok: true, 
        path, 
        exists: true 
      }), { status: 200, headers: CORS });
    }

    if (!exists && generateIfMissing) {
      console.log(`🎨 Generating image: ${path}`);
      
      // TODO: erstat med rigtig billedgenerering – her lægger vi en minimal placeholder
      const tinyWebp = new Uint8Array([0x52,0x49,0x46,0x46]); // "RIFF" – bare en markør
      
      const { error: uploadError } = await admin.storage
        .from(bucket)
        .upload(path, tinyWebp, {
          upsert: true,
          contentType,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log(`✅ Generated image: ${path}`);
    }

    return new Response(JSON.stringify({ ok: true, path }), { 
      status: 200, headers: CORS 
    });

  } catch (e) {
    console.error('image-ensure error', e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: CORS });
  }
});