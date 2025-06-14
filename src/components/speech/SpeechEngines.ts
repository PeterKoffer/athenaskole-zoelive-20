
import { SpeechConfig } from "./SpeechConfig";
import { ElevenLabsEngine } from "./engine/ElevenLabsEngine";
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
  console.log("‼️‼️ [SpeechEngines] ENTERING speakWithEngines ‼️‼️", {
    text: text.substring(0, 50),
    useElevenLabs,
    shouldTryElevenLabs,
  });

  // If we should try ElevenLabs, and it is user preference, always try first!
  if (shouldTryElevenLabs && useElevenLabs) {
    console.log("‼️ [SpeechEngines] Condition MET. Trying ElevenLabs.");
    showSpeechToast("Trying ElevenLabs...", "Attempting to generate premium voice...", "default");

    const success = await ElevenLabsEngine.speak(text);
    console.log("‼️ [SpeechEngines] ElevenLabs success status:", success);

    if (success) {
      showSpeechToast("ElevenLabs Success", "Premium voice playback complete.", "success");
      console.log("✅ [SpeechEngines] ElevenLabs speech finished successfully.");
      updateState({ isSpeaking: false, lastError: null });
      onDone();
      return;
    } else {
      const errorMsg = "ElevenLabs engine failed. Falling back to browser voice.";
      console.log("‼️ [SpeechEngines] ElevenLabs FAILED. Preparing to fall back.");
      updateState({
        usingElevenLabs: false,
        lastError: errorMsg,
      });
      showSpeechToast("ElevenLabs Fallback", "Falling back to browser speech.", "destructive");
      console.warn(`❗ [SpeechEngines] ${errorMsg}`);
    }
  } else {
    if (!shouldTryElevenLabs) {
      console.warn("‼️ [SpeechEngines] Skipping ElevenLabs: shouldTryElevenLabs is false");
    } else if (!useElevenLabs) {
      console.warn("‼️ [SpeechEngines] Skipping ElevenLabs: useElevenLabs is false (user/config does not prefer)");
    }
  }

  // The check for isCheckingElevenLabs was removed from here because it was causing silent failures.
  // The main guard in UnifiedSpeechSystem.speak() is sufficient and handles retries gracefully.

  console.log("‼️ [SpeechEngines] Executing browser fallback.");
  browserSpeakFallback({
    text,
    config,
    updateState,
    onDone,
  });
}
