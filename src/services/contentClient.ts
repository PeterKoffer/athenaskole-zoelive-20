// src/services/contentClient.ts
import { getSupabase } from "./supabaseClient";

export async function generateLesson(body: unknown): Promise<any> {
  const supabase = getSupabase();
  const { data, error } = await supabase.functions.invoke("generate-content", { body });
  if (error) throw error;
  return (data as any)?.data ?? data;
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
