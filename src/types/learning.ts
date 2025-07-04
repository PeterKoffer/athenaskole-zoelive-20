export interface LearningAtomPerformance {
  attempts: number;
  timeTakenSeconds: number;
  hintsUsed: number;
  success: boolean;
  score?: number; // Optional
  firstAttemptSuccess: boolean;
  timestamp: string; // When this performance was recorded
}

export interface LearningAtom {
  id: string; // Unique ID for the atom instance
  type: 'exploration' | 'challenge' | 'discovery' | 'creation' | 'reflection' | 'instruction';
  subject: string;
  curriculumObjectiveId: string; // The ID of the Curriculum object from curriculum-steps.json
  curriculumObjectiveTitle: string; // The title of the Curriculum object
  narrativeContext: string; // Story snippet that embeds this atom
  estimatedMinutes: number;
  interactionType: 'story' | 'game' | 'experiment' | 'puzzle' | 'creative' | 'instruction';

  difficulty: 'easy' | 'medium' | 'hard'; // Difficulty for this instance of the atom
  variantId?: string; // Optional: For different presentation styles of the same objective/difficulty

  content: {
    title: string;
    description: string; // This description should be tailored to the difficulty
    data?: any; // e.g., game config { level: 'easy' }, puzzle data, experiment steps with more/less scaffolding
  };
  isCompleted?: boolean; // Reflects if this specific atom instance in the universe was completed by the user
  performance?: LearningAtomPerformance; // Performance data for this specific instance, filled by UniverseSessionManager
}

// Represents the overall daily learning experience
export interface DailyUniverse {
  userId: string;
  theme: string; // e.g., 'Galactic Research Mission'
  storylineIntro: string; // Initial narrative for the day
  learningAtoms: LearningAtom[]; // The sequence of learning atoms for the day
  storylineOutro: string; // Concluding narrative
  estimatedTotalMinutes: number;
  dateGenerated: string;
}
