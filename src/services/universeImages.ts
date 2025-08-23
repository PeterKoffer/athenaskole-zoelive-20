import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/safeInvoke';

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

async function dataUrlPlaceholder({ w, h, label }: { w: number; h: number; label: string }) {
  const blob = await makePlaceholderWebp({ w, h, label });
  return URL.createObjectURL(blob);
}

export async function getUniverseImageSignedUrl(
  path: string,
  { expires = 300, minBytes = 2000, label = 'Cover' }: { expires?: number; minBytes?: number; label?: string } = {}
): Promise<string> {
  // 1) sikre (server guard regenererer hvis mangler/for lille)
  await invokeFn<{ ok: boolean; path: string; exists: boolean }>(
    'image-ensure',
    { bucket: BUCKET, path, generateIfMissing: true }
  ).catch(() => null); // vi fortsætter selv ved fejl

  const sign = () => supabase.storage.from(BUCKET).createSignedUrl(path, expires);

  // 2) første sign-forsøg
  let { data, error } = await sign();

  // 3) hvis sign fejler → upload korrekt placeholder og prøv igen
  if (!data?.signedUrl || error) {
    const blob = await makePlaceholderWebp({ w: 1024, h: 512, label });
    await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { upsert: true, contentType: 'image/webp' })
      .catch(() => null);

    ;({ data, error } = await sign());
  }

  if (!data?.signedUrl) {
    throw new Error(error?.message || 'Could not create signed URL');
  }

  // 4) sanity: filen skal være "rigtig"
  try {
    const head = await fetch(data.signedUrl, { method: 'HEAD' });
    const len = +(head.headers.get('content-length') || 0);
    if (len < minBytes) throw new Error(`too small (${len})`);
  } catch (e) {
    // Falder tilbage til data-url placeholder hvis CDN fejler
    return await dataUrlPlaceholder({ w: 1024, h: 512, label });
  }

  return data.signedUrl;
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