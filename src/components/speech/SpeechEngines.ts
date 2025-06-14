
import { SpeechConfig } from "./SpeechConfig";
import { ElevenLabsEngine } from "./engine/ElevenLabsEngine";
import { browserSpeakFallback } from "./engine/BrowserEngine";

export async function speakWithEngines(
  text: string,
  useElevenLabs: boolean,
  config: SpeechConfig,
  updateState: (partial: any) => void,
  onDone: () => void,
  shouldTryElevenLabs: boolean,
  isCheckingElevenLabs?: boolean
) {
  console.log("‼️‼️ [SpeechEngines] ENTERING speakWithEngines ‼️‼️", {
    text: text.substring(0, 50),
    useElevenLabs,
    shouldTryElevenLabs,
  });

  // Remove toast notifications to avoid confusing students
  window.addEventListener("nelie-tts-engine", (evt) => {
    const detail = (evt as CustomEvent).detail || {};
    console.info("[SpeechEngines] Speech engine event:", detail);
  }, { once: true });

  if (shouldTryElevenLabs && useElevenLabs) {
    console.log("‼️ [SpeechEngines] Condition MET. Trying ElevenLabs.");

    const success = await ElevenLabsEngine.speak(text);
    console.log("‼️ [SpeechEngines] ElevenLabs success status:", success);

    if (success) {
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
      window.dispatchEvent(new CustomEvent("nelie-tts-engine", { detail: { engine: "browser-fallback", source: "elevenlabs-failed" } }));
      console.warn(`❗ [SpeechEngines] ${errorMsg}`);
    }
  } else {
    if (!shouldTryElevenLabs) {
      console.warn("‼️ [SpeechEngines] Skipping ElevenLabs: shouldTryElevenLabs is false");
    } else if (!useElevenLabs) {
      console.warn("‼️ [SpeechEngines] Skipping ElevenLabs: useElevenLabs is false (user/config does not prefer)");
    }
  }

  // Use browser fallback without showing technical messages to students
  console.warn("*** [SpeechEngines] USING BROWSER VOICE FALLBACK NOW! ***");
  window.dispatchEvent(new CustomEvent("nelie-tts-engine", { detail: { engine: "browser-fallback", source: "direct-fallback" } }));

  console.log("‼️ [SpeechEngines] Executing browser fallback.");
  browserSpeakFallback({
    text,
    config,
    updateState,
    onDone,
  });
}
