// src/services/UniverseImageGenerator.ts
// Single place to generate a cover image for a universe/lesson.
// Uses our Supabase Edge Function: /functions/v1/image-service/generate

type EnsureCoverOpts = {
  universeId: string;
  title: string;
  subject?: string;
  grade?: number;
  width?: number;
  height?: number;
};

function escapeSvgText(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeFallbackSvg(text: string, w = 1024, h = 576) {
  const safe = escapeSvgText(text || "Today's Program");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `  <defs>` +
    `    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">` +
    `      <stop offset="0%" stop-color="#111827"/><stop offset="100%" stop-color="#1f2937"/>` +
    `    </linearGradient>` +
    `  </defs>` +
    `  <rect width="100%" height="100%" fill="url(#g)"/>` +
    `  <text x="50%" y="50%" fill="#e5e7eb" font-family="ui-sans-serif,system-ui,Segoe UI,Roboto"` +
    `        font-size="28" text-anchor="middle" dominant-baseline="middle">${safe}</text>` +
    `</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

async function callEdgeGenerate(
  universeId: string,
  prompt: string,
  w = 1024,
  h = 576
): Promise<string | null> {
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supaUrl || !anon) return null;

  try {
    const res = await fetch(`${supaUrl}/functions/v1/image-service/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anon}`,
      },
      body: JSON.stringify({
        universeId,
        prompt,
        width: w,
        height: h,
      }),
    });

    // Edge function always returns JSON (even for fallback)
    const json = (await res.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
      source?: string;
      status?: string;
    };

    // If BFL succeeded, url is a https link. If BFL failed, we still get a data: URL fallback.
    if (typeof json?.url === "string" && json.url.length > 8) {
      return json.url;
    }

    // Explicit fallback if we got here without a url
    return null;
  } catch {
    return null;
  }
}

/**
 * Main entry used by the app to ensure there is a cover image URL.
 * Always resolves to a usable URL (remote image or SVG data URL).
 */
export async function ensureDailyProgramCover(opts: EnsureCoverOpts): Promise<string> {
  const w = opts.width ?? 1024;
  const h = opts.height ?? 576;
  const title = opts.title?.trim() || "Today’s Program";

  const prompt =
    `Classroom-friendly cover for "${title}"` +
    (opts.subject ? `, ${opts.subject}` : "") +
    ", minimal, bright, 16:9";

  // Try edge function (BFL or its internal fallback)
  const edgeUrl = await callEdgeGenerate(opts.universeId || `fallback-${title}`, prompt, w, h);
  if (edgeUrl) return `${edgeUrl}${edgeUrl.startsWith("data:") ? "" : `?x=${Date.now()}`}`;

  // Last-resort local fallback
  return makeFallbackSvg(title, w, h);
}
