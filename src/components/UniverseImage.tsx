import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  universeId: string;
  gradeInt: number;
  /** Bruges kun til fallback-tekst på billedet */
  title?: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  /** Minimum filstørrelse, før eksisterende cover accepteres */
  minBytes?: number;
};

type EnsureResponse = {
  ok: boolean;
  publicUrl?: string;
  path?: string;
  existed?: boolean;
  source?: "existing" | "openai" | "placeholder";
  bytes?: number;
  error?: string;
};

export default function UniverseImage({
  universeId,
  gradeInt,
  title = "Today's Program",
  className,
  alt = "Universe cover",
  width = 1024,
  height = 576,
  minBytes = 4096,
}: Props) {
  const [src, setSrc] = useState<string | null>(null);

  // Stabil public URL (fallback hvis invoke svarer uden publicUrl)
  const storagePath = useMemo(
    () => `${universeId}/${gradeInt}/cover.webp`,
    [universeId, gradeInt]
  );

  const initialUrl = useMemo(() => {
    const { data } = supabase.storage.from("universe-images").getPublicUrl(storagePath);
    return data.publicUrl;
  }, [storagePath]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Kald edge-funktionen – den uploader hvis nødvendigt og returnerer publicUrl
        const { data, error } = await supabase.functions.invoke<EnsureResponse>("image-ensure", {
          body: {
            universeId,
            gradeInt,
            title: "cover", // filnavn fastholdes til cover.webp
            minBytes,
            width,
            height,
          },
        });

        if (error) throw error;
        const url = (data && data.publicUrl) ? data.publicUrl : initialUrl;

        if (!cancelled) {
          // let cache-bust være lille for ikke at sprænge cache helt
          setSrc(`${url}?v=${Date.now() % 1e7}`);
        }
      } catch {
        // Fallback: prøv at vise eksisterende objekt direkte
        if (!cancelled) {
          setSrc(`${initialUrl}?v=${Date.now() % 1e7}`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [universeId, gradeInt, minBytes, width, height, initialUrl]);

  if (!src) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          aspectRatio: `${width}/${height}`,
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg,#111827,#1f2937)",
          color: "#e5e7eb",
          borderRadius: 12,
        }}
      >
        Genererer cover …
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        // Robust inline-SVG som sidste fallback
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
          <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
            <stop offset='0%' stop-color='#111827'/><stop offset='100%' stop-color='#1f2937'/>
          </linearGradient></defs>
          <rect width='100%' height='100%' fill='url(#g)'/>
          <text x='50%' y='50%' fill='#e5e7eb' font-family='system-ui,Segoe UI,Roboto'
                font-size='28' text-anchor='middle' dominant-baseline='middle'>${title}</text>
        </svg>`;
        setSrc(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`);
      }}
    />
  );
}
