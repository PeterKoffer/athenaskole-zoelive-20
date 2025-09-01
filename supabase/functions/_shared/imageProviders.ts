// supabase/functions/_shared/imageProviders.ts
// BFL adapter: submit + poll til "Ready", returnér endelig billed-URL

type BflSubmitResponse = {
  id?: string;
  polling_url?: string;
  // ...andre felter
};

type BflPollResponse = {
  status?: "Queued" | "Processing" | "Ready" | "Error" | "Failed";
  result?: { sample?: string };
  error?: unknown;
};

export async function bflGenerateImage(args: {
  prompt: string;
  width?: number;
  height?: number;
  apiKey: string;
  // valgfrit
  seed?: number;
  promptUpsampling?: boolean;
  outputFormat?: "jpeg" | "png";
  safetyTolerance?: number; // 0..6
}): Promise<{ url: string; raw: unknown }> {
  const base = (Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai").replace(/\/+$/, "");
  const model = (Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1").replace(/^\/+|\/+$/g, "");
  const submitUrl = `${base}/v1/${model}`;

  const body: Record<string, unknown> = {
    prompt: args.prompt,
    width: args.width ?? 1024,
    height: args.height ?? 1024,
  };

  if (args.seed !== undefined) body.seed = args.seed;
  if (args.promptUpsampling !== undefined) body.prompt_upsampling = args.promptUpsampling;
  if (args.outputFormat) body.output_format = args.outputFormat;
  if (args.safetyTolerance !== undefined) body.safety_tolerance = args.safetyTolerance;

  // 1) Submit
  const submitRes = await fetch(submitUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // VIGTIGT: BFL bruger x-key, ikke Authorization
      "x-key": args.apiKey,
      "accept": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!submitRes.ok) {
    const txt = await safeText(submitRes);
    throw new Error(`BFL submit ${submitRes.status}: ${txt}`);
  }
  const submitJson = (await safeJson<BflSubmitResponse>(submitRes)) ?? {};
  const pollingUrl = submitJson.polling_url;
  if (!pollingUrl) throw new Error("BFL submit: mangler polling_url i svaret");

  // 2) Poll
  const pollMs = toNumber(Deno.env.get("BFL_POLL_MS"), 800);
  const timeoutMs = toNumber(Deno.env.get("BFL_TIMEOUT_MS"), 60000);
  const abort = AbortSignal.timeout(timeoutMs);

  while (true) {
    await delay(pollMs, abort);

    const pollRes = await fetch(pollingUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "x-key": args.apiKey,
      },
      signal: abort,
    });

    if (!pollRes.ok) {
      const txt = await safeText(pollRes);
      throw new Error(`BFL poll ${pollRes.status}: ${txt}`);
    }

    const pollJson = (await safeJson<BflPollResponse>(pollRes)) ?? {};
    const status = pollJson.status;

    if (status === "Ready") {
      const url = pollJson.result?.sample;
      if (!url || !/^https?:\/\//i.test(url)) {
        throw new Error("BFL poll: mangler gyldig result.sample URL");
      }
      return { url, raw: pollJson };
    }

    if (status === "Error" || status === "Failed") {
      throw new Error(`BFL job fejlede: ${JSON.stringify(pollJson)}`);
    }

    // ellers: "Queued"/"Processing" → fortsæt
  }
}

// Hjælpere
function toNumber(v: string | undefined | null, def: number) {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : def;
}

async function safeText(r: Response) {
  try {
    return await r.text();
  } catch {
    return "";
  }
}

async function safeJson<T = unknown>(r: Response): Promise<T | null> {
  try {
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
