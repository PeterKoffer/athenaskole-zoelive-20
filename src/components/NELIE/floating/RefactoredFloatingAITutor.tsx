import React, { useEffect, useRef, useState } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

type Point = { x: number; y: number };

const LS_KEY = "nelie-pos";
const AVATAR_SIZE = 96; // ~2x
const Z = 2147483647;   // stay on top

export default function RefactoredFloatingAITutor() {
  const { speakAsNelie } = useUnifiedSpeech?.() ?? { speakAsNelie: undefined };

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<Point>({ x: 24, y: 24 });
  const rel = useRef<Point>({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  // Initial position: bottom-right, or last saved
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

  // Persist position
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(pos));
  }, [pos]);

  // Drag handlers
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

  return (
    <>
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

      {open && (
        <div
          className="fixed w-80 rounded-lg shadow-xl p-3 bg-white text-black"
          style={{
            left: Math.max(8, pos.x - 320),
            top: Math.max(8, pos.y - 20),
            zIndex: Z,
          }}
          role="dialog"
          aria-label="NELIE chat"
        >
          <div className="font-bold text-blue-600 mb-2">NELIE</div>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={4}
            placeholder="Skriv til NELIE..."
          />
          <div className="mt-2 flex gap-2">
            <button
              className="bg-blue-600 text-white rounded px-3 py-1 text-sm"
              onClick={() =>
                speakAsNelie?.("Hej, jeg er NELIE. Hvad vil du lære i dag?")
              }
            >
              🔊 Tal
            </button>
            <button
              className="border rounded px-3 py-1 text-sm"
              onClick={() => setOpen(false)}
            >
              Luk
            </button>
          </div>
        </div>
      )}
    </>
  );
}
