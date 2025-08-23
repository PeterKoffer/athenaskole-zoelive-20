import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/functionsClient';
import type { ImageEnsureReq, ImageEnsureRes } from '@/types/api';

export async function getUniverseImageSignedUrl(path: string, ttlSec = 300): Promise<string> {
  const ensureReq: ImageEnsureReq = { bucket: 'universe-images', path, generateIfMissing: true };
  const ensured = await invokeFn<ImageEnsureRes>('image-ensure', ensureReq);
  
  // Handle both parsed object and string responses
  let parsedEnsured: ImageEnsureRes;
  if (typeof ensured === 'string') {
    try {
      parsedEnsured = JSON.parse(ensured);
    } catch {
      throw new Error('Invalid JSON response from image-ensure');
    }
  } else {
    parsedEnsured = ensured;
  }
  
  if (!parsedEnsured.ok) throw new Error('image-ensure failed');

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