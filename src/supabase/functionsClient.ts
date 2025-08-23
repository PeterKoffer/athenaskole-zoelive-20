import { supabase } from '@/integrations/supabase/client';

export { supabase };

export async function waitForAuth() {
  // Garanterer at vi har en frisk token før vi kalder edge functions
  let { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) return session;

  return new Promise<any>((resolve) => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.access_token) {
        sub.subscription.unsubscribe();
        resolve(s);
      }
    });
  });
}

export type InvokeOptions = { headers?: Record<string, string> };

export async function invokeFn<T = unknown>(
  name: string,
  body?: unknown,
  opts?: InvokeOptions
): Promise<T> {
  // SSR guard
  if (typeof window === 'undefined') {
    throw new Error(`Cannot call ${name} during SSR`);
  }

  const session = await waitForAuth();
  console.debug(`[invokeFn] ${name} jwt.len=${session.access_token.length}`);

  const { data, error } = await supabase.functions.invoke<T>(name, {
    body: body as Record<string, unknown>,
    headers: { Authorization: `Bearer ${session.access_token}`, ...(opts?.headers ?? {}) },
  });
  if (error) throw error;
  return data as T;
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