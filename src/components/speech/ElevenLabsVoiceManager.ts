
import { EDGE_BASE, FENA_VOICE_ID } from "./ElevenLabsConfig";
import { VoicesResponse } from "./ElevenLabsTypes";

export class ElevenLabsVoiceManager {
  private lastCheck: number = 0;
  private cachedAvailability: boolean | null = null;
  private lastError: string | null = null;

  public async checkAvailability(): Promise<boolean> {
    const now = Date.now();
    // Reduce cache time to 3 seconds so it refreshes more quickly after API key is added
    if (now - this.lastCheck < 3000 && this.cachedAvailability !== null) {
      console.log(`‼️ [ElevenLabsVoiceManager] Using CACHED availability: ${this.cachedAvailability}`);
      return this.cachedAvailability;
    }
    console.log("‼️ [ElevenLabsVoiceManager] Cache expired or empty. Performing LIVE check.");
    this.lastCheck = now;

    try {
      console.log("🔍 [ElevenLabsVoiceManager] Calling edge function to check availability...");
      
      // Get the API key from localStorage
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        console.error("❌ [ElevenLabsVoiceManager] No API key available");
        this.cachedAvailability = false;
        this.lastError = "ElevenLabs API key not configured";
        return false;
      }

      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-elevenlabs-key": apiKey
        },
        body: JSON.stringify({ type: "check-availability" })
      });

      console.log("📡 [ElevenLabsVoiceManager] Edge function response status:", response.status);

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
        this.lastError = "Unknown response from ElevenLabs";
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

  private async getApiKey(): Promise<string | null> {
    // Try to get the API key from localStorage
    try {
      const storedKey = localStorage.getItem('elevenlabs_api_key');
      if (storedKey) {
        console.log("🔑 [ElevenLabsVoiceManager] Found API key in localStorage");
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
        console.log("🔑 [ElevenLabsVoiceManager] API key saved to localStorage");
      } catch (e) {
        console.warn("⚠️ [ElevenLabsVoiceManager] Could not save API key to localStorage");
      }
      return apiKey;
    }

    return null;
  }

  public getLastError(): string | null {
    return this.lastError;
  }

  public async refreshAvailability(): Promise<void> {
    console.log("🔄 [ElevenLabsVoiceManager] Forcing refresh of availability cache...");
    this.cachedAvailability = null;
    this.lastCheck = 0; // Force immediate refresh
    await this.checkAvailability();
  }
}
