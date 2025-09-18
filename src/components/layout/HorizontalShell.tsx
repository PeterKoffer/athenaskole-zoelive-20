import { useEffect, useRef } from "react";

export default function HorizontalShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  // Map vertical wheel to horizontal scrolling for trackpads/mice
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollLeft += e.deltaY; // convert vertical scroll to horizontal
        e.preventDefault();
      }
    };
    
    const onKey = (e: KeyboardEvent) => {
      if (!el) return;
      const w = el.clientWidth;
      if (e.key === "ArrowRight") el.scrollBy({ left: w, behavior: "smooth" });
      if (e.key === "ArrowLeft") el.scrollBy({ left: -w, behavior: "smooth" });
    };
    
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <main
      ref={ref}
      className="
        h-[100dvh] w-full
        overflow-x-auto overflow-y-hidden
        snap-x snap-mandatory
        flex
        scrollbar-hide
      "
    >
      {children}
    </main>
  );
}