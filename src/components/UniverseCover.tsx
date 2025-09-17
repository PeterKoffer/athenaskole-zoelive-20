import { coverUrl } from '../utils/imageUrl';

export default function UniverseCover(
  { universeId, grade }: { universeId: string; grade: number | string }
) {
  const src = coverUrl(universeId, grade, String(Date.now())); // cache-bust to force new images
  return <img src={src} alt="Universe cover" className="w-full h-auto rounded-xl" />;
}