import { useEffect, useState } from "react";

/** simple slug for fallback ids */
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function escapeSvgText(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeFallbackSvg(text: string, w = 1024, h = 576) {
  const safe = escapeSvgText(text || "Today’s Program");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `  <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">` +
    `    <stop offset="0%" stop-color="#111827"/><stop offset="100%" stop-color="#1f2937"/>` +
    `  </linearGradient></defs>` +
    `  <rect width="100%" height="100%" fill="url(#g)"/>` +
    `  <text x="50%" y="50%" fill="#e5e7eb" font-family="ui-sans-serif,system-ui,Segoe UI,Roboto"` +
    `        font-size="28" text-anchor="middle" dominant-baseline="middle">${safe}</text>` +
    `</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/** Minimal hook that hits our edge function and returns a usable URL (or null). */
function useEdgeCover(
  universeId: string,
  opts: { title?: string; prompt?: string; width?: number; height?: number } = {}
) {
  const [url, setUrl] = useState<string | null>(null);
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!supaUrl || !anon || !universeId) {
        console.warn("[UniverseImage] missing env/universeId", { hasUrl: !!supaUrl, hasAnon: !!anon, universeId });
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

      try {
        console.log("[UniverseImage] calling edge", { endpoint: `${supaUrl}/functions/v1/image-service/generate`, body });
        const res = await fetch(`${supaUrl}/functions/v1/image-service/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${anon}` },
          body: JSON.stringify(body),
        });

        const json = await res.json().catch(() => ({}));
        console.log("[UniverseImage] edge response", { status: res.status, json });

        const candidate =
          typeof json?.url === "string" && json.url.length > 8 ? json.url : null;

        if (!cancelled) setUrl(candidate);
      } catch (err) {
        console.error("[UniverseImage] edge error", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supaUrl, anon, universeId, opts.title, opts.prompt, opts.width, opts.height]);

  return url;
}

type Props = { universeId?: string; title?: string; subject?: string; className?: string };

export default function UniverseImage({ universeId, title, subject, className }: Props) {
  const alt = title ? `${title}${subject ? ` (${subject})` : ""}` : "Universe cover";

  // Always have an id (so we can cache by title if no explicit id)
  const effectiveId =
    (universeId && universeId.trim()) ||
    (title ? `fallback-${slugify(title)}` : "fallback-general");

  // Try edge; it will fall back to data: SVG if BFL credits are empty.
  const edgeUrl = useEdgeCover(effectiveId, { title, width: 1024, height: 576 });

  // Absolute last resort: local SVG (if the hook never returned anything)
  const src = edgeUrl ?? null;

  if (src) {
    return (
      <img
        src={src.startsWith("data:") ? src : `${src}?ts=${Date.now()}`} // cache-bust
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 12, objectFit: "cover" }}
        className={className}
      />
    );
  }

  // Placeholder while generating
  return (
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
