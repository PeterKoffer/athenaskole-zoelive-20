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

// Aria: 9BWtsMINqrJLrRacOk9x (Official ElevenLabs voice)
const DEFAULT_VOICE_ID = "9BWtsMINqrJLrRacOk9x";
const DEFAULT_MODEL_ID = "eleven_turbo_v2_5";

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private isAvailable: boolean = false;
  private lastCheck: number = 0;
  private lastError: string | null = null;

  constructor() {
    this.config = {
      apiKey: "",
      voiceId: DEFAULT_VOICE_ID,
      model: DEFAULT_MODEL_ID,
    };
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
        console.log("🎤 [ElevenLabsService] Available voices:", result.voices.map((v: any) => v.name));
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
        "🎤 Generating ElevenLabs speech (via Supabase) for:",
        text.substring(0, 50) + "...",
        "VoiceID:", this.config.voiceId, "Model:", this.config.model
      );
      const response = await fetch(EDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "generate-speech",
          text: text,
          voiceId: this.config.voiceId,
          model: this.config.model,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.audioContent) {
        throw new Error(data.error || "Unknown TTS error");
      }
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
        const audioData = `data:audio/mpeg;base64,${base64Audio}`;
        const audio = new Audio(audioData);

        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error("Audio playback failed"));

        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  setVoice(voiceId: string): void {
    console.log("🛠️ ElevenLabsService.setVoice called! Now using:", voiceId);
    this.config.voiceId = voiceId;
  }
}

export const elevenLabsService = new ElevenLabsService();
