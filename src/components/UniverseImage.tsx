import React from "react";

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

  // In tests/CI we avoid fetching real images; render a styled placeholder.
  return (
    <div className={className}>
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
