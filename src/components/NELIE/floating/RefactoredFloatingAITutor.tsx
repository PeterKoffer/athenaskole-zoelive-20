// src/components/NELIE/floating/RefactoredFloatingAITutor.tsx
import React, { useEffect, useRef, useState } from "react";

/** ---------- Voice cache & priming (module-level) ---------- */
let VOICES: SpeechSynthesisVoice[] = [];
let voicesReady = false;
let primed = false;

function loadVoicesOnce() {
  try {
    const synth = window.speechSynthesis;
    const fill = () => {
      VOICES = synth.getVoices() || [];
      voicesReady = VOICES.length > 0;
    };
    fill();
    synth.addEventListener?.("voiceschanged", () => {
      fill();
    });
    // poke Chrome to populate
    synth.getVoices();
  } catch {}
}

function primeAudioOnce() {
  if (primed) return;
  primed = true;
  try {
    // resume the speech engine as soon as we get *any* gesture
    const resume = () => {
      try {
        // @ts-ignore
        window.speechSynthesis?.resume?.();
      } catch {}
      document.removeEventListener("click", resume);
      document.removeEventListener("keydown", resume);
    };
    document.addEventListener("click", resume);
    document.addEventListener("keydown", resume);
  } catch {}
}

/** Pick a stable voice (prefer Danish → English → first) */
function pickVoice() {
  if (!VOICES.length) VOICES = window.speechSynthesis.getVoices() || [];
  return (
    VOICES.find((v) => /da/i.test(v.lang) || /dansk/i.test(v.name)) ||
    VOICES.find((v) => /en/i.test(v.lang)) ||
    VOICES[0] ||
    null
  );
}

/** Speak immediately (no awaits) to keep user-gesture context */
function speakNow(text: string) {
  const t = (text || "").trim();
  if (!t) return;

  const synth = window.speechSynthesis;
  try {
    // Cancel quickly then speak in the *same tick*
    synth.cancel();

    const u = new SpeechSynthesisUtterance(t);
    const v = pickVoice();

    if (v) {
      u.voice = v;
      u.lang = v.lang || (/da/i.test(v.name) ? "da-DK" : "en-US");
    } else {
      u.lang = "en-US"; // safe default if voices array is empty
    }
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;

    u.onstart = () => console.debug("[NELIE:TTS] start", u.lang, u.voice?.name);
    u.onerror = (e) => console.warn("[NELIE:TTS] error", e);
    u.onend = () => console.debug("[NELIE:TTS] end");

    synth.speak(u);
  } catch (e) {
    console.warn("[NELIE:TTS] speakNow error", e);
  }
}

/** ---------- Component ---------- */
export default function RefactoredFloatingAITutor() {
  // make sure we prime once per page
  useEffect(() => {
    loadVoicesOnce();
    primeAudioOnce();
  }, []);

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = (e: MouseEvent) =>
      dragging && setPos({ x: e.pageX - rel.x, y: e.pageY - rel.y });
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

  const send = () => {
    // IMPORTANT: call speakNow synchronously from the click
    speakNow(input);
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
              onClick={() => speakNow("Hej, jeg er NELIE. Hvad vil du lære i dag?")}
            >
              ▶︎ Test lyd
            </button>
          </div>
          {!voicesReady && (
            <div className="mt-2 text-xs text-slate-500">Indlæser stemmer…</div>
          )}
        </div>
      )}
    </>
  );
}
