import { useEffect, useRef, useState } from "react";

type UseUnifiedSpeech = {
  speakAsNelie: (text: string, opts?: { lang?: string }) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function ensureVoicesLoaded(timeoutMs = 1500) {
  const synth = window.speechSynthesis;
  // poke Chrome to populate
  synth.getVoices();
  if (synth.getVoices().length) return;
  await new Promise<void>((resolve) => {
    const t = setTimeout(resolve, timeoutMs);
    const on = () => {
      clearTimeout(t);
      resolve();
    };
    synth.addEventListener("voiceschanged", on, { once: true });
  });
}

export function useUnifiedSpeech(): UseUnifiedSpeech {
  const [isSpeaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Prime/resume on first user gesture (browser requirement)
  useEffect(() => {
    const prime = () => {
      try {
        window.speechSynthesis.resume();
      } catch {}
    };
    document.addEventListener("click", prime, { once: true });
    return () => document.removeEventListener("click", prime);
  }, []);

  async function speakAsNelie(text: string, opts?: { lang?: string }) {
    if (!text?.trim()) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    // If something is already speaking, cancel and wait a tick
    if (synth.speaking || synth.pending) {
      synth.cancel();
      await sleep(60);
    }

    await ensureVoicesLoaded();

    const langPref = (opts?.lang || "da-DK").toLowerCase();
    const voices = synth.getVoices();

    const voice =
      voices.find((v) => v.lang?.toLowerCase() === langPref) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith(langPref.split("-")[0])) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0];

    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || langPref;
    u.rate = 1;
    u.pitch = 1;

    u.onstart = () => setSpeaking(true);
    u.onend = () => {
      setSpeaking(false);
      utterRef.current = null;
    };
    u.onerror = () => {
      // swallow "canceled" noise
      setSpeaking(false);
      utterRef.current = null;
    };

    utterRef.current = u;
    synth.resume(); // if the engine was paused
    synth.speak(u);
  }

  function stop() {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setSpeaking(false);
    utterRef.current = null;
  }

  return { speakAsNelie, stop, isSpeaking };
}

export default useUnifiedSpeech;
