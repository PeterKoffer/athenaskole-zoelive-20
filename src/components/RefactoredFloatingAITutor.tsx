import React, { useState, useRef, useEffect } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

export default function RefactoredFloatingAITutor() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onClick={() => setOpen(!open)}
        className="fixed z-50 w-20 h-20 rounded-full shadow-lg cursor-move border border-gray-200"
        style={{
          left: pos.x,
          top: pos.y,
          backgroundImage: "url('/nelie.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {open && (
        <div
          className="fixed z-50 w-80 bg-white rounded-lg shadow-xl p-3"
          style={{ left: pos.x - 280, top: pos.y - 20 }}
        >
          <div className="font-bold text-blue-600 mb-2">NELIE</div>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={4}
            placeholder="Skriv til NELIE..."
          />
          <button
            className="mt-2 bg-blue-600 text-white rounded px-3 py-1 text-sm"
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