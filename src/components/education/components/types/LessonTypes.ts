
export interface LessonActivity {
  id: string;
  title: string;
  type: 'introduction' | 'interactive-game' | 'creative-exploration' | 'application' | 'summary';
  phase: string;
  duration: number;
  phaseDescription: string;
  metadata: {
    subject: string;
    skillArea: string;
  };
  content: {
    text?: string;
    question?: string;
    options?: string[];
    choices?: string[];
    correctAnswer?: number;
    explanation?: string;
    title?: string;
    battleScenario?: string;
    activityId?: string;
    questionText?: string;
    creativePrompt?: string;
    whatIfScenario?: string;
    explorationTask?: string;
    scenario?: string;
    task?: string;
    guidance?: string;
    keyTakeaways?: string[];
    nextTopicSuggestion?: string;
  };
}
