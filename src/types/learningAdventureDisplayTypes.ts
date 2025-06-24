import type { LearningAdventure } from './learningAdventureTypes';

// This file is optional as components can directly use LearningAdventure.
// It can be used for frontend-specific state or view model shaping if needed later.

export interface CurrentAdventureState {
  adventure?: LearningAdventure;
  currentArcId?: string;
  currentChapterIndex?: number; // Make this non-optional in page state, default to 0
  isLoading: boolean;
  error?: string;
}

// Example of a more specific view model if needed, e.g., for the current chapter
// export interface DisplayChapterModel {
//   title: string;
//   narrative: string;
//   imagePrompt?: string;
//   activities: Array<{
//     description: string;
//     imagePrompt?: string;
//   }>;
// }
