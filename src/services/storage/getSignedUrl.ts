import { memoGet, memoSet } from '@/utils/cache';
import { singleFlight } from '@/utils/singleflight';
import { trySignDownload } from './signForDownload';
import { objectExists, pollUntilExists } from './objectExists';
import { invokeFn } from '@/supabase/safeInvoke';

function hashPath(bucket: string, path: string): string {
  return btoa(`${bucket}:${path}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
}

export async function getSignedUniverseCover(
  pathBase: string, 
  opts: { expires?: number; label?: string } = {}
): Promise<string | null> {
  const { expires = 300, label = 'Cover' } = opts;
  
  // Try .webp then .png extensions
  for (const ext of ['webp', 'png']) {
    const path = `${pathBase}/cover.${ext}`;
    const cacheKey = `signed:${path}`;
    
    // Check cache first
    const cached = memoGet<string>(cacheKey);
    if (cached) return cached;

    const run = async () => {
      try {
        const exists = await objectExists('universe-images', path);
        if (!exists) return null;

        const res = await trySignDownload('universe-images', path, expires);
        if (!res.data?.signedUrl) return null;

        // Cache the signed URL
        memoSet(cacheKey, res.data.signedUrl, 2.5 * 60 * 1000); // 2.5min (shorter than 5min expiry)
        return res.data.signedUrl;
      } catch (error) {
        // Graceful handling of 429/offline
        const isRetryable = error instanceof Error && 
          (error.message.includes('429') || error.message.includes('network'));
        
        if (isRetryable) {
          console.debug(`🔄 Retryable error for ${path}, treating as pending`);
          return null;
        }
        throw error;
      }
    };

    const url = await singleFlight(cacheKey, run);
    if (url) return url;
  }
  
  return null; // No existing file found
}

export async function healAndGetSignedUrl(
  pathBase: string,
  opts: { expires?: number; label?: string; title?: string; subject?: string } = {}
): Promise<string> {
  const { expires = 300, label = 'Cover', title = 'Learning Universe', subject = 'Education' } = opts;
  
  // Try to get existing signed URL first
  const existing = await getSignedUniverseCover(pathBase, { expires, label });
  if (existing) return existing;
  
  // Need to heal - generate deterministic job ID
  const jobId = hashPath('universe-images', `${pathBase}/cover`);
  const healKey = `heal:${jobId}`;
  
  const healAndSign = async () => {
    console.debug(`🔧 Auto-healing universe image: ${pathBase} (job: ${jobId})`);
    
    // Trigger healing with job ID for idempotent processing
    await invokeFn('image-ensure', {
      bucket: 'universe-images',
      path: `${pathBase}/cover.webp`,
      generateIfMissing: true,
      jobId,
      ai: { title, subject }
    }, { logName: 'image-ensure-heal' }).catch(() => {
      console.warn('Image ensure failed, will try placeholder upload');
    });

    // Poll for file appearance
    for (const ext of ['webp', 'png']) {
      const path = `${pathBase}/cover.${ext}`;
      const appeared = await pollUntilExists('universe-images', path);
      if (appeared) {
        const res = await trySignDownload('universe-images', path, expires);
        if (res.data?.signedUrl) {
          return res.data.signedUrl;
        }
      }
    }
    
    return null;
  };
  
  const url = await singleFlight(healKey, healAndSign);
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