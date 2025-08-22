import { supabase } from '@/integrations/supabase/client';

async function isNotFound(res: Response): Promise<boolean> {
  try {
    const body = await res.clone().text();
    return /not_found|Object not found/i.test(body);
  } catch {
    return false;
  }
}

// Safe cache-buster appender (handles signed vs public URLs)
function withParam(url: string, key: string, value: string | number): string {
  const u = new URL(url);
  u.searchParams.set(key, String(value));
  return u.toString();
}

export async function publicOrSignedUrl(path: string): Promise<string | null> {
  const debug = import.meta.env.DEV;
  
  // 1) Try public URL first
  const { data: pub } = supabase.storage.from('universe-images').getPublicUrl(path);
  const cacheBustedUrl = withParam(pub.publicUrl, 'v', Date.now());

  try {
    // Use GET + Range (HEAD can 400 on missing)
    const probe = await fetch(cacheBustedUrl, {
      method: 'GET',
      cache: 'no-store',
      headers: { Range: 'bytes=0-0' },
    });

    if (debug) console.log('[storage probe]', path, 'status:', probe.status);

    // 200/206 → exists
    if (probe.ok || probe.status === 206) return cacheBustedUrl;

    let body = "";
    try { body = await probe.clone().text(); } catch {}

    // Treat 400 & 404 as missing (don't try to sign non-existent files)
    if (probe.status === 400 || probe.status === 404 || (await isNotFound(probe))) {
      if (debug) console.info('Storage object not found:', path);
      return null; // object not there yet
    }

    // Only sign for auth issues (401/403)
    if (probe.status === 401 || probe.status === 403) {
      if (debug) console.log('[storage probe] detected auth issue, trying signed URL for:', path);
      
      const { data: signed, error } = await supabase
        .storage
        .from('universe-images')
        .createSignedUrl(path, 60 * 60);

      if (error) {
        if (debug) console.log('[storage probe] signed URL error:', error);
        throw error;
      }
      if (debug) console.log('[storage probe] got signed URL for:', path);
      return signed.signedUrl; // Use as-is, already has signature
    }

    if (debug) console.debug('[storage probe] unexpected:', probe.status, body);
    return null;
  } catch (e) {
    if (debug) console.debug('[storage probe] error:', e);
    return null;
  }
}