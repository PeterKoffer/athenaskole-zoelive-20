import { supabase } from '@/integrations/supabase/client';

// Helper to invoke edge functions with guaranteed JWT authentication
export async function callFunction<T = unknown>(
  name: string,
  body?: Record<string, unknown>
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No session; user must be signed in before calling functions.');
  }

  const { data, error } = await supabase.functions.invoke<T>(name, {
    body,
    headers: { Authorization: `Bearer ${session.access_token}` }
  });
  
  if (error) throw error;
  return data!;
}

// Short-circuit pattern to prevent retry storms on function 500s
const hardFailures = new Set<string>();

export async function safeCallFunction<T = unknown>(
  name: string,
  body?: Record<string, unknown>
): Promise<T> {
  const functionKey = `${name}-${JSON.stringify(body)}`;
  
  if (hardFailures.has(functionKey)) {
    throw new Error(`Function ${name} failed previously - short-circuited to prevent retry storm`);
  }

  try {
    return await callFunction<T>(name, body);
  } catch (error: any) {
    // 5xx from Edge Function → stop further attempts this session
    if (error?.status === 500 || /Edge Function returned a non-2xx/.test(String(error?.message))) {
      hardFailures.add(functionKey);
    }
    throw error;
  }
}