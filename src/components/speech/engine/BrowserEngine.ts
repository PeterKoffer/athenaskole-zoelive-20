
import { speakWithBrowser } from "./BrowserSpeak";
import { showSpeechToast } from "../ToastUtils";
import { SpeechConfig } from "../SpeechConfig";

interface BrowserSpeakFallbackParams {
  text: string;
  config: SpeechConfig;
  updateState: (partial: any) => void;
  onDone: () => void;
}

export function browserSpeakFallback({
  text,
  config,
  updateState,
  onDone,
}: BrowserSpeakFallbackParams) {
  if (typeof speechSynthesis === "undefined") {
    showSpeechToast("Speech Error", "Browser speech synthesis not supported", "destructive");
    updateState({
      isSpeaking: false,
      currentUtterance: null,
      lastError: "Browser TTS not supported",
    });
    onDone();
    return;
  }

  console.warn("[BrowserEngine] Invoking browser fallback speech engine.");
  showSpeechToast("Browser Voice", "Using browser voice (default or male)", "default");
  speakWithBrowser(
    text,
    config,
    updateState,
    onDone,
    (event) => {
      updateState({
        isSpeaking: false,
        currentUtterance: null,
        lastError: event.error || "Unknown error (browser TTS)",
      });
      showSpeechToast("Browser Voice Error", event.error || "Unknown error (browser TTS)", "destructive");
      console.error("[BrowserEngine] [Browser TTS error]", event);
    }
  );
}
