// src/services/UniverseImageGenerator.ts
import { supabase } from "@/lib/supabaseClient";
import { buildAdventureImagePrompt } from "./imagePromptBuilder";

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
  // Use new advanced prompt builder for better image quality
  const imagePromptData = buildAdventureImagePrompt(
    args.universeId,
    args.title || "Learning Adventure",
    0, // phase 0 for cover
    "cover"
  );

  const { data, error } = await supabase.functions.invoke("image-service", {
    body: {
      prompt: imagePromptData.prompt,
      negative_prompt: imagePromptData.negativePrompt,
      seed: imagePromptData.seed,
      universeId: args.universeId,
      width: args.width || 1920,
      height: args.height || 1080,
    },
  });
  if (error) throw error;

  const url = (data as any)?.data?.publicUrl || (data as any)?.data?.bflUrl as string | undefined;
  if (url) return url;

  const title = (args.title?.trim() || "cover").replace(/\.(png|jpe?g|webp)$/i, "");
  return publicCoverUrl(`/${args.universeId}/${args.gradeInt}/${title}.webp`);
}

export async function ensurePhaseImage(
  universeId: string,
  title: string,
  phaseIndex: number,
  phaseType: "math" | "language" | "science" | "exit",
  gradeInt: number = 7
): Promise<string> {
  const imagePromptData = buildAdventureImagePrompt(
    universeId,
    title,
    phaseIndex,
    phaseType
  );

  const { data, error } = await supabase.functions.invoke("image-service", {
    body: {
      prompt: imagePromptData.prompt,
      negative_prompt: imagePromptData.negativePrompt,
      seed: imagePromptData.seed,
      universeId: universeId,
      width: 1920,
      height: 1080,
    },
  });
  if (error) throw error;

  const url = (data as any)?.data?.publicUrl || (data as any)?.data?.bflUrl as string | undefined;
  if (url) return url;

  return publicCoverUrl(`/${universeId}/${gradeInt}/${phaseType}-${phaseIndex}.webp`);
}
