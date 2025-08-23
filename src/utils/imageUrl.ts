// src/utils/imageUrl.ts
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const PUBLIC_BASE = `${SUPABASE_URL}/storage/v1/object/public`;

export function coverUrl(universeId: string, grade: number | string, bust?: string) {
  const g = typeof grade === "string" ? parseInt(grade, 10) : grade;
  const v = bust ? `?v=${bust}` : "";
  return `${PUBLIC_BASE}/universe-images/${universeId}/${g}/cover.webp${v}`;
}
