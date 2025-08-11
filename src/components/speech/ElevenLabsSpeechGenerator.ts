
import { EDGE_BASE, DEFAULT_VOICE_SETTINGS } from "./ElevenLabsConfig";
import { AudioResponse, ElevenLabsConfig } from "./ElevenLabsTypes";

export class ElevenLabsSpeechGenerator {
  async generateSpeech(text: string, config: ElevenLabsConfig): Promise<AudioResponse> {
    try {
      console.log(
        "🎤 [ElevenLabsSpeechGenerator] Generating speech with FENA voice for:",
        text.substring(0, 50) + "...",
        "\n🎭 VoiceID:", config.voiceId,
        "\n🎛️ Model:", config.model
      );

      const requestPayload = {
        type: "generate-speech",
        text: text,
        voiceId: config.voiceId,
        model: config.model,
      };
      
      console.log("📤 [ElevenLabsSpeechGenerator] Request payload:", JSON.stringify(requestPayload, null, 2));
      console.log("🔑 [ElevenLabsSpeechGenerator] Making request without authorization header");
      
      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      console.log("📡 [ElevenLabsSpeechGenerator] Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      let rawJson = null;
      try {
        rawJson = await response.json();
      } catch (e) {
        console.error("❌ [ElevenLabsSpeechGenerator] Could not parse response JSON", e);
        throw new Error("Could not parse response JSON from edge function");
      }

      console.log(
        "📥 [ElevenLabsSpeechGenerator] Response data:", {
          status: response.status,
          hasAudioContent: !!rawJson.audioContent,
          audioContentLength: rawJson.audioContent?.length,
          error: rawJson.error
        }
      );

      // Check for errors in response (even with 200 status)
      if (rawJson.error) {
        console.error("❌ [ElevenLabsSpeechGenerator] Speech generation failed:", rawJson.error);
        throw new Error(rawJson.error);
      }

      if (!response.ok || !rawJson.audioContent) {
        console.error("❌ [ElevenLabsSpeechGenerator] Speech generation failed:", rawJson.error || "No audio content");
        throw new Error(rawJson.error || "Unknown TTS error");
      }

      console.log("✅ [ElevenLabsSpeechGenerator] Generated speech successfully");

      return { audioContent: rawJson.audioContent };
    } catch (error) {
      console.error("❌ ElevenLabs speech generation via EDGE failed:", error);
      // Fallback: direct ElevenLabs REST using API key
      try {
        if (!config.apiKey) throw new Error("Missing ElevenLabs API key");
        const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`,{
          method: "POST",
          headers: {
            "xi-api-key": config.apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text,
            model_id: config.model,
            voice_settings: DEFAULT_VOICE_SETTINGS
          })
        });
        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`Direct TTS HTTP ${resp.status}: ${errText}`);
        }
        const buffer = await resp.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
          binary += String.fromCharCode.apply(null, Array.from(chunk) as any);
        }
        const base64 = btoa(binary);
        return { audioContent: base64 };
      } catch (fallbackError) {
        console.error("❌ ElevenLabs direct TTS failed:", fallbackError);
        return {
          audioContent: "",
          error: fallbackError instanceof Error ? fallbackError.message : "Speech generation failed",
        };
      }
    }
  }

}
