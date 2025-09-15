import React from "react";
import { createPortal } from "react-dom";

export default function SingleNELIE() {
  const node = (
    <div className="fixed top-6 left-6 z-[99999] pointer-events-none select-none" aria-hidden>
      <img src="/nelie.png" alt="NELIE" width={96} height={96} className="nelie-avatar block" draggable={false} />
    </div>
  );
  return createPortal(node, document.body);
}
