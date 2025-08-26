// deno-lint-ignore-file no-explicit-any

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-key, content-type, apikey, x-client-info",
  "access-control-allow-methods": "POST, OPTIONS",
};

function svgFallback(title = "Today's Program") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576">
    <rect width="100%" height="100%" fill="#0b1220"/>
    <text x="50%" y="50%" fill="#7dd3fc" font-size="36" text-anchor="middle" font-family="sans-serif">
      ${title}
    </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}

function looksLikeUrl(s: unknown): s is string {
  return typeof s === "string" && /^https?:\/\//.test(s);
}

function pickUrl(obj: any): string | null {
  if (!obj || typeof obj !== "object") return null;
  // typiske felter
  for (const k of ["url", "image_url", "imageUrl", "image", "output_url"]) {
    const v = obj[k];
    if (looksLikeUrl(v)) return v;
    if (Array.isArray(v)) {
      const hit = v.find(looksLikeUrl);
      if (hit) return hit;
    }
  }
  // søg bredt
  for (const v of Object.values(obj)) {
    if (looksLikeUrl(v)) return v;
    if (Array.isArray(v)) {
      const hit = v.find(looksLikeUrl);
      if (hit) return hit;
    }
    if (v && typeof v === "object") {
      const deep = pickUrl(v);
      if (deep) return deep;
    }
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { universeId, prompt, width = 1024, height = 576, title = "Today's Program", model } =
      await req.json();

    if (!universeId || !prompt) {
      return json({ error: "Missing universeId or prompt" }, 400);
    }

    const apiKey = Deno.env.get("BFL_API_KEY");
    if (!apiKey) {
      // Kør videre uden ekstern API → fallback, så UI altid viser noget
      return json({ url: svgFallback(title), source: "fallback", note: "Missing BFL_API_KEY" });
    }

    // Brug schnell i prod. Dev-modellen er ikke-kommerciel (må ikke bruges i prod).
    const chosen = (Deno.env.get("IMAGE_MODEL") ?? model ?? "flux-schnell").toLowerCase();
    const endpoint = chosen.includes("schnell")
      ? "https://api.bfl.ai/v1/flux-schnell"
      : "https://api.bfl.ai/v1/flux-dev";

    // 1) Start job
    const startRes = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", "x-key": apiKey },
      body: JSON.stringify({
        prompt,
        width,
        height,
        steps: 28,
        output_format: "jpeg",
        // evt. guidance, safety_tolerance m.m. her
      }),
    });

    const start = await startRes.json();
    const pollingUrl: string | undefined = start?.polling_url;
    if (!pollingUrl) {
      return json({
        url: svgFallback(title),
        source: "fallback",
        note: "No polling_url from BFL",
        start,
      });
    }

    // 2) Poll indtil der er URL
    const deadline = Date.now() + 120_000; // 2 minutter
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await fetch(pollingUrl, { headers: { "x-key": apiKey } });
      const data = await pollRes.json();

      // Forsøg at finde en billed-URL i svaret
      const url =
        pickUrl(data) ?? pickUrl(data?.result) ?? pickUrl(data?.output) ?? pickUrl(data?.data);
      const status = (data?.status ?? data?.state ?? "").toString().toLowerCase();

      if (url) return json({ url, source: "bfl", status });
      if (["failed", "error", "canceled"].includes(status)) {
        return json({ url: svgFallback(title), source: "fallback", status });
      }
    }

    return json({ url: svgFallback(title), source: "fallback", note: "Timed out" });
  } catch (e) {
    return json({ url: svgFallback(), source: "fallback", error: String((e as Error)?.message || e) }, 200);
  }
});