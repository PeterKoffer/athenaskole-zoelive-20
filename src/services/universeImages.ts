import { supabase } from '@/integrations/supabase/client';
import { buildCinematicPrompt } from './images/promptBuilder';

export const BUCKET = 'universe-images';
export const MIN_BYTES = 1024;

export const imageKey = (universeId: string, grade: number) =>
  `${universeId}/${grade}/cover.webp`;

export async function getUniverseImageSignedUrl(
  path: string,
  opts: { prompt?: string } = {}
): Promise<string> {
  const parts = path.split('/');
  if (parts.length < 3) throw new Error('invalid path');
  const [universeId, grade] = parts;

  const from = supabase.storage.from(BUCKET);

  // 1) Find existing file (check both webp and png)
  const { data: list } = await from.list(`${universeId}/${grade}`);
  const existing = list?.find(o => o.name === 'cover.webp')?.name
                 || list?.find(o => o.name === 'cover.png')?.name;
  if (existing) {
    const actualPath = `${universeId}/${grade}/${existing}`;
    return from.getPublicUrl(actualPath).data.publicUrl;
  }

  // 2) Invoke edge function to ensure image exists
  const title = opts.prompt || path.split('/')[0] || 'cover';
  await supabase.functions.invoke('image-ensure', {
    body: {
      universeId: universeId,
      gradeInt: Number(grade),
      title: title,
      minBytes: MIN_BYTES,
      width: 1024,
      height: 576
    }
  }).catch(() => {});

  // 3) Deterministic wait for the file to appear (webp or png)
  const deadline = Date.now() + 45000;
  const candidates = [`${universeId}/${grade}/cover.webp`, `${universeId}/${grade}/cover.png`];
  while (Date.now() < deadline) {
    for (const p of candidates) {
      const { data: signed } = await from.createSignedUrl(p, 60);
      if (signed?.signedUrl) {
        return from.getPublicUrl(p).data.publicUrl;
      }
    }
    await new Promise(r => setTimeout(r, 1200));
  }

  // 4) Graceful fallback so UI always shows something
  return inlinePlaceholder(1024, 512, 'Cover');
}

// Legacy wrapper for backwards compatibility
export async function ensureAndSign(path: string, _expires = 300): Promise<string> {
  return getUniverseImageSignedUrl(path);
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
  return getUniverseImageSignedUrl(`${universeId}/${version}/cover.webp`);
}

