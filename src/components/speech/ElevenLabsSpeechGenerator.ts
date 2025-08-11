
import { EDGE_BASE } from "./ElevenLabsConfig";
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
      console.error("❌ ElevenLabs speech generation failed:", error);
      return {
        audioContent: "",
        error: error instanceof Error
          ? error.message
          : "Speech generation failed",
      };
    }
  }

}
