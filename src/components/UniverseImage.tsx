import { useEffect, useState } from "react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
        console.debug("[UniverseImage] missing env or universeId", { supaUrl: !!supaUrl, anon: !!anon, universeId });
        return;
      }

      try {
        const endpoint = `${supaUrl}/functions/v1/image-service/generate`;
        const body = {
          universeId,
          prompt:
            opts.prompt ??
            `${opts.title ?? "Today's Program"} — classroom-friendly, minimal, bright, 16:9`,
          width: opts.width ?? 1024,
          height: opts.height ?? 576,
        };
        console.debug("[UniverseImage] POST", endpoint, body);

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${anon}` },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          console.warn("[UniverseImage] edge returned non-2xx", res.status, await res.text());
          return;
        }

        const json = await res.json().catch(() => ({}));
        const candidate = typeof json?.url === "string" && json.url.length > 8 ? json.url : null;
        console.debug("[UniverseImage] edge response url:", candidate);

        if (!cancelled) setUrl(candidate);
      } catch (e) {
        console.error("[UniverseImage] fetch error", e);
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
    (universeId && universeId.trim()) ||
    (title ? `fallback-${slugify(title)}` : "fallback-general");

  const src = useEdgeCover(effectiveId, { title, width: 1024, height: 576 });

  return src ? (
    <img
      src={src}
      alt={alt}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 12, objectFit: "cover" }}
      className={className}
    />
  ) : (
    <div
      className={className}
      style={{
        width: "100%", aspectRatio: "16 / 9", background: "#1f2937",
        borderRadius: 12, display: "grid", placeItems: "center", color: "white", fontWeight: 600,
      }}
      aria-label={alt}
    >
      {title || "Universe Cover"}
    </div>
  );
}
