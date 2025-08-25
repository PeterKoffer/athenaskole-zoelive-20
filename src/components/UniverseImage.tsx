import { useEffect, useState } from "react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeFallbackSvg(text: string, w = 1024, h = 576) {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#0b1220"/>
        <stop offset="1" stop-color="#1f2937"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" fill="#7dd3fc" font-size="36" text-anchor="middle"
          font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
          dominant-baseline="middle">${safe}</text>
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
      if (!supaUrl || !anon || !universeId) {
        console.debug("[UniverseImage] missing env or id", { supaUrl: !!supaUrl, anon: !!anon, universeId });
        return;
      }

      const body = {
        universeId,
        prompt:
          opts.prompt ??
          `${opts.title ?? "Today's Program"} — classroom-friendly, minimal, bright, 16:9`,
        width: opts.width ?? 1024,
        height: opts.height ?? 576,
      };

      console.debug("[UniverseImage] calling edge with:", { supaUrl, body });

      try {
        const res = await fetch(`${supaUrl}/functions/v1/image-service/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anon}`,
          },
          body: JSON.stringify(body),
        });

        const json = await res.json().catch(() => ({} as any));
        console.debug("[UniverseImage] edge response:", json);

        const candidate =
          typeof json?.url === "string" && json.url.length > 8 ? (json.url as string) : null;

        if (!cancelled) setUrl(candidate);
      } catch (e) {
        console.debug("[UniverseImage] fetch failed:", e);
        if (!cancelled) setUrl(null);
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

  // Stable id so we can generate per-title when no id is present
  const effectiveId =
    (universeId && universeId.trim()) ||
    (title ? `fallback-${slugify(title)}` : "fallback-general");

  const src = useEdgeCover(effectiveId, { title, width: 1024, height: 576 });
  const fallback = makeFallbackSvg(alt, 1024, 576);

  return src ? (
    <img
      key={src}
      src={src}
      alt={alt}
      // do NOT set crossOrigin — BFL delivery lacks CORS headers
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={(e) => {
        console.debug("[UniverseImage] image onError -> fallback");
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
