// src/services/media/imagePrefetch.ts
export async function generateActivityImage(prompt?: string): Promise<string | null> {
  if (!prompt) return null;
  try {
    // Stub: integrate your edge function here (e.g., supabase.functions.invoke)
    // Env variables are not used in this project, so we return null by default.
    return null;
  } catch {
    return null;
  }
}
