import React, { useEffect, useState } from "react";

// Lille helper til stabilt fallback-id
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${anon}` },
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
          typeof json?.url === "string" && json.url.length > 8 ? json.url : undefined;

        if (!cancelled && candidate) setUrl(candidate);
      } catch {
        /* silent fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supaUrl, anon, universeId, opts.title, opts.prompt, opts.width, opts.height]);

  return url;
}

type UniverseImageProps = {
  universeId?: string;
  title?: string;
  subject?: string;
  className?: string;
};

const UniverseImage: React.FC<UniverseImageProps> = ({
  universeId,
  title,
  subject,
  className,
}) => {
  const alt = title ? `${title}${subject ? ` (${subject})` : ""}` : "Universe cover";

  // Fald tilbage til et stabilt id når universeId mangler (typisk i lokale fallbacks)
  const effectiveId =
    (universeId && universeId.trim()) ||
    (title ? `fallback-${slug(title)}` : "fallback-general");

  const edgeUrl = useEdgeCover(effectiveId, { title, width: 1024, height: 576 });

  const src = edgeUrl ?? undefined;

  return (
    <div className={className}>
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 12, objectFit: "cover" }}
        />
      ) : (
        <div
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
      )}
    </div>
  );
};

export default UniverseImage;

