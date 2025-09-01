// supabase/functions/_shared/imageProviders.ts
export async function bflGenerateImage(args: {
  prompt: string;
  width?: number;
  height?: number;
  apiKey: string;
  // valgfrit:
  negativePrompt?: string;
  seed?: number;
  cfgScale?: number;
  steps?: number;
}): Promise<{ url: string; raw: unknown }> {
  const endpoint =
    Deno.env.get("BFL_API_URL") ??
    // Sæt evt. præcis endpoint i env; dette er en fornuftig default.
    "https://api.bfl.ai/v1/images";

  const body: Record<string, unknown> = {
    prompt: args.prompt,
    width: args.width ?? 1024,
    height: args.height ?? 576,
  };
  if (args.negativePrompt) body.negative_prompt = args.negativePrompt;
  if (args.seed !== undefined) body.seed = args.seed;
  if (args.cfgScale !== undefined) body.cfg_scale = args.cfgScale;
  if (args.steps !== undefined) body.steps = args.steps;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${args.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`BFL ${res.status} ${txt}`.trim());
  }

  const json = await res.json().catch(() => ({}));

  // Prøv almindelige felter (tilpas let hvis jeres BFL-respons ser anderledes ud)
  const url =
    (json?.data?.[0]?.url as string | undefined) ??
    (json?.output?.[0] as string | undefined) ??
    (json?.url as string | undefined);

  if (!url) throw new Error("BFL response: missing image URL");

  return { url, raw: json };
}
