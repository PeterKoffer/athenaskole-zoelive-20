
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Extra logging for DEBUG
  console.log("[ElevenLabs] Function invoked at", new Date().toISOString());
  console.log("[ElevenLabs] ELEVENLABS_API_KEY present:", !!ELEVENLABS_API_KEY, "| length:", ELEVENLABS_API_KEY?.length);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST supported" }), { status: 405, headers: corsHeaders });
    }
    const payload = await req.json();
    const type = payload.type || "";

    console.log("[ElevenLabs] Payload received:", JSON.stringify(payload));

    if (type === "check-availability") {
      if (!ELEVENLABS_API_KEY) {
        console.log("[ElevenLabs] API KEY IS MISSING.");
        return new Response(JSON.stringify({ error: "Missing ElevenLabs API KEY in server environment." }), {
          status: 500,
          headers: corsHeaders
        });
      }
      console.log("[ElevenLabs] Checking voices on ElevenLabs...");
      const voicesRes = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": ELEVENLABS_API_KEY },
      });
      let body;
      let status = voicesRes.status;
      try {
        body = await voicesRes.json();
      } catch (e) {
        console.log("[ElevenLabs] Failed to parse ElevenLabs voices response", e);
        return new Response(JSON.stringify({ error: "Failed to parse ElevenLabs voices response" }), {
          status: 502,
          headers: corsHeaders,
        });
      }
      console.log("[ElevenLabs] Voices fetch status:", status, "body:", JSON.stringify(body));

      if (!voicesRes.ok) {
        console.log("[ElevenLabs] Voices fetch error", body);
        return new Response(JSON.stringify({ error: body?.detail?.message || "Could not fetch voices" }), {
          status,
          headers: corsHeaders,
        });
      }
      // Always return a clear JSON structure
      return new Response(JSON.stringify({ voices: body.voices ?? [], ...body }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (type === "generate-speech") {
      const { text, voiceId, model } = payload;
      if (!ELEVENLABS_API_KEY) {
        console.log("[ElevenLabs] API KEY IS MISSING during generate-speech.");
        return new Response(JSON.stringify({ error: "Missing ElevenLabs API KEY in server environment." }), {
          status: 500,
          headers: corsHeaders
        });
      }
      if (!text || !voiceId || !model) {
        console.log("[ElevenLabs] Missing params", { text, voiceId, model });
        return new Response(JSON.stringify({ error: "Missing required params" }), { status: 400, headers: corsHeaders });
      }
      console.log("[ElevenLabs] Generating speech via ElevenLabs API...");

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
          console.log("[ElevenLabs] TTS Generation API error:", errorMsg);
        } catch (err) {
          console.log("[ElevenLabs] TTS Generation API: could not parse error body", err);
        }
        return new Response(JSON.stringify({ error: errorMsg }), { status: ttsRes.status, headers: corsHeaders });
      }
      const audioBuffer = await ttsRes.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      console.log("[ElevenLabs] Speech generated and encoded, sending response");
      return new Response(JSON.stringify({ audioContent: base64Audio }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[ElevenLabs] Unknown type:", type);
    return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400, headers: corsHeaders });
  } catch (e) {
    console.log("[ElevenLabs] Top-level error: ", e?.message || e);
    return new Response(JSON.stringify({ error: e?.message || "Proxy error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

