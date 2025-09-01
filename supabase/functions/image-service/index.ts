cat > supabase/functions/image-service/index.ts <<'EOF'
/**
 * image-service (BFL inline)
 * - x-key header (ikke Authorization)
 * - model-endpoint: /v1/<model> (fx flux-pro-1.1)
 * - submit -> poll -> returnér result.sample URL
 */
import { ok, bad, handleOptions } from "../_shared/http.ts";

type SubmitResp = { polling_url?: string };
type PollResp = {
  status?: "Queued" | "Processing" | "Ready" | "Error" | "Failed";
  result?: { sample?: string };
  error?: unknown;
};

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  let body: any; try { body = await req.json(); } catch { return bad("Invalid JSON body", 400); }

  const apiKey = Deno.env.get("BFL_API_KEY"); if (!apiKey) return bad("Missing BFL_API_KEY", 500);
  const base  = (Deno.env.get("BFL_API_BASE") ?? "https://api.bfl.ai").replace(/\/+$/, "");
  const model = (Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1").replace(/^\/+|\/+$/g, "");
  const submitUrl = `${base}/v1/${model}`;

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width  = Number(body.width ?? 1024);
  const height = Number(body.height ?? 1024);

  try {
    // 1) Submit
    const submitRes = await fetch(submitUrl, {
      method: "POST",
      headers: { "content-type": "application/json", "x-key": apiKey, "accept": "application/json" },
      body: JSON.stringify({ prompt, width, height }),
    });
    if (!submitRes.ok) {
      const txt = await submitRes.text().catch(() => "");
      return bad(`BFL submit ${submitRes.status}: ${txt}`, 502);
    }
    const submitJson = (await submitRes.json().catch(() => ({}))) as SubmitResp;
    if (!submitJson?.polling_url) return bad("BFL submit: missing polling_url", 502);

    // 2) Poll
    const pollMs = toNumber(Deno.env.get("BFL_POLL_MS"), 800);
    const timeoutMs = toNumber(Deno.env.get("BFL_TIMEOUT_MS"), 60000);
    const abort = AbortSignal.timeout(timeoutMs);

    while (true) {
      await delay(pollMs, abort);
      const pollRes = await fetch(submitJson.polling_url, {
        headers: { "x-key": apiKey, "accept": "application/json" }, signal: abort
      });
      if (!pollRes.ok) {
        const txt = await pollRes.text().catch(() => "");
        return bad(`BFL poll ${pollRes.status}: ${txt}`, 502);
      }
      const pollJson = (await pollRes.json().catch(() => ({}))) as PollResp;
      if (pollJson.status === "Ready") {
        const url = pollJson.result?.sample;
        if (!url || !/^https?:\/\//i.test(url)) return bad("BFL poll: invalid result.sample URL", 502);
        return ok({ impl: "bfl-inline-v1", endpoint: submitUrl, url, width, height });
      }
      if (pollJson.status === "Error" || pollJson.status === "Failed") {
        return bad(`BFL job failed: ${JSON.stringify(pollJson)}`, 502);
      }
      // ellers: Queued/Processing → fortsæt
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return bad(msg, 502);
  }
});

function toNumber(v: string | undefined | null, def: number) {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : def;
}
function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(id); reject(new DOMException("Aborted", "AbortError")); });
  });
}
EOF
