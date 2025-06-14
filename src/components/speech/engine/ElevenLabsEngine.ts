
import { elevenLabsService } from "../ElevenLabsService";
import { showSpeechToast } from "../ToastUtils";

export const ElevenLabsEngine = {
  async isAvailable(): Promise<boolean> {
    return await elevenLabsService.isServiceAvailable();
  },

  async speak(text: string): Promise<boolean> {
    try {
      console.log("‼️ [ElevenLabsEngine V2] ENTERING speak method.");

      const audioResponse = await elevenLabsService.generateSpeech(text);

      console.log(
        "‼️ [ElevenLabsEngine V2] Audio response received.",
        "Has audioContent:", !!audioResponse.audioContent,
        "Content length:", audioResponse.audioContent?.length,
        "Has error:", !!audioResponse.error,
        "Error message:", audioResponse.error
      );

      if (audioResponse.error) {
        showSpeechToast("ElevenLabs Error", `Generation failed: ${audioResponse.error}`, "destructive");
        console.error("‼️ [ElevenLabsEngine V2] Speech generation failed with error:", audioResponse.error);
        window.dispatchEvent(new CustomEvent("nelie-tts-engine", { detail: { engine: "browser-fallback", source: "error" } }));
        return false;
      }

      if (!audioResponse.audioContent) {
        showSpeechToast("ElevenLabs Error", "Generation resulted in empty audio.", "destructive");
        console.error("‼️ [ElevenLabsEngine V2] Speech generation failed: No audio content.");
        window.dispatchEvent(new CustomEvent("nelie-tts-engine", { detail: { engine: "browser-fallback", source: "empty-audio" } }));
        return false;
      }

      console.log("‼️ [ElevenLabsEngine V2] About to play audio... (should play premium voice: Fena)");
      // Add event before and after playing audio
      window.dispatchEvent(new CustomEvent("nelie-tts-engine", { detail: { engine: "elevenlabs", source: "about-to-play" } }));
      await elevenLabsService.playAudio(audioResponse.audioContent);
      console.log("‼️ [ElevenLabsEngine V2] ElevenLabs playback finished.");
      window.dispatchEvent(new CustomEvent("nelie-tts-engine", { detail: { engine: "elevenlabs", source: "did-play" } }));
      return true;

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      showSpeechToast("ElevenLabs Critical Error", errorMessage, "destructive");
      console.error("‼️ [ElevenLabsEngine V2] CRITICAL ERROR in speak method:", e);
      window.dispatchEvent(new CustomEvent("nelie-tts-engine", { detail: { engine: "browser-fallback", source: "exception" } }));
      return false;
    }
  },

  async refreshAvailability() {
    await elevenLabsService.refreshAvailability();
  },
};
