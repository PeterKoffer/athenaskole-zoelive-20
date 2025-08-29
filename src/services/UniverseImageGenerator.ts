// src/services/UniverseImageGenerator.ts
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "universe-images";

export function publicCoverUrl(path: string) {
  const clean = path.replace(/^\//, "");
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(clean);
  return data.publicUrl;
}

export type EnsureArgs = {
  universeId: string;
  gradeInt: number;
  title?: string;
  width?: number;
  height?: number;
  minBytes?: number;
  prompt?: string;
};

/**
 * Kalder kun den hostede edge function "image-ensure".
 * Returnerer en stabil public URL til cover-billedet.
 */
export async function ensureDailyProgramCover(args: EnsureArgs): Promise<string> {
  const { data, error } = await supabase.functions.invoke("image-ensure", {
    body: args,
  });
  if (error) throw error;

  const url = (data as any)?.publicUrl as string | undefined;
  if (url) return url;

  const title = (args.title?.trim() || "cover").replace(/\.(png|jpe?g|webp)$/i, "");
  return publicCoverUrl(`/${args.universeId}/${args.gradeInt}/${title}.webp`);
}
