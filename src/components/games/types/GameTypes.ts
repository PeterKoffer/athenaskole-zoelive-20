
export type GameStatus = "available" | "coming-soon" | "beta";
export type GameDifficulty = "beginner" | "intermediate" | "advanced";
export type InteractionType = 'drag-drop' | 'click-sequence' | 'drawing' | 'typing' | 'multiple-choice' | 'simulation' | 'puzzle' | 'memory' | 'timing' | 'strategy';

export interface GameRewards {
  coins: number;
  badges: string[];
}

export interface AdaptiveRules {
  successThreshold: number;
  failureThreshold: number;
  difficultyIncrease: number;
  difficultyDecrease: number;
}

export interface CurriculumGame {
  id: string;
  title: string;
  description: string;
  emoji: string;
  subject: string;
  gradeLevel: number[];
  difficulty: GameDifficulty;
  interactionType: InteractionType;
  timeEstimate: string;
  skillAreas: string[];
  learningObjectives: string[];
  status: GameStatus;
  rewards: GameRewards;
  adaptiveRules?: AdaptiveRules;
}
