import { supabase } from '@/integrations/supabase/client';
import { incrementCounter, debugLog, warnLog, makeCorrelationId } from '@/utils/observability';

function normalizePath(path: string): string {
  return path.replace(/^\/+/, '');
}

export async function objectExists(bucket: string, path: string, cid?: string) {
  const correlationId = cid || makeCorrelationId(bucket, path);
  const normalizedPath = normalizePath(path);
  
  const i = normalizedPath.lastIndexOf('/');
  const prefix = i === -1 ? '' : normalizedPath.slice(0, i + 1);
  const filename = i === -1 ? normalizedPath : normalizedPath.slice(i + 1);

  incrementCounter('storage.list.calls');
  debugLog(correlationId, 'list', `bucket: ${bucket}, prefix: ${prefix}, filename: ${filename}`);

  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    search: filename,
    limit: 1000, // Increased for potential large directories
    sortBy: { column: 'name', order: 'asc' }
  });

  if (error) {
    warnLog(correlationId, 'list-error', error);
    throw error;
  }
  
  const exists = !!data?.some(f => f.name === filename);
  debugLog(correlationId, 'list-result', `exists: ${exists}, files: ${data?.length || 0}`);
  
  return exists;
}

export async function pollUntilExists(bucket: string, path: string, timeoutMs = 15000, intervalMs = 800) {
  const correlationId = makeCorrelationId(bucket, path);
  const start = Date.now();
  
  debugLog(correlationId, 'poll-start', `timeout: ${timeoutMs}ms, interval: ${intervalMs}ms`);
  
  while (Date.now() - start < timeoutMs) {
    if (await objectExists(bucket, path, correlationId)) {
      debugLog(correlationId, 'poll-success', `appeared after ${Date.now() - start}ms`);
      return true;
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  
  warnLog(correlationId, 'poll-timeout', `failed after ${timeoutMs}ms`);
  return false;
}