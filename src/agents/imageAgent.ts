import { logEvent } from "./logger";
import { placeholderImagePath } from "./fallbacks";

export async function ensureCoverImage(
  sessionId: string,
  opts: { universeId: string; gradeInt: number; prompt?: string; minBytes?: number }
) {
  // Stub – her kunne du kalde Replicate/andet image-API.
  const path = placeholderImagePath(opts.universeId, opts.gradeInt);
  const bytes = Math.max(opts.minBytes ?? 2048, 2048);

  await logEvent({
    sessionId,
    agent: "image",
    level: "info",
    message: "Ensured cover image (stubbed)",
    meta: { path, bytes },
  });

  return { path, bytes, source: "placeholder" as const };
}
