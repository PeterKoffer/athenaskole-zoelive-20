import { supabase } from '@/integrations/supabase/client';
import { objectExists } from './objectExists';
import { debugLog, warnLog, makeCorrelationId } from '@/utils/observability';

export async function trySignDownload(bucket: string, path: string, expires = 300) {
  const correlationId = makeCorrelationId(bucket, path);
  
  // Avoid 400s by skipping sign until file is present
  const exists = await objectExists(bucket, path, correlationId);
  if (!exists) {
    debugLog(correlationId, 'sign-skip', `object not found: ${bucket}/${path}`);
    return { data: null, pending: true };
  }

  debugLog(correlationId, 'sign-attempt', `bucket: ${bucket}, path: ${path}, expires: ${expires}s`);
  
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expires);
  if (error) {
    warnLog(correlationId, 'sign-error', error);
    throw error;
  }
  
  debugLog(correlationId, 'sign-success', 'signed URL created');
  return { data, pending: false };
}

export async function pollUntilExists(bucket: string, path: string, timeoutMs = 15000, intervalMs = 800) {
  const start = Date.now();
  console.debug(`🔄 Polling for ${bucket}/${path}...`);
  
  while (Date.now() - start < timeoutMs) {
    if (await objectExists(bucket, path)) {
      console.debug(`✅ File appeared: ${bucket}/${path}`);
      return true;
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  
  console.warn(`⏰ Timeout waiting for file: ${bucket}/${path}`);
  return false;
}

// Legacy function for HEAD polling (kept for compatibility)
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