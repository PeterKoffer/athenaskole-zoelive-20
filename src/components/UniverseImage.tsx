import React, { useEffect, useState } from "react";

// --- Quick wire to BFL edge function (minimal, safe) ---
// Called when the component mounts and no image URL is known.
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
              opts.prompt ?? `${opts.title ?? "Today's Program"} — classroom-friendly, minimal, bright, 16:9`,
            width: opts.width ?? 1024,
            height: opts.height ?? 576,
          }),
        });

        const json = await res.json().catch(() => ({}));
        const candidate: string | undefined =
          json?.url && typeof json.url === "string" && json.url.length > 8
            ? json.url
            : undefined;

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
// --- END quick wire ---

type UniverseImageProps = {
  universeId?: string;
  title?: string;
  subject?: string;
  className?: string;
};

/**
 * NOTE:
 * Keep this component free of side effects so test imports don't crash.
 * Any "how to use" examples must live inside comments, not as live JSX.
 */
const UniverseImage: React.FC<UniverseImageProps> = ({
  universeId,
  title,
  subject,
  className,
}) => {
  const alt =
    title ? `${title}${subject ? ` (${subject})` : ""}` : "Universe cover";

  const edgeUrl = useEdgeCover(universeId ?? "", { title, width: 1024, height: 576 });

  // Placeholder variables for future image sources or SVG data URIs.
  const existingResolvedUrlFromStateOrProps = undefined;
  const fallbackSvgDataUrl = undefined;
  const src = existingResolvedUrlFromStateOrProps || edgeUrl || fallbackSvgDataUrl;

  return (
    <div className={className}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 12,
            objectFit: "cover",
            display: "block",
          }}
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

/*
Usage (EXAMPLE ONLY; keep examples inside comments):

<UniverseImage
  universeId="uuid-here"
  title="Genetic Engineering Lab"
  subject="Science"
/>
*/
