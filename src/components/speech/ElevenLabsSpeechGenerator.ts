
import { EDGE_BASE, DEFAULT_VOICE_SETTINGS } from "./ElevenLabsConfig";
import { AudioResponse, ElevenLabsConfig } from "./ElevenLabsTypes";

export class ElevenLabsSpeechGenerator {
  async generateSpeech(text: string, config: ElevenLabsConfig): Promise<AudioResponse> {
    try {
      console.log(
        "🎤 [ElevenLabsSpeechGenerator] Generating speech with FENA voice for:",
        text.substring(0, 50) + "...",
        "\n🎭 VoiceID:", config.voiceId,
        "\n🎛️ Model:", config.model,
        "\n🎀 Expected: Female character voice (Fena)"
      );
      
      const requestPayload = {
        type: "generate-speech",
        text: text,
        voiceId: config.voiceId,
        model: config.model,
      };
      
      console.log("📤 [ElevenLabsSpeechGenerator] Request payload:", JSON.stringify(requestPayload, null, 2));
      
      console.log("‼️‼️ [ElevenLabsSpeechGenerator] ABOUT TO FETCH from edge function... ‼️‼️");
      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      // Try to dump as much as possible if not ok
      let rawJson = null;
      try {
        rawJson = await response.json();
      } catch (e) {
        console.error("❌ [ElevenLabsSpeechGenerator] Could not parse response JSON", e);
        throw new Error("Could not parse response JSON from edge function");
      }

      console.log(
        "📥 [ElevenLabsSpeechGenerator] Response status:", response.status,
        "Has audioContent:", !!rawJson.audioContent,
        "audioContent length:", rawJson.audioContent?.length,
        "Error:", rawJson.error
      );

      if (!response.ok || !rawJson.audioContent) {
        console.error("❌ [ElevenLabsSpeechGenerator] Speech generation failed:", rawJson.error || "No audio content");
        throw new Error(rawJson.error || "Unknown TTS error");
      }

      // Log a snippet of the base64 content for debugging (don't log it all)
      console.log("✅ [ElevenLabsSpeechGenerator] Generated speech. base64 (first 32):", rawJson.audioContent?.substring(0,32), "len:", rawJson.audioContent?.length);

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
