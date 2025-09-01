// supabase/functions/image-ensure/index.ts
// Generates a simple SVG cover, uploads to Storage bucket "public", returns { publicUrl }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("[image-ensure] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsOk();
  if (req.method !== "POST") return corsErr(405, "Method Not Allowed");

  try {
    const body = await req.json().catch(() => ({} as any));

    const universeId = (body?.universeId ?? "universe-fallback").toString();
    const width  = Number(body?.width)  || 1216;
    const height = Number(body?.height) || 640;
    const title  = (body?.title ?? "Today’s Program").toString();

    const key = `covers/${universeId}/${width}x${height}.svg`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#C1D3FE"/><stop offset="100%" stop-color="#ABC4FF"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle"
        font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        font-size="${Math.max(24, Math.floor(width/16))}" font-weight="700"
        fill="#0f172a">${escapeXml(title)}</text>
</svg>`;

    // Ensure bucket exists (idempotent)
    await supabase.storage.createBucket("public", { public: true }).catch(() => {});

    const { error: upErr } = await supabase.storage
      .from("public")
      .upload(key, new Blob([svg], { type: "image/svg+xml" }), { upsert: true, contentType: "image/svg+xml" });
    if (upErr) return json({ error: upErr.message }, 500);

    const { data: pub } = supabase.storage.from("public").getPublicUrl(key);
    if (!pub?.publicUrl) return json({ error: "No publicUrl from storage" }, 500);

    return json({ publicUrl: pub.publicUrl });
  } catch (e) {
    return json({ error: (e as Error).message ?? String(e) }, 500);
  }
});

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]!));
}

function corsOk() { return new Response("", { status: 204, headers: corsHeaders() }); }
function corsErr(status: number, msg: string) { return new Response(msg, { status, headers: corsHeaders("text/plain") }); }
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders("application/json") });
}
function corsHeaders(contentType?: string) {
  const h: Record<string,string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (contentType) h["Content-Type"] = contentType;
  return h;
}
