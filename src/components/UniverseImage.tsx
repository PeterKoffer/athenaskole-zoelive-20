import { useEffect, useState } from "react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function fallbackSvgDataUrl(text: string, w = 1024, h = 576) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="#0b1220"/>
      <text x="50%" y="50%" fill="#7dd3fc" font-size="36" text-anchor="middle"
            font-family="sans-serif" dominant-baseline="middle">
        ${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}
      </text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function useEdgeCover(
  universeId: string,
  opts: { title?: string; prompt?: string; width?: number; height?: number } = {},
) {
  const [url, setUrl] = useState<string | null>(null);
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!supaUrl || !anon || !universeId) return;

      try {
        const res = await fetch(`${supaUrl}/functions/v1/image-service/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anon}`,
          },
          body: JSON.stringify({
            universeId,
            prompt:
              opts.prompt ??
              `${opts.title ?? "Today's Program"} — classroom-friendly, minimal, bright, 16:9`,
            width: opts.width ?? 1024,
            height: opts.height ?? 576,
          }),
        });

        const json = await res.json().catch(() => ({} as any));
        const candidate =
          typeof json?.url === "string" && json.url.length > 8 ? (json.url as string) : null;

        if (!cancelled) setUrl(candidate);
      } catch {
        // silent fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supaUrl, anon, universeId, opts.title, opts.prompt, opts.width, opts.height]);

  return url;
}

type Props = {
  universeId?: string;
  title?: string;
  subject?: string;
  className?: string;
};

export default function UniverseImage({ universeId, title, subject, className }: Props) {
  const alt = title ? `${title}${subject ? ` (${subject})` : ""}` : "Universe cover";

  // Always have a stable id (lets us cache per-title too)
  const effectiveId =
    (universeId && universeId.trim()) ||
    (title ? `fallback-${slugify(title)}` : "fallback-general");

  const src = useEdgeCover(effectiveId, { title, width: 1024, height: 576 });
  const fallback = fallbackSvgDataUrl(alt, 1024, 576);

  return src ? (
    <img
      key={src}                   // ensure React swaps image when URL changes
      src={src}
      alt={alt}
      // IMPORTANT: no `crossOrigin` — BFL delivery URLs do not send CORS headers
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={(e) => {
        // graceful fallback if the signed URL expires or is blocked
        (e.currentTarget as HTMLImageElement).src = fallback;
      }}
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 12,
        objectFit: "cover",
        display: "block",
      }}
      className={className}
    />
  ) : (
    <div
      className={className}
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        background: "#1f2937",
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        color: "white",
        fontWeight: 600,
      }}
      aria-label={alt}
    >
      {title || "Universe Cover"}
    </div>
  );
}
