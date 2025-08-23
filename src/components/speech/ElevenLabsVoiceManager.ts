
import { EDGE_BASE, FENA_VOICE_ID } from "./ElevenLabsConfig";
import { VoicesResponse } from "./ElevenLabsTypes";

export class ElevenLabsVoiceManager {
  private lastCheck: number = 0;
  private cachedAvailability: boolean | null = null;
  private lastError: string | null = null;

  public async checkAvailability(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastCheck < 5000 && this.cachedAvailability !== null) {
      console.log(`✅ [ElevenLabsVoiceManager] Using CACHED availability: ${this.cachedAvailability}`);
      return this.cachedAvailability;
    }
    
    console.log("🔍 [ElevenLabsVoiceManager] Performing LIVE availability check...");
    this.lastCheck = now;

    try {
      console.log("🔑 [ElevenLabsVoiceManager] Making request without authorization header");

      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "check-availability" }),
      });

      console.log("📡 [ElevenLabsVoiceManager] Response:", {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [ElevenLabsVoiceManager] HTTP error:", response.status, errorText);
        this.cachedAvailability = false;
        this.lastError = `HTTP ${response.status}: ${errorText}`;
        return false;
      }

      const result: VoicesResponse = await response.json();
      
      // Check if response contains an error (even with 200 status)
      if (result.error) {
        console.error("❌ [ElevenLabsVoiceManager] API error:", result.error);
        this.cachedAvailability = false;
        this.lastError = result.error;
        return false;
      }
      
      if (result && Array.isArray(result.voices) && result.voices.length > 0) {
        this.cachedAvailability = true;
        this.lastError = null;
        console.log("✅ [ElevenLabsVoiceManager] ElevenLabs is available!");
        
        const fenaVoice = result.voices.find((v) => v.voice_id === FENA_VOICE_ID);
        if (fenaVoice) {
          console.log("✅ [ElevenLabsVoiceManager] Fena voice found:", fenaVoice.name);
        } else {
          console.warn("⚠️ [ElevenLabsVoiceManager] Fena voice not found!");
        }
        
        return true;
      } else {
        console.error("❌ [ElevenLabsVoiceManager] Invalid response:", result);
        this.cachedAvailability = false;
        this.lastError = "Invalid response from ElevenLabs";
        return false;
      }
    } catch (error) {
      this.cachedAvailability = false;
      this.lastError = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ [ElevenLabsVoiceManager] Check failed:", error);
      return false;
    }
  }

  public getLastError(): string | null {
    return this.lastError;
  }

  public async refreshAvailability(): Promise<void> {
    console.log("🔄 [ElevenLabsVoiceManager] Forcing refresh...");
    this.cachedAvailability = null;
    this.lastCheck = 0;
    await this.checkAvailability();
  }
}
