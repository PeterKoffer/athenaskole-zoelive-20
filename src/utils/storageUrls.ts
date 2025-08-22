import { supabase } from '@/integrations/supabase/client';

export async function publicOrSignedUrl(path: string): Promise<string | null> {
  // 1) Try public URL first
  const { data: pub } = supabase.storage.from('universe-images').getPublicUrl(path);
  const u = new URL(pub.publicUrl);
  u.searchParams.set('v', String(Date.now()));
  
  try {
    const head = await fetch(u.toString(), { method: 'HEAD' });

    if (head.ok) return u.toString();
    
    if (head.status === 400) {
      console.warn('Storage 400 body:', await (await fetch(u.toString())).text());
    }
    
    if (head.status !== 404) {
      // 2) Fallback to signed URL on 400/401/403/etc.
      const { data, error } = await supabase
        .storage
        .from('universe-images')
        .createSignedUrl(path, 60 * 60); // 1h
      if (error) throw error;
      return data.signedUrl;
    }
  } catch (error) {
    console.warn('Public URL fetch failed, trying signed URL:', error);
    // Fallback to signed URL on network errors
    const { data, error: signedError } = await supabase
      .storage
      .from('universe-images')
      .createSignedUrl(path, 60 * 60); // 1h
    if (signedError) throw signedError;
    return data.signedUrl;
  }
  
  // 404: not generated yet
  return null;
}