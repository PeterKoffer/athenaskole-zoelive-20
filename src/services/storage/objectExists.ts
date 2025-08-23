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

export async function pollUntilExists(
  bucket: string, 
  path: string, 
  opts: { timeoutMs?: number; intervalMs?: number; minBytes?: number } = {}
) {
  const { timeoutMs = 15000, intervalMs = 800, minBytes = 1 } = opts;
  const start = Date.now();
  
  while (Date.now() - start < timeoutMs) {
    const result = await objectExistsWithSize(bucket, path, minBytes);
    if (result.ok) {
      return true;
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  
  return false;
}

export async function objectExistsWithSize(bucket: string, path: string, minBytes = 1) {
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
  
  const file = data?.find(f => f.name === filename);
  const exists = file && (file.metadata?.size ?? 0) >= minBytes;
  
  return { 
    ok: !!exists, 
    size: file?.metadata?.size,
    file 
  };
}