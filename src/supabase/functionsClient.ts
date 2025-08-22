import { supabase } from '@/integrations/supabase/client';

export async function invokeFn<T>(name: string, body?: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No session. Please sign in before calling functions.');

  const { data, error } = await supabase.functions.invoke<T>(name, {
    body,
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (error) throw error;
  return data!;
}

// Circuit breaker for hard failures
const contentServiceDown = new Set<string>();

export async function safeInvokeFn<T>(name: string, body?: Record<string, unknown>): Promise<T> {
  const key = `${name}-${JSON.stringify(body)}`;
  
  if (contentServiceDown.has(key)) {
    throw new Error('content-service-down');
  }
  
  try {
    return await invokeFn<T>(name, body);
  } catch (e: any) {
    const status = e?.status ?? 500;
    if (status >= 500 || /Edge Function returned a non-2xx/.test(String(e?.message))) {
      contentServiceDown.add(key);
    }
    throw e;
  }
}