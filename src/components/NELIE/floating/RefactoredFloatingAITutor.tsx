import React, { useEffect, useRef, useState } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";
import { askNelie } from "@/services/nelie/chat";

type Point = { x: number; y: number };

const LS_KEY = "nelie-pos";
const AVATAR_SIZE = 128; // matcher CSS
const Z = 2147483647;

export default function RefactoredFloatingAITutor() {
  const { speakAsNelie } = useUnifiedSpeech?.() ?? { speakAsNelie: undefined };

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<Point>({ x: 24, y: 24 });
  const rel = useRef<Point>({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "nelie"; text: string }[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // Start nede i højre hjørne (eller brug sidste position)
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved) as Point;
        setPos(p);
        return;
      } catch {}
    }
    const x = Math.max(16, window.innerWidth - AVATAR_SIZE - 24);
    const y = Math.max(16, window.innerHeight - AVATAR_SIZE - 24);
    setPos({ x, y });
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(pos));
  }, [pos]);

  // Drag
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({ x: e.pageX - rel.current.x, y: e.pageY - rel.current.y });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setDragging(true);
    rel.current = { x: e.pageX - r.left, y: e.pageY - r.top };
    e.preventDefault();
  };

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setErr(null);
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const a = await askNelie(q);
      setMessages((m) => [...m, { role: "nelie", text: a }]);
      speakAsNelie?.(a);
    } catch (e: any) {
      const msg =
        e?.message?.includes("Missing VITE_SUPABASE_")
          ? "Supabase keys mangler i .env.local (VITE_SUPABASE_URL og VITE_SUPABASE_ANON)."
          : e?.message || "Noget gik galt.";
      setErr(msg);
      setMessages((m) => [...m, { role: "nelie", text: msg }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Avatar */}
      <div
        ref={boxRef}
        className="floating-tutor-container"
        onMouseDown={onMouseDown}
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          cursor: "grab",
          zIndex: Z,
        }}
        aria-label="NELIE assistant"
      >
        <img
          src="/nelie.png"
          alt="NELIE"
          className="nelie-avatar w-full h-full select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Chat */}
      {open && (
        <div
          className="fixed w-96 max-w-[92vw] rounded-lg shadow-xl p-3 bg-white text-black"
          style={{
            left: Math.max(8, pos.x - 340),
            top: Math.max(8, pos.y - 20),
            zIndex: Z,
          }}
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
                <div key={i} className={m.role === "user" ? "mb-2 text-right" : "mb-2 text-left"}>
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

          {err && <div className="mb-2 text-xs text-red-600">{err}</div>}

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
