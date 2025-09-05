const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// Size normalizer — maps arbitrary sizes/aspect ratios to OpenAI-allowed sizes
type OAISize = "1024x1024" | "1024x1536" | "1536x1024" | "auto";

function normalizeSize(
  size?: string,
  aspect_ratio?: string
): OAISize {
  const allowed = new Set<OAISize>(["1024x1024", "1024x1536", "1536x1024", "auto"]);
  if (size && allowed.has(size as OAISize)) return size as OAISize;

  // If aspect ratio is present, pick closest allowed
  if (aspect_ratio) {
    const m = String(aspect_ratio).trim().match(/^(\d+)\s*:\s*(\d+)$/);
    if (m) {
      const w = parseInt(m[1], 10);
      const h = parseInt(m[2], 10);
      if (w === h) return "1024x1024";
      return w > h ? "1536x1024" : "1024x1536";
    }
  }

  // Common fallbacks
  const map: Record<string, OAISize> = {
    "512x512": "1024x1024",
    "256x256": "1024x1024",
    "128x128": "1024x1024",
    "1080x1920": "1024x1536",
    "720x1280": "1024x1536",
    "1920x1080": "1536x1024",
    "1280x720": "1536x1024",
  };
  if (size && map[size]) return map[size];

  return "1024x1024";
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  if (req.method === "GET") {
    return json({ ok: true, service: "ai-image", provider: "openai" });
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request", details: "Invalid JSON" }, 400);
  }

  const prompt: string | undefined = body?.prompt;
  const sizeRaw: string | undefined = body?.size;
  const aspectRatio: string | undefined = body?.aspect_ratio;

  if (!prompt || typeof prompt !== "string") {
    return json({ error: "bad_request", details: "Missing 'prompt' (string)" }, 400);
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_IMAGE_MODEL") || "gpt-image-1";
  if (!apiKey) {
    return json({ error: "server_misconfig", details: "OPENAI_API_KEY is not set" }, 500);
  }

  const sizeNorm: OAISize = normalizeSize(sizeRaw, aspectRatio);

  try {
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        size: sizeNorm, // must be one of: 1024x1024, 1024x1536, 1536x1024, auto
      }),
    });

    const text = await resp.text();

    if (!resp.ok) {
      return json(
        { error: "upstream_error", provider: "openai", status: resp.status, details: text },
        resp.status
      );
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return json({ error: "upstream_parse_error", raw: text }, 502);
    }

    const b64 = data?.data?.[0]?.b64_json || data?.data?.[0]?.b64;
    const url = data?.data?.[0]?.url;

    if (b64) return json({ image_base64: b64 }, 200);
    if (url) return json({ image_url: url }, 200);

    return json({ error: "no_image_returned", details: data }, 502);
  } catch (err) {
    return json({ error: "server_error", details: String((err as any)?.message || err) }, 500);
  }
});
