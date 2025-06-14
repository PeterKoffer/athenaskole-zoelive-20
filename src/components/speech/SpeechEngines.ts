
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
  // If we should try ElevenLabs, and it is user preference, always try first!
  if (shouldTryElevenLabs && useElevenLabs) {
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
        // No return, continue to fallback (browser)
      }
    );
    if (elevenDone) {
      console.log('✅ ElevenLabs speech finished successfully.');
      return;
    } else {
      console.warn('❗ ElevenLabs failed, will attempt browser fallback.');
    }
  }

  if (isCheckingElevenLabs) {
    // Don't fallback or do anything else until EL check is over
    console.log('⏳ Still checking for ElevenLabs, not falling back to browser');
    return;
  }

  // Fallback to browser TTS only when allowed (never until EL is fully checked)
  if (typeof speechSynthesis === "undefined") {
    console.error('🚫 Browser speech synthesis not supported.');
    updateState({ isSpeaking: false, currentUtterance: null, lastError: "Browser TTS not supported" });
    onDone();
    return;
  }

  console.log('🗣️ Using browser speech synthesis fallback.');
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
      console.error('[Browser TTS error]', event);
    }
  );
}
