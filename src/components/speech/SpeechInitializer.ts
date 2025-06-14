
import { selectOptimalVoice, SpeechConfig } from "./SpeechConfig";
import { SpeechState } from "./SpeechState";
import { elevenLabsSpeechEngine } from "./ElevenLabsSpeechEngine";

export async function initializeSpeechEngines(
  config: SpeechConfig,
  updateState: (updates: Partial<SpeechState>) => void,
  currentState: SpeechState
) {
  updateState({ isLoading: true });
  const elevenLabsAvailable = await elevenLabsSpeechEngine.isAvailable();

  if (elevenLabsAvailable && config.preferElevenLabs) {
    updateState({
      usingElevenLabs: true,
      isReady: true,
      isLoading: false,
      lastError: null,
    });
  } else {
    await initializeBrowserSpeech(config, updateState);
    updateState({ usingElevenLabs: false });
  }
}

async function initializeBrowserSpeech(
  config: SpeechConfig,
  updateState: (updates: Partial<SpeechState>) => void
) {
  if (typeof speechSynthesis === "undefined") {
    updateState({
      lastError: "Speech synthesis not supported in this browser",
      isReady: false,
      isLoading: false,
    });
    return;
  }
  await waitForVoices(config, updateState);
  await performInitialTest(updateState);
}

async function waitForVoices(
  config: SpeechConfig,
  updateState: (updates: Partial<SpeechState>) => void,
  timeout = 5000
) {
  return new Promise<void>((resolve) => {
    const checkVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        config.voice = selectOptimalVoice(voices) || undefined;
        updateState({
          voicesLoaded: true,
          isLoading: false,
          isReady: true,
          lastError: null,
        });
        resolve();
      }
    };
    checkVoices();
    speechSynthesis.addEventListener("voiceschanged", checkVoices);
    setTimeout(() => {
      updateState({
        voicesLoaded: true,
        isLoading: false,
        isReady: true,
        lastError: "Using browser default voice",
      });
      resolve();
    }, timeout);
  });
}

async function performInitialTest(updateState: (updates: Partial<SpeechState>) => void) {
  try {
    const testUtterance = new SpeechSynthesisUtterance("");
    testUtterance.volume = 0;
    speechSynthesis.speak(testUtterance);
  } catch (error) {
    updateState({
      lastError: "Speech test failed: " + (error as Error).message,
    });
  }
}
