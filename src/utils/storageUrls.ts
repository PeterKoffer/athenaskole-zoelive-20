import { supabase } from '@/integrations/supabase/client';

// Toggle if this bucket is actually public. If it's private, NEVER hit /object/public.
const UNIVERSE_BUCKET = "universe-images";
const UNIVERSE_BUCKET_IS_PUBLIC = false; // <-- set true only if bucket policy is public

async function headOk(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Resolve a usable URL for a storage object without causing retry storms.
 * - If bucket is public: try public URL once.
 * - If bucket is private: try createSignedUrl once.
 * Returns null on any 4xx, which the caller must treat as "permanently missing".
 */
export async function resolveImageUrl(
  path: string,
  opts?: { expiresIn?: number }
): Promise<string | null> {
  if (UNIVERSE_BUCKET_IS_PUBLIC) {
    const { data } = supabase.storage.from(UNIVERSE_BUCKET).getPublicUrl(path);
    // No cache-busting query — keep it stable
    return (await headOk(data.publicUrl)) ? data.publicUrl : null;
  }

  // Private bucket → signed URL only
  const { data, error } = await supabase.storage
    .from(UNIVERSE_BUCKET)
    .createSignedUrl(path, opts?.expiresIn ?? 60 * 60 * 8);

  if (error || !data?.signedUrl) return null;

  // Signed URLs already contain a token. Do NOT append extra query params.
  return (await headOk(data.signedUrl)) ? data.signedUrl : null;
}