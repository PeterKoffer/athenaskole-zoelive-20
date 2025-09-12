import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON as string | undefined;

if (!url || !anon) {
  // Do not crash at import-time; warn instead.
  // eslint-disable-next-line no-console
  console.warn(
    "[contentClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON. Edge function calls will fail until set."
  );
}

export const supabase = url && anon ? createClient(url, anon) : undefined;

export async function generateLesson(body: any): Promise<any> {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON in .env.local"
    );
  }
  const { data, error } = await supabase.functions.invoke("generate-content", { body });
  if (error) throw error;
  // Support both { ok, data } and direct payloads
  return (data as any)?.data ?? data;
}
