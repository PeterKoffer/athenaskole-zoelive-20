import { EDGE_BASE, FENA_VOICE_ID } from "./ElevenLabsConfig";
import { VoicesResponse } from "./ElevenLabsTypes";

export class ElevenLabsVoiceManager {
  private lastCheck: number = 0;
  private cachedAvailability: boolean | null = null;
  private lastError: string | null = null;

  public async checkAvailability(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastCheck < 5000 && this.cachedAvailability !== null) {
      console.log(`‼️ [ElevenLabsVoiceManager] Using CACHED availability: ${this.cachedAvailability}`);
      return this.cachedAvailability;
    }
    console.log("‼️ [ElevenLabsVoiceManager] Cache expired or empty. Performing LIVE check.");
    this.lastCheck = now;

    try {
      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ type: "check-availability" })
      });

      const text = await response.text();
      let result: VoicesResponse | null = null;
      
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("‼️ [ElevenLabsVoiceManager] Failed to parse response JSON", text);
        this.cachedAvailability = false;
        this.lastError = "Parse error when checking ElevenLabs";
        return false;
      }

      console.log(
        "‼️ [ElevenLabsVoiceManager] LIVE check response - Status:",
        response.status,
        "Body keys:",
        result ? Object.keys(result) : "null"
      );

      if (
        response.ok &&
        result &&
        Array.isArray(result.voices) &&
        result.voices.length > 0
      ) {
        this.cachedAvailability = true;
        this.lastError = null;
        console.log("✅ [ElevenLabsVoiceManager] LIVE check SUCCESS. Caching availability: true.");
        
        const fenaVoice = result.voices.find((v) => v.voice_id === FENA_VOICE_ID);
        if (fenaVoice) {
          console.log("✅ [ElevenLabsVoiceManager] Fena voice found:", fenaVoice.name, "ID:", fenaVoice.voice_id);
        } else {
          console.warn("⚠️ [ElevenLabsVoiceManager] Fena voice not found in available voices!");
        }
        
        return true;
      } else if (result && result.error) {
        console.error("❌ [ElevenLabsVoiceManager] LIVE check FAILED (API Error). Caching availability: false.", result.error);
        this.cachedAvailability = false;
        this.lastError = result.error;
        return false;
      } else {
        console.error("❌ [ElevenLabsVoiceManager] LIVE check FAILED (Unknown Response). Caching availability: false.", result);
        this.cachedAvailability = false;
        this.lastError = "Unknown response";
        return false;
      }
    } catch (error) {
      this.cachedAvailability = false;
      this.lastError = error instanceof Error ? error.message : "Unknown error";
      console.error(
        "❌ [ElevenLabsVoiceManager] CRITICAL LIVE check FAILED (Catch Block). Caching availability: false. Error:", error
      );
      return false;
    }
  }

  public getLastError(): string | null {
    return this.lastError;
  }

  public async refreshAvailability(): Promise<void> {
    this.cachedAvailability = null;
    await this.checkAvailability();
  }
}
