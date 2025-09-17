import { coverUrl } from '../utils/imageUrl';

export default function UniverseCover(
  { universeId, grade }: { universeId: string; grade: number | string }
) {
  const src = coverUrl(universeId, grade, String(Date.now())); // cache-bust to force new images
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl">
      <img 
        src={src} 
        alt="Universe cover" 
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}