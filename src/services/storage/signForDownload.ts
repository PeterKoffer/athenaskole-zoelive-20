// Storage signForDownload (leaf module)
import { supabase } from '@/integrations/supabase/client';

function normalizePath(path: string): string {
  return path.replace(/^\/+/, '');
}

export async function signForDownload(bucket: string, path: string, expiresIn = 300) {
  const cleanPath = normalizePath(path);
  return supabase.storage.from(bucket).createSignedUrl(cleanPath, expiresIn);
}