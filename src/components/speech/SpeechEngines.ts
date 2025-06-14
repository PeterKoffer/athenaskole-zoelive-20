
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
  shouldTryElevenLabs: boolean,
  isCheckingElevenLabs?: boolean // new argument, to track EL check state
) {
  // Never allow browser fallback if EL check is not finished yet
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
  if (isCheckingElevenLabs) {
    // Don't fallback until EL check is over, will retry after state update
    console.log('⏳ Still checking for ElevenLabs, not falling back to browser');
    return;
  }
  // Fallback to browser TTS only when allowed
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

