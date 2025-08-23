// src/components/UniverseImage.tsx
import { useUniverseCover } from "../hooks/useUniverseCover";

type Props = {
  universeId: string;
  title: string;
  subject: string;
  grade: number | string;
  className?: string;
};

export default function UniverseImage({ universeId, title, subject, grade, className }: Props) {
  const { src, ready } = useUniverseCover({ universeId, title, subject, grade });

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${className ?? ""}`}
      style={{ aspectRatio: "16 / 9", background: "rgba(255,255,255,0.06)" }}
    >
      {!ready && <div className="absolute inset-0 animate-pulse" />}
      {ready && (
        <img
          src={src}
          alt={`${title} cover`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          draggable={false}
        />
      )}
    </div>
  );
}

