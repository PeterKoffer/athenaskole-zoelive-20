export async function generateCover(
  universeId: string,
  {
    title,
    prompt,
    width = 1024,
    height = 576,
  }: { title?: string; prompt?: string; width?: number; height?: number } = {}
): Promise<string> {
  const supaUrl = "https://yphkfkpfdpdmllotpqua.supabase.co";
  const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaGtma3BmZHBkbWxsb3RwcXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcxNTksImV4cCI6MjA2Mzk5MzE1OX0.hqyZ2nk3dqMx8rX9tdM1H4XF9wZ9gvaRor-6i5AyCy8";

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

  const json = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    throw new Error(`edge returned ${res.status}: ${json?.error ?? "unknown error"}`);
  }
  const url = typeof json?.url === "string" ? json.url : null;
  if (!url) throw new Error("edge returned no url");
  return url;
}

export async function ensureDailyProgramCover(opts: {
  universeId: string;
  title: string;
  subject: string;
  grade: string | number;
}) {
  const { universeId, title, subject, grade } = opts;
  const prompt = `Classroom-friendly ${subject} cover for ${title}`;

  try {
    const url = await generateCover(universeId, { title, prompt });
    return `${url}?v=${Date.now()}`; // cache-bust
  } catch (error) {
    console.warn("Cover generation failed:", error);
    return svgFallback(universeId, grade);
  }
}

function svgFallback(universeId: string, gradeRaw: string | number) {
  const g = String(gradeRaw).match(/\d+/)?.[0] ?? "0";
  const txt = `U:${universeId.slice(0,4)} G:${g}`;
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'>
      <rect width='100%' height='100%' fill='rgb(220,200,180)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Inter,Arial' font-size='48' fill='black'>${txt}</text>
    </svg>`
  );
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}
