cat > supabase/functions/image-service/index.ts <<'EOF'
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

  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body", 400); }

  const apiKey = env("BFL_API_KEY", true)!;
  const base   = (env("BFL_API_BASE") ?? "https://api.bfl.ai").replace(/\/+$/, "");
  const model  = (env("BFL_MODEL") ?? "flux-pro-1.1").replace(/^\/+|\/+$/g, "");
  const submitUrl = `${base}/v1/${model}`;

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width  = Number(body.width  ?? 1024);
  const height = Number(body.height ?? 1024);

  console.info("[image-service] submitting to:", submitUrl, "prompt:", prompt, "w/h:", width, height);

  try {
    // 1) Submit til BFL
    const submitRes = await fetch(submitUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-key": apiKey,            // BFL bruger x-key (ikke Authorization)
        "accept": "application/json",
      },
      body: JSON.stringify({ prompt, width, height }),
    });
    if (!submitRes.ok) {
      const txt = await submitRes.text().catch(() => "");
      return bad(`[endpoint=${submitUrl}] BFL submit ${submitRes.status}: ${txt}`, 502);
    }
    const submitJson = (await submitRes.json().catch(() => ({}))) as SubmitResp;
    if (!submitJson?.polling_url) return bad(`[endpoint=${submitUrl}] BFL submit: missing polling_url`, 502);

    // 2) Poll indtil Ready
    const pollMs    = toNumber(env("BFL_POLL_MS"), 800);
    const timeoutMs = toNumber(env("BFL_TIMEOUT_MS"), 60000);
    const abort     = AbortSignal.timeout(timeoutMs);

    while (true) {
      await delay(pollMs, abort);

      const pollRes = await fetch(submitJson.polling_url, {
        method: "GET",
        headers: { "x-key": apiKey, "accept": "application/json" },
        signal: abort,
      });

      if (!pollRes.ok) {
        const txt = await pollRes.text().catch(() => "");
        return bad(`[endpoint=${submitUrl}] BFL poll ${pollRes.status}: ${txt}`, 502);
      }

      const pollJson = (await pollRes.json().catch(() => ({}))) as PollResp;
      const status = pollJson.status;

      if (status === "Ready") {
        const bflUrl = pollJson.result?.sample;
        if (!bflUrl || !/^https?:\/\//i.test(bflUrl)) {
          return bad(`[endpoint=${submitUrl}] BFL poll: invalid result.sample URL`, 502);
        }

        // 3) Upload til Supabase Storage (hvis env er sat)
        const bucket = env("UNIVERSE_IMAGES_BUCKET") ?? "universe-images";
        const projectUrl = env("SUPABASE_URL") ?? env("PROJECT_URL");
        const serviceRole = env("SUPABASE_SERVICE_ROLE_KEY") ?? env("SERVICE_ROLE_KEY");

        let storagePublicUrl: string | null = null;
        if (projectUrl && serviceRole && bucket) {
          try {
            // Hent bytes fra BFL
            const imgRes = await fetch(bflUrl);
            if (!imgRes.ok) throw new Error(`download ${imgRes.status}`);
            const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
            const bytes = new Uint8Array(await imgRes.arrayBuffer());

            // Navngivning
            const d = new Date();
            const y = d.getUTCFullYear();
            const m = String(d.getUTCMonth() + 1).padStart(2, "0");
            const day = String(d.getUTCDate()).padStart(2, "0");
            const ext = contentType.includes("png") ? "png"
              : contentType.includes("webp") ? "webp" : "jpg";
            const objectPath = `bfl/${y}/${m}/${day}/${crypto.randomUUID()}.${ext}`;

            // Upload
            const uploadUrl = `${projectUrl.replace(/\/+$/, "")}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath}`;
            const upRes = await fetch(uploadUrl, {
              method: "POST",
              headers: {
                "authorization": `Bearer ${serviceRole}`,
                "apikey": serviceRole,
                "content-type": contentType,
                "x-upsert": "true",
              },
              body: bytes,
            });
            if (!upRes.ok) {
              const txt = await upRes.text().catch(() => "");
              throw new Error(`storage upload ${upRes.status}: ${txt}`);
            }

            const candidate = `${projectUrl.replace(/\/+$/, "")}/storage/v1/object/public/${encodeURIComponent(bucket)}/${objectPath}`;
            try {
              const head = await fetch(candidate, { method: "HEAD" });
              if (head.ok) storagePublicUrl = candidate;
            } catch { /* ignore */ }
          } catch (e) {
            console.warn("[image-service] storage upload failed:", e);
          }
        }

        return ok({
          impl: "bfl-inline-v1",
          endpoint: submitUrl,
          url: bflUrl,                 // midlertidig BFL-URL (fallback)
          storageUrl: storagePublicUrl, // stabil URL hvis upload lykkes
          width, height,
        });
      }

      if (status === "Error" || status === "Failed") {
        return bad(`[endpoint=${submitUrl}] BFL job failed: ${JSON.stringify(pollJson)}`, 502);
      }
      // Queued/Processing → fortsæt
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return bad(`[endpoint=${submitUrl}] ${msg}`, 502);
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
function env(name: string, required = false): string | undefined {
  const v = Deno.env.get(name);
  if (required && (!v || v.trim() === "")) throw new Error(`Missing env: ${name}`);
  return v ?? undefined;
}
EOF
