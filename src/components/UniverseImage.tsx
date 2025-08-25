import { useEffect, useState } from "react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function makeFallbackSvg(text: string, w = 1024, h = 576) {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#0b1220"/><stop offset="100%" stop-color="#1c2a44"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" fill="#7dd3fc" font-size="36" text-anchor="middle"
            font-family="ui-sans-serif,system-ui,Segoe UI,Roboto"
            dominant-baseline="middle">${safe}</text>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${anon}` },
          body: JSON.stringify(body),
        });
        const json = await res.json().catch(() => ({}));
        console.debug("[UniverseImage] edge response:", json);

        const candidate =
          typeof json?.url === "string" && json.url.startsWith("data:") ? json.url : null;
        if (!cancelled) setUrl(candidate);
      } catch (e) {
        console.warn("[UniverseImage] edge error:", e);
        if (!cancelled) setUrl(null);
      }
    })();
    return () => { cancelled = true; };
  }, [supaUrl, anon, universeId, opts.title, opts.prompt, opts.width, opts.height]);

  return url;
}

type Props = { universeId?: string; title?: string; subject?: string; className?: string };

export default function UniverseImage({ universeId, title, subject, className }: Props) {
  const alt = title ? `${title}${subject ? ` (${subject})` : ""}` : "Universe cover";
  const effectiveId =
    (universeId && universeId.trim()) || (title ? `fallback-${slugify(title)}` : "fallback-general");

  const src =
    useEdgeCover(effectiveId, { title, width: 1024, height: 576 }) ||
    makeFallbackSvg(title || "Universe Cover");

  return (
    <img
      src={src}
      alt={alt}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 12, objectFit: "cover" }}
      className={className}
    />
  );
}
