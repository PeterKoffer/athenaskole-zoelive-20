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

const MIN_BYTES = 1024;

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
    const { bucket, path, generateIfMissing = true } = await req.json();
    const jsonHeaders = { ...CORS, 'content-type': 'application/json; charset=utf-8' };
    
    if (!bucket || !path) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'bucket and path required' 
      }), { 
        status: 400, 
        headers: jsonHeaders 
      });
    }

    // HEAD the current file via a short signed URL
    let exists = false;
    let tooSmall = false;
    let contentLength = 0;
    let contentType = '';

    const { data: signed } = await admin.storage.from(bucket).createSignedUrl(path, 60);
    if (signed?.signedUrl) {
      const head = await fetch(signed.signedUrl, { method: 'HEAD' });
      if (head.ok) {
        exists = true;
        contentLength = parseInt(head.headers.get('content-length') || '0', 10);
        contentType = head.headers.get('content-type') || '';
        tooSmall = !contentType.startsWith('image/') || contentLength < MIN_BYTES;
        console.log(`📏 File exists: ${path}, size: ${contentLength} bytes, type: ${contentType}`);
      }
    }

    // If too small/corrupt: delete the file, so we can treat as "missing"
    if (exists && tooSmall) {
      console.log(`🗑️ Deleting corrupt file: ${path} (${contentLength} bytes)`);
      await admin.storage.from(bucket).remove([path]).catch(() => {});
      exists = false;
    }

    // If missing and we may generate: (here we let the client handle upload/placeholder)
    // We can add actual server-generation later if needed.
    if (!exists && generateIfMissing) {
      return new Response(JSON.stringify({
        ok: true,
        path,
        exists: false,
        needsUpload: true, // signal to client
      }), { headers: jsonHeaders });
    }

    return new Response(JSON.stringify({
      ok: true,
      path,
      exists: exists,
      size: contentLength,
      type: contentType,
    }), { headers: jsonHeaders });

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