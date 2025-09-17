import type { AdventureGame } from './sdk';
import type { GameDefinition } from './types';

const REG = new Map<string, AdventureGame>();

// Legacy registry for old GameDefinition system
const LEGACY_GAMES: Record<string, () => Promise<GameDefinition>> = {
  "fast-facts": () => import("./fast-facts").then(m => m.default),
  // Add more games here...
};

export function registerGame(game: AdventureGame) { REG.set(game.id, game); }
export function getGame(id: string) { return REG.get(id); }
export function listGames() { return Array.from(REG.values()); }

// Legacy compatibility functions
export async function loadGame(gameId: string): Promise<GameDefinition | null> {
  try {
    const loader = LEGACY_GAMES[gameId];
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
  return Object.keys(LEGACY_GAMES);
}

export function getGamesBySubject(_subject: string): string[] {
  // This would ideally be enhanced to load game metadata without loading full games
  // For now, return all games (can be improved later)
  return getAvailableGames();
}