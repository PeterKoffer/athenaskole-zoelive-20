// src/components/SingleNELIE.tsx
import { useEffect, useRef, useState } from "react";
import NELIE from "@/components/NELIE"; // <- virker nu pga. index.ts

let mounted = false;

export default function SingleNELIE() {
  const [visible, setVisible] = useState(false);
  const once = useRef(false);

  useEffect(() => {
    if (once.current || mounted) return;
    once.current = true;
    mounted = true;
    setVisible(true);
  }, []);

  if (!visible) return null;
  return <NELIE />;
}
