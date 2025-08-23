import { supabase } from '@/integrations/supabase/client';

export async function objectExists(bucket: string, path: string) {
  const i = path.lastIndexOf('/');
  const prefix = i === -1 ? '' : path.slice(0, i + 1);
  const filename = i === -1 ? path : path.slice(i + 1);

  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    search: filename, // SDK supports search
    limit: 100,
    sortBy: { column: 'name', order: 'asc' }
  });

  if (error) throw error;
  return !!data?.some(f => f.name === filename);
}