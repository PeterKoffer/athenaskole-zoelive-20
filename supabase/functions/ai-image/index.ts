cat > supabase/functions/ai-image/index.ts <<'TS'
// CORS shared headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

function mapAspectToOpenAISize(_ar?: string): "256x256" | "512x512" | "1024x1024" {
  // Cheaper default? switch to "512x512"
  return "1024x1024";
}

async function genWithOpenAI(prompt: string, aspect?: string): Promise<string> {
  const key = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_IMAGE_MODEL") || "gpt-image-1";
  if (!key) throw new Error("OPENAI_API_KEY not set");

  const size = mapAspectToOpenAISize(aspect);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, prompt, size, response_format: "b64_json" }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const b64: string | undefined = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image");
  return b64;
}

async function genWithBFL(prompt: string, aspect?: string): Promise<string> {
  const key = Deno.env.get("BFL_API_KEY");
  const base = (Deno.env.get("BFL_API_URL") || "https://api.bfl.ai").replace(/\/+$/, "");
  const endpointRaw = Deno.env.get("BFL_IMAGE_ENDPOINT") || "/v1/images/generations";
  const endpoint = endpointRaw.startsWith("http")
    ? endpointRaw
    : `${base}${endpointRaw.startsWith("/") ? "" : "/"}${endpointRaw}`;
  const model = Deno.env.get("BFL_MODEL") || "flux-pro-1.1";

  if (!key) throw new Error("BFL_API_KEY not set");

  const payload = { model, prompt, aspect_ratio: aspect || "1:1" };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`BFL ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const b64 =
    data?.data?.[0]?.b64_json ??
    data?.image_base64 ??
    data?.output?.[0]?.b64_json ??
    data?.output?.[0]?.base64;

  if (!b64) throw new Error("BFL returned no image");
  return b64;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json().catch(() => ({}))) as {
      prompt?: string;
      aspect_ratio?: string;
      provider?: string; // "openai" | "bfl"
      fallback?: string; // "openai" | "bfl"
    };

    const prompt = body.prompt?.trim();
    if (!prompt) return json({ error: "Missing 'prompt' in body" }, 400);

    const aspect = body.aspect_ratio;
    const primary = (body.provider || Deno.env.get("DEFAULT_IMAGE_PROVIDER") || "openai").toLowerCase();
    const fallback = (body.fallback || Deno.env.get("FALLBACK_IMAGE_PROVIDER") || "").toLowerCase();

    const tryProvider = async (p: string) => {
      if (p === "openai") return genWithOpenAI(prompt, aspect);
      if (p === "bfl") return genWithBFL(prompt, aspect);
      throw new Error(`Unknown provider: ${p}`);
    };

    let imageB64: string | null = null;
    let firstErr: unknown = null;

    try {
      console.log("ai-image: primary provider", primary);
      imageB64 = await tryProvider(primary);
    } catch (e) {
      firstErr = e;
      console.error("ai-image: primary failed:", primary, e);
    }

    if (!imageB64 && fallback) {
      try {
        console.log("ai-image: trying fallback", fallback);
        imageB64 = await tryProvider(fallback);
      } catch (e2) {
        console.error("ai-image: fallback failed:", fallback, e2);
      }
    }

    if (!imageB64) {
      return json(
        { error: "generation_failed", details: String((firstErr as any)?.message || firstErr || "unknown") },
        502
      );
    }

    return json({ image_base64: imageB64 }, 200);
  } catch (err) {
    console.error("ai-image: server error", err);
    return json({ error: "server_error", details: String((err as any)?.message || err) }, 500);
  }
});
TS
