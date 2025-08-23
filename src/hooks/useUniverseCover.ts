// src/hooks/useUniverseCover.ts
import { useEffect, useMemo, useState } from "react";
import { getUniverseImageSignedUrl } from '@/services/universeImages';

// Create coverUrl function directly since utils/imageUrl doesn't exist
function coverUrl(universeId: string, grade: number | string, cacheBust: string) {
  const BUCKET_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/universe-images`;
  return `${BUCKET_BASE}/${encodeURIComponent(universeId)}/${grade}/cover.webp?v=${cacheBust}`;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const FUNCTIONS_BASE = SUPABASE_URL.replace("supabase.co", "functions.supabase.co");

function coverGeneratorURL(title: string, author = "NELIE") {
  const u = new URL(`${FUNCTIONS_BASE}/cover-generator`);
  u.searchParams.set("title", title);
  u.searchParams.set("author", author);
  u.searchParams.set("bg", "264653");
  u.searchParams.set("color", "ffffff");
  u.searchParams.set("v", String(Date.now())); // cache-bust
  return u.toString();
}

export function useUniverseCover({
  universeId, title, subject, grade,
  pollMs = 1200, timeoutMs = 25000,
}: {
  universeId: string;
  title: string;
  subject: string;
  grade: number | string;
  pollMs?: number;
  timeoutMs?: number;
}) {
  const [src, setSrc] = useState<string>("");
  const [ready, setReady] = useState(false);

  const primary = useMemo(
    () => coverUrl(universeId, grade, String(Date.now())),
    [universeId, grade]
  );
  const fallback = useMemo(() => coverGeneratorURL(title), [title]);

  useEffect(() => {
    let cancelled = false;

    async function ensureAndPoll() {
      // 1) Generate signed URL (ensures + signs)  
      try {
        const path = `${universeId}/${grade}/cover.webp`;
        const url = await getUniverseImageSignedUrl(path);
        setSrc(url);
        setReady(true);
        return;
      } catch {}

      // 2) poll GET on cover.webp (instead of HEAD to avoid 400s)
      const t0 = Date.now();
      while (!cancelled && Date.now() - t0 < timeoutMs) {
        try {
          const url = `${primary}?v=${Date.now()}`;
          const r = await fetch(url, { method: "GET", cache: "no-store" });
          if (r.ok) { setSrc(url); setReady(true); return; }
        } catch {}
        await new Promise(r => setTimeout(r, pollMs));
      }

      // 3) fallback SVG
      if (!cancelled) { setSrc(fallback); setReady(true); }
    }

    setReady(false); setSrc(""); ensureAndPoll();
    return () => { cancelled = true; };
  }, [primary, fallback, universeId, title, subject, grade, pollMs, timeoutMs]);

  return { src, ready };
}
