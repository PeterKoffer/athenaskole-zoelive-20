import type { AdventureGamePolicy } from '@/types/AdventureSettings';

export function maxGameSeconds(totalDayMinutes: number, games: AdventureGamePolicy) {
  return Math.floor(totalDayMinutes * 60 * (games.enabled ? games.max_share : 0));
}

export function shouldAllowGameStart(params: {
  games: AdventureGamePolicy;
  totalDayMinutes: number;
  gameSecondsUsed: number;
  coreCompleted: boolean;
}) {
  if (!params.games.enabled) return false;
  if (!params.coreCompleted) return false;
  const cap = maxGameSeconds(params.totalDayMinutes, params.games);
  return params.gameSecondsUsed < cap;
}

// Use when finishing a game to clip overage to 0
export function remainingGameSeconds(params: {
  games: AdventureGamePolicy;
  totalDayMinutes: number;
  gameSecondsUsed: number;
}) {
  const cap = maxGameSeconds(params.totalDayMinutes, params.games);
  return Math.max(0, cap - params.gameSecondsUsed);
}