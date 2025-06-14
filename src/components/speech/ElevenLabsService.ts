
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
      voiceId: "YvMZb1i5lC3pIbB08jiB", // Fena (Female English per ElevenLabs, as requested)
      model: "eleven_turbo_v2_5",
    };
    this.availabilityPromise = this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
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
        return;
      }

      // LOG what we receive for troubleshooting
      console.log(
        "🎤 ElevenLabs availability (via Supabase) - Status:",
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
        console.log("🎤 ElevenLabs availability detected voices:", result.voices.map((v: any) => v.name));
      } else if (result && result.error) {
        console.error("❌ ElevenLabs availability: returned error", result.error);
        this.isAvailable = false;
      } else {
        console.error("❌ ElevenLabs availability: Unknown response", result);
        this.isAvailable = false;
      }
    } catch (error) {
      this.isAvailable = false;
      console.log(
        "🎤 ElevenLabs not available (via Supabase), will use browser speech synthesis. Error:", error
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

  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  setVoice(voiceId: string): void {
    this.config.voiceId = voiceId;
  }
}

export const elevenLabsService = new ElevenLabsService();

