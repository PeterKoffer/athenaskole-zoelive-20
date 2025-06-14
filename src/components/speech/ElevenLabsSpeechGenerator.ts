
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
      
      const data = await response.json();
      console.log("📥 [ElevenLabsSpeechGenerator] Response status:", response.status, "Has audioContent:", !!data.audioContent);
      
      if (!response.ok || !data.audioContent) {
        console.error("❌ [ElevenLabsSpeechGenerator] Speech generation failed:", data.error || "No audio content");
        throw new Error(data.error || "Unknown TTS error");
      }
      
      console.log("✅ [ElevenLabsSpeechGenerator] Successfully generated speech with Fena voice, audio length:", data.audioContent.length);
      return { audioContent: data.audioContent };
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
