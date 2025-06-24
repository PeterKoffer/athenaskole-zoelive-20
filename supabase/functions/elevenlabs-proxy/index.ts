
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-elevenlabs-key",
};

// Hardcoded ElevenLabs API key for immediate functionality
const HARDCODED_API_KEY = "sk_37e2751a30d9fcb1c276898281def78f92a285a2223b1b51";

function encodeBase64Chunked(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 32768;
  let result = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    const chunkString = String.fromCharCode(...chunk);
    result += btoa(chunkString);
  }
  
  return result;
}

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

    // Use hardcoded API key for immediate functionality
    let apiKey = HARDCODED_API_KEY;
    
    // Also try to get from headers as fallback
    const clientApiKey = req.headers.get("x-elevenlabs-key") || 
                        req.headers.get("authorization")?.replace("Bearer ", "");
    
    if (clientApiKey && clientApiKey.startsWith('sk_')) {
      apiKey = clientApiKey;
      console.log("[ElevenLabs] Using client-provided API key");
    } else {
      console.log("[ElevenLabs] Using hardcoded API key");
    }

    const payload = await req.json();
    const type = payload.type || "";
    console.log(`[ElevenLabs] Processing request type: ${type}`);

    if (type === "check-availability") {
      console.log("[ElevenLabs] Checking ElevenLabs API availability");
      
      const voicesRes = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": apiKey }
      });
      
      if (!voicesRes.ok) {
        const errorText = await voicesRes.text();
        console.error("[ElevenLabs] API error:", voicesRes.status, errorText);
        return new Response(JSON.stringify({ 
          error: `ElevenLabs API error: ${voicesRes.status}` 
        }), {
          status: voicesRes.status,
          headers: corsHeaders,
        });
      }
      
      const voices = await voicesRes.json();
      console.log("[ElevenLabs] Successfully retrieved voices");
      
      return new Response(JSON.stringify(voices), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "generate-speech") {
      const { text, voiceId, model } = payload;
      
      if (!text || !voiceId || !model) {
        return new Response(JSON.stringify({ error: "Missing required params" }), { 
          status: 400, 
          headers: corsHeaders 
        });
      }
      
      console.log(`[ElevenLabs] Generating speech for: "${text.substring(0,50)}..."`);

      const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
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
        const errorText = await ttsRes.text();
        console.error("[ElevenLabs] TTS error:", ttsRes.status, errorText);
        return new Response(JSON.stringify({ 
          error: `TTS generation failed: ${ttsRes.status}` 
        }), { 
          status: ttsRes.status, 
          headers: corsHeaders 
        });
      }

      const audioBuffer = await ttsRes.arrayBuffer();
      console.log(`[ElevenLabs] Generated audio: ${audioBuffer.byteLength} bytes`);

      if (audioBuffer.byteLength === 0) {
        return new Response(JSON.stringify({ error: "Empty audio buffer" }), { 
          status: 500, 
          headers: corsHeaders 
        });
      }

      const base64Audio = encodeBase64Chunked(audioBuffer);
      console.log(`[ElevenLabs] Encoded to base64: ${base64Audio.length} chars`);

      return new Response(JSON.stringify({ audioContent: base64Audio }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Unknown request type" }), { 
      status: 400, 
      headers: corsHeaders 
    });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[ElevenLabs] Exception:", errMsg);
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
