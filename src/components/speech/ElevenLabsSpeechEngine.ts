
// Adapter for ElevenLabs via ElevenLabsService
import { elevenLabsService } from './ElevenLabsService';

export const elevenLabsSpeechEngine = {
  async isAvailable(): Promise<boolean> {
    await elevenLabsService.ensureAvailability();
    return elevenLabsService.isServiceAvailable();
  },

  async speak(text: string): Promise<boolean> {
    try {
      const audioResponse = await elevenLabsService.generateSpeech(text);
      if (audioResponse.audioContent && !audioResponse.error) {
        await elevenLabsService.playAudio(audioResponse.audioContent);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  async refreshAvailability() {
    await elevenLabsService.refreshAvailability();
  }
};
