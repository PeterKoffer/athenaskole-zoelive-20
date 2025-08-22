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

function withParam(url: string, key: string, value: string | number): string {
  const u = new URL(url);
  u.searchParams.set(key, String(value));
  return u.toString();
}

export async function publicOrSignedUrl(path: string): Promise<string | null> {
  const debug = import.meta.env.DEV;

  // 1) Try public first (works for public buckets; also used as an existence probe for private)
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = withParam(pub.publicUrl, 'v', Date.now());

  try {
    const probe = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: { Range: 'bytes=0-0' }, // HEAD returns 400 on missing
    });

    if (debug) console.log('[storage probe]', path, '→', probe.status);

    // Exists
    if (probe.ok || probe.status === 206) return url;

    // Treat 400/404 (and "Object not found") as missing — DO NOT SIGN
    if (probe.status === 400 || probe.status === 404 || (await isNotFound(probe))) {
      if (debug) console.info('[storage] missing:', path);
      return null;
    }

    // Only sign for auth issues (private bucket)
    if (probe.status === 401 || probe.status === 403) {
      if (debug) console.log('[storage] auth-only → signed URL:', path);
      const { data: signed, error } =
        await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
      if (error) {
        if (debug) console.warn('[storage] signed URL error:', error);
        return null;
      }
      return signed.signedUrl; // already includes its own signature params
    }

    if (debug) {
      let body = '';
      try { body = await probe.clone().text(); } catch {}
      console.debug('[storage] unexpected:', probe.status, body);
    }
    return null;
  } catch (e) {
    if (debug) console.debug('[storage] probe error:', e);
    return null;
  }
}

/** Convenience wrapper for covers */
export async function coverUrl(universeId: string, grade: number): Promise<string | null> {
  return publicOrSignedUrl(coverKey(universeId, grade));
}