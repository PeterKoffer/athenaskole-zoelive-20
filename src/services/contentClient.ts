// src/services/contentClient.ts
import { getSupabase } from "@/lib/supabaseClient";

/** Kald Supabase Edge Function `generate-content` */
export async function generateLesson(body: unknown): Promise<any> {
  const supabase = getSupabase();
  const { data, error } = await supabase.functions.invoke("generate-content", { body });
  if (error) throw error;
  return (data as any)?.data ?? data;
}
