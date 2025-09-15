import { useEffect, useRef, useState } from "react";

type UseUnifiedSpeech = {
  speakAsNelie: (text: string, opts?: { lang?: string }) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
};

async function ensureVoicesLoaded(timeout = 1500) {
  const synth = window.speechSynthesis;
  if (synth.getVoices().length) return;
  await new Promise<void>((resolve) => {
    const t = setTimeout(resolve, timeout);
    const on = () => {
      clearTimeout(t);
      resolve();
    };
    synth.addEventListener("voiceschanged", on, { once: true });
    // poke Chrome to populate list
    synth.getVoices();
  });
}

export function useUnifiedSpeech(): UseUnifiedSpeech {
  const [isSpeaking, setSpeaking] = useState(false);
  const current = useRef<SpeechSynthesisUtterance | null>(null);

  // Prime audio on first gesture (required by browsers)
  useEffect(() => {
    const resume = () => {
      try {
        window.speechSynthesis?.resume();
      } catch {}
    };
    document.addEventListener("click", resume, { once: true });
    return () => document.removeEventListener("click", resume);
  }, []);

  async function speakAsNelie(text: string, opts?: { lang?: string }) {
    if (!text) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("[useUnifiedSpeech] speechSynthesis not available");
      return;
    }

    const synth = window.speechSynthesis;
    // Stop any ongoing utterance
    synth.cancel();
    await ensureVoicesLoaded();

    const pref = (opts?.lang || "da-DK").toLowerCase();
    const u = new SpeechSynthesisUtterance(text);

    const voices = synth.getVoices();
    const v =
      voices.find((x) => x.lang?.toLowerCase() === pref) ||
      voices.find((x) => x.lang?.toLowerCase().startsWith(pref.split("-")[0])) ||
      voices.find((x) => x.lang?.toLowerCase().startsWith("en")) ||
      voices[0];

    if (v) u.voice = v;
    u.lang = v?.lang || pref;
    u.rate = 1;
    u.pitch = 1;

    u.onstart = () => setSpeaking(true);
    u.onend = () => {
      setSpeaking(false);
      current.current = null;
    };
    u.onerror = (e) => {
      console.warn("[useUnifiedSpeech] error", e);
      setSpeaking(false);
      current.current = null;
    };

    current.current = u;
    synth.speak(u);
  }

  function stop() {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setSpeaking(false);
    current.current = null;
  }

  return { speakAsNelie, stop, isSpeaking };
}

export default useUnifiedSpeech;
