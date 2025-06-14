
import { browserSpeechEngine } from "../BrowserSpeechEngine";
import { SpeechConfig } from "../SpeechConfig";

export function speakWithBrowser(
  text: string,
  config: SpeechConfig,
  updateState: (partial: any) => void,
  onDone: () => void,
  onError: (event: any) => void
) {
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
      onError(event);
      onDone();
    }
  );
}
