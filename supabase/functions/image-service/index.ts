// supabase/functions/image-service/index.ts
// Simple placeholder generator -> returns { url: "data:image/svg+xml;base64,..." }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsOkService();
  if (req.method !== "POST") return corsErrService(405, "Method Not Allowed");

  try {
    const body = await req.json().catch(() => ({} as any));
    const width  = Number(body?.width)  || 1216;
    const height = Number(body?.height) || 640;
    const title  = (body?.title ?? "Today's Program").toString();

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFD08A"/><stop offset="100%" stop-color="#FF8BA7"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle"
        font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        font-size="${Math.max(24, Math.floor(width/16))}" font-weight="700"
        fill="#1f2937">${escapeXmlService(title)}</text>
</svg>`;

    const url = "data:image/svg+xml;base64," + btoa(svg);
    return jsonService({ url });
  } catch (e) {
    return jsonService({ error: (e as Error).message ?? String(e) }, 500);
  }
});

function escapeXmlService(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]!));
}

function corsOkService() { return new Response("", { status: 204, headers: corsHeadersService() }); }
function corsErrService(status: number, msg: string) { return new Response(msg, { status, headers: corsHeadersService("text/plain") }); }
function jsonService(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeadersService("application/json") });
}
function corsHeadersService(contentType?: string) {
  const h: Record<string,string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (contentType) h["Content-Type"] = contentType;
  return h;
}