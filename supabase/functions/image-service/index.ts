// Deno edge function – always return data URL (no CORS in browser)
type GenBody = {
  universeId?: string;
  prompt?: string;
  title?: string;
  width?: number;
  height?: number;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function ok(data: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json", ...CORS, ...extra },
  });
}
function err(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });
}

function makeFallbackSvg(text: string, w = 1024, h = 576) {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#111827"/><stop offset="100%" stop-color="#1f2937"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" fill="#e5e7eb" font-family="ui-sans-serif,system-ui,Segoe UI,Roboto"
            font-size="28" text-anchor="middle" dominant-baseline="middle">${safe}</text>
    </svg>`;
  const b64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${b64}`;
}

function toBase64(u8: Uint8Array) {
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < u8.length; i += CHUNK) {
    bin += String.fromCharCode(...u8.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

async function bflStart(prompt: string, width: number, height: number) {
  const apiKey = Deno.env.get("BFL_API_KEY");
  const model = Deno.env.get("IMAGE_MODEL") || "flux-dev"; // use flux-dev
  if (!apiKey) throw new Error("Missing BFL_API_KEY");

  const endpoint =
    model === "flux-dev"
      ? "https://api.bfl.ai/v1/flux-dev"
      : "https://api.bfl.ai/v1/flux-dev"; // keep dev for now

  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", "x-key": apiKey },
    body: JSON.stringify({
      prompt,
      width,
      height,
      steps: 28,
      guidance: 3,
      prompt_upsampling: false,
      output_format: "jpeg",
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    throw new Error(`BFL start failed: ${r.status} ${detail}`);
  }
  return (await r.json()) as { id?: string; polling_url?: string };
}

async function bflPoll(pollingUrl: string, timeoutMs = 60_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const r = await fetch(pollingUrl, { method: "GET" });
    if (!r.ok) throw new Error(`BFL poll failed: ${r.status}`);
    const j = await r.json().catch(() => ({}));

    // Try to find any image URL in response
    const candidates: string[] = [];
    const pushIfUrl = (v: unknown) => {
      if (typeof v === "string" && /^https?:\/\//i.test(v)) candidates.push(v);
    };
    const scan = (obj: any) => {
      if (!obj || typeof obj !== "object") return;
      for (const k of Object.keys(obj)) {
        const v = (obj as any)[k];
        if (typeof v === "string") pushIfUrl(v);
        else if (Array.isArray(v)) v.forEach(scan);
        else if (typeof v === "object") scan(v);
      }
    };
    scan(j);

    // Prefer BFL delivery links
    const delivery = candidates.find((u) => u.includes(".bfl.ai/") || u.includes("delivery"));
    const anyUrl = delivery || candidates[0];

    // Consider statuses
    const status = (j?.status || j?.state || "").toString().toLowerCase();
    if (anyUrl && (status === "ready" || status === "succeeded" || status === "success")) {
      return { url: anyUrl, raw: j };
    }

    // If no explicit status, but we already see a delivery URL, try it
    if (delivery) return { url: delivery, raw: j };

    await new Promise((s) => setTimeout(s, 1500));
  }
  throw new Error("BFL poll timeout");
}

async function urlToDataUrl(imgUrl: string, mime = "image/jpeg") {
  const r = await fetch(imgUrl, { method: "GET" });
  if (!r.ok) throw new Error(`Fetch image failed: ${r.status}`);
  const buf = new Uint8Array(await r.arrayBuffer());
  const b64 = toBase64(buf);
  return `data:${mime};base64,${b64}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return ok({}, CORS);

  const u = new URL(req.url);
  if (u.pathname.endsWith("/health"))
    return ok({ ok: true, time: new Date().toISOString() });

  if (!u.pathname.endsWith("/generate")) return err("Not Found", 404);

  let body: GenBody;
  try {
    body = (await req.json()) as GenBody;
  } catch {
    return err("Invalid JSON body", 400);
  }

  const title = body.title || "Today's Program";
  const prompt =
    body.prompt ||
    `${title} — classroom-friendly, minimal, bright, 16:9, clean graphic cover`;
  const width = Math.max(256, Math.min(body.width || 1024, 1440));
  const height = Math.max(256, Math.min(body.height || 576, 1440));

  try {
    const start = await bflStart(prompt, width, height);
    if (!start?.polling_url) {
      // No async task? just fallback now
      return ok({
        url: makeFallbackSvg(title, width, height),
        source: "fallback",
        note: "No polling_url from BFL",
        start,
      });
    }

    const got = await bflPoll(start.polling_url);
    const dataUrl = await urlToDataUrl(got.url, "image/jpeg");
    return ok({ url: dataUrl, source: "bfl", status: "ready" });
  } catch (e) {
    // Last-resort fallback: SVG placeholder
    return ok({
      url: makeFallbackSvg(title, width, height),
      source: "fallback",
      error: String(e?.message || e),
    });
  }
});
