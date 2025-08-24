// supabase/functions/image-service/index.ts
// deno-lint-ignore-file no-explicit-any
// @ts-ignore
import Replicate from "npm:replicate";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, apikey, x-client-info, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json",
};

const replicate = new Replicate({
  auth: Deno.env.get("REPLICATE_API_TOKEN") ?? "",
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const { pathname } = new URL(req.url);
  if (!pathname.endsWith("/generate")) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: CORS });
  }

  try {
    const body = (await req.json()) as any;
    const universeId: string | undefined = body?.universeId;
    const prompt: string | undefined = body?.prompt;
    if (!universeId) {
      return new Response(JSON.stringify({ error: "universeId required" }), { status: 400, headers: CORS });
    }

    // If no token, return a safe SVG fallback (frontend supports this)
    if (!replicate.auth) {
      const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'><rect width='100%' height='100%' fill='#1f2937'/>` +
        `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='#fff'>${universeId.slice(0, 4)}</text></svg>`;
      return new Response(JSON.stringify({ url: `data:image/svg+xml,${encodeURIComponent(svg)}` }), { headers: CORS });
    }

    const modelSlug = Deno.env.get("IMAGE_MODEL_SLUG") || "black-forest-labs/flux-schnell";
    const text = prompt || `Classroom-friendly cover for ${body?.title ?? "Today's Program"}`;

    // ✅ SDK resolves latest version automatically — no 422 "version required"
    const out = await replicate.run(modelSlug, {
      input: { prompt: text, width: 1024, height: 576 },
    });

    const url = Array.isArray(out) ? out[0] : (out as any)?.[0] ?? (out as any)?.output?.[0];
    return new Response(JSON.stringify({ url }), { headers: CORS });
  } catch (e) {
    // Non-fatal for the app — frontend will fall back to SVG
    return new Response(JSON.stringify({ error: String(e) }), { status: 200, headers: CORS });
  }
});