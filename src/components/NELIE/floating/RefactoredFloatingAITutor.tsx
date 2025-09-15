// --- replace your current speech code with THIS ---

// Optional external speech hook (temporarily disabled to avoid double-speak)
// import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";
// let hookSpeak: ((t: string) => void) | undefined;
// try { hookSpeak = useUnifiedSpeech()?.speakAsNelie; } catch {}
const hookSpeak = undefined; // <— force native TTS for now

// Make sure voices exist before we try to speak
async function ensureVoicesLoaded(timeout = 1500) {
  const synth = window.speechSynthesis;
  if (synth.getVoices().length) return true;
  await new Promise<void>((resolve) => {
    const t = setTimeout(resolve, timeout);
    const on = () => {
      clearTimeout(t);
      resolve();
    };
    synth.addEventListener("voiceschanged", on, { once: true });
    // Kick Chrome to populate voices
    synth.getVoices();
  });
  return true;
}

// Stop anything currently speaking, and wait a moment
async function stopCurrent(maxWait = 300) {
  const synth = window.speechSynthesis;
  if (synth.speaking || synth.pending) synth.cancel();
  const start = performance.now();
  while ((synth.speaking || synth.pending) && performance.now() - start < maxWait) {
    await new Promise((r) => setTimeout(r, 25));
  }
}

// Native TTS (robust)
async function speakNative(text: string) {
  if (!text) return;
  await ensureVoicesLoaded();
  await stopCurrent();

  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(text);

  const all = synth.getVoices();
  const voice =
    all.find((v) => v.lang?.toLowerCase().startsWith("da")) ||
    all.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
    all[0];

  if (voice) u.voice = voice;
  u.lang = voice?.lang || "da-DK";
  u.rate = 1;
  u.pitch = 1;

  u.onstart = () => console.debug("[NELIE:TTS] start", u.lang, voice?.name);
  u.onerror = (e) => console.warn("[NELIE:TTS] error", e);
  u.onend = () => console.debug("[NELIE:TTS] end");

  synth.speak(u);
}

// Public speak function used by buttons
function speakNelie(text: string) {
  // If/when you want to re-enable the hook, remove the early return and
  // call speakNative(text) in a catch if the hook fails.
  // if (hookSpeak) {
  //   try {
  //     const r = (hookSpeak as any)(text);
  //     if (r?.then) r.catch(() => speakNative(text));
  //     return;
  //   } catch {
  //     /* fall through */
  //   }
  // }
  void speakNative(text);
}

// Ensure browsers with strict gesture policies are "primed"
import { useEffect } from "react";
useEffect(() => {
  const resume = () => {
    try {
      // @ts-ignore resume exists in browsers
      window.speechSynthesis?.resume?.();
    } catch {}
  };
  document.addEventListener("click", resume, { once: true });
  return () => document.removeEventListener("click", resume);
}, []);
// --- end replacement ---
