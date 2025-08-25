// src/services/UniverseImageGenerator.ts
import supabase from "../lib/supabaseClient";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function fallbackSvg(title: string, w = 1024, h = 576) {
  const safe = escapeHtml(title || "Today’s Program");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#0b1220"/>
          <stop offset="100%" stop-color="#1f2a44"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" fill="#cbd5e1" font-size="36" text-anchor="middle" font-family="system-ui, sans-serif">
        ${safe}
      </text>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

type GenerateInput = {
  universeId: string;
  title?: string;
  subject?: string;
  grade?: number;
  width?: number;
  height?: number;
  prompt?: string;
};

// Direkte fetch til edge-funktionen (ALTID /generate)
async function generateCoverDirect(input: GenerateInput): Promise<string> {
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const W = input.width ?? 1024;
  const H = input.height ?? 576;

  if (!supaUrl || !anon) {
    console.warn("[cover] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
    return fallbackSvg(input.title ?? "Today’s Program", W, H);
  }

  const url = `${supaUrl}/functions/v1/image-service/generate`;
  const body = {
    universeId: input.universeId,
    prompt:
      input.prompt ??
      `${input.title ?? "Today’s Program"} — classroom-friendly, minimal, bright, 16:9`,
    width: W,
    height: H,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${anon}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.warn("[cover] edge non-2xx:", res.status, txt);
    return fallbackSvg(input.title ?? "Today’s Program", W, H);
  }

  const json = (await res.json().catch(() => ({}))) as any;
  const candidate = typeof json?.url === "string" && json.url.length > 8 ? json.url : null;
  return candidate ?? fallbackSvg(input.title ?? "Today’s Program", W, H);
}

// Offentligt API
export async function ensureDailyProgramCover(opts: {
  universeId: string;
  title?: string;
  subject?: string;
  grade?: number;
  width?: number;
  height?: number;
  prompt?: string;
}): Promise<string> {
  const url = await generateCoverDirect({
    universeId: opts.universeId,
    title: opts.title,
    subject: opts.subject,
    grade: opts.grade,
    width: opts.width ?? 1024,
    height: opts.height ?? 576,
    prompt: opts.prompt,
  });

  // let-bust for at tvinge <img> til at hente igen
  const bust = `ts=${Date.now()}`;
  return url.includes("?") ? `${url}&${bust}` : `${url}?${bust}`;
}
