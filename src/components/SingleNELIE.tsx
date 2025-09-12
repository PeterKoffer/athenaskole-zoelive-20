import { useEffect, useRef, useState } from "react";
import NELIE from "@/components/NELIE";

let mounted = false;

export default function SingleNELIE() {
  const ok = useRef(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!mounted) {
      mounted = true;
      ok.current = true;
      setShow(true);
      return () => {
        mounted = false;
      };
    }
  }, []);

  if (!show || !ok.current) return null;
  return <NELIE />;
}
