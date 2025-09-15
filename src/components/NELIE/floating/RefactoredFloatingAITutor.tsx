import React, { useEffect, useRef, useState } from "react";

/** ---------- Voice / priming utilities ---------- */
let VOICES: SpeechSynthesisVoice[] = [];
let voicesReady = false;
let primed = false;

function refreshVoices() {
  try {
    const synth = window.speechSynthesis;
    VOICES = synth.getVoices() || [];
    voicesReady = VOICES.length > 0;
  } catch {}
}

function setupVoiceEventsOnce() {
  try {
    const synth = window.speechSynthesis;
    refreshVoices();
    synth.addEventListener?.("voiceschanged", refreshVoices, { once: false });
    // poke Chrome
    synth.getVoices();
  } catch {}
}

/** Hard-unlock: speak a single space at volume 0, then cancel. */
function primeAudioOnce() {
  if (primed) return;
  primed = true;
  const unlock = () => {
    try {
      const synth = window.speechSynthesis;
      // Some engines need an utterance to “open” the pipeline
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0; // inaudible
      u.onend = () => synth.cancel();
      synth.speak(u);
      // Also resume if the engine is paused
      // @ts-ignore
      synth.resume?.();
    } catch {}
    document.removeEventListener("click", unlock);
    document.removeEventListener("keydown", unlock);
  };
  document.addEventListener("click", unlock);
  document.addEventListener("keydown", unlock);
}

/** Pick specific voice: prefer Danish -> English -> first */
function pickVoice(langHint?: "da" | "en") {
  if (!VOICES.length) refreshVoices();
  if (langHint === "da") {
    return (
      VOICES.find((v) => /da/i.test(v.lang) || /dansk/i.test(v.name)) ||
      VOICES.find((v) => /en/i.test(v.lang)) ||
      VOICES[0] ||
      null
    );
  }
  if (langHint === "en") {
    return (
      VOICES.find((v) => /en/i.test(v.lang)) ||
      VOICES.find((v) => /da/i.test(v.lang)) ||
      VOICES[0] ||
      null
    );
  }
  return (
    VOICES.find((v) => /da/i.test(v.lang) || /dansk/i.test(v.name)) ||
    VOICES.find((v) => /en/i.test(v.lang)) ||
    VOICES[0] ||
    null
  );
}

/** Speak with 0–2 retries if voices aren’t ready yet. NO awaits to keep gesture context. */
function speakNow(text: string, langPref: "da" | "en" = "da") {
  const t = (text || "").trim();
  if (!t) return;

  const trySpeak = (attempt: number) => {
    const synth = window.speechSynthesis;
    try {
      // Cancel then schedule speak in next tick to avoid cancel-race
      synth.cancel();
      setTimeout(() => {
        const u = new SpeechSynthesisUtterance(t);
        const v = pickVoice(langPref);
        if (v) {
          u.voice = v;
          u.lang = v.lang || (langPref === "da" ? "da-DK" : "en-US");
        } else {
          u.lang = langPref === "da" ? "da-DK" : "en-US";
        }
        u.rate = 1;
        u.pitch = 1;
        u.volume = 1;

        u.onstart = () => console.debug("[NELIE:TTS] start", u.lang, u.voice?.name);
        u.onerror = (e) => {
          console.warn("[NELIE:TTS] error", e);
          // If it failed because voices weren’t ready, retry a couple times
          if (attempt < 2) setTimeout(() => trySpeak(attempt + 1), 250);
        };
        u.onend = () => console.debug("[NELIE:TTS] end");

        synth.speak(u);
      }, 0);
    } catch (e) {
      console.warn("[NELIE:TTS] speak error", e);
      if (attempt < 2) setTimeout(() => trySpeak(attempt + 1), 250);
    }
  };

  trySpeak(0);
}

/** ---------- Component ---------- */
export default function RefactoredFloatingAITutor() {
  useEffect(() => {
    setupVoiceEventsOnce();
    primeAudioOnce();
  }, []);

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const [voiceInfo, setVoiceInfo] = useState<string>("");

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

  const speak = (text: string, lang: "da" | "en" = "da") => {
    const v = pickVoice(lang);
    setVoiceInfo(v ? `${v.lang} — ${v.name}` : "no voice");
    speakNow(text, lang);
  };

  const send = () => {
    speak(input || "Hej, jeg er NELIE. Hvad vil du lære i dag?", "da");
  };

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onClick={() => setOpen(!open)}
        className="floating-tutor-container w-24 h-24 cursor-move"
        style={{ left: pos.x, top: pos.y }}
        title="NELIE"
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
              onClick={() => speak("Dette er en test fra NELIE.", "da")}
              title="Test dansk stemme"
            >
              ▶︎ Test (DA)
            </button>
            <button
              className="border rounded px-3 py-1 text-sm"
              onClick={() => speak("This is a test from NELIE.", "en")}
              title="Test English voice"
            >
              ▶︎ Test (EN)
            </button>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Voices: {voicesReady ? VOICES.length : "loading…"}{voiceInfo ? ` • Using: ${voiceInfo}` : ""}
          </div>
        </div>
      )}
    </>
  );
}
