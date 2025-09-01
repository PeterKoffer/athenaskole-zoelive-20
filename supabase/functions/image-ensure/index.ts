import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// Use ONE import. Prefer jsr; if it fails, switch to esm.sh.
// import { createClient } from "jsr:@supabase/supabase-js@2.45.4";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4?target=deno";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BUCKET = Deno.env.get("PUBLIC_IMAGES_BUCKET") ?? "public";

const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null;

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return cors(204);
    if (req.method !== "POST") return cors(405, "Method Not Allowed");

    const body = (await req.json().catch(() => ({}))) ?? {};
    const universeId = (body.universeId ?? "universe-fallback") as string;
    const title = (body.title ?? "Today’s Program") as string;
    const width = Number(body.width ?? 1216);
    const height = Number(body.height ?? 640);
    const keySvg = `covers/${universeId}/${width}x${height}.svg`;

    if (!supabase) {
      // No secrets configured: just return a data: URL like image-service does.
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="#334155"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-size="${Math.round(Math.min(width, height) / 10)}"
              font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
              fill="#e5e7eb" font-weight="700">${title}</text>
      </svg>`;
      const url = `data:image/svg+xml;base64,${btoa(svg)}`;
      return json({ publicUrl: url });
    }

    // If secrets exist: write an SVG into Storage and return a real public URL
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0ea5e9"/>
          <stop offset="1" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-size="${Math.round(Math.min(width, height) / 10)}"
            font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
            fill="white" font-weight="800">${title}</text>
    </svg>`;

    const up = await supabase.storage.from(BUCKET).upload(
      keySvg,
      new TextEncoder().encode(svg),
      { upsert: true, contentType: "image/svg+xml" },
    );
    if (up.error) throw up.error;

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(keySvg);
    return json({ publicUrl: pub.publicUrl });
  } catch (err) {
    return json({ error: String(err?.message ?? err) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders("application/json"),
  });
}
function cors(status = 204, text = "ok") {
  return new Response(text, { status, headers: corsHeaders() });
}
function corsHeaders(contentType?: string) {
  return {
    ...(contentType ? { "Content-Type": contentType } : {}),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}
