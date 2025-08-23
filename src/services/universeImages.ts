import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/functionsClient';
import type { ImageEnsureReq, ImageEnsureRes } from '@/types/api';

const normalizePath = (path: string) => path.replace(/^\/+/, '').replace(/\/{2,}/g, '/');

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