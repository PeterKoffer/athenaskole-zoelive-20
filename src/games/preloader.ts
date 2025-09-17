import { getGame } from './registry';

// Simpel preloader: instansierer ikke spillet, men forbereder assets i baggrunden
export async function preloadGame(id: string) {
  const g = getGame(id); if (!g) return false;
  // plads til at hente sprites/assets senere; nu blot existence-check
  return true;
}

export async function preloadBlock(ids: string[]) {
  const results = await Promise.all(ids.map(preloadGame));
  return results.every(Boolean);
}