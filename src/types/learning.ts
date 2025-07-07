
// Learning-related type definitions

export interface LearningAtomPerformance {
  attempts: number;
  timeTakenSeconds: number;
  hintsUsed: number;
  success: boolean;
  firstAttemptSuccess: boolean;
  timestamp: string;
}

export interface LearningAtom {
  id: string;
  type: string;
  content: any;
  subject: string;
  difficulty: string;
  estimatedMinutes: number;
}

export interface DailyUniverse {
  theme: string;
  storylineIntro: string;
  storylineOutro: string;
  estimatedTotalMinutes: number;
  learningAtoms: LearningAtom[];
}
