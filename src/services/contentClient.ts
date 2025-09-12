// src/services/contentClient.ts
import { getSupabase } from "@/lib/supabaseClient";

/**
 * Kalder Supabase Edge Function `generate-content`.
 * Tåler både { ok, data } og direkte payload.
 */
export async function generateLesson(body: unknown): Promise<any> {
  const supabase = getSupabase();
  const { data, error } = await supabase.functions.invoke("generate-content", { body });
  if (error) throw error;
  return (data as any)?.data ?? data;
}
