
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
      console.log("🔑 [ElevenLabsSpeechGenerator] Using API key:", apiKey.substring(0, 10) + "...");
      
      console.log("‼️‼️ [ElevenLabsSpeechGenerator] ABOUT TO FETCH from edge function... ‼️‼️");
      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-elevenlabs-key": apiKey,
          "authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestPayload),
      });

      console.log("📡 [ElevenLabsSpeechGenerator] Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
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
        "📥 [ElevenLabsSpeechGenerator] Response data:", {
          status: response.status,
          hasAudioContent: !!rawJson.audioContent,
          audioContentLength: rawJson.audioContent?.length,
          error: rawJson.error,
          fullResponse: rawJson
        }
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
    // Use the hardcoded API key as primary
    const hardcodedKey = 'sk_37e2751a30d9fcb1c276898281def78f92a285a2223b1b51';
    
    if (hardcodedKey) {
      console.log("🔑 [ElevenLabsSpeechGenerator] Using hardcoded API key");
      // Store it in localStorage for consistency
      try {
        localStorage.setItem('elevenlabs_api_key', hardcodedKey);
      } catch (e) {
        console.warn("⚠️ Could not save API key to localStorage");
      }
      return hardcodedKey;
    }

    // Fallback to localStorage
    try {
      const storedKey = localStorage.getItem('elevenlabs_api_key');
      if (storedKey) {
        console.log("🔑 [ElevenLabsSpeechGenerator] Using stored API key");
        return storedKey;
      }
    } catch (e) {
      // localStorage might not be available
    }

    console.log("🔑 [ElevenLabsSpeechGenerator] No API key found");
    return null;
  }
}
