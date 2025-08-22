import { supabase } from '@/integrations/supabase/client';

async function isNotFound(res: Response): Promise<boolean> {
  try {
    const body = await res.clone().text();        // don't consume the original
    return /not_found|Object not found/i.test(body);
  } catch {
    return false;
  }
}

export async function publicOrSignedUrl(path: string): Promise<string | null> {
  // 1) Try public URL
  const { data: pub } = supabase.storage.from('universe-images').getPublicUrl(path);
  const u = new URL(pub.publicUrl);
  u.searchParams.set('v', String(Date.now()));    // cache-bust

  // Use GET + Range (HEAD can 400 on missing)
  const probe = await fetch(u.toString(), {
    method: 'GET',
    cache: 'no-store',
    headers: { Range: 'bytes=0-0' },
  });

  // 200/206 → exists
  if (probe.ok || probe.status === 206) return u.toString();

  // Treat missing as missing (don't try to sign it)
  if (probe.status === 404 || (probe.status === 400 && (await isNotFound(probe)))) {
    return null; // object not there yet
  }

  // 401/403/other errors → try signed URL
  const { data: signed, error } = await supabase
    .storage
    .from('universe-images')
    .createSignedUrl(path, 60 * 60);

  if (error) throw error;
  return signed.signedUrl;
}