import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/functionsClient';

export async function getUniverseImageSignedUrl(path: string) {
  // A) Sørg for at filen findes (opretter placeholder hvis mangler)
  await invokeFn('image-ensure', {
    bucket: 'universe-images',
    path,
    generateIfMissing: true,
  });

  // B) Signér
  const { data, error } = await supabase
    .storage.from('universe-images')
    .createSignedUrl(path, 300);

  if (error) throw error;
  return data.signedUrl;
}

export async function getUniverseCoverSignedUrl(universeId: string, version: number = 6) {
  const path = `${universeId}/${version}/cover.webp`;
  return getUniverseImageSignedUrl(path);
}