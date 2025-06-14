
import { elevenLabsService } from './ElevenLabsService';
import { showSpeechToast } from './ToastUtils';

export const elevenLabsSpeechEngine = {
  async isAvailable(): Promise<boolean> {
    return await elevenLabsService.isServiceAvailable();
  },

  async speak(text: string): Promise<boolean> {
    try {
      console.log("[ElevenLabsSpeechEngine] Attempting to speak with ElevenLabs...");
      const audioResponse = await elevenLabsService.generateSpeech(text);
      // NEW: LOG audio length
      console.log("[ElevenLabsSpeechEngine] audioContent length:", audioResponse.audioContent?.length, "error:", audioResponse.error);
      if (audioResponse.audioContent && !audioResponse.error) {
        showSpeechToast("ElevenLabs Voice 💜", "Playing with Aria (ElevenLabs premium voice) [You should be hearing Aria now!]", "success");
        // SIGNIFICANT: Log before, during, and after playback
        console.log("[ElevenLabsSpeechEngine] About to play audio...");
        await elevenLabsService.playAudio(audioResponse.audioContent);
        console.log("[ElevenLabsSpeechEngine] ElevenLabs playback succeeded.");
        showSpeechToast("ElevenLabs Audio", "Playback completed!", "default");
        return true;
      }
      showSpeechToast("ElevenLabs Fallback", "Error: " + (audioResponse.error ?? "Unknown audio error"), "destructive");
      console.warn("[ElevenLabsSpeechEngine] ElevenLabs playback failed:", audioResponse.error);
      return false;
    } catch (e) {
      showSpeechToast("ElevenLabs Critical Error", (e as Error).message, "destructive");
      console.error("[ElevenLabsSpeechEngine] ElevenLabs threw error:", e);
      return false;
    }
  },

  async refreshAvailability() {
    await elevenLabsService.refreshAvailability();
  }
};
