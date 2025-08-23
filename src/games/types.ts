export interface GameDefinition<State = any> {
  id: string;
  title: string;
  subject: string;                // e.g., "Mathematics"
  gradeBands?: Array<"3-5" | "6-8" | "9-12">;
  description?: string;
  estimatedTimeMs?: number;       // expected game duration
  
  // Core game lifecycle
  init(seed: number, params?: any): State;
  reducer(state: State, action: { type: string; payload?: any }): State;
  score(state: State): number;    // final score (int)
  isFinished(state: State): boolean;
  render(state: State, dispatch: (action: any) => void): JSX.Element; // pure view
  
  // Optional game metadata
  getProgress?(state: State): number; // 0-1, for progress bars
  getHints?(state: State): string[];  // contextual hints
  getStats?(state: State): Record<string, any>; // detailed stats
}

export interface GameScore {
  gameId: string;
  userId: string;
  score: number;
  meta: {
    durationMs?: number;
    accuracy?: number;
    attempts?: number;
    difficulty?: number;
    [key: string]: any;
  };
  period: string; // date string
  schoolId?: string;
  country?: string;
}

export interface LeaderboardEntry {
  userId: string;
  username?: string;
  avatar?: string;
  score: number;
  rank: number;
  meta: Record<string, any>;
  createdAt: string;
}

export interface GameAction {
  type: string;
  payload?: any;
}

export interface GameParams {
  difficulty?: number;
  timeLimit?: number;
  gradeLevel?: number;
  subject?: string;
  [key: string]: any;
}