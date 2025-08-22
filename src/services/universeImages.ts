import { invokeFn, supabase } from '@/supabase/functionsClient';

export async function getUniverseCoverSignedUrl(universeId: string, version: number = 6) {
  const path = `${universeId}/${version}/cover.webp`;

  // 1) ensure
  await invokeFn('image-ensure', {
    bucket: 'universe-images',
    path,
    generateIfMissing: true,
  });

  // 2) sanity check (giver klar fejl hvis ensure ikke skrev filen)
  const { data: list } = await supabase.storage.from('universe-images')
    .list(`${universeId}/${version}`, { search: 'cover.webp', limit: 1 });

  if (!list?.length) throw new Error('cover.webp missing after ensure()');

  // 3) sign
  const { data, error } = await supabase
    .storage
    .from('universe-images')
    .createSignedUrl(path, 60 * 60);

  if (error) throw error;
  return data.signedUrl;
}