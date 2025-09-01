// supabase/functions/_shared/imageProviders.ts
export type BflArgs = {
  prompt: string;
  width?: number;
  height?: number;
  apiKey: string;
  negativePrompt?: string;
  seed?: number;
  cfgScale?: number;
  steps?: number;
  timeoutMs?: number;
};

function candidateEndpoints(): string[] {
  const fromEnv = Deno.env.get("BFL_API_URL");
  const defaults = [
    "https://api.bfl.ai/v1/images",
    "https://api.bfl.ai/v1/image",
    "https://api.bfl.ai/v1/text-to-image",
    "https://api.bfl.ai/v1/generate",
  ];
  return [fromEnv, ...defaults].filter(Boolean) as string[];
}

export async function bflGenerateImage(args: BflArgs): Promise<{ url: string; raw: unknown, endpoint: string }> {
  const body: Record<string, unknown> = {
    prompt: args.prompt,
    width: args.width ?? 1024,
    height: args.height ?? 576,
  };
  if (args.negativePrompt) body.negative_prompt = args.negativePrompt;
  if (args.seed !== undefined) body.seed = args.seed;
  if (args.cfgScale !== undefined) body.cfg_scale = args.cfgScale;
  if (args.steps !== undefined) body.steps = args.steps;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), args.timeoutMs ?? 60000);

  const errors: string[] = [];
  try {
    for (const endpoint of candidateEndpoints()) {
      try {
        const res = await fetch(endpoint, {
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
          errors.push(`${endpoint} -> ${res.status} ${txt}`);
          continue; // prøv næste kandidat
        }

        const json: any = await res.json().catch(() => ({}));
        const candidates: unknown[] = [
          json?.url,
          json?.image?.url,
          ...(Array.isArray(json?.data) ? json.data.map((x: any) => x?.url) : []),
          ...(Array.isArray(json?.output) ? json.output : []),
          ...(Array.isArray(json?.images) ? json.images.map((x: any) => x?.url ?? x) : []),
        ].filter(Boolean);

        const url = String(candidates[0] ?? "");
        if (!url || !/^https?:\/\//i.test(url)) {
          errors.push(`${endpoint} -> 200 OK men ingen URL i respons`);
          continue;
        }

        return { url, raw: json, endpoint };
      } catch (e: any) {
        errors.push(`${endpoint} -> ${e?.message ?? e}`);
      }
    }

    throw new Error(`BFL endpoints exhausted:\n${errors.join("\n")}`);
  } finally {
    clearTimeout(timeout);
  }
}
