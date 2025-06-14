
interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  model: string;
}

interface AudioResponse {
  audioContent: string;
  error?: string;
}

const EDGE_BASE =
  "https://tgjudtnjhtumrfthegis.functions.supabase.co/elevenlabs-proxy";

// Fena - Character: BlgEcC0TfWpBak7FmvHW (Official ElevenLabs voice - FEMALE CHARACTER)
const FENA_VOICE_ID = "BlgEcC0TfWpBak7FmvHW";
const DEFAULT_MODEL_ID = "eleven_turbo_v2_5";

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private isAvailable: boolean = false;
  private lastCheck: number = 0;
  private lastError: string | null = null;

  constructor() {
    this.config = {
      apiKey: "",
      voiceId: FENA_VOICE_ID, // Explicitly use Fena
      model: DEFAULT_MODEL_ID,
    };
    console.log("🎤 [ElevenLabsService] Initialized with Fena voice ID:", FENA_VOICE_ID);
  }

  public async checkAvailability(): Promise<boolean> {
    // Only check once every 5 seconds unless forced
    const now = Date.now();
    if (now - this.lastCheck < 5000 && typeof this.isAvailable === "boolean") {
      console.log("🎤 [ElevenLabsService] Skipping re-check, recent result:", this.isAvailable);
      return this.isAvailable;
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
      let result: any = null;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("🎤 ElevenLabs availability: Failed to parse response JSON", text);
        this.isAvailable = false;
        this.lastError = "Parse error when checking ElevenLabs";
        return false;
      }

      console.log(
        "🎤 [ElevenLabsService] checkAvailability - Status:",
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
        this.isAvailable = true;
        this.lastError = null;
        console.log("🎤 [ElevenLabsService] Available voices:", result.voices.map((v: any) => `${v.name} (${v.voice_id})`));
        
        // Check if Fena is available
        const fenaVoice = result.voices.find((v: any) => v.voice_id === FENA_VOICE_ID);
        if (fenaVoice) {
          console.log("✅ [ElevenLabsService] Fena voice found:", fenaVoice.name, "ID:", fenaVoice.voice_id);
        } else {
          console.warn("⚠️ [ElevenLabsService] Fena voice not found in available voices!");
        }
        
        return true;
      } else if (result && result.error) {
        console.error("❌ [ElevenLabsService] Error returned", result.error);
        this.isAvailable = false;
        this.lastError = result.error;
        return false;
      } else {
        console.error("❌ [ElevenLabsService] Unknown response", result);
        this.isAvailable = false;
        this.lastError = "Unknown response";
        return false;
      }
    } catch (error) {
      this.isAvailable = false;
      this.lastError = error instanceof Error ? error.message : "Unknown error";
      console.log(
        "🎤 [ElevenLabsService] Not available, will use browser synthesis. Error:", error
      );
      return false;
    }
  }

  public async isServiceAvailable(): Promise<boolean> {
    const available = await this.checkAvailability();
    return available;
  }

  async refreshAvailability(): Promise<void> {
    await this.checkAvailability();
  }

  async generateSpeech(text: string): Promise<AudioResponse> {
    if (!(await this.isServiceAvailable())) {
      return {
        audioContent: "",
        error: this.lastError || "ElevenLabs not available",
      };
    }
    try {
      console.log(
        "🎤 [ElevenLabsService] Generating speech with FENA voice for:",
        text.substring(0, 50) + "...",
        "\n🎭 VoiceID:", this.config.voiceId,
        "\n🎛️ Model:", this.config.model,
        "\n🎀 Expected: Female character voice (Fena)"
      );
      
      const requestPayload = {
        type: "generate-speech",
        text: text,
        voiceId: this.config.voiceId,
        model: this.config.model,
      };
      
      console.log("📤 [ElevenLabsService] Request payload:", JSON.stringify(requestPayload, null, 2));
      
      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });
      
      const data = await response.json();
      console.log("📥 [ElevenLabsService] Response status:", response.status, "Has audioContent:", !!data.audioContent);
      
      if (!response.ok || !data.audioContent) {
        console.error("❌ [ElevenLabsService] Speech generation failed:", data.error || "No audio content");
        throw new Error(data.error || "Unknown TTS error");
      }
      
      console.log("✅ [ElevenLabsService] Successfully generated speech with Fena voice, audio length:", data.audioContent.length);
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

  async playAudio(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log("🔊 [ElevenLabsService] Starting audio playback, data length:", base64Audio.length);
        const audioData = `data:audio/mpeg;base64,${base64Audio}`;
        const audio = new Audio(audioData);

        audio.onended = () => {
          console.log("✅ [ElevenLabsService] Audio playback completed successfully");
          resolve();
        };
        
        audio.onerror = (e) => {
          console.error("❌ [ElevenLabsService] Audio playback error:", e);
          reject(new Error("Audio playback failed"));
        };

        audio.onloadstart = () => {
          console.log("🎵 [ElevenLabsService] Audio loading started");
        };

        audio.oncanplay = () => {
          console.log("🎵 [ElevenLabsService] Audio can start playing");
        };

        audio.play().then(() => {
          console.log("🎵 [ElevenLabsService] Audio.play() called successfully");
        }).catch((playError) => {
          console.error("❌ [ElevenLabsService] Audio.play() failed:", playError);
          reject(playError);
        });
      } catch (error) {
        console.error("❌ [ElevenLabsService] Audio setup failed:", error);
        reject(error);
      }
    });
  }

  setVoice(voiceId: string): void {
    console.log("🛠️ [ElevenLabsService] setVoice called! Changing from:", this.config.voiceId, "to:", voiceId);
    this.config.voiceId = voiceId;
  }

  // Force Fena voice (for debugging)
  forceFenaVoice(): void {
    console.log("🎭 [ElevenLabsService] Forcing Fena voice ID:", FENA_VOICE_ID);
    this.config.voiceId = FENA_VOICE_ID;
  }
}

export const elevenLabsService = new ElevenLabsService();

// Force Fena voice on initialization
elevenLabsService.forceFenaVoice();
