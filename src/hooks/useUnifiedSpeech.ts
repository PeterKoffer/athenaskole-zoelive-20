import { useEffect, useRef, useState } from "react";

type UseUnifiedSpeech = {
  speakAsNelie: (text: string, opts?: { lang?: string }) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ensureVoicesLoaded(timeoutMs = 1500) {
  const synth = window.speechSynthesis;
  // poke Chrome/Safari so it actually populates voices
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

  // Unlock/resume audio on first user gesture (browser policy)
  useEffect(() => {
    const unlock = () => {
      try {
        // resume speech engine
        window.speechSynthesis.resume();
        // also unlock audio context if any libs create one later
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AC) {
          const ctx = new AC();
          ctx.resume?.();
          ctx.close?.();
        }
      } catch {}
    };
    document.addEventListener("pointerdown", unlock, { once: true, capture: true });
    return () => document.removeEventListener("pointerdown", unlock, { capture: true } as any);
  }, []);

  async function speakAsNelie(text: string, opts?: { lang?: string }) {
    if (!text?.trim()) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    // If something is mid-flight, cancel and wait a tick so we don't
    // immediately self-cancel.
    if (synth.speaking || synth.pending) {
      synth.cancel();
      await wait(60);
    }

    await ensureVoicesLoaded();

    const want = (opts?.lang || "da-DK").toLowerCase();
    const voices = synth.getVoices();

    const voice =
      voices.find((v) => v.lang?.toLowerCase() === want) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith(want.split("-")[0])) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0];

    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || "en-US"; // hard fallback that always exists
    u.rate = 1;
    u.pitch = 1;

    u.onstart = () => setSpeaking(true);
    u.onend = () => {
      setSpeaking(false);
      utterRef.current = null;
    };
    u.onerror = () => {
      // swallow the noisy "canceled" error Chrome fires after cancel()
      setSpeaking(false);
      utterRef.current = null;
    };

    utterRef.current = u;
    synth.resume();
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
