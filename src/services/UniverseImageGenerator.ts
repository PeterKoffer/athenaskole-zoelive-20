// src/services/UniverseImageGenerator.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn("[UniverseImageGenerator] Missing NEXT_PUBLIC_SUPABASE_URL/ANON_KEY");
}

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function coverPath(universeId: string, gradeInt: number) {
  // path inde i bucket
  return `/universe-images/${universeId}/${gradeInt}/cover.webp`;
}

export function publicCoverUrl(universeId: string, gradeInt: number) {
  // public URL til object i public bucket
  return `${SUPABASE_URL}/storage/v1/object/public${coverPath(universeId, gradeInt)}`;
}

export async function ensureCover(args: {
  universeId: string;
  gradeInt: number;
  prompt?: string;
  title?: string;
  width?: number;
  height?: number;
  minBytes?: number;
}) {
  const { data, error } = await sb.functions.invoke("image-ensure", {
    body: {
      universeId: args.universeId,
      gradeInt: args.gradeInt,
      prompt: args.prompt,
      title: args.title ?? "Today's Program",
      width: args.width ?? 1024,
      height: args.height ?? 576,
      minBytes: args.minBytes ?? 4096,
    },
  });

  if (error) throw error;
  if (!data?.ok) throw new Error(data?.error || "image-ensure failed");

  return data.data as { path: string; bytes: number; source: string };
}
