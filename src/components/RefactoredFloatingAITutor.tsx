import React, { useState, useRef, useEffect } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

export default function RefactoredFloatingAITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const { speakAsNelie } = useUnifiedSpeech();
  const tutorRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [rel, setRel] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({ x: e.pageX - rel.x, y: e.pageY - rel.y });
    };
    const handleMouseUp = () => setDragging(false);
    
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, rel]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tutorRef.current) return;
    setDragging(true);
    const rect = tutorRef.current.getBoundingClientRect();
    setRel({ x: e.pageX - rect.left, y: e.pageY - rect.top });
    e.stopPropagation();
    e.preventDefault();
  };

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div
      ref={tutorRef}
      className="fixed w-20 h-20 rounded-full cursor-move shadow-lg border border-gray-300 z-50"
      style={{
        left: pos.x,
        top: pos.y,
        backgroundImage: "url('/lovable-uploads/5f017352-b893-4428-97c9-83b514c5839c.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onMouseDown={onMouseDown}
      onClick={toggle}
    >
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-64 bg-white rounded shadow-lg p-4 border border-gray-200">
          <h3 className="text-blue-600 font-bold mb-2">NELIE AI Tutor</h3>
          <textarea
            className="border border-gray-300 p-2 w-full rounded mb-2"
            placeholder="Skriv til NELIE..."
            rows={3}
          />
          <button
            className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => speakAsNelie("Hej, jeg er NELIE. Hvad vil du lære i dag?")}
          >
            🔊 Tal med NELIE
          </button>
        </div>
      )}
    </div>
  );
}