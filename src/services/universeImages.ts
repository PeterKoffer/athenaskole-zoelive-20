import { supabase } from '@/integrations/supabase/client';
import { healAndGetSignedUrl, getSignedUniverseCover } from '@/services/storage/getSignedUrl';

const BUCKET = 'universe-images';
export const MIN_BYTES = 2000;

function makePlaceholderWebp({ w, h, label }: { w: number; h: number; label: string }): Promise<Blob> {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#3b82f6'); g.addColorStop(1, '#9333ea');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = 'bold 110px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillText(label, 64, 200);
  return new Promise(res => c.toBlob(b => res(b!), 'image/webp', 0.92));
}

export async function getUniverseImageSignedUrl(
  path: string,
  opts: { expires?: number; minBytes?: number; label?: string; title?: string; subject?: string } = {}
): Promise<string> {
  const { expires = 300, minBytes = 2000, label = 'Cover', title = 'Learning Universe', subject = 'Education' } = opts;

  // Extract pathBase from full path (remove /cover.webp or /cover.png)
  const pathBase = path.replace(/\/cover\.(webp|png)$/, '');
  
  // Try to get existing signed URL with extension fallback
  const existing = await getSignedUniverseCover(pathBase, { expires, label });
  if (existing) {
    // Do optional sanity check for size if we have a URL
    try {
      const head = await fetch(existing, { method: 'HEAD' });
      const len = +(head.headers.get('content-length') || 0);
      if (len >= minBytes) {
        return existing;
      }
      console.debug(`🔧 File too small (${len} bytes), triggering heal`);
    } catch (e) {
      console.debug('🔧 HEAD check failed, triggering heal');
    }
  }
  
  // File doesn't exist or is corrupt - trigger auto-healing with all hardening
  return healAndGetSignedUrl(pathBase, { expires, label, title, subject });
}

// Legacy function for backwards compatibility
export async function ensureAndSign(path: string, expires = 300): Promise<string> {
  return getUniverseImageSignedUrl(path, { expires });
}

/** Lille, pæn inline-placeholder så vi altid viser noget */
export function inlinePlaceholder(width = 512, height = 256, label = 'Loading…') {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#3b82f6' offset='0'/>` +
    `<stop stop-color='#9333ea' offset='1'/></linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `<text x='24' y='48' fill='rgba(255,255,255,.85)' font-family='system-ui,sans-serif' font-size='28' font-weight='700'>${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function getUniverseCoverSignedUrl(universeId: string, version = 6): Promise<string> {
  return getUniverseImageSignedUrl(`${universeId}/${version}/cover.webp`, { label: 'Cover' });
}