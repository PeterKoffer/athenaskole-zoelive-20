import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/functionsClient';
import type { ImageEnsureReq, ImageEnsureRes } from '@/types/api';

export async function getUniverseImageSignedUrl(path: string, ttlSec = 300): Promise<string> {
  const ensureReq: ImageEnsureReq = { bucket: 'universe-images', path, generateIfMissing: true };
  const ensured = await invokeFn<ImageEnsureRes>('image-ensure', ensureReq);
  if (!('ok' in ensured) || !ensured.ok) throw new Error('image-ensure failed');

  const { data, error } = await supabase.storage
    .from('universe-images')
    .createSignedUrl(path, ttlSec);

  if (error || !data?.signedUrl) throw error ?? new Error('No signedUrl');
  return data.signedUrl as string;
}

export async function getUniverseCoverSignedUrl(universeId: string, version: number = 6): Promise<string> {
  const path = `${universeId}/${version}/cover.webp`;
  return getUniverseImageSignedUrl(path);
}