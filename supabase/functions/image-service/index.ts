// Edge Function: image-service
// Routes:
//   GET  /health
//   POST /generate   body: { kind?: 'daily-program-cover', universeId: string, gradeRaw: string|number, prompt: string }
//
// Output:
//   { status: 'generated'|'exists', url, key }  |  { error, stack }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...cors,
      ...init.headers || {}
    }
  });
}
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") return new Response("ok", {
    headers: cors
  });
  const url = new URL(req.url);
  // ---------- HEALTH ----------
  if (req.method === "GET" && url.pathname.endsWith("/health")) {
    const provider = (Deno.env.get("IMAGE_PROVIDER") || "").toLowerCase() || null;
    const hasKey = provider === "replicate" && !!Deno.env.get("REPLICATE_API_TOKEN") || provider === "openai" && !!Deno.env.get("OPENAI_API_KEY") || false;
    return json({
      ok: !!provider && hasKey && !!Deno.env.get("SUPABASE_URL") && !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      provider,
      hasProviderKey: hasKey,
      envOk: !!Deno.env.get("SUPABASE_URL") && !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    });
  }
  // ---------- GENERATE ----------
  if (req.method === "POST" && url.pathname.endsWith("/generate")) {
    try {
      const { universeId, gradeRaw, prompt } = await req.json();
      if (!universeId || !prompt) return json({
        error: "Missing universeId or prompt"
      }, {
        status: 400
      });
      const grade = String(gradeRaw ?? "").match(/\d+/)?.[0] ?? "0";
      const key = `${universeId}/${grade}/cover.webp`;
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: {
          persistSession: false
        }
      });
      // Fast-path: already exists?
      const existing = await supabase.storage.from("universe-images").list(`${universeId}/${grade}`, {
        search: "cover.webp"
      });
      if (!existing.error && existing.data?.some((f)=>f.name === "cover.webp")) {
        const url = supabase.storage.from("universe-images").getPublicUrl(key).data.publicUrl;
        return json({
          status: "exists",
          url,
          key
        });
      }
      // Choose provider
      const provider = (Deno.env.get("IMAGE_PROVIDER") || "replicate").toLowerCase();
      let imageArrayBuffer;
      if (provider === "replicate") {
        const token = Deno.env.get("REPLICATE_API_TOKEN");
        if (!token) throw new Error("Missing REPLICATE_API_TOKEN");
        // Create prediction (use model:, not version hash)
        const start = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "black-forest-labs/flux-1.1-pro",
            input: {
              prompt,
              width: 1024,
              height: 576,
              output_format: "webp"
            }
          })
        });
        if (!start.ok) throw new Error(`Replicate create failed: ${await start.text()}`);
        const created = await start.json();
        // Poll for completion
        const pollUrl = created?.urls?.get;
        const headers = {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        };
        let outputUrl = null;
        for(let i = 0; i < 40; i++){
          const r = await fetch(pollUrl, {
            headers
          });
          const j = await r.json();
          if (j.status === "succeeded") {
            const out = j.output;
            outputUrl = Array.isArray(out) ? out[0] : out;
            break;
          }
          if (j.status === "failed" || j.status === "canceled") {
            throw new Error(`Replicate ${j.status}: ${j.error || "unknown error"}`);
          }
          await new Promise((res)=>setTimeout(res, 1000));
        }
        if (!outputUrl) throw new Error("No output URL from provider.");
        const img = await fetch(outputUrl);
        if (!img.ok) throw new Error(`Image fetch failed: ${img.status}`);
        imageArrayBuffer = await img.arrayBuffer();
      } else if (provider === "openai") {
        const openaiKey = Deno.env.get("OPENAI_API_KEY");
        if (!openaiKey) throw new Error("Missing OPENAI_API_KEY");
        const r = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-image-1",
            prompt,
            size: "1024x576",
            response_format: "b64_json"
          })
        });
        if (!r.ok) throw new Error(`OpenAI image failed: ${await r.text()}`);
        const j = await r.json();
        const b64 = j?.data?.[0]?.b64_json;
        if (!b64) throw new Error("No image returned.");
        imageArrayBuffer = Uint8Array.from(atob(b64), (c)=>c.charCodeAt(0)).buffer;
      } else {
        throw new Error(`Unknown IMAGE_PROVIDER: ${provider}`);
      }
      // Upload (upsert)
      const up = await supabase.storage.from("universe-images").upload(key, imageArrayBuffer, {
        contentType: "image/webp",
        upsert: true
      });
      if (up.error) throw up.error;
      const publicUrl = supabase.storage.from("universe-images").getPublicUrl(key).data.publicUrl;
      return json({
        status: "generated",
        url: publicUrl,
        key
      });
    } catch (e) {
      console.error(e);
      return json({
        error: String(e?.message || e),
        stack: e?.stack || null
      }, {
        status: 500
      });
    }
  }
  return json({
    error: "Not found"
  }, {
    status: 404
  });
});
