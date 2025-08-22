import { supabase } from '@/integrations/supabase/client';
import { coverKey } from '@/utils/coverKey';

const BUCKET = 'universe-images';

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

/**
 * Tries the public path first with a cheap GET+Range probe.
 * - 200/206 -> return public URL (cache-busted)
 * - 400/404 or "Object not found" -> missing -> return null (don't sign)
 * - 401/403 -> permissions -> return signed URL
 * - other -> treat as transient -> return null (UI backoff/fallback)
 */
export async function publicOrSignedUrl(path: string): Promise<string | null> {
  const debug = import.meta.env.DEV;
  
  // 1) Public URL (exists even for private buckets; request will 401/403)
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = pub.publicUrl;
  const cacheBustedPublic = withParam(publicUrl, 'v', Date.now());

  try {
    const probe = await fetch(cacheBustedPublic, {
      method: 'GET',
      cache: 'no-store',
      headers: { Range: 'bytes=0-0' },
    });

    if (debug) console.log('[storage probe]', path, 'status:', probe.status);

    if (probe.ok || probe.status === 206) return cacheBustedPublic;

    let body = "";
    try { body = await probe.clone().text(); } catch {}

    if (probe.status === 400 || probe.status === 404 || (await isNotFound(probe))) {
      if (debug) console.info('[storage probe] not found:', path, body);
      return null; // don't try to sign non-existent objects
    }

    if (probe.status === 401 || probe.status === 403) {
      if (debug) console.log('[storage probe] auth issue -> signing:', path);

      const { data: signed, error } =
        await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);

      if (error) {
        if (debug) console.log('[storage probe] signed URL error:', error);
        return null;
      }
      // IMPORTANT: do NOT cache-bust signed URLs (query tampering invalidates signatures)
      return signed.signedUrl;
    }

    if (debug) console.debug('[storage probe] unexpected:', probe.status, body);
    return null;
  } catch (e) {
    if (debug) console.debug('[storage probe] fetch error:', e);
    return null;
  }
}

/** Convenience wrapper for covers */
export async function coverUrl(universeId: string, grade: number): Promise<string | null> {
  return publicOrSignedUrl(coverKey(universeId, grade));
}