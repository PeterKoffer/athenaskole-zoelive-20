import { supabase } from '@/integrations/supabase/client';

export { supabase };

export async function invokeFn<T>(name: string, body?: unknown): Promise<T> {
  // SSR guard
  if (typeof window === 'undefined') {
    throw new Error(`Cannot call ${name} during SSR`);
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error(`No session for ${name}. Please sign in before calling functions.`);
  
  // Debug logging for JWT presence
  console.debug(`[invokeFn] ${name} jwt.len=${session.access_token.length}`);

  const { data, error } = await supabase.functions.invoke<T>(name, {
    body: body as Record<string, unknown>,
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (error) throw error;
  return data!;
}

// Circuit breaker for hard failures
const contentServiceDown = new Set<string>();

export async function safeInvokeFn<T>(name: string, body?: unknown): Promise<T> {
  const key = `${name}-${JSON.stringify(body)}`;
  
  if (contentServiceDown.has(key)) {
    throw new Error('content-service-down');
  }
  
  try {
    return await invokeFn<T>(name, body);
  } catch (e: any) {
    const status = e?.status ?? 500;
    if (status === 400) {
      console.warn(`Bad request to ${name}:`, e);
      throw e; // Don't retry 400s
    }
    if (status >= 500 || /Edge Function returned a non-2xx/.test(String(e?.message))) {
      contentServiceDown.add(key);
    }
    throw e;
  }
}