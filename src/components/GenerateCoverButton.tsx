// src/components/GenerateCoverButton.tsx
import { useState } from "react";
import { generateCover } from "../lib/generateCover";

export default function GenerateCoverButton() {
  const [url, setUrl] = useState<string>();
  const [err, setErr] = useState<string>();
  const [busy, setBusy] = useState(false);

  const go = async () => {
    try {
      setBusy(true); setErr(undefined);
      const u = await generateCover();
      setUrl(u);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{display:"grid", gap:12}}>
      <button onClick={go} disabled={busy}>
        {busy ? "Genererer…" : "Generate cover"}
      </button>
      {err && <div style={{color:"crimson"}}>Fejl: {err}</div>}
      {url && <img src={url} alt="cover" style={{maxWidth:"100%", borderRadius:8}} />}
    </div>
  );
}
