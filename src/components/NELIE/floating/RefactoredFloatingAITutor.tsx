import React, { useEffect, useRef, useState } from "react";

/** ---- Voice/bootstrap utilities ---- */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ensureVoicesLoaded(maxWaitMs = 3000) {
  const synth = window.speechSynthesis;
  if (synth.getVoices().length) return true;

  let resolved = false;
  await new Promise<void>((resolve) => {
    const t = setTimeout(() => {
      if (!resolved) resolve();
    }, maxWaitMs);
    const on = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(t);
        resolve();
      }
    };
    synth.addEventListener("voiceschanged", on, { once: true });
    // poke Chrome
    try {
      synth.getVoices();
    } catch {}
  });

  return true;
}

async function primeAudioOnce() {
  // WebAudio “poke” helps autoplay unlock on some systems
  try {
    // @ts-ignore
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    await ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch {}
  try {
    window.speechSynthesis?.resume();
  } catch {}
}

/** Single speak — guarded cancel to coexist with global cancel patch */
async function speakNativeOnce(text: string) {
  if (!text) return;

  await ensureVoicesLoaded(3000);
  try {
    window.speechSynthesis.resume();
  } catch {}

  const synth = window.speechSynthesis;

  // If currently speaking or queued, stop it (allow just OUR cancel)
  if (synth.speaking || synth.pending) {
    (window as any).__NELIE_ALLOW_CANCEL__ = true;
    try {
      synth.cancel();
    } finally {
      (window as any).__NELIE_ALLOW_CANCEL__ = false;
    }
    await sleep(50);
  }

  const u = new SpeechSynthesisUtterance(text);

  const voices = synth.getVoices();
  // Prefer Danish, then English, then first available
  const pick =
    voices.find((v) => /da/i.test(v.lang) || /dansk/i.test(v.name)) ||
    voices.find((v) => /en/i.test(v.lang)) ||
    voices[0];

  if (pick) u.voice = pick;
  u.lang = pick?.lang || "da-DK";
  u.rate = 1;
  u.pitch = 1;
  u.volume = 1;

  u.onstart = () => console.log("🔊 speaking...", u.lang, u.voice?.name);
  u.onerror = (e) => console.warn("TTS error", e);
  u.onend = () => console.log("✅ done");

  // Tiny delay avoids spurious "canceled" on some macOS/Chrome combos
  await sleep(60);
  synth.speak(u);
}

/** ---- Component ---- */
export default function RefactoredFloatingAITutor() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const primedRef = useRef(false);

  // Drag logic
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

  // Prime on first user gesture
  useEffect(() => {
    const onFirst = async () => {
      if (primedRef.current) return;
      primedRef.current = true;
      await primeAudioOnce();
      await ensureVoicesLoaded(3000);
      console.log(
        "✅ audio & voices primed:",
        window.speechSynthesis.getVoices().length
      );
    };
    document.addEventListener("pointerdown", onFirst, { once: true });
    return () => document.removeEventListener("pointerdown", onFirst);
  }, []);

  const send = async () => {
    const t = input.trim();
    if (!t) return;
    await speakNativeOnce(t);
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
              onClick={() =>
                speakNativeOnce("Hej, jeg er NELIE. Hvad vil du lære i dag?")
              }
            >
              ▶︎ Test lyd
            </button>
          </div>
        </div>
      )}
    </>
  );
}
