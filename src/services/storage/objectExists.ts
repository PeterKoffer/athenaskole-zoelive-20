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

export async function pollUntilExists(bucket: string, path: string, timeoutMs = 15000, intervalMs = 800) {
  const start = Date.now();
  console.debug(`🔄 Polling for ${bucket}/${path}...`);
  
  while (Date.now() - start < timeoutMs) {
    if (await objectExists(bucket, path)) {
      console.debug(`✅ File appeared: ${bucket}/${path}`);
      return true;
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  
  console.warn(`⏰ Timeout waiting for file: ${bucket}/${path}`);
  return false;
}