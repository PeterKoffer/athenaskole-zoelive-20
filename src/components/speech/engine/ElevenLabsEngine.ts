
import { elevenLabsService } from "../ElevenLabsService";
import { showSpeechToast } from "../ToastUtils";

export const ElevenLabsEngine = {
  async isAvailable(): Promise<boolean> {
    return await elevenLabsService.isServiceAvailable();
  },

  async speak(text: string): Promise<boolean> {
    try {
      console.log("‼️ [ElevenLabsEngine V2] ENTERING speak method.");
      showSpeechToast("ElevenLabs", "Generating premium voice...", "default");

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
        return false;
      }

      if (!audioResponse.audioContent) {
        showSpeechToast("ElevenLabs Error", "Generation resulted in empty audio.", "destructive");
        console.error("‼️ [ElevenLabsEngine V2] Speech generation failed: No audio content.");
        return false;
      }

      showSpeechToast("ElevenLabs", "Playing audio...", "success");
      console.log("‼️ [ElevenLabsEngine V2] About to play audio...");
      await elevenLabsService.playAudio(audioResponse.audioContent);
      console.log("‼️ [ElevenLabsEngine V2] ElevenLabs playback finished.");
      showSpeechToast("ElevenLabs Audio", "Playback completed!", "default");
      return true;

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      showSpeechToast("ElevenLabs Critical Error", errorMessage, "destructive");
      console.error("‼️ [ElevenLabsEngine V2] CRITICAL ERROR in speak method:", e);
      return false;
    }
  },

  async refreshAvailability() {
    await elevenLabsService.refreshAvailability();
  },
};
