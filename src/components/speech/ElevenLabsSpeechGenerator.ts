
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

      // Get the API key
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        console.error("❌ [ElevenLabsSpeechGenerator] No API key available");
        return {
          audioContent: "",
          error: "ElevenLabs API key not configured"
        };
      }
      
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
          "Authorization": `Bearer ${apiKey}`
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

  private async getApiKey(): Promise<string | null> {
    // Try to get the API key from localStorage
    try {
      const storedKey = localStorage.getItem('elevenlabs_api_key');
      if (storedKey) {
        return storedKey;
      }
    } catch (e) {
      // localStorage might not be available
    }

    // Prompt user for API key if not found
    const apiKey = prompt(
      "ElevenLabs API key required for premium voice. Please enter your ElevenLabs API key:"
    );
    
    if (apiKey) {
      try {
        localStorage.setItem('elevenlabs_api_key', apiKey);
      } catch (e) {
        console.warn("⚠️ Could not save API key to localStorage");
      }
      return apiKey;
    }

    return null;
  }
}
