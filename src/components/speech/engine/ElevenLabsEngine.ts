
import { elevenLabsService } from "../ElevenLabsService";
import { showSpeechToast } from "../ToastUtils";

export const ElevenLabsEngine = {
  async isAvailable(): Promise<boolean> {
    return await elevenLabsService.isServiceAvailable();
  },

  async speak(text: string): Promise<boolean> {
    try {
      console.log("[ElevenLabsEngine] Attempting to speak with ElevenLabs...");
      const audioResponse = await elevenLabsService.generateSpeech(text);
      // Log audio content length & error
      console.log(
        "[ElevenLabsEngine] audioContent length:",
        audioResponse.audioContent?.length,
        "error:",
        audioResponse.error
      );
      if (audioResponse.audioContent && !audioResponse.error) {
        showSpeechToast(
          "ElevenLabs Voice 💜",
          "Playing with Aria (ElevenLabs premium voice) [You should be hearing Aria now!]",
          "success"
        );
        // Log before, during, and after playback
        console.log("[ElevenLabsEngine] About to play audio...");
        await elevenLabsService.playAudio(audioResponse.audioContent);
        console.log("[ElevenLabsEngine] ElevenLabs playback succeeded.");
        showSpeechToast("ElevenLabs Audio", "Playback completed!", "default");
        return true;
      }
      showSpeechToast(
        "ElevenLabs Fallback",
        "Error: " + (audioResponse.error ?? "Unknown audio error"),
        "destructive"
      );
      console.warn("[ElevenLabsEngine] ElevenLabs playback failed:", audioResponse.error);
      return false;
    } catch (e) {
      showSpeechToast("ElevenLabs Critical Error", (e as Error).message, "destructive");
      console.error("[ElevenLabsEngine] ElevenLabs threw error:", e);
      return false;
    }
  },

  async refreshAvailability() {
    await elevenLabsService.refreshAvailability();
  },
};
