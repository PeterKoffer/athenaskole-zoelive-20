import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/functionsClient';
import type { ImageEnsureReq, ImageEnsureRes } from '@/types/api';

const normalizePath = (path: string) => path.replace(/^\/+/, '').replace(/\/{2,}/g, '/');

type EnsureResult = { ok: boolean; path: string; exists?: boolean; created?: boolean; placeholder?: boolean };

export async function ensureAndSign(path: string, expires = 300): Promise<string> {
  const ensure = await invokeFn<EnsureResult>('image-ensure', {
    bucket: 'universe-images',
    path,
    generateIfMissing: true,
  });
  if (!ensure?.ok) throw new Error('image-ensure failed');

  const { data, error } = await supabase.storage
    .from('universe-images')
    .createSignedUrl(path, expires);

  if (error || !data?.signedUrl) throw error ?? new Error('sign failed');
  return data.signedUrl;
}

export async function headOk(url: string, minBytes = 128) {
  const res = await fetch(url, { method: 'HEAD' });
  const len = parseInt(res.headers.get('content-length') || '0', 10);
  const type = res.headers.get('content-type') || '';
  return { ok: res.ok && type.startsWith('image/') && len > minBytes, status: res.status, type, len };
}

/** Lille, pæn inline-placeholder så vi altid viser noget */
export function inlinePlaceholder(width = 512, height = 256, label = 'Loading…') {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#1d4ed8' offset='0'/>` +
    `<stop stop-color='#9333ea' offset='1'/></linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `<text x='24' y='48' fill='rgba(255,255,255,.85)' font-family='system-ui,sans-serif' font-size='28' font-weight='700'>${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function getUniverseImageSignedUrl(path: string, ttlSec = 300): Promise<string> {
  // 1) Ensure file exists (with proper placeholder if missing)
  const ensureReq: ImageEnsureReq = { bucket: 'universe-images', path, generateIfMissing: true };
  const ensured = await invokeFn<ImageEnsureRes>('image-ensure', ensureReq);
  
  if (!ensured.ok) throw new Error(ensured.error ?? 'image-ensure failed');

  // 2) Create signed URL
  const normalizedPath = normalizePath(path);
  const { data, error } = await supabase.storage
    .from('universe-images')
    .createSignedUrl(normalizedPath, ttlSec);

  if (error || !data?.signedUrl) throw error ?? new Error('No signedUrl');

  // 3) Safety check: verify file isn't corrupt
  try {
    const head = await fetch(data.signedUrl, { method: 'HEAD' });
    const contentLength = parseInt(head.headers.get('content-length') || '0', 10);
    
    if (!head.ok || contentLength < 128) {
      console.warn(`Image too small or corrupt: ${path} (${contentLength} bytes), using fallback`);
      return '/placeholder.svg'; // Use existing placeholder
    }
  } catch (e) {
    console.warn(`Failed to verify image: ${path}, using fallback:`, e);
    return '/placeholder.svg';
  }

  return data.signedUrl as string;
}

export async function getUniverseCoverSignedUrl(universeId: string, version: number = 6): Promise<string> {
  const path = `${universeId}/${version}/cover.webp`;
  return getUniverseImageSignedUrl(path);
}