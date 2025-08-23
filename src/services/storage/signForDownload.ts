import { supabase } from '@/integrations/supabase/client';

export async function trySignDownload(bucket: string, path: string, expires = 300) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expires);

  // Supabase sender 400 når objektet ikke findes – det er "ok" i vores heal-flow
  if (error) {
    const msg = (error as any)?.message || '';
    const status = (error as any)?.status || (error as any)?.statusCode;

    const isNotReady =
      status === 400 ||
      /not found|does not exist|No such file/i.test(msg);

    if (isNotReady) {
      console.debug(`📦 Storage object pending: ${bucket}/${path}`);
      return { data: null, pending: true }; // lad ensure→HEAD→fallback tage over
    }
    // andre fejl er rigtige fejl
    throw error;
  }

  return { data, pending: false };
}

export async function pollHeadUntilExists(url: string, maxAttempts = 10, delayMs = 500) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok && response.headers.get('content-length')) {
        const size = parseInt(response.headers.get('content-length') || '0');
        if (size > 1000) { // reasonable size check
          console.debug(`✅ File ready: ${url} (${size} bytes)`);
          return true;
        }
      }
    } catch (e) {
      // ignore fetch errors during polling
    }
    
    if (i < maxAttempts - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.warn(`⏰ Timeout waiting for file: ${url}`);
  return false;
}