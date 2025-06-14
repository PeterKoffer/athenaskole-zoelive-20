import { SpeechConfig } from "./SpeechConfig";
import { speakWithElevenLabs } from "./engine/ElevenLabsSpeak";
import { speakWithBrowser } from "./engine/BrowserSpeak";
import { elevenLabsSpeechEngine } from "./ElevenLabsSpeechEngine";
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
    const elevenDone = await speakWithElevenLabs(
      text,
      () => {
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
      showSpeechToast("ElevenLabs Used", "Voice: Aria (premium)", "success");
      console.log('✅ [SpeechEngines] ElevenLabs speech finished successfully.');
      return;
    } else {
      showSpeechToast("ElevenLabs Fallback", "Falling back to browser speech (Aria/Nelie unavailable)", "destructive");
      console.warn('❗ [SpeechEngines] ElevenLabs failed, will attempt browser fallback.');
    }
  } else {
    if (!shouldTryElevenLabs) {
      console.warn("[SpeechEngines] Skipping ElevenLabs: shouldTryElevenLabs is false");
    } else if (!useElevenLabs) {
      console.warn("[SpeechEngines] Skipping ElevenLabs: useElevenLabs is false (user/config does not prefer)");
    }
  }

  if (isCheckingElevenLabs) {
    // Don't fallback or do anything else until EL check is over
    showSpeechToast("Speech Delayed", "Still checking for premium voice (ElevenLabs)...", "default");
    console.log('⏳ [SpeechEngines] Still checking for ElevenLabs, not falling back to browser. Speech request paused.');
    return;
  }

  // Fallback to browser TTS only when allowed (never until EL is fully checked)
  if (typeof speechSynthesis === "undefined") {
    showSpeechToast("Speech Error", "Browser speech synthesis not supported", "destructive");
    updateState({
      isSpeaking: false,
      currentUtterance: null,
      lastError: "Browser TTS not supported"
    });
    onDone();
    return;
  }

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
      console.error('[SpeechEngines] [Browser TTS error]', event);
    }
  );
}
