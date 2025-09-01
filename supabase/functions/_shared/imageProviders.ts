mkdir -p supabase/functions/_shared
cat > supabase/functions/_shared/imageProviders.ts <<'TS'
// supabase/functions/_shared/imageProviders.ts

export async function bflGenerateImageInline(args: {
  apiKey: string;
  endpoint: string; // fx https://api.bfl.ai/v1/flux-pro-1.1
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
  cfgScale?: number;
  steps?: number;
}): Promise<{ url: string; raw: unknown }> {
  const timeoutMs = Number(Deno.env.get("BFL_TIMEOUT_MS") ?? 60_000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body: Record<string, unknown> = {
      prompt: args.prompt,
      width: args.width ?? 1024,
      height: args.height ?? 576,
    };
    if (args.negativePrompt) body.negative_prompt = args.negativePrompt;
    if (typeof args.seed === "number") body.seed = args.seed;
    if (typeof args.cfgScale === "number") body.cfg_scale = args.cfgScale;
    if (typeof args.steps === "number") body.steps = args.steps;

    const res = await fetch(args.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${args.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`BFL ${res.status}: ${txt || res.statusText}`);
    }
    const json = await res.json();

    const candidates: unknown[] = [
      json?.url,
      json?.image?.url,
      ...(Array.isArray(json?.data) ? json.data.map((x: any) => x?.url) : []),
      ...(Array.isArray(json?.output) ? json.output : []),
      ...(Array.isArray(json?.images) ? json.images.map((x: any) => x?.url ?? x) : []),
    ].filter(Boolean);

    const url = String(candidates[0] ?? "");
    if (!url || !/^https?:\/\//i.test(url)) {
      throw new Error("BFL response: missing image URL");
    }

    return { url, raw: json };
  } finally {
    clearTimeout(timeout);
  }
}
TS
