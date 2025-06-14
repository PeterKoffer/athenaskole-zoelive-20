
import { browserSpeechEngine } from "./BrowserSpeechEngine";
import { elevenLabsSpeechEngine } from "./ElevenLabsSpeechEngine";
import { SpeechConfig } from "./SpeechConfig";

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
    const success = await elevenLabsSpeechEngine.speak(text);
    if (success) {
      updateState({ isSpeaking: false });
      onDone();
      return;
    } else {
      updateState({
        usingElevenLabs: false,
        lastError: "ElevenLabs error, fallback to browser",
      });
    }
  }

  // Fallback to browser TTS
  if (typeof speechSynthesis === "undefined") {
    onDone();
    return;
  }
  let utteranceRef: SpeechSynthesisUtterance | null = null;
  browserSpeechEngine.speak(
    text,
    config,
    () => updateState({ isSpeaking: true, currentUtterance: utteranceRef }),
    () => {
      updateState({ isSpeaking: false, currentUtterance: null });
      onDone();
    },
    (event) => {
      updateState({
        isSpeaking: false,
        currentUtterance: null,
        lastError: event.error || "Unknown error",
      });
      onDone();
    }
  );
}
