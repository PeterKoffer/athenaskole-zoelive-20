// src/services/UniverseImageGenerator.ts
// Minimal, stabil klient til edge image-service.
// Ingen supabase.functions.invoke — vi rammer /generate direkte.

type GenerateOpts = {
  title?: string;
  prompt?: string;
  width?: number;
  height?: number;
};

export async function generateCover(
  universeId: string,
  { title, prompt, width = 1024, height = 576 }: GenerateOpts = {}
): Promise<string> {
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supaUrl || !anon) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }
  if (!universeId || !universeId.trim()) {
    throw new Error("universeId is required");
  }

  const body = {
    universeId,
    prompt:
      prompt ??
      `${title ?? "Today's Program"} — classroom-friendly, minimal, bright, 16:9`,
    width,
    height,
  };

  const res = await fetch(`${supaUrl}/functions/v1/image-service/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anon}`,
    },
    body: JSON.stringify(body),
  });

  // Robust JSON-parsing
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = {};
  }

  if (!res.ok) {
    const msg = json?.error || `HTTP ${res.status}`;
    throw new Error(`edge returned non-OK: ${msg}`);
  }

  const url = typeof json?.url === "string" && json.url.length > 8 ? json.url : null;
  if (!url) throw new Error("edge returned no url");
  return url;
}

// Bruges af sider/loader til at sikre et cover — falder pænt tilbage til SVG.
export async function ensureDailyProgramCover(opts: {
  universeId: string;
  title?: string;
  subject?: string;
  grade?: number | string;
}): Promise<string> {
  const { universeId, title, subject } = opts;

  const niceTitle = title ?? "Today's Program";
  const prompt = `Classroom-friendly ${subject ? subject + " " : ""}cover for ${niceTitle}, minimal, bright, 16:9`;

  try {
    const url = await generateCover(universeId, { title: niceTitle, prompt, width: 1024, height: 576 });
    // ⚠️ IKKE tilføje egen cache-bust på signerede links
    return url;
  } catch (error) {
    console.warn("[cover] generation failed, using SVG fallback:", error);
    return makeFallbackSvg(niceTitle, 1024, 576);
  }
}

// En simpel, neutral fallback som data-URL (virker uden netværk/CORS)
function makeFallbackSvg(text: string, w = 1024, h = 576): string {
  const safe = (text || "Today's Program")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#111827"/>
          <stop offset="1" stop-color="#1f2937"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" fill="#d1d5db" font-size="36" text-anchor="middle"
            font-family="system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial" dy="12">
        ${safe}
      </text>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
