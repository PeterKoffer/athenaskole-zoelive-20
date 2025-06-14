
// Adapter for ElevenLabs via ElevenLabsService
import { elevenLabsService } from './ElevenLabsService';

export const elevenLabsSpeechEngine = {
  async isAvailable(): Promise<boolean> {
    // Always force a re-check on every call (ensures non-racy result)
    return await elevenLabsService.isServiceAvailable();
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
