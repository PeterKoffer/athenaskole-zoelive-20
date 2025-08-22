import { invokeFn, supabase } from '@/supabase/functionsClient';

export async function getUniverseCoverSignedUrl(universeId: string, version: number = 6) {
  const path = `${universeId}/${version}/cover.webp`;

  // 1) ensure (this writes the file if missing)
  await invokeFn('image-ensure', {
    bucket: 'universe-images',
    path,
    generateIfMissing: true,
    kind: 'cover',
  });

  // 2) check if file exists after ensure
  const exists = await supabase.storage.from('universe-images')
    .list(`${universeId}/${version}`, { limit: 1, search: 'cover.webp' });
  
  if (!exists.data?.length) {
    throw new Error('cover.webp missing after ensure()');
  }

  // 3) now create a signed URL (object exists now)
  const { data, error } = await supabase
    .storage
    .from('universe-images')
    .createSignedUrl(path, 60 * 60, { download: false });

  if (error) throw error;
  return data.signedUrl;
}