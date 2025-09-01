/**
 * This function returns a data: URL (SVG) so the client always has a cover image.
 */
Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") return corsResp(204);
    if (req.method !== "POST") return corsResp(405, "Method Not Allowed");

    const body = (await req.json().catch(() => ({}))) ?? {};
    const title = (body.title ?? "Today's Program") as string;
    const width = Number(body.width ?? 1216);
    const height = Number(body.height ?? 640);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fb923c"/>
          <stop offset="1" stop-color="#f97316"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-size="${Math.round(Math.min(width, height) / 9)}"
            font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
            fill="#111827" font-weight="800">${title}</text>
    </svg>`;

    const url = `data:image/svg+xml;base64,${btoa(svg)}`;
    return jsonResp({ url });
  } catch (err) {
    return jsonResp({ error: String((err as Error)?.message ?? err) }, 500);
  }
});

function jsonResp(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHead("application/json"),
  });
}

function corsResp(status = 204, text = "ok") {
  return new Response(text, { status, headers: corsHead() });
}

function corsHead(contentType?: string) {
  return {
    ...(contentType ? { "Content-Type": contentType } : {}),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}