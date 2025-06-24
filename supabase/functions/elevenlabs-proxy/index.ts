
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-elevenlabs-key",
};

// Chunked base64 encoding to handle large buffers safely
function encodeBase64Chunked(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 32768; // 32KB chunks
  let result = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    const chunkString = String.fromCharCode(...chunk);
    result += btoa(chunkString);
  }
  
  return result;
}

serve(async (req) => {
  const invocationTime = new Date().toISOString();
  console.log("[ElevenLabs] Function invoked at", invocationTime);

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

    // Get ElevenLabs API key from custom header or use environment variable as fallback
    const clientApiKey = req.headers.get("x-elevenlabs-key");
    const ELEVENLABS_API_KEY = clientApiKey || Deno.env.get("ELEVENLABS_API_KEY");
    
    if (!ELEVENLABS_API_KEY) {
      console.error("[ElevenLabs] API KEY IS MISSING.");
      return new Response(JSON.stringify({ error: "Missing ElevenLabs API KEY." }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const payload = await req.json();
    const type = payload.type || "";
    console.log(`[ElevenLabs] Incoming payload:`, JSON.stringify(payload));

    if (type === "check-availability") {
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
        console.error("[ElevenLabs] Missing required params in generate-speech:", { text, voiceId, model });
        return new Response(JSON.stringify({ error: "Missing required params" }), { status: 400, headers: corsHeaders });
      }
      
      console.log(`[ElevenLabs] Generating speech for text (first 60): "${text.substring(0,60)}..."`);
      console.log(`[ElevenLabs] Using voiceId:`, voiceId, " model:", model);

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
        console.error("[ElevenLabs] TTS request failed:", errorMsg);
        return new Response(JSON.stringify({ error: errorMsg }), { status: ttsRes.status, headers: corsHeaders });
      }

      const audioBuffer = await ttsRes.arrayBuffer();
      console.log(`[ElevenLabs] Received audio buffer of byteLength:`, audioBuffer.byteLength);

      let base64Audio = "";
      if (audioBuffer && audioBuffer.byteLength > 0) {
        try {
          // Use chunked encoding to prevent stack overflow
          base64Audio = encodeBase64Chunked(audioBuffer);
          console.log(`[ElevenLabs] Successfully encoded audio to base64, length:`, base64Audio.length);
        } catch (err) {
          console.error("[ElevenLabs] Error base64 encoding audio:", err);
          return new Response(JSON.stringify({ error: "Failed to encode audio to base64" }), { status: 500, headers: corsHeaders });
        }
      } else {
        console.error("[ElevenLabs] Empty audio buffer received!");
        return new Response(JSON.stringify({ error: "Empty audio buffer received" }), { status: 500, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ audioContent: base64Audio }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.error("[ElevenLabs] Unknown type in payload:", type);
    return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400, headers: corsHeaders });

  } catch (e) {
    const errMsg = e instanceof Error ? e.message : "Proxy error";
    console.error("[ElevenLabs] Exception thrown in handler:", errMsg);
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
