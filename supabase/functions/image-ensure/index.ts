import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const IMAGE_ENSURE_TOKEN = Deno.env.get('IMAGE_ENSURE_TOKEN') || '';
const PLACEHOLDER_MIN_BYTES =
  Number.parseInt(Deno.env.get('PLACEHOLDER_MIN_BYTES') ?? '', 10) || 1024;

const PNG_1x1_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO9zE9kAAAAASUVORK5CYII=';
const fallbackPng = Uint8Array.from(atob(PNG_1x1_BASE64), c => c.charCodeAt(0));
const FALLBACK_LEN = fallbackPng.byteLength;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function generateImage(prompt = 'Learning universe cover'): Promise<{ bytes: Uint8Array; contentType: string }> {
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('generation failed');
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/png';
    return { bytes: new Uint8Array(arrayBuffer), contentType };
  } catch (_) {
    return { bytes: fallbackPng, contentType: 'image/png' };
  }
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return json({ error: 'method not allowed' }, 405);
    }

    const authHeader = req.headers.get('authorization') || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (IMAGE_ENSURE_TOKEN && bearer !== IMAGE_ENSURE_TOKEN) {
      return json({ error: 'unauthorized' }, 401);
    }

    const { bucket, objectKey, prompt } = await req.json();
    if (!bucket || !objectKey) return json({ error: 'missing bucket/objectKey' }, 400);
    if (typeof bucket !== 'string' || typeof objectKey !== 'string') {
      return json({ error: 'invalid body types' }, 400);
    }
    if (objectKey.startsWith('/') || objectKey.includes('..')) {
      return json({ error: 'invalid objectKey' }, 400);
    }

    const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    const existing = await sb.storage.from(bucket).download(objectKey);
    if (existing.data) {
      const existingBytes = new Uint8Array(await existing.data.arrayBuffer());
      const looksPlaceholder =
        existingBytes.byteLength === FALLBACK_LEN ||
        existingBytes.byteLength < PLACEHOLDER_MIN_BYTES;
      if (!looksPlaceholder) {
        return json({ status: 'exists', objectKey });
      }
    }

    const { bytes, contentType } = await generateImage(prompt);
    const finalBytes = bytes.byteLength < PLACEHOLDER_MIN_BYTES ? fallbackPng : bytes;
    // Upload the validated bytes (placeholder or generated image)
    const { error } = await sb.storage.from(bucket).upload(objectKey, finalBytes, {
      contentType,
      upsert: true,
    });
    if (error) return json({ error: error.message }, 500);

    return json({ status: 'created', objectKey, placeholder: finalBytes === fallbackPng });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
