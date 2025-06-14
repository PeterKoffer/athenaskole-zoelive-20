
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("[ElevenLabs] Function invoked at", new Date().toISOString());
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST supported" }), {
        status: 405,
        headers: corsHeaders,
      });
    }
    if (!ELEVENLABS_API_KEY) {
      console.error("[ElevenLabs] API KEY IS MISSING.");
      return new Response(JSON.stringify({ error: "Missing ElevenLabs API KEY in server environment." }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const payload = await req.json();
    const type = payload.type || "";

    if (type === "check-availability") {
      // Check for voices (availability)
      const voicesRes = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": ELEVENLABS_API_KEY }
      });
      const status = voicesRes.status;
      let body = null;
      try {
        body = await voicesRes.json();
      } catch (e) {
        console.error("[ElevenLabs] Failed to parse ElevenLabs voices response", e);
        return new Response(JSON.stringify({ error: "Failed to parse ElevenLabs voices response" }), {
          status: 502,
          headers: corsHeaders,
        });
      }
      if (!voicesRes.ok) {
        return new Response(JSON.stringify({ error: body?.detail?.message || "Could not fetch voices" }), {
          status,
          headers: corsHeaders,
        });
      }
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "generate-speech") {
      const { text, voiceId, model } = payload;
      if (!text || !voiceId || !model) {
        return new Response(JSON.stringify({ error: "Missing required params" }), { status: 400, headers: corsHeaders });
      }
      // Generate speech from text
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
        } catch (err) {
          errorMsg = "Could not parse error body";
        }
        return new Response(JSON.stringify({ error: errorMsg }), { status: ttsRes.status, headers: corsHeaders });
      }

      const audioBuffer = await ttsRes.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      return new Response(JSON.stringify({ audioContent: base64Audio }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Unknown type
    return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400, headers: corsHeaders });

  } catch (e) {
    // Always use a plain error string, never a circular structure
    const errMsg = e instanceof Error ? e.message : "Proxy error";
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
