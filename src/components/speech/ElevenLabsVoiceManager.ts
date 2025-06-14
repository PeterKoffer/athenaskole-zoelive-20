
import { EDGE_BASE, FENA_VOICE_ID } from "./ElevenLabsConfig";
import { VoicesResponse } from "./ElevenLabsTypes";

export class ElevenLabsVoiceManager {
  private lastCheck: number = 0;
  private cachedAvailability: boolean | null = null;
  private lastError: string | null = null;

  public async checkAvailability(): Promise<boolean> {
    // Only check once every 5 seconds unless forced
    const now = Date.now();
    if (now - this.lastCheck < 5000 && this.cachedAvailability !== null) {
      console.log("🎤 [ElevenLabsVoiceManager] Skipping re-check, recent result:", this.cachedAvailability);
      return this.cachedAvailability;
    }
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
        console.error("🎤 ElevenLabs availability: Failed to parse response JSON", text);
        this.cachedAvailability = false;
        this.lastError = "Parse error when checking ElevenLabs";
        return false;
      }

      console.log(
        "🎤 [ElevenLabsVoiceManager] checkAvailability - Status:",
        response.status,
        "Body:",
        result
      );

      if (
        response.ok &&
        result &&
        Array.isArray(result.voices) &&
        result.voices.length > 0
      ) {
        this.cachedAvailability = true;
        this.lastError = null;
        console.log("🎤 [ElevenLabsVoiceManager] Available voices:", result.voices.map((v) => `${v.name} (${v.voice_id})`));
        
        // Check if Fena is available
        const fenaVoice = result.voices.find((v) => v.voice_id === FENA_VOICE_ID);
        if (fenaVoice) {
          console.log("✅ [ElevenLabsVoiceManager] Fena voice found:", fenaVoice.name, "ID:", fenaVoice.voice_id);
        } else {
          console.warn("⚠️ [ElevenLabsVoiceManager] Fena voice not found in available voices!");
        }
        
        return true;
      } else if (result && result.error) {
        console.error("❌ [ElevenLabsVoiceManager] Error returned", result.error);
        this.cachedAvailability = false;
        this.lastError = result.error;
        return false;
      } else {
        console.error("❌ [ElevenLabsVoiceManager] Unknown response", result);
        this.cachedAvailability = false;
        this.lastError = "Unknown response";
        return false;
      }
    } catch (error) {
      this.cachedAvailability = false;
      this.lastError = error instanceof Error ? error.message : "Unknown error";
      console.log(
        "🎤 [ElevenLabsVoiceManager] Not available, will use browser synthesis. Error:", error
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
