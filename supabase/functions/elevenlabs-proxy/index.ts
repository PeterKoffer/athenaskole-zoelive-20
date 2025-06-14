
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST supported" }), { status: 405, headers: corsHeaders });
    }
    const payload = await req.json();
    const type = payload.type || "";

    if (type === "check-availability") {
      const voicesRes = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": ELEVENLABS_API_KEY },
      });
      const status = voicesRes.status;
      const body = await voicesRes.text();
      return new Response(body, {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (type === "generate-speech") {
      const { text, voiceId, model } = payload;
      if (!text || !voiceId || !model) {
        return new Response(JSON.stringify({ error: "Missing required params" }), { status: 400, headers: corsHeaders });
      }
      const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      });
      if (!ttsRes.ok) {
        let errorMsg = "Unknown error";
        try {
          const errData = await ttsRes.json();
          errorMsg = errData?.detail?.message || JSON.stringify(errData);
        } catch { }
        return new Response(JSON.stringify({ error: errorMsg }), { status: ttsRes.status, headers: corsHeaders });
      }
      const audioBuffer = await ttsRes.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      return new Response(JSON.stringify({ audioContent: base64Audio }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Proxy error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
