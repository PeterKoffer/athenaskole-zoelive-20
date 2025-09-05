// src/lib/ai.ts
// Minimal, vendor-neutral helpers for your Edge Functions.
// Usage:
//   const text = await aiText({ prompt: "Grade 4 math warmup" });
//   const img  = await aiImage({ prompt: "cartoon cat reading a book", size: "1024x1024" });

const FN_BASE = import.meta.env.VITE_FUNCTIONS_URL?.replace(/\/+$/, "") || "";

export type AiTextRequest = {
  prompt: string;
  orgId?: string;
  mode?: "cheap" | "normal";
  // future: subject, grade, etc. can be added and the function will pass them through
};

export type AiTextResponse = {
  output: string;
  model?: string;
  usage?: unknown;
  cost_est_usd?: number;
};

export async function aiText(req: AiTextRequest): Promise<AiTextResponse> {
  if (!FN_BASE) throw new Error("VITE_FUNCTIONS_URL is not set");
  const res = await fetch(`${FN_BASE}/ai-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.details || data?.message || data?.error || "ai-text failed";
    throw new Error(String(msg));
  }

  // Edge function returns { output, model, usage, cost_est_usd, ... }
  return {
    output: data.output ?? "",
    model: data.model,
    usage: data.usage,
    cost_est_usd: data.cost_est_usd,
  };
}

// ---- Images ----

export type AiImageRequest = {
  prompt: string;
  // OpenAI valid sizes: "1024x1024" | "1024x1536" | "1536x1024" | "auto"
  // NOTE: Our Edge function already normalizes old sizes like "512x512" -> "1024x1024".
  size?: string;
  // OR provide aspect_ratio ("1:1" | "16:9" | "9:16"), the Edge function will convert.
  aspect_ratio?: string;
  // Free placeholder (no-cost) if you want to avoid API usage for this call:
  mode?: "cheap" | "normal";
};

export type AiImageResponse = {
  src: string; // data: URL (b64) or remote URL — always something you can put in <img src=...>
  base64?: string;
  url?: string;
};

export async function aiImage(req: AiImageRequest): Promise<AiImageResponse> {
  if (!FN_BASE) throw new Error("VITE_FUNCTIONS_URL is not set");
  const res = await fetch(`${FN_BASE}/ai-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.details || data?.message || data?.error || "ai-image failed";
    throw new Error(String(msg));
  }

  // Edge returns either base64 or a hosted URL; normalize to a single 'src'
  if (data.image_base64 && typeof data.image_base64 === "string") {
    return { src: `data:image/png;base64,${data.image_base64}`, base64: data.image_base64 };
  }
  if (data.image_url && typeof data.image_url === "string") {
    return { src: data.image_url, url: data.image_url };
  }
  throw new Error("ai-image: no image returned");
}
