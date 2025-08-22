import { supabase } from '@/integrations/supabase/client';

async function isNotFound(res: Response): Promise<boolean> {
  try {
    const body = await res.clone().text();
    return /not_found|Object not found/i.test(body);
  } catch {
    return false;
  }
}

function isPermissionish(res: Response, bodyText?: string, triedPublicRoute?: boolean): boolean {
  if (res.status === 401 || res.status === 403) return true;
  // Supabase returns 400 when hitting /object/public on a private bucket
  if (triedPublicRoute && res.status === 400) return true;
  if (/public buckets/i.test(bodyText ?? "")) return true;
  return false;
}

// Safe cache-buster appender (handles signed vs public URLs)
function withParam(url: string, key: string, value: string | number): string {
  const u = new URL(url);
  u.searchParams.set(key, String(value));
  return u.toString();
}

export async function publicOrSignedUrl(path: string): Promise<string | null> {
  const debug = import.meta.env.DEV && import.meta.env.VITE_IMG_DEBUG === 'true';
  
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

    // 200/206 → exists
    if (probe.ok || probe.status === 206) return cacheBustedUrl;

    let body = "";
    try { body = await probe.clone().text(); } catch {}

    // Check if this is a permission issue (private bucket)
    if (isPermissionish(probe, body, true)) {
      const { data: signed, error } = await supabase
        .storage
        .from('universe-images')
        .createSignedUrl(path, 60 * 60);

      if (error) throw error;
      return signed.signedUrl; // Use as-is, already has signature
    }

    // Treat missing as missing (don't try to sign it)
    if (probe.status === 404 || (await isNotFound(probe))) {
      if (debug) console.info('Storage object not found:', path);
      return null; // object not there yet
    }

    if (debug) console.debug('[storage probe] unexpected:', probe.status, body);
    return null;
  } catch (e) {
    if (debug) console.debug('[storage probe] error:', e);
    return null;
  }
}