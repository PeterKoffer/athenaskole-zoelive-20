// Edge function to ensure cover image exists
Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") return corsResponse(204);
    if (req.method !== "POST") return corsResponse(405, "Method Not Allowed");

    const body = (await req.json().catch(() => ({}))) ?? {};
    const title = (body.title ?? "Today's Program") as string;
    const width = Number(body.width ?? 1216);
    const height = Number(body.height ?? 640);

    // Generate simple SVG data URL
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
    
    const url = `data:image/svg+xml;base64,${btoa(svg)}`;
    return jsonResponse({ publicUrl: url });
  } catch (err) {
    return jsonResponse({ error: String((err as Error)?.message ?? err) }, 500);
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: getCorsHeaders("application/json"),
  });
}

function corsResponse(status = 204, text = "ok") {
  return new Response(text, { status, headers: getCorsHeaders() });
}

function getCorsHeaders(contentType?: string) {
  return {
    ...(contentType ? { "Content-Type": contentType } : {}),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}