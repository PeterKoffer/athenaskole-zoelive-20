
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
        console.warn("🛑 [SpeechEngines] ElevenLabs failed with:", msg);
        // No return, continue to fallback (browser)
      }
    );
    if (elevenDone) {
      console.log('✅ [SpeechEngines] ElevenLabs speech finished successfully.');
      return;
    } else {
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
    console.log('⏳ [SpeechEngines] Still checking for ElevenLabs, not falling back to browser. Speech request paused.');
    return;
  }

  // Fallback to browser TTS only when allowed (never until EL is fully checked)
  if (typeof speechSynthesis === "undefined") {
    console.error('🚫 [SpeechEngines] Browser speech synthesis not supported.');
    updateState({
      isSpeaking: false,
      currentUtterance: null,
      lastError: "Browser TTS not supported"
    });
    onDone();
    return;
  }

  console.log('🗣️ [SpeechEngines] Using browser speech synthesis fallback.');
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
      console.error('[SpeechEngines] [Browser TTS error]', event);
    }
  );
}

