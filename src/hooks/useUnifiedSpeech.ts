import { useEffect, useRef, useState } from "react";

/* ---------- tiny utils ---------- */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------- robust voice boot ---------- */
async function ensureVoicesLoaded(maxWaitMs = 2000) {
  const synth = window.speechSynthesis;
  // prod the engine
  try { synth.resume(); } catch {}
  synth.getVoices();

  if (synth.getVoices().length) return true;

  // wait for voiceschanged OR poll for up to maxWaitMs
  let resolved = false;
  await new Promise<void>((resolve) => {
    const t = setTimeout(() => {
      if (!resolved) resolve();
    }, maxWaitMs);

    const on = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(t);
      resolve();
    };

    synth.addEventListener("voiceschanged", on, { once: true });
  });

  // last nudge
  synth.getVoices();
  return true;
}

async function stopCurrent(maxWaitMs = 300) {
  const synth = window.speechSynthesis;
  if (synth.speaking || synth.pending) synth.cancel();
  const start = performance.now();
  while ((synth.speaking || synth.pending) && performance.now() - start < maxWaitMs) {
    await sleep(25);
  }
}

async function speakNative(text: string, preferredLang?: string) {
  if (!text?.trim()) return;
  const synth = window.speechSynthesis;

  await ensureVoicesLoaded();
  // DO NOT call cancel repeatedly; one clean stop before speaking
  await stopCurrent();

  const u = new SpeechSynthesisUtterance(text);

  const voices = synth.getVoices();
  const langLower = (preferredLang || "").toLowerCase();

  const voice =
    (langLower && voices.find((v) => v.lang?.toLowerCase().startsWith(langLower))) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("da")) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
    voices[0];

  if (voice) u.voice = voice;
  u.lang = voice?.lang || preferredLang || "da-DK";
  u.rate = 1;
  u.pitch = 1;

  synth.resume(); // in case the engine is suspended

  return new Promise<void>((resolve) => {
    u.onend = () => resolve();
    u.onerror = () => resolve(); // swallow ‘canceled’ etc.
    synth.speak(u);
  });
}

/* ---------- prime on first gesture (autoplay policy) ---------- */
function usePrimeSpeech() {
  useEffect(() => {
    const unlock = () => {
      try {
        window.speechSynthesis?.resume?.();
        window.speechSynthesis?.getVoices?.();
      } catch {}
    };
    document.addEventListener("pointerdown", unlock, { once: true, capture: true });
    return () => document.removeEventListener("pointerdown", unlock, { capture: true } as any);
  }, []);
}

/* ---------- exported hook (single, safe API) ---------- */
export function useUnifiedSpeech() {
  usePrimeSpeech();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentRef = useRef<Promise<void> | null>(null);

  const speakAsNelie = async (text: string, opts?: { lang?: string }) => {
    setIsSpeaking(true);
    try {
      // serialize calls so nothing cancels mid-utterance
      currentRef.current = (currentRef.current || Promise.resolve()).then(() =>
        speakNative(text, opts?.lang)
      );
      await currentRef.current;
    } finally {
      setIsSpeaking(false);
      currentRef.current = null;
    }
  };

  const stop = async () => {
    try {
      await stopCurrent();
    } finally {
      setIsSpeaking(false);
      currentRef.current = null;
    }
  };

  return { speakAsNelie, isSpeaking, stop };
}

export default useUnifiedSpeech;

