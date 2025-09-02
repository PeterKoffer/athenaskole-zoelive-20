// supabase/functions/image-ensure/index.ts
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
} as const;

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...CORS, ...(init.headers ?? {}) },
  });
}
const ok  = (data: unknown, status = 200) => json({ ok: true, data }, { status });
const bad = (msg: string, status = 400) => json({ error: msg }, { status });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS, status: 204 });
  if (req.method !== "GET" && req.method !== "POST") return bad("Method not allowed", 405);

  const supabaseUrl =
    Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  const srv =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!srv) return bad("Missing SERVICE_ROLE_KEY", 500);

  // read inputs from query or json
  const q = Object.fromEntries(new URL(req.url).searchParams.entries());
  let body: any = {};
  if (req.method === "POST") {
    try { body = await req.json(); } catch {}
  }

  const payload = {
    prompt: String(body.prompt ?? body.title ?? q.prompt ?? q.title ?? "Untitled"),
    universeId: String(body.universeId ?? q.universeId ?? "default"),
    width: Number(body.width ?? q.width ?? 1024),
    height: Number(body.height ?? q.height ?? 576),
    negativePrompt: body.negativePrompt ?? q.negativePrompt,
    seed: body.seed ?? (q.seed ? Number(q.seed) : undefined),
    cfgScale: body.cfgScale ?? (q.cfgScale ? Number(q.cfgScale) : undefined),
    steps: body.steps ?? (q.steps ? Number(q.steps) : undefined),
  };

  // forward to the working image-service with SRV auth
  const r = await fetch(`${supabaseUrl}/functions/v1/image-service`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "apikey": srv,
      "authorization": `Bearer ${srv}`,
    },
    body: JSON.stringify(payload),
  });

  let out: any = null;
  try { out = await r.json(); } catch {}

  if (!r.ok || !out?.ok) {
    return bad(out?.error ?? `image-service ${r.status}`, 502);
  }
  return ok(out.data);
});