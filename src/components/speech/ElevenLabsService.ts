
import { ElevenLabsConfig, AudioResponse } from "./ElevenLabsTypes";
import { FENA_VOICE_ID, DEFAULT_MODEL_ID } from "./ElevenLabsConfig";
import { ElevenLabsVoiceManager } from "./ElevenLabsVoiceManager";
import { ElevenLabsAudioPlayer } from "./ElevenLabsAudioPlayer";
import { ElevenLabsSpeechGenerator } from "./ElevenLabsSpeechGenerator";

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private voiceManager: ElevenLabsVoiceManager;
  private audioPlayer: ElevenLabsAudioPlayer;
  private speechGenerator: ElevenLabsSpeechGenerator;

  constructor() {
    this.config = {
      apiKey: "",
      voiceId: FENA_VOICE_ID, // Explicitly use Fena
      model: DEFAULT_MODEL_ID,
    };
    this.voiceManager = new ElevenLabsVoiceManager();
    this.audioPlayer = new ElevenLabsAudioPlayer();
    this.speechGenerator = new ElevenLabsSpeechGenerator();
    console.log("🎤 [ElevenLabsService] Initialized with Fena voice ID:", FENA_VOICE_ID);
  }

  public async checkAvailability(): Promise<boolean> {
    return await this.voiceManager.checkAvailability();
  }

  public async isServiceAvailable(): Promise<boolean> {
    return await this.checkAvailability();
  }

  async refreshAvailability(): Promise<void> {
    await this.voiceManager.refreshAvailability();
  }

  async generateSpeech(text: string): Promise<AudioResponse> {
    console.log("‼️ [ElevenLabsService] ENTERING generateSpeech. Checking availability...");
    const available = await this.isServiceAvailable();
    console.log(`‼️ [ElevenLabsService] Availability check result: ${available}`);

    if (!available) {
      const lastError = this.voiceManager.getLastError();
      console.error("‼️ [ElevenLabsService] Service NOT available. Returning error. Last error:", lastError);
      return {
        audioContent: "",
        error: lastError || "ElevenLabs not available",
      };
    }

    console.log("‼️ [ElevenLabsService] Service IS available. Calling speechGenerator.");
    return await this.speechGenerator.generateSpeech(text, this.config);
  }

  async playAudio(base64Audio: string): Promise<void> {
    return await this.audioPlayer.playAudio(base64Audio);
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
