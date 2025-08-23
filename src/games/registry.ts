import { GameDefinition } from './types';

// Lazy registry for dynamic game loading
export const Games: Record<string, () => Promise<GameDefinition>> = {
  "fast-facts": () => import("./fast-facts").then(m => m.default),
  // Add more games here...
};

export async function loadGame(gameId: string): Promise<GameDefinition | null> {
  try {
    const loader = Games[gameId];
    if (!loader) {
      console.error(`Game not found: ${gameId}`);
      return null;
    }
    
    const game = await loader();
    return game;
  } catch (error) {
    console.error(`Failed to load game ${gameId}:`, error);
    return null;
  }
}

export function getAvailableGames(): string[] {
  return Object.keys(Games);
}

export function getGamesBySubject(_subject: string): string[] {
  // This would ideally be enhanced to load game metadata without loading full games
  // For now, return all games (can be improved later)
  return getAvailableGames();
}