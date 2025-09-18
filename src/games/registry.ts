import type { AdventureGame } from './sdk';

const REG = new Map<string, AdventureGame>();

export function registerGame(game: AdventureGame) { 
  REG.set(game.id, game); 
}

export function getGame(id: string) { 
  return REG.get(id); 
}

export function listGames() { 
  return Array.from(REG.values()); 
}

// Legacy compatibility functions for existing code
export function loadGame(id: string) {
  return Promise.resolve(getGame(id) || null);
}

export function getAvailableGames() {
  return Array.from(REG.keys());
}