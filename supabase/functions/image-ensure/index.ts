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

async function generateWithReplicate(prompt: string, w = 1024, h = 512) {
  const token = Deno.env.get("REPLICATE_API_TOKEN");
  if (!token) throw new Error("REPLICATE_API_TOKEN missing");

  // Create prediction
  const create = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "black-forest-labs/flux-schnell", // Fast model for covers
      input: { prompt, width: w, height: h, num_inference_steps: 4 }
    })
  });
  const pred = await create.json();
  if (!create.ok) throw new Error(pred?.error ?? "replicate create failed");

  // Poll until complete
  for (let attempts = 0; attempts < 30; attempts++) {
    const r = await fetch(pred.urls.get, { headers: { "Authorization": `Bearer ${token}` }});
    const j = await r.json();
    if (j.status === "succeeded") {
      const out = Array.isArray(j.output) ? j.output[0] : j.output;
      return out as string; // URL to image
    }
    if (j.status === "failed" || j.status === "canceled") {
      throw new Error(j.error ?? j.status);
    }
    await new Promise(s => setTimeout(s, 2000));
  }
  throw new Error("Replicate generation timeout");
}

async function ensureAiCover(admin: any, bucket: string, path: string, meta: { title?: string; subject?: string }) {
  // Extract universe info from path pattern
  const pathMatch = path.match(/^([^\/]+)\/(\d+)\/cover\.(webp|png)$/);
  if (!pathMatch) throw new Error("Invalid path format");
  
  const [, universeId, grade] = pathMatch;
  const title = meta.title || "Learning Universe";
  const subject = meta.subject || "General";
  
  // Create educational prompt
  const prompt = `Wide 1024x512 cover image for an educational learning universe about "${title}"${subject !== "General" ? ` (${subject})` : ""}. Bright, friendly, modern, high quality educational illustration.`;
  
  console.log(`🎨 Generating AI cover for ${universeId}: ${prompt}`);
  const imageUrl = await generateWithReplicate(prompt);

  // Download and upload as PNG (more reliable)
  const img = await fetch(imageUrl);
  const bytes = new Uint8Array(await img.arrayBuffer());
  const pngPath = path.replace(/\/cover\.webp$/, "/cover.png");

  // Protect against null/tiny uploads
  if (!bytes || bytes.byteLength < MIN_BYTES) {
    throw new Error(`Generated image too small: ${bytes?.byteLength || 0} bytes`);
  }

  const { error } = await admin.storage.from(bucket).upload(pngPath, bytes, {
    contentType: "image/png",
    upsert: true, // Critical: allow overwriting tiny/corrupt files
  });
  if (error) throw error;

  console.log(`✅ AI cover generated and uploaded: ${pngPath}`);
  return { ok: true, path: pngPath, exists: true, generated: true };
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

    // If missing and we may generate: try AI generation first
    if (!exists && generateIfMissing) {
      try {
        // Try to generate AI cover if Replicate token is available
        const replicateToken = Deno.env.get("REPLICATE_API_TOKEN");
        if (replicateToken && path.includes("/cover.")) {
          const result = await ensureAiCover(admin, bucket, path, { 
            title: "Learning Universe", 
            subject: "Education" 
          });
          return new Response(JSON.stringify(result), { headers: jsonHeaders });
        }
      } catch (aiError) {
        console.warn(`AI generation failed for ${path}:`, aiError);
        // Fall back to client placeholder generation
      }
      
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