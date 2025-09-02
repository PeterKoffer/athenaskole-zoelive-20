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
 * Uses the image-service edge function to generate and store images.
 * Returns a stable public URL to the cover image in Storage.
 */
export async function ensureDailyProgramCover(args: EnsureArgs): Promise<string> {
  const { data, error } = await supabase.functions.invoke("image-service", {
    body: {
      prompt: args.title || args.prompt || "Daily program cover",
      universeId: args.universeId,
      width: args.width || 1024,
      height: args.height || 576,
    },
  });
  if (error) throw error;

  const url = (data as any)?.data?.publicUrl || (data as any)?.data?.bflUrl as string | undefined;
  if (url) return url;

  const title = (args.title?.trim() || "cover").replace(/\.(png|jpe?g|webp)$/i, "");
  return publicCoverUrl(`/${args.universeId}/${args.gradeInt}/${title}.webp`);
}
