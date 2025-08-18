// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// ---------- CORS ----------
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info, x-supabase-authorization",
  "Content-Type": "application/json",
} as const;

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: CORS });

// ---------- Supabase (Service Role for Storage writes) ----------
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// ---------- Helpers ----------
const getStoragePublicUrl = (path: string) => {
  const { data } = supabase.storage
    .from("universe-images")
    .getPublicUrl(path);
  return data.publicUrl;
};

function withTimeout<T>(p: Promise<T>, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort("timeout"), ms);
  return Promise.race([
    p, 
    new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))
  ]).finally(() => clearTimeout(t));
}

// Hash function for prompt deduplication
async function hashPrompt(universeId: string, lang: string, prompt: string, size: string): Promise<string> {
  const text = `${universeId}|${lang}|${prompt}|${size}`;
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

const b64ToBytes = (b64: string) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

async function fetchBytes(url: string): Promise<Uint8Array> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download failed: ${r.status}`);
  const buf = new Uint8Array(await r.arrayBuffer());
  return buf;
}

// ---------- Providers ----------
async function genWithOpenAI(prompt: string, w: number, h: number) {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) throw new Error("OPENAI_API_KEY missing");
  
  // OpenAI gpt-image-1 only supports specific sizes
  const allowed = new Set(["1024x1024", "1024x1536", "1536x1024"]);
  let size = `${w}x${h}`;
  if (!allowed.has(size)) size = "1024x1024";
  
  const resp = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size,
    }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`OpenAI API error: ${resp.status} - ${errorText}`);
  }

  const data = await resp.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image");
  return b64ToBytes(b64);
}

// ---- helpers ----
function firstImageRef(val: any): { kind: "url" | "dataurl"; value: string } | null {
  const seen = new Set<any>();
  const stack = [val];
  const isHttp = (s: string) => /^https?:\/\//i.test(s);
  const isData = (s: string) => /^data:image\/[a-zA-Z+]+;base64,/i.test(s);

  while (stack.length) {
    const cur = stack.pop();
    if (!cur || seen.has(cur)) continue;
    seen.add(cur);

    if (typeof cur === "string") {
      if (isHttp(cur)) return { kind: "url", value: cur };
      if (isData(cur)) return { kind: "dataurl", value: cur };
    } else if (Array.isArray(cur)) {
      for (const item of cur) stack.push(item);
    } else if (typeof cur === "object") {
      for (const v of Object.values(cur)) stack.push(v);
    }
  }
  return null;
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const b64 = dataUrl.split(",", 2)[1] ?? "";
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

async function genWithReplicate(
  prompt: string,
  w: number,
  h: number,
  replicateInput?: Record<string, unknown>
) {
  const token = Deno.env.get("REPLICATE_API_TOKEN");
  const version = Deno.env.get("REPLICATE_VERSION");
  if (!token) throw new Error("REPLICATE_API_TOKEN missing");
  if (!version) throw new Error("REPLICATE_VERSION missing");

  // Build input: for ComfyUI workflows, you can pass whatever the model expects.
  // If you provided replicateInput in the request, we pass it straight through.
  // Otherwise fall back to a simple shape some models accept (prompt/width/height).
  const input =
    replicateInput && Object.keys(replicateInput).length
      ? replicateInput
      : { prompt, width: w, height: h };

  // 1) Start prediction
  const start = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ version, input }),
  }).then(r => r.json());

  if (start.error) {
    throw new Error(`Replicate start error: ${start.error?.message || start.error}`);
  }

  // 2) Poll for completion
  let pred = start;
  const t0 = Date.now();
  while (true) {
    if (pred.status === "succeeded") break;
    if (pred.status === "failed" || pred.status === "canceled") {
      throw new Error(`Replicate ${pred.status}: ${pred.error || "unknown"}`);
    }
    if (Date.now() - t0 > 120000) throw new Error("Replicate timeout");
    await new Promise(r => setTimeout(r, 1200));
    pred = await fetch(`https://api.replicate.com/v1/predictions/${start.id}`, {
      headers: { Authorization: `Token ${token}` },
    }).then(r => r.json());
  }

  // 3) Extract first image reference (URL or data URL) from pred.output
  const ref = firstImageRef(pred.output);
  if (!ref) {
    // Helpful for one-off debugging: enable only temporarily
    // console.log("Replicate full output (sanitized):", JSON.stringify(pred.output).slice(0, 2000));
    throw new Error(`Replicate output missing image URL or data URL`);
  }

  if (ref.kind === "url") {
    const r = await fetch(ref.value);
    if (!r.ok) throw new Error(`download failed: ${r.status}`);
    return new Uint8Array(await r.arrayBuffer());
  } else {
    // data:image/...;base64,...
    return dataUrlToBytes(ref.value);
  }
}

async function genWithFal(prompt: string, w: number, h: number) {
  const key = Deno.env.get("FAL_KEY");
  const modelPath = Deno.env.get("FAL_MODEL"); // e.g. "fal-ai/flux/schnell" from your fal.ai dashboard
  if (!key) throw new Error("FAL_KEY missing");
  if (!modelPath) throw new Error("FAL_MODEL missing");
  // Typical fal run endpoint pattern:
  const runUrl = `https://api.fal.ai/v1/run/${modelPath}`;
  const r = await fetch(runUrl, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt,
        size: { width: w, height: h },
      },
    }),
  }).then((x) => x.json());

  // fal responses usually include an image URL in output(s)
  const out =
    r?.image?.url ||
    r?.images?.[0]?.url ||
    r?.output?.[0]?.url ||
    r?.output?.image?.url;

  if (!out) throw new Error(`fal response missing image url: ${JSON.stringify(r)}`);
  return await fetchBytes(out);
}

