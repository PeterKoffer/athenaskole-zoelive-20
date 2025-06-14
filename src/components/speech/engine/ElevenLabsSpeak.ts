
import { elevenLabsSpeechEngine } from "../ElevenLabsSpeechEngine";

export async function speakWithElevenLabs(
  text: string,
  onDone: () => void,
  onError: (msg: string) => void
) {
  try {
    const success = await elevenLabsSpeechEngine.speak(text);
    if (success) {
      onDone();
      return true;
    } else {
      onError("ElevenLabs returned failure.");
      return false;
    }
  } catch (err) {
    onError("ElevenLabs error: " + (err instanceof Error ? err.message : "Unknown error"));
    return false;
  }
}
