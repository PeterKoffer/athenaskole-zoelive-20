
import { SpeechConfig } from "./SpeechConfig";
import { speakWithElevenLabs } from "./engine/ElevenLabsSpeak";
import { browserSpeakFallback } from "./engine/BrowserEngine";
import { showSpeechToast } from "./ToastUtils";

export async function speakWithEngines(
  text: string,
  useElevenLabs: boolean,
  config: SpeechConfig,
  updateState: (partial: any) => void,
  onDone: () => void,
  shouldTryElevenLabs: boolean,
  isCheckingElevenLabs?: boolean // new argument, to track EL check state
) {
  console.log("✨ [SpeechEngines] speakWithEngines called", {
    text,
    useElevenLabs,
    config,
    shouldTryElevenLabs,
    isCheckingElevenLabs,
  });

  // If we should try ElevenLabs, and it is user preference, always try first!
  if (shouldTryElevenLabs && useElevenLabs) {
    console.log("🔎 [SpeechEngines] Trying ElevenLabs speech engine...");
    showSpeechToast("Trying ElevenLabs...", "Attempting Aria voice via ElevenLabs", "default");
    const elevenDone = await speakWithElevenLabs(
      text,
      () => {
        showSpeechToast("ElevenLabs Finished", "Audio playback completed.", "success");
        updateState({ isSpeaking: false, lastError: null });
        onDone();
      },
      (msg) => {
        updateState({
          usingElevenLabs: false,
          lastError: "ElevenLabs error, fallback to browser: " + msg,
        });
        showSpeechToast("ElevenLabs Error", "Falling back to browser voice: " + msg, "destructive");
        console.warn("🛑 [SpeechEngines] ElevenLabs failed with:", msg);
        // No return, continue to fallback (browser)
      }
    );
    if (elevenDone) {
      showSpeechToast("ElevenLabs Used", "Voice: Aria (premium) [Audio playback should be Aria]", "success");
      console.log("✅ [SpeechEngines] ElevenLabs speech finished successfully (Aria, premium).");
      return;
    } else {
      showSpeechToast("ElevenLabs Fallback", "Falling back to browser speech (Aria/Nelie unavailable)", "destructive");
      console.warn("❗ [SpeechEngines] ElevenLabs failed, will attempt browser fallback.");
    }
  } else {
    if (!shouldTryElevenLabs) {
      console.warn("[SpeechEngines] Skipping ElevenLabs: shouldTryElevenLabs is false");
    } else if (!useElevenLabs) {
      console.warn("[SpeechEngines] Skipping ElevenLabs: useElevenLabs is false (user/config does not prefer)");
    }
  }

  // The check for isCheckingElevenLabs was removed from here because it was causing silent failures.
  // The main guard in UnifiedSpeechSystem.speak() is sufficient and handles retries gracefully.

  browserSpeakFallback({
    text,
    config,
    updateState,
    onDone,
  });
}
