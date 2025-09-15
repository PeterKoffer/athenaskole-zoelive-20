import React, { useEffect, useRef, useState } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

export default function RefactoredFloatingAITutor() {
  // UI
  const [open, setOpen] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  // Chat
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  // Optional external speech hook (if wired)
  let hookSpeak: ((t: string) => void) | undefined;
  try {
    hookSpeak = useUnifiedSpeech()?.speakAsNelie;
  } catch {
    /* ignore if hook requires providers we don't have yet */
  }

  // ---------- Robust native TTS fallback ----------
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const synth = window.speechSynthesis;
    // Trigger voice load
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, []);

  function speakNative(text: string) {
    if (!text) return;
    const synth = window.speechSynthesis;
    // Safari/Chrome occasionally start paused until a user gesture; resume just in case
    try {
      // @ts-ignore - exists in browsers
      if (synth?.paused) synth.resume();
    } catch {}
    synth.cancel(); // stop any previous utterance

    const u = new SpeechSynthesisUtterance(text);
    // Prefer Danish if present, then English as fallback
    const v =
      voices.find((v) => v.lang?.toLowerCase().startsWith("da")) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      undefined;
    if (v) u.voice = v;
    u.lang = v?.lang || "da-DK";
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
  }

  function speakNelie(text: string) {
    if (hookSpeak) {
      try {
        hookSpeak(text);
        return;
      } catch {
        // fall through to native if hook fails
      }
    }
    speakNative(text);
  }
  // ------------------------------------------------

  // Drag handlers
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

  // Tiny local reply so UI feels alive
  function localNelieReply(prompt: string): string {
    const p = prompt.trim().toLowerCase();
    if (!p) return "Skriv bare din første besked 😊";
    if (/(hej|hello|hi|halløj)/.test(p)) return "Hej! Jeg er NELIE 🤖✨ Hvad vil du gerne lære i dag?";
    if (/mat(ematik|h)/.test(p)) return "Skal vi øve procent, brøker eller ligninger?";
    if (/dansk|skriv|essay|stil/.test(p)) return "Hvilket emne vil du skrive om? Jeg kan hjælpe med idéer og struktur.";
    if (/engelsk|english/.test(p)) return "Vil du øve ordforråd, læsning eller en lille samtale?";
    if (/hjælp|help/.test(p)) return "Jeg kan lave en mini-plan, forklare trin-for-trin eller give øvelser. Hvad foretrækker du?";
    return `Spændende! Du skrev: “${prompt}”. Fortæl lidt mere, så guider jeg dig videre.`;
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 200));
    const reply = localNelieReply(content);
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
    setBusy(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const toSpeak =
    lastAssistant?.content || input.trim() || "Hej, jeg er NELIE. Hvad vil du lære i dag?";

  return (
    <>
      {/* Avatar */}
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 w-24 h-24 shadow-lg cursor-move floating-tutor-container"
        style={{
          left: pos.x,
          top: pos.y,
          backgroundImage: "url('/nelie.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "transparent",
        }}
        aria-label="Open NELIE"
        role="button"
      />

      {/* Chat card */}
      {open && (
        <div
          className="fixed z-50 w-80 bg-white rounded-lg shadow-xl p-3"
          style={{ left: pos.x + 100, top: pos.y - 10 }}
        >
          <div className="font-bold text-blue-600 mb-2">NELIE</div>

          <div className="mb-2 max-h-64 overflow-auto rounded border border-slate-200 p-2 bg-slate-50">
            {messages.length === 0 ? (
              <div className="opacity-60 text-sm">
                Hej! Jeg er NELIE. Skriv et spørgsmål, så hjælper jeg dig i gang. ✨
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="mb-2 text-sm">
                  <span
                    className={
                      m.role === "user"
                        ? "inline-block rounded px-2 py-1 bg-blue-600 text-white"
                        : "inline-block rounded px-2 py-1 bg-white text-slate-800 border"
                    }
                  >
                    {m.content}
                  </span>
                </div>
              ))
            )}
          </div>

          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Skriv til NELIE… (Enter for at sende, Shift+Enter for ny linje)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
          />

          <div className="mt-2 flex gap-2">
            <button
              className="bg-blue-600 text-white rounded px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => sendMessage()}
              disabled={busy || !input.trim()}
            >
              {busy ? "…" : "Send"}
            </button>

            <button
              className="text-sm rounded px-3 py-1 border"
              onClick={() => speakNelie(toSpeak)}
              title="Tal det seneste svar (eller input/greeting)"
            >
              🔊 Tal
            </button>

            <button
              className="text-sm rounded px-3 py-1 border"
              onClick={() => speakNelie("Test lyd. Hej fra NELIE!")}
              title="Afspil en kort testsætning"
            >
              ▶︎ Test lyd
            </button>
          </div>
        </div>
      )}
    </>
  );
}
