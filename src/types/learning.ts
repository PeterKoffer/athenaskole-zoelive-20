export interface LearningAtom {
  id: string; // Unique ID for the atom, can be derived from curriculum objective ID
  type: 'exploration' | 'challenge' | 'discovery' | 'creation' | 'reflection';
  subject: string;
  curriculumObjectiveId: string; // The ID of the Curriculum object from curriculum-steps.json
  curriculumObjectiveTitle: string; // The title of the Curriculum object
  narrativeContext: string; // Story snippet that embeds this atom
  estimatedMinutes: number;
  interactionType: 'story' | 'game' | 'experiment' | 'puzzle' | 'creative' | 'instruction'; // Added instruction
  content: { // More structured content
    title: string; // Could be same as curriculumObjectiveTitle or more specific for the atom
    description: string; // Detailed instructions or content for the atom
    data?: any; // e.g., game config, puzzle data, experiment steps
  };
  isCompleted?: boolean; // Optional: status can be tracked by UniverseSessionManager via curriculumObjectiveId
}

// Represents the overall daily learning experience
export interface DailyUniverse {
  userId: string;
  theme: string; // e.g., 'Galactic Research Mission'
  storylineIntro: string; // Initial narrative for the day
  learningAtoms: LearningAtom[];
  storylineOutro: string; // Concluding narrative
  estimatedTotalMinutes: number;
  dateGenerated: string;
}
