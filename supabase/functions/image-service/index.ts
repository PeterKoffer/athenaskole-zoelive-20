// supabase/functions/image-service/index.ts
// deno-lint-ignore-file no-explicit-any
// @ts-ignore
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type, apikey, x-client-info",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json",
};

const replicateToken = Deno.env.get("REPLICATE_API_TOKEN") ?? "";
const replicate = new Replicate({ auth: replicateToken });

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function svgFallback(universeId: string, gradeRaw: string | number) {
  const g = String(gradeRaw).match(/\d+/)?.[0] ?? "0";
  const txt = `U:${universeId.slice(0, 4)} G:${g}`;
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'>
      <rect width='100%' height='100%' fill='#1f2937'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Inter,Arial' font-size='48' fill='#fff'>${txt}</text>
    </svg>`
  );
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  if (!url.pathname.endsWith("/generate")) return json(404, { error: "not found" });

  try {
    const body = await req.json().catch(() => ({}));
    const { universeId, prompt, title, subject, gradeRaw } = body as any;
    if (!universeId) return json(400, { error: "universeId required" });

    const effectivePrompt =
      prompt ?? `Classroom-friendly ${subject ?? "general"} cover for ${title ?? "Today's Program"}`;

    // No token? Return SVG placeholder so UI still renders.
    if (!replicateToken) {
      return json(200, { url: svgFallback(universeId, gradeRaw ?? "0"), note: "missing REPLICATE_API_TOKEN" });
    }

    // Try FLUX first (fast), then SDXL as a fallback
    let out: any;
    try {
      out = await replicate.run("black-forest-labs/FLUX.1-schnell", {
        input: { prompt: effectivePrompt, width: 1024, height: 576 },
      });
    } catch {
      out = await replicate.run("stability-ai/sdxl", {
        input: { prompt: effectivePrompt, width: 1024, height: 576 },
      });
    }

    const url0 = Array.isArray(out) ? out[0] : out?.[0] ?? out?.output?.[0];
    if (!url0) {
      return json(200, { url: svgFallback(universeId, gradeRaw ?? "0"), note: "model returned no URL" });
    }
    return json(200, { url: url0 });
  } catch (e) {
    return json(200, { url: svgFallback("err-" + crypto.randomUUID(), "0"), error: String(e) });
  }
});