import React, { useEffect, useRef, useState } from "react";

/* ===========================
   Robust native TTS helpers
   =========================== */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ensureVoicesLoaded(timeoutMs = 1500) {
  const synth = window.speechSynthesis;
  // poke Chrome/Safari so it actually populates voices
  synth.getVoices();
  if (synth.getVoices().length) return true;

  await new Promise<void>((resolve) => {
    const t = setTimeout(resolve, timeoutMs);
    const on = () => {
      clearTimeout(t);
      resolve();
    };
    synth.addEventListener("voiceschanged", on, { once: true });
  });

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

async function speakNative(text: string) {
  if (!text?.trim()) return;

  await ensureVoicesLoaded();
  await stopCurrent();

  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(text);

  // pick a sensible voice: da-* → en-* → first
  const voices = synth.getVoices();
  const voice =
    voices.find((v) => v.lang?.toLowerCase().startsWith("da")) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
    voices[0];

  if (voice) u.voice = voice;
  u.lang = voice?.lang || "da-DK";
  u.rate = 1;
  u.pitch = 1;

  u.onstart = () => console.debug("[NELIE:TTS] start", u.lang, voice?.name);
  u.onerror = (e) => console.warn("[NELIE:TTS] error", e);
  u.onend = () => console.debug("[NELIE:TTS] end");

  synth.resume(); // in case engine was suspended
  synth.speak(u);
}

/** Prime speech on first user gesture (browser autoplay policy) */
function usePrimeSpeech() {
  useEffect(() => {
    const unlock = () => {
      try {
        window.speechSynthesis?.resume?.();
        // also gently prod voices list
        window.speechSynthesis?.getVoices?.();
      } catch {}
    };
    document.addEventListener("pointerdown", unlock, { once: true, capture: true });
    return () => document.removeEventListener("pointerdown", unlock, { capture: true } as any);
  }, []);
}

/* ===========================
   Component
   =========================== */

export default function RefactoredFloatingAITutor() {
  usePrimeSpeech();

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // drag handlers
  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (dragging) setPos({ x: e.pageX - rel.x, y: e.pageY - rel.y });
    };
    const mu = () => setDragging(false);
    document.addEventListener("mousemove", mm);
    document.addEventListener("mouseup", mu);
    return () => {
      document.removeEventListener("mousemove", mm);
      document.removeEventListener("mouseup", mu);
    };
  }, [dragging, rel]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setDragging(true);
    setRel({ x: e.pageX - r.left, y: e.pageY - r.top });
    e.stopPropagation();
    e.preventDefault();
  };

  const speakNelie = (text: string) => {
    void speakNative(text);
  };

  const send = () => {
    const t = input.trim();
    if (!t) return;
    speakNelie(t);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onClick={() => setOpen(!open)}
        className="floating-tutor-container w-24 h-24 cursor-move"
        style={{ left: pos.x, top: pos.y }}
      >
        <img
          src="/nelie.png"
          alt="NELIE"
          className="nelie-avatar w-full h-full pointer-events-none"
          draggable={false}
        />
      </div>

      {open && (
        <div
          className="fixed z-[2147483647] w-80 bg-white rounded-lg shadow-xl p-3"
          style={{ left: pos.x + 100, top: pos.y - 20 }}
        >
          <div className="font-bold text-blue-600 mb-2">NELIE</div>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={4}
            placeholder="Skriv til NELIE..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              className="bg-blue-600 text-white rounded px-3 py-1 text-sm"
              onClick={send}
              aria-label="Tal"
            >
              🔊 Tal
            </button>
            <button
              className="border rounded px-3 py-1 text-sm"
              onClick={() => speakNelie("Hej, jeg er NELIE. Hvad vil du lære i dag?")}
            >
              ▶︎ Test lyd
            </button>
          </div>
        </div>
      )}
    </>
  );
}
