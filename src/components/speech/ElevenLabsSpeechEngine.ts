
import { elevenLabsService } from './ElevenLabsService';

export const elevenLabsSpeechEngine = {
  async isAvailable(): Promise<boolean> {
    return await elevenLabsService.isServiceAvailable();
  },

  async speak(text: string): Promise<boolean> {
    try {
      console.log("[ElevenLabsSpeechEngine] Attempting to speak with ElevenLabs...");
      const audioResponse = await elevenLabsService.generateSpeech(text);
      if (audioResponse.audioContent && !audioResponse.error) {
        await elevenLabsService.playAudio(audioResponse.audioContent);
        console.log("[ElevenLabsSpeechEngine] ElevenLabs playback succeeded.");
        return true;
      }
      console.warn("[ElevenLabsSpeechEngine] ElevenLabs playback failed:", audioResponse.error);
      return false;
    } catch (e) {
      console.error("[ElevenLabsSpeechEngine] ElevenLabs threw error:", e);
      return false;
    }
  },

  async refreshAvailability() {
    await elevenLabsService.refreshAvailability();
  }
};
