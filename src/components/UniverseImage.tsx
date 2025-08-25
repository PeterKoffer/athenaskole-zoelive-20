import React, { useEffect, useState } from "react";

// --- Quick wire to BFL edge function (robust) ---
function useEdgeCover(
  universeId: string | undefined,
  opts: { title?: string; subject?: string; prompt?: string; width?: number; height?: number } = {},
) {
  const [url, setUrl] = useState<string | null>(null);
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!supaUrl || !anon) return;

    // Use a stable fallback id if universeId is missing
    const idFallback =
      universeId && universeId.trim().length > 0
        ? universeId
        : `demo-${(opts.title || "program").toLowerCase().replace(/\s+/g, "-")}`;

    const controller = new AbortController();
    const width = opts.width ?? 1024;
    const height = opts.height ?? 576;
    const prompt =
      opts.prompt ??
      `${opts.title ?? "Today's Program"}${
        opts.subject ? ` (${opts.subject})` : ""
      } — classroom-friendly, minimal, bright, 16:9`;

    (async () => {
      try {
        console.debug("[UniverseImage] calling edge fn", {
          supaUrl,
          id: idFallback,
          width,
          height,
        });

        const res = await fetch(`${supaUrl}/functions/v1/image-service/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anon}`,
          },
          body: JSON.stringify({
            universeId: idFallback,
            prompt,
            width,
            height,
          }),
          signal: controller.signal,
        });

        const json = await res.json().catch(() => ({}));
        console.debug("[UniverseImage] edge response", res.status, json);

        const candidate =
          json && typeof json.url === "string" && json.url.length > 8 ? json.url : undefined;

        if (candidate) setUrl(candidate);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.debug("[UniverseImage] edge call failed", err);
        }
      }
    })();

    return () => controller.abort();
  }, [supaUrl, anon, universeId, opts.title, opts.subject, opts.prompt, opts.width, opts.height]);

  return url;
}
// --- END quick wire ---

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
  const edgeUrl = useEdgeCover(universeId, { title, subject, width: 1024, height: 576 });

  return (
    <div className={className}>
      {edgeUrl ? (
        <img
          src={edgeUrl}
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
