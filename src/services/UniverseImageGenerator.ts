import { supabase } from "../lib/supabaseClient";

export async function ensureDailyProgramCover(opts: {
  universeId: string;
  gradeRaw: string | number;
  prompt: string;
}) {
  const { universeId, gradeRaw, prompt } = opts;

  const { data, error } = await supabase.functions.invoke("image-service", {
    method: "POST",
    path: "/generate",
    body: { universeId, gradeRaw, prompt },
  });

  if (error || !data?.url) {
    console.warn("Cover generation failed:", error?.message);
    return svgFallback(universeId, gradeRaw);
  }
  return `${data.url}?v=${Date.now()}`; // cache-bust
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
