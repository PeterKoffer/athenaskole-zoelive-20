// supabase/functions/image-service/index.ts
// deno-lint-ignore-file no-explicit-any
// @ts-ignore
import Replicate from "npm:replicate";

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type, apikey, x-client-info",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json",
};

const replicate = new Replicate({ auth: Deno.env.get("REPLICATE_API_TOKEN") ?? "" });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const { pathname } = new URL(req.url);
  if (!pathname.endsWith("/generate")) return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: cors });

  try {
    const { universeId, prompt } = await req.json() as any;
    if (!universeId) return new Response(JSON.stringify({ error: "universeId required" }), { status: 400, headers: cors });

    if (!replicate.auth) {
      // graceful fallback: front-end can still show something
      return new Response(JSON.stringify({ url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'><rect width='100%' height='100%' fill='#1f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='#fff'>${universeId.slice(0,4)}</text></svg>`)}` }), { headers: cors });
    }

    const out = await replicate.run("black-forest-labs/flux-schnell", {
      input: { prompt, width: 1024, height: 576 },
    });

    const url0 = Array.isArray(out) ? out[0] : out?.[0] ?? out?.output?.[0];
    return new Response(JSON.stringify({ url: url0 }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 200, headers: cors });
  }
});