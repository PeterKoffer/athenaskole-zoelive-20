// src/services/contentClient.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON as string | undefined;

if (!url || !anon) {
  // Undgå crash ved import; log i stedet.
  // eslint-disable-next-line no-console
  console.warn(
    "[contentClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON. Edge function calls will fail until set."
  );
}

// Opret kun klient hvis nøgler findes (import-safe)
export const supabase = url && anon ? createClient(url, anon) : undefined;

/**
 * Kalder Supabase Edge Function `generate-content`.
 * Tåler både { ok, data } og direkte payload.
 */
export async function generateLesson(body: unknown): Promise<any> {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON in .env.local"
    );
  }
  const { data, error } = await supabase.functions.invoke("generate-content", { body });
  if (error) throw error;
  return (data as any)?.data ?? data;
}
