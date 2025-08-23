// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
};

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...cors, ...(init.headers || {}) },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method Not Allowed" }, { status: 405 });

  try {
    const body = await req.json().catch(() => ({}));

    // Bagudkompatibel: brug {userPrompt} eller {prompt}
    const rawUser =
      typeof body?.userPrompt === "string" ? body.userPrompt :
      typeof body?.prompt === "string"     ? body.prompt     : "";

    const rawSystem =
      typeof body?.systemPrompt === "string" ? body.systemPrompt :
      (Deno.env.get("OPENAI_SYSTEM_PROMPT") || "");

    const userPrompt   = rawUser.trim();
    const systemPrompt = rawSystem.trim();

    if (!userPrompt) {
      return json({ error: "Missing prompt: send {prompt: string} eller {userPrompt: string}" }, { status: 400 });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) return json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });

    const model       = (typeof body?.model === "string" && body.model) || Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
    const temperature = typeof body?.temperature === "number" ? Math.min(Math.max(body.temperature, 0), 1) : 0.4;
    const max_tokens  = typeof body?.max_tokens === "number" ? body.max_tokens : 800;

    const messages: Array<{ role: "system" | "user"; content: string }> = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt }); // kun hvis ikke tom
    messages.push({ role: "user", content: userPrompt });

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, temperature, max_tokens }),
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: `OpenAI API error: ${r.status}`, details: j }, { status: 500 });

    const content = j?.choices?.[0]?.message?.content ?? "";
    return json({ ok: true, model, content, usage: j?.usage ?? null, id: j?.id ?? null });
  } catch (e) {
    console.error(e);
    return json({ error: String(e?.message || e), stack: e?.stack || null }, { status: 500 });
  }
});
