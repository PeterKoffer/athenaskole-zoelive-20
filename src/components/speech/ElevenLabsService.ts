
interface ElevenLabsConfig {
  apiKey: string; // Not used anymore, but kept for compatibility
  voiceId: string;
  model: string;
}

interface AudioResponse {
  audioContent: string;
  error?: string;
}

// Supabase Edge Function URL (replace with actual project ref if needed)
const EDGE_BASE =
  "https://tgjudtnjhtumrfthegis.functions.supabase.co/elevenlabs-proxy";

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private isAvailable: boolean = false;
  private availabilityPromise: Promise<void>;

  constructor() {
    this.config = {
      apiKey: "", // No longer needed on client
      voiceId: "YvMZb1i5lC3pIbB08jiB", // Fena
      model: "eleven_turbo_v2_5",
    };
    this.availabilityPromise = this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
    try {
      const response = await fetch(EDGE_BASE + "/check-availability", {
        method: "GET",
      });
      this.isAvailable = response.ok;
      console.log(
        "🎤 ElevenLabs availability (via Supabase):",
        this.isAvailable ? "Available" : "Unavailable"
      );
    } catch (error) {
      this.isAvailable = false;
      console.log(
        "🎤 ElevenLabs not available (via Supabase), will use browser speech synthesis"
      );
    }
  }

  ensureAvailability(): Promise<void> {
    return this.availabilityPromise;
  }

  async refreshAvailability(): Promise<void> {
    await this.checkAvailability();
  }

  async generateSpeech(text: string): Promise<AudioResponse> {
    if (!this.isAvailable) {
      return {
        audioContent: "",
        error: "ElevenLabs not available",
      };
    }

    try {
      console.log(
        "🎤 Generating ElevenLabs speech (via Supabase) for:",
        text.substring(0, 50) + "..."
      );
      const response = await fetch(EDGE_BASE + "/generate-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  setVoice(voiceId: string): void {
    this.config.voiceId = voiceId;
  }
}

export const elevenLabsService = new ElevenLabsService();
