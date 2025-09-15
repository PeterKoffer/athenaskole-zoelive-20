import React, { useState, useRef, useEffect } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";
import { askNelie, type ChatMessage } from "@/services/nelie/chatClient";

export default function RefactoredFloatingAITutor() {
  const [open, setOpen] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 420, y: 220 });
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content:
        "You are NELIE, a friendly learning assistant for school kids. Answer briefly and helpfully in Danish.",
    },
  ]);

  const { speakAsNelie } = useUnifiedSpeech();

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

  async function send() {
    const txt = input.trim();
    if (!txt || busy) return;

    const next = [...messages, { role: "user", content: txt } as ChatMessage];
    setMessages(next);
    setInput("");
    setBusy(true);

    const reply = await askNelie(next);
    const withAssistant = [...next, { role: "assistant", content: reply } as ChatMessage];
    setMessages(withAssistant);
    setBusy(false);

    // Speak the assistant's reply (soft-fail if TTS not configured)
    try {
      speakAsNelie(reply);
    } catch {}
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <>
      {/* Avatar */}
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onClick={() => setOpen((v) => !v)}
        className="floating-tutor-container w-24 h-24"
        style={{
          left: pos.x,
          top: pos.y,
        }}
      >
        <img
          src="/nelie.png"
          alt="NELIE"
          className="nelie-avatar w-full h-full pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Chat bubble */}
      {open && (
        <div
          className="fixed z-[2147483646] w-80 bg-white rounded-lg shadow-xl p-3"
          style={{ left: pos.x - 300, top: pos.y - 12 }}
        >
          <div className="font-bold text-blue-600 mb-2">NELIE</div>

          <div className="mb-2 max-h-64 overflow-auto rounded border border-slate-200 p-2">
            {messages
              .filter((m) => m.role !== "system")
              .map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "mb-2 text-sm"
                      : "mb-2 text-sm bg-blue-50 border border-blue-200 rounded p-2"
                  }
                >
                  {m.content}
                </div>
              ))}
          </div>

          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Skriv til NELIE… (Enter for at sende)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
          />

          <div className="mt-2 flex gap-2">
            <button
              className="bg-blue-600 text-white rounded px-3 py-1 text-sm disabled:opacity-50"
              onClick={send}
              disabled={busy || !input.trim()}
            >
              {busy ? "…" : "Send"}
            </button>
            <button
              className="text-sm rounded px-3 py-1 border"
              onClick={() => {
                const last = [...messages].reverse().find((m) => m.role === "assistant");
                if (last) speakAsNelie(last.content);
              }}
            >
              🔊 Tal igen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
