import { useEffect, useMemo, useState } from "react";
import { ensureDailyProgramCover, publicCoverUrl } from "@/services/UniverseImageGenerator";

type Props = {
  universeId: string;
  gradeInt: number;
  title?: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  minBytes?: number;
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

  const initialUrl = useMemo(() => publicCoverUrl(`/${universeId}/${gradeInt}/cover.webp`), [universeId, gradeInt]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) Forsøg at sikre billedet via edge function (den uploader hvis nødvendigt)
        const coverUrl = await ensureDailyProgramCover({
          universeId,
          gradeInt,
          title,
          width,
          height,
        });

        if (!cancelled) setSrc(coverUrl + `?v=${Date.now()}`);
      } catch (e: any) {
        // 3) Fallback: prøv i det mindste at vise hvad der allerede ligger
        if (!cancelled) {
          setSrc(initialUrl + `?v=${Date.now()}`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [universeId, gradeInt, title, minBytes, width, height, initialUrl]);

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
        // Hvis Storage-billedet mangler/fejler, hold brugbar fallback-tekst
        setSrc(
          `data:image/svg+xml;base64,${btoa(
            unescape(
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
                  <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
                  <stop offset='0%' stop-color='#111827'/><stop offset='100%' stop-color='#1f2937'/></linearGradient></defs>
                  <rect width='100%' height='100%' fill='url(#g)'/>
                  <text x='50%' y='50%' fill='#e5e7eb' font-family='system-ui,Segoe UI,Roboto'
                        font-size='28' text-anchor='middle' dominant-baseline='middle'>${title}</text>
                </svg>`
              )
            )
          )}`
        );
      }}
    />
  );
}