// Placeholder until we have exact DeepSeek Janus endpoint
async function genWithDeepSeek(_prompt: string, _w: number, _h: number) {
  throw new Error("DeepSeek Janus provider requires endpoint details (base URL, headers, and response shape).");
}

// ---------- Main ----------
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const started = Date.now();

  try {
    const {
      universeId,
      imagePrompt,
      lang = "en",
      width = Number(Deno.env.get("IMAGE_WIDTH") ?? 1024),
      height = Number(Deno.env.get("IMAGE_HEIGHT") ?? 1024),
      force = false,
      replicateInput = {},
    } = (await req.json().catch(() => ({}))) as {
      universeId?: string;
      imagePrompt?: string;
      lang?: string;
      width?: number;
      height?: number;
      force?: boolean;
      replicateInput?: Record<string, unknown>;
    };

    if (!universeId) return json({ success: false, error: "universeId required" }, 400);

    // Feature flag: disable AI generation if needed
    const ENABLE_AI_IMAGES = Deno.env.get("ENABLE_AI_IMAGES") !== "false";
    if (!ENABLE_AI_IMAGES) {
      const { data } = supabase.storage
        .from("universe-images")
        .getPublicUrl(`${universeId}.png`);
      return json({
        success: true,
        imageUrl: data.publicUrl,
        from: "disabled",
        provider: "none",
        cached: true,
        isAI: false,
        duration_ms: Date.now() - started,
      });
    }

    const placeholderUrl = getStoragePublicUrl(`${universeId}.png`);
    
    // Ensure valid size for OpenAI
    const allowed = new Set(["1024x1024", "1024x1536", "1536x1024"]);
    let size = `${width}x${height}`;
    if (!allowed.has(size)) size = "1024x1024";

    const provider = (Deno.env.get("IMAGE_PROVIDER") ?? "replicate").toLowerCase();
    console.log(`🔍 IMAGE_PROVIDER env var: "${Deno.env.get("IMAGE_PROVIDER")}" -> using provider: "${provider}"`);
    const prompt = imagePrompt?.trim() || "Kid-friendly classroom illustration, bright, high-contrast, simple shapes";
    
    // Generate hash for prompt deduplication
    const promptHash = await hashPrompt(universeId, lang, prompt, size);

    // Optional: clear cache/object (safe try/catch)
    if (force) {
      try {
        await supabase.from("universe_images").delete().eq("universe_id", universeId).eq("lang", lang);
      } catch { /* noop */ }
      try {
        await supabase.storage.from("universe-images").remove([`${universeId}.png`]);
      } catch { /* noop */ }
    }

    // Cache-first: Check if image already exists
    if (!force) {
      try {
        const { data: headResponse } = await supabase.storage
          .from("universe-images")
          .list("", { search: `${universeId}.png` });
        
        if (headResponse && headResponse.length > 0) {
          console.log(`✅ Cache hit for ${universeId}`);
          return json({
            success: true,
            imageUrl: placeholderUrl,
            from: "cache",
            provider,
            cached: true,
            isAI: true,
            duration_ms: Date.now() - started,
          });
        }
      } catch {
        // Continue to generation if cache check fails
      }
    }

    let bytes: Uint8Array | null = null;

    try {
      console.log(`🎨 Generating image for ${universeId} with ${provider}`);
      const t0 = Date.now();
      
      // Apply timeout to prevent hanging
      if (provider === "openai") {
        bytes = await withTimeout(genWithOpenAI(prompt, width, height), 10000);
      } else if (provider === "replicate") {
        bytes = await withTimeout(genWithReplicate(prompt, width, height, replicateInput), 30000);
      } else if (provider === "fal") {
        bytes = await withTimeout(genWithFal(prompt, width, height), 15000);
      } else if (provider === "deepseek") {
        bytes = await withTimeout(genWithDeepSeek(prompt, width, height), 10000);
      } else {
        throw new Error(`Unknown IMAGE_PROVIDER: ${provider}`);
      }
      
      const t1 = Date.now();
      console.log(`✅ Image generated in ${t1 - t0}ms`);
      
      // Upload timing
      const uploadStart = Date.now();
      await supabase.storage
        .from("universe-images")
        .upload(`${universeId}.png`, bytes!, {
          contentType: "image/png",
          upsert: true,
          cacheControl: "604800",
        });
      const uploadEnd = Date.now();
      console.log(`📤 Upload completed in ${uploadEnd - uploadStart}ms`);
    } catch (e: any) {
      const msg = e?.message || String(e);
      // Special case: OpenAI org not verified (should be solved now, but keep it)
      if (msg.toLowerCase().includes("must be verified")) {
        return json({
          success: true,
          imageUrl: placeholderUrl,
          from: "locked",
          provider,
          reason: "openai_org_unverified",
          cached: false,
          isAI: false,
          duration_ms: Date.now() - started,
        });
      }
      // Provider misconfiguration or runtime error
      return json({
        success: true,
        imageUrl: placeholderUrl,
        from: "fallback",
        provider,
        reason: msg,
        cached: false,
        isAI: false,
        duration_ms: Date.now() - started,
      });
    }

    const imageUrl = getStoragePublicUrl(`${universeId}.png`);

    // Optional: update DB flags (best-effort)
    try {
      await supabase
        .from("universes")
        .update({ image_url: imageUrl, image_status: "ready" })
        .eq("id", universeId);
    } catch {
      /* noop */
    }

    return json({
      success: true,
      imageUrl,
      from: "ai",
      provider,
      cached: false,
      isAI: true,
      duration_ms: Date.now() - started,
    });
  } catch (err: any) {
    const reason =
      err?.response?.data?.error?.message ||
      err?.message ||
      "unknown";
    return json({ success: true, imageUrl: null, from: "fallback", reason }, 200);
  }
});
