import React, { useEffect, useRef, useState } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";
import { generateLesson } from "@/services/contentClient";

/**
 * Small floating avatar you can drag. Click to open a chat card.
 * - Uses Supabase Edge Function via generateLesson()
 * - Speaks responses via useUnifiedSpeech()
 * - Safe if env isn't configured (shows hint)
 */
export default function RefactoredFloatingAITutor() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [rel, setRel] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "nelie"; text: string }[]>([]);

  const { speakAsNelie } = useUnifiedSpeech();

  // ---- drag logic
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
    e.preventDefault();
  };

  // ---- send message via edge function
  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);

    setBusy(true);
    try {
      // Basic body the edge function can handle. Adapt as needed.
      const body = {
        subject: "general",
        context: {
          question: q,
          source: "NELIE-floating",
        },
      };
      const out = await generateLesson(body);
      const text =
        (typeof out === "string" && out) ||
        out?.answer ||
        out?.text ||
        JSON.stringify(out);

      setMessages((m) => [...m, { role: "nelie", text }]);
      // speak (softly)
      speakAsNelie(String(text));
    } catch (err: any) {
      const msg =
        err?.message?.includes("Supabase client not initialized")
          ? "Supabase keys mangler. Tilføj VITE_SUPABASE_URL og VITE_SUPABASE_ANON i .env.local"
          : (err?.message || "Noget gik galt.");
      setMessages((m) => [...m, { role: "nelie", text: msg }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Floating avatar */}
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onClick={() => setOpen((v) => !v)}
        className="floating-tutor-container nelie-avatar"
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: 96,
          height: 96,
          backgroundImage: "url('/nelie.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "transparent",
          cursor: "grab",
        }}
        aria-label="Open NELIE"
      />

      {/* Chat card */}
      {open && (
        <div
          className="fixed z-[9999999] w-96 max-w-[92vw] rounded-xl border bg-white p-3 shadow-xl"
          style={{ left: pos.x + 110, top: pos.y }}
          role="dialog"
          aria-label="NELIE chat"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold text-blue-600">NELIE</div>
            <button
              className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Luk
            </button>
          </div>

          <div className="mb-2 max-h-64 overflow-auto rounded border bg-slate-50 p-2 text-sm">
            {messages.length === 0 ? (
              <div className="opacity-60">
                Hej! Jeg er NELIE. Skriv et spørgsmål, så hjælper jeg ✨
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "mb-2 text-right" : "mb-2 text-left"}
                >
                  <span
                    className={
                      "inline-block rounded px-2 py-1 " +
                      (m.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-800 border")
                    }
                  >
                    {m.text}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Skriv til NELIE…"
              className="flex-1 rounded border px-2 py-1 text-sm outline-none focus:ring"
            />
            <button
              onClick={send}
              disabled={busy}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
            >
              {busy ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
