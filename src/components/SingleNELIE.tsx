// src/components/SingleNELIE.tsx
import { useEffect, useRef, useState } from "react";
// use the direct file path to avoid any barrel/cache ambiguity
import NELIE from "@/components/NELIE/NELIE";

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
