import { memoGet, memoSet } from '@/utils/cache';
import { singleFlight } from '@/utils/singleflight';
import { signForDownload } from './signForDownload';
import { objectExists, objectExistsWithSize, pollUntilExists } from './objectExists';
import { invokeFn } from '@/supabase/safeInvoke';
import { supabase } from '@/integrations/supabase/client';
import { 
  incr, 
  debugLog, 
  warnLog, 
  makeCorrelationId 
} from '@/utils/observability';

function hashPath(bucket: string, path: string): string {
  return btoa(`${bucket}:${path}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
}

async function validateContentType(url: string, cid: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type') || '';
    const isValidImage = contentType.startsWith('image/');
    
    debugLog(cid, 'content-check', `type: ${contentType}, valid: ${isValidImage}`);
    return isValidImage;
  } catch (error) {
    warnLog(cid, 'content-check-error', error);
    return false;
  }
}

const MIN_BYTES = 1024; // Files smaller than this are considered corrupt
const LOG_HEAL = import.meta.env.DEV || (typeof localStorage !== 'undefined' && localStorage.getItem("debugImages") === "1");

export async function getSignedUniverseCover(
  pathBase: string, 
  opts: { expires?: number; label?: string } = {}
): Promise<string | null> {
  const { expires = 300, label = 'Cover' } = opts;
  const correlationId = makeCorrelationId('universe-images', pathBase);
  
  incr('image.ensure.requested');
  
  // Try .webp then .png extensions
  for (const ext of ['webp', 'png']) {
    const path = `${pathBase}/cover.${ext}`;
    const cacheKey = `signed:${pathBase}:${ext}`;
    
    // Check cache first
    const cached = memoGet<string>(cacheKey);
    if (cached) {
      incr('signedurl.cache.hit');
      debugLog(correlationId, 'cache-hit', `ext: ${ext}`);
      return cached;
    }
    
    incr('signedurl.cache.miss');

    const run = async () => {
      try {
        // Check if file exists and has proper size
        const existsResult = await objectExistsWithSize('universe-images', path, MIN_BYTES);
        if (!existsResult.ok) {
          if (existsResult.size != null && existsResult.size < MIN_BYTES) {
            // Tiny/corrupt file detected - purge it first
            if (LOG_HEAL) {
              console.debug("🔧 Tiny object detected, purging before heal", { 
                path, 
                size: existsResult.size 
              });
            }
            
            try {
              await supabase.storage.from('universe-images').remove([path]);
              incr('image.purge.tiny');
            } catch (_) { /* ignore purge errors */ }
          }
          return null;
        }

        const res = await signForDownload('universe-images', path, expires);
        if (!res.data?.signedUrl) return null;

        // Validate content type before caching
        const isValidImage = await validateContentType(res.data.signedUrl, correlationId);
        if (!isValidImage) {
          warnLog(correlationId, 'invalid-content-type', `path: ${path}`);
          return null;
        }

        // Cache the signed URL (TTL < token expiry)
        memoSet(cacheKey, res.data.signedUrl, 2.5 * 60 * 1000);
        incr(ext === 'webp' ? 'fallback.used.webp' : 'fallback.used.png');
        
        debugLog(correlationId, 'sign-cached', `ext: ${ext}, expires: ${expires}s`);
        return res.data.signedUrl;
      } catch (error) {
        // Graceful handling of 429/offline
        const isRetryable = error instanceof Error && 
          (error.message.includes('429') || error.message.includes('network'));
        
        if (isRetryable) {
          debugLog(correlationId, 'retryable-error', `path: ${path}, treating as pending`);
          return null;
        }
        throw error;
      }
    };

    const singleFlightKey = `${cacheKey}:flight`;
    const url = await singleFlight(singleFlightKey, run);
    if (url) return url;
  }
  
  debugLog(correlationId, 'no-file-found', 'neither .webp nor .png exists');
  return null; // No existing file found
}

export async function healAndGetSignedUrl(
  pathBase: string,
  opts: { expires?: number; label?: string; title?: string; subject?: string } = {}
): Promise<string> {
  const { expires = 300, label = 'Cover', title = 'Learning Universe', subject = 'Education' } = opts;
  const correlationId = makeCorrelationId('universe-images', pathBase);
  
  // Try to get existing signed URL first
  const existing = await getSignedUniverseCover(pathBase, { expires, label });
  if (existing) {
    incr('image.ensure.skipped');
    return existing;
  }
  
  // Need to heal - generate deterministic job ID
  const jobId = hashPath('universe-images', `${pathBase}/cover`);
  const healKey = `heal:${jobId}`;
  
  const healAndSign = async () => {
    debugLog(correlationId, 'heal-start', `jobId: ${jobId}`);
    incr('image.ensure.healed');
    
    // Trigger healing with job ID for idempotent processing
    await invokeFn('image-ensure', {
      bucket: 'universe-images',
      path: `${pathBase}/cover.webp`,
      generateIfMissing: true,
      jobId,
      correlationId,
      ai: { title, subject }
    }, { logName: 'image-ensure-heal' }).catch((error) => {
      warnLog(correlationId, 'heal-invoke-failed', error);
    });

    // Poll for file appearance (try both extensions) with size check
    for (const ext of ['webp', 'png']) {
      const path = `${pathBase}/cover.${ext}`;
      const appeared = await pollUntilExists('universe-images', path, { 
        timeoutMs: 30000, 
        minBytes: MIN_BYTES 
      });
      if (appeared) {
        const res = await signForDownload('universe-images', path, expires);
        if (res.data?.signedUrl) {
          debugLog(correlationId, 'heal-success', `ext: ${ext}`);
          return res.data.signedUrl;
        }
      }
    }
    
    warnLog(correlationId, 'heal-failed', 'no file appeared after healing');
    return null;
  };
  
  const url = await singleFlight(healKey, healAndSign);
  
  if (!url) {
    incr('fallback.used.placeholder');
    debugLog(correlationId, 'fallback-placeholder', 'using SVG fallback');
  }
  
  return url || createFallbackPlaceholder(1024, 512, label);
}

function createFallbackPlaceholder(width = 512, height = 256, label = 'Loading…') {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#3b82f6' offset='0'/>` +
    `<stop stop-color='#9333ea' offset='1'/></linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `<text x='24' y='48' fill='rgba(255,255,255,.85)' font-family='system-ui,sans-serif' font-size='28' font-weight='700'>${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}