// src/components/NELIE/floating/RefactoredFloatingAITutor.tsx
import React, { useEffect, useRef, useState } from "react";

function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "da-DK"; // tweak if you prefer en-US
    synth.cancel();
    synth.speak(u);
  } catch {
    /* no-op */
  }
}

export default function RefactoredFloatingAITutor() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 24, y: 24 });
  const [rel, setRel] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Drag handlers
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({ x: e.pageX - rel.x, y: e.pageY - rel.y });
    };
    const onUp = () => setDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dragging, rel]);

  const startDrag = (e: React.MouseEvent) => {
    if (!rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    setDragging(true);
    setRel({ x: e.pageX - r.left, y: e.pageY - r.top });
    e.preventDefault();
    e.stopPropagation();
  };

  const onAvatarClick = () => setOpen((v) => !v);

  const onSpeak = () => {
    const text =
      textareaRef.current?.value?.trim() ||
      "Hej, jeg er NELIE. Hvad vil du lære i dag?";
    speak(text);
  };

  return (
    <div
      ref={rootRef}
      className="floating-tutor-container"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
      }}
    >
      {/* Avatar button (draggable) */}
      <button
        ref={avatarRef}
        onMouseDown={startDrag}
        onClick={onAvatarClick}
        className="block w-24 h-24 p-0 m-0 border-0 bg-transparent cursor-move"
        aria-label="Open NELIE"
      >
        <img
          src="/nelie.png"
          alt="NELIE"
          className="nelie-avatar w-full h-full pointer-events-none select-none"
          draggable={false}
        />
      </button>

      {/* Tiny chat card */}
      {open && (
        <div
          className="mt-2 w-80 rounded-xl border bg-white/95 shadow-xl backdrop-blur px-3 py-3 text-sm"
          style={{ cursor: "default" }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="font-semibold text-blue-600 mb-2">NELIE</div>

          <textarea
            ref={textareaRef}
            rows={4}
            placeholder="Skriv til NELIE…"
            className="w-full resize-none rounded border p-2 outline-none"
          />

          <div className="mt-2 flex gap-2">
            <button
              onClick={onSpeak}
              className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              🔊 Tal
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded border px-3 py-1 hover:bg-neutral-50"
            >
              Luk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
