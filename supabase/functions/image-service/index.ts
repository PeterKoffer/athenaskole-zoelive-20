// deno-lint-ignore-file no-explicit-any
// @ts-ignore
import Replicate from "npm:replicate";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, apikey, x-client-info, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json",
};

const replicate = new Replicate({ auth: Deno.env.get("REPLICATE_API_TOKEN") ?? "" });

function svg(universeId: string) {
  const s = universeId.slice(0, 4);
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'><rect width='100%' height='100%' fill='#1f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='#fff'>${s}</text></svg>`
  )}`;
}

function toUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) {
    const s = (output as unknown[]).find((v) => typeof v === "string");
    return typeof s === "string" ? s : null;
  }
  if (output && typeof output === "object") {
    const o = output as any;
    if (typeof o.output?.[0] === "string") return o.output[0];
    if (typeof o.url === "string") return o.url;
  }
  return null;
}

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
    if (!universeId) return new Response(JSON.stringify({ error: "universeId required" }), { status: 400, headers: CORS });

    // No token? Return fallback (frontend supports it)
    if (!replicate.auth) {
      return new Response(JSON.stringify({ url: svg(universeId) }), { headers: CORS });
    }

    const model = Deno.env.get("IMAGE_MODEL_SLUG") || "black-forest-labs/flux-schnell";
    const text = prompt || `Classroom-friendly cover for ${body?.title ?? "Today's Program"}`;

    const out = await replicate.run(model, {
      input: { prompt: text, width: 1024, height: 576 },
    });

    const url = toUrl(out);
    if (!url) {
      // Last-resort fallback so we NEVER return { url: {} }
      return new Response(JSON.stringify({ url: svg(universeId) }), { headers: CORS });
    }

    return new Response(JSON.stringify({ url }), { headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 200, headers: CORS });
  }
});