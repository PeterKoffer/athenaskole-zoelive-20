
// Re-export everything from the new modular structure
export type { CurriculumGame, GameStatus, GameDifficulty, InteractionType, GameRewards, AdaptiveRules } from './types/GameTypes';
export { curriculumGames } from './data/GameData';
export { getGamesBySubject, getGamesByGradeLevel, getGameById, getGamesByDifficulty, filterGames } from './utils/GameFilters';
