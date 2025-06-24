
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
      
      // Get the API key - use the new one provided by user
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        console.error("❌ [ElevenLabsVoiceManager] No API key available");
        this.cachedAvailability = false;
        this.lastError = "Please add your ElevenLabs API key (starts with 'sk_' for ElevenLabs)";
        return false;
      }

      // Validate API key format
      if (!apiKey.startsWith('sk_') || apiKey.length < 20) {
        console.error("❌ [ElevenLabsVoiceManager] Invalid API key format");
        this.cachedAvailability = false;
        this.lastError = "Invalid ElevenLabs API key format. Please check your API key.";
        return false;
      }

      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ type: "check-availability" }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("📡 [ElevenLabsVoiceManager] Edge function response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [ElevenLabsVoiceManager] HTTP error:", response.status, errorText);
        
        if (response.status === 401) {
          this.cachedAvailability = false;
          this.lastError = "Invalid ElevenLabs API key. Please check your API key.";
          return false;
        }
        
        this.cachedAvailability = false;
        this.lastError = `HTTP ${response.status}: ${errorText}`;
        return false;
      }

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
      
      if (error.name === 'AbortError') {
        this.lastError = "Request timeout - ElevenLabs service may be unavailable";
        console.error("❌ [ElevenLabsVoiceManager] Request timed out");
      } else {
        this.lastError = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ [ElevenLabsVoiceManager] CRITICAL LIVE check FAILED (Catch Block). Caching availability: false. Error:", error);
      }
      
      return false;
    }
  }

  private async getApiKey(): Promise<string | null> {
    // First try the new API key provided by user
    const newApiKey = 'sk_37e2751a30d9fcb1c276898281def78f92a285a2223b1b51';
    if (newApiKey) {
      console.log("🔑 [ElevenLabsVoiceManager] Using provided API key");
      // Store it in localStorage for future use
      try {
        localStorage.setItem('elevenlabs_api_key', newApiKey);
      } catch (e) {
        console.warn("⚠️ Could not save API key to localStorage");
      }
      return newApiKey;
    }

    // Fallback to localStorage
    try {
      const storedKey = localStorage.getItem('elevenlabs_api_key');
      if (storedKey) {
        console.log("🔑 [ElevenLabsVoiceManager] Found API key in localStorage");
        return storedKey;
      }
    } catch (e) {
      // localStorage might not be available
    }

    console.log("🔑 [ElevenLabsVoiceManager] No API key found");
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
