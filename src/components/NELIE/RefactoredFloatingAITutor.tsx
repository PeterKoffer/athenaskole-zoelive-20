import React, { useState, useRef, useEffect } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

type Pos = { x: number; y: number };

export default function RefactoredFloatingAITutor() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: 24, y: 24 });
  const [rel, setRel] = useState<Pos>({ x: 0, y: 0 });
  const startPosRef = useRef<Pos | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { speakAsNelie } = useUnifiedSpeech();

  useEffect(() => {
    const onMove = (pageX: number, pageY: number) =>
      setPos({ x: pageX - rel.x, y: pageY - rel.y });

    const mm = (e: MouseEvent) => dragging && onMove(e.pageX, e.pageY);
    const mu = () => setDragging(false);

    const tm = (e: TouchEvent) => {
      if (!dragging) return;
      const t = e.touches[0];
      if (t) onMove(t.pageX, t.pageY);
    };
    const tu = () => setDragging(false);

    document.addEventListener("mousemove", mm);
    document.addEventListener("mouseup", mu);
    document.addEventListener("touchmove", tm, { passive: false });
    document.addEventListener("touchend", tu);

    return () => {
      document.removeEventListener("mousemove", mm);
      document.removeEventListener("mouseup", mu);
      document.removeEventListener("touchmove", tm);
      document.removeEventListener("touchend", tu);
    };
  }, [dragging, rel]);

  const beginDrag = (pageX: number, pageY: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setDragging(true);
    setRel({ x: pageX - r.left, y: pageY - r.top });
    startPosRef.current = { x: pageX, y: pageY };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    beginDrag(e.pageX, e.pageY);
    e.preventDefault();
    e.stopPropagation();
  };
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    beginDrag(t.pageX, t.pageY);
    e.preventDefault();
    e.stopPropagation();
  };

  const onClick = () => {
    const s = startPosRef.current;
    if (!s) return setOpen((v) => !v);
    const dx = Math.abs(pos.x - (s.x - rel.x));
    const dy = Math.abs(pos.y - (s.y - rel.y));
    const moved = dx + dy > 6;
    if (!moved) setOpen((v) => !v);
    startPosRef.current = null;
  };

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={onClick}
        role="button"
        aria-label="NELIE"
        className="fixed z-[9999] w-24 h-24 cursor-move select-none"
        style={{ left: pos.x, top: pos.y, background: "transparent" }}
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
          className="fixed z-[10000] w-80 rounded-lg shadow-xl p-3 bg-white dark:bg-neutral-900 border border-black/5"
          style={{ left: pos.x - 280, top: pos.y - 20 }}
        >
          <div className="font-bold text-blue-600 dark:text-blue-400 mb-2">
            NELIE
          </div>
          <textarea
            className="w-full border rounded p-2 text-sm bg-white/70 dark:bg-neutral-800"
            rows={4}
            placeholder="Skriv til NELIE..."
          />
          <button
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm"
            onClick={() =>
              speakAsNelie("Hej, jeg er NELIE. Hvad vil du lære i dag?")
            }
          >
            🔊 Tal
          </button>
        </div>
      )}
    </>
  );
}
