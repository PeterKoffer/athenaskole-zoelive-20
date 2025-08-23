// Storage objectExists (leaf module)
import { supabase } from '@/integrations/supabase/client';

function normalizePath(path: string): string {
  return path.replace(/^\/+/, '');
}

export async function objectExists(bucket: string, path: string) {
  const normalizedPath = normalizePath(path);
  
  const i = normalizedPath.lastIndexOf('/');
  const prefix = i === -1 ? '' : normalizedPath.slice(0, i + 1);
  const filename = i === -1 ? normalizedPath : normalizedPath.slice(i + 1);

  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    search: filename,
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' }
  });

  if (error) {
    return { ok: false, reason: 'list_error', error };
  }
  
  const exists = !!data?.some(f => f.name === filename);
  return { ok: exists };
}

export async function pollUntilExists(bucket: string, path: string, timeoutMs = 15000, intervalMs = 800) {
  const start = Date.now();
  
  while (Date.now() - start < timeoutMs) {
    const result = await objectExists(bucket, path);
    if (result.ok) {
      return true;
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  
  return false;
}