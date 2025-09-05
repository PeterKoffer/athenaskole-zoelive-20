// ai-image@v2 (OpenAI only, safe + verbose errors)
Deno.serve(async (req) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json", ...cors } });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method === "GET") return json({ ok: true, service: "ai-image", provider: "openai" });

  try {
    let body: any = {};
    try { body = await req.json(); } catch { body = {}; }

    const prompt: string | undefined = body?.prompt;
    const size: "256x256" | "512x512" | "1024x1024" = body?.size ?? "512x512";
    if (typeof prompt !== "string" || !prompt.trim()) {
      return json({ error: "bad_request", details: "`prompt` (string) is required" }, 400);
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_IMAGE_MODEL") ?? "gpt-image-1";
    if (!apiKey) return json({ error: "missing_secret", details: "OPENAI_API_KEY not set" }, 500);

    // NOTE: no response_format here
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, size }),
    });

    const raw = await r.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch {}

    if (!r.ok) {
      return json({ error: "upstream_error", provider: "openai", status: r.status, details: raw }, 502);
    }

    const item = data?.data?.[0];
    const b64 = item?.b64_json;
    const url = item?.url;

    if (typeof b64 === "string" && b64.length > 0) return json({ image_base64: b64 }, 200);
    if (typeof url === "string" && url.length > 0) return json({ image_url: url }, 200);

    return json({ error: "unexpected_response", raw: data ?? raw }, 502);
  } catch (err) {
    return json({ error: "server_error", details: String(err) }, 500);
  }
});
