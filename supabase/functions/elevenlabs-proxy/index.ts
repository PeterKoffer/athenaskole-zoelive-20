
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-elevenlabs-key",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Use the hardcoded API key directly - no JWT validation needed
const ELEVENLABS_API_KEY = "sk_37e2751a30d9fcb1c276898281def78f92a285a2223b1b51";

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
  console.log("[Function] Invoked at", new Date().toISOString());

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST supported" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    const action = payload.action || "";
    console.log(`[Function] Processing action: ${action}`);

    if (action === "get-openai-key") {
      const apiKey = Deno.env.get("OPENAI_API_KEY");
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ apiKey }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate-speech") {
      const { text, voiceId, model } = payload;
      
      if (!text || !voiceId || !model) {
        return new Response(JSON.stringify({ error: "Missing required params: text, voiceId, model" }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      console.log(`[ElevenLabs] Generating speech for: "${text.substring(0,50)}..." with voice: ${voiceId}`);

      try {
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
            error: `TTS generation failed: ${ttsRes.status}`,
            details: errorText
          }), { 
            status: 200, // Return 200 so client can handle gracefully
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const audioBuffer = await ttsRes.arrayBuffer();
        console.log(`[ElevenLabs] Generated audio: ${audioBuffer.byteLength} bytes`);

        if (audioBuffer.byteLength === 0) {
          return new Response(JSON.stringify({ error: "Empty audio buffer received" }), { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const base64Audio = encodeBase64Chunked(audioBuffer);
        console.log(`[ElevenLabs] Encoded to base64: ${base64Audio.length} chars`);

        return new Response(JSON.stringify({ audioContent: base64Audio }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("[ElevenLabs] TTS generation exception:", error);
        return new Response(JSON.stringify({ 
          error: "TTS generation failed with exception",
          details: error.message
        }), { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({ error: "Unknown request type: " + type }), { 
      status: 400, 
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[ElevenLabs] Exception:", errMsg);
    return new Response(JSON.stringify({ 
      error: "Server error", 
      details: errMsg 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
