// supabase/functions/_shared/imageProviders.ts

export interface BflGenerateArgs {
  apiKey: string;
  /**
   * Optional full endpoint, e.g. https://api.bfl.ai/v1/flux-pro-1.1
   * If omitted, defaults to `${BFL_API_BASE}/v1/${BFL_MODEL}`.
   */
  endpoint?: string;
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
  cfgScale?: number;
  steps?: number;
}

export async function bflGenerateImageInline(
  args: Required<Pick<BflGenerateArgs, "apiKey" | "endpoint" | "prompt">> &
    Omit<BflGenerateArgs, "apiKey" | "endpoint" | "prompt">
): Promise<{ url: string; raw: unknown }> {
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

export async function bflGenerateImage(
  args: BflGenerateArgs
): Promise<{ url: string; raw: unknown }> {
  const base = Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai";
  const model = Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1";
  const endpoint = args.endpoint ?? `${base}/v1/${model}`;

  return bflGenerateImageInline({ ...args, endpoint });
}

