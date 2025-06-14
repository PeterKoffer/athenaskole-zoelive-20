
import { SpeechConfig } from "./SpeechConfig";
import { speakWithElevenLabs } from "./engine/ElevenLabsSpeak";
import { speakWithBrowser } from "./engine/BrowserSpeak";
import { elevenLabsSpeechEngine } from "./ElevenLabsSpeechEngine";

export async function speakWithEngines(
  text: string,
  useElevenLabs: boolean,
  config: SpeechConfig,
  updateState: (partial: any) => void,
  onDone: () => void,
  shouldTryElevenLabs: boolean
) {
  // Try ElevenLabs first if requested
  if (shouldTryElevenLabs && useElevenLabs) {
    const elevenDone = await speakWithElevenLabs(
      text,
      () => {
        updateState({ isSpeaking: false });
        onDone();
      },
      (msg) => {
        updateState({
          usingElevenLabs: false,
          lastError: "ElevenLabs error, fallback to browser: " + msg,
        });
      }
    );
    if (elevenDone) return;
  }
  // Fallback to browser TTS
  if (typeof speechSynthesis === "undefined") {
    onDone();
    return;
  }
  speakWithBrowser(
    text,
    config,
    updateState,
    onDone,
    (event) => {
      updateState({
        isSpeaking: false,
        currentUtterance: null,
        lastError: event.error || "Unknown error",
      });
    }
  );
}
