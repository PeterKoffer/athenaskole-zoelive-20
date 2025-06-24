import { LessonActivity, ActivityType } from '@/components/education/components/types/LessonTypes';

// Describes a request for a LessonActivity to be generated,
// to be processed by DailyLessonGenerator or ActivityContentGenerator.
export interface EmbeddedActivityRequest {
  activityType: ActivityType; // e.g., 'interactive-game', 'content-delivery'
  subject: string;
  skillArea: string; // The specific skill the activity should target within the narrative context
  focusArea?: string; // More specific focus, if applicable
  promptOverride?: string; // Optional: A specific prompt for the AI generating this activity's content
  activityImagePrompt?: string; // Text prompt for an image specific to this activity
  // Parameters like difficulty might be inherited from the adventure's context or specified here
  difficulty?: number;
}

export interface ChoiceOption {
  id: string; // e.g., "sporting_goods_store"
  displayText: string; // e.g., "The Grand Slam Sporting Goods"
  description?: string; // Brief description of what this choice entails
  choiceImagePrompt?: string; // Text prompt for an image representing this choice
  linkedStoryArcId: string; // ID to match a StoryArc
}

export interface InitialChoicePoint {
  narrativeLeadingToChoice?: string; // Optional text setting up the choice
  prompt: string; // e.g., "Which store will you manage?"
  options: ChoiceOption[];
}

export interface Chapter {
  chapterId: string;
  chapterTitle: string;
  narrativeText: string; // Story text for this chapter
  chapterImagePrompt?: string; // Text prompt for a background/illustrative image for this chapter
  // Activities can be pre-defined LessonActivity objects or requests to generate them.
  embeddedActivities: Array<LessonActivity | EmbeddedActivityRequest>;
  // decisionPoints, completionCriteria, etc. can be added in the future
}

export interface StoryArc {
  storyArcId: string; // Matches linkedStoryArcId from a ChoiceOption, or a default one
  arcTitle?: string; // e.g., "The Sporting Goods Store Success Story"
  arcIntroductionNarrative?: string; // Optional narrative specific to this arc's beginning
  chapters: Chapter[];
  arcConclusionNarrative?: string; // Narrative for when this specific arc is completed
  arcConclusionImagePrompt?: string;
}

export type AdventureDurationType = 'singleDay' | 'multiDay' | 'weekLong' | 'continuousArc';

export interface LearningAdventure {
  adventureId: string;
  title: string;
  theme?: string; // e.g., "Entrepreneurship", "Space Exploration", "Community Service"
  logline?: string; // A short, exciting one-sentence summary
  targetAudience?: {
    gradeLevelMin: number;
    gradeLevelMax: number;
  };
  targetDurationType: AdventureDurationType;
  estimatedTotalDays?: number; // If multiDay/weekLong

  coverImagePrompt?: string; // Text prompt for a cover image for the whole adventure

  introductionNarrative: string; // Sets the main scene and overarching goal for the adventure
  introductionImagePrompt?: string;

  learningObjectivesSummary?: string[]; // Student-friendly list of what they'll achieve overall

  mainCharacters?: Array<{
    name: string;
    role: string;
    description?: string;
    // characterImagePrompt?: string; // For character portraits later
  }>;

  initialChoicePoint?: InitialChoicePoint; // If the adventure starts with a choice

  storyArcs: Record<string, StoryArc>; // Keyed by storyArcId. If no choice, one arc with defaultStoryArcId.
  defaultStoryArcId: string; // The arc to use if no initialChoicePoint or as a default.

  conclusionNarrative?: string; // Overall adventure conclusion if not arc-specific or if there's a final wrap-up
  conclusionImagePrompt?: string;

  subjectsCovered?: string[]; // List of subjects explicitly integrated
  skillsDeveloped?: string[]; // e.g., "Problem Solving", "Budgeting", "Creative Writing"
  tags?: string[]; // For searching/categorizing adventures
}
