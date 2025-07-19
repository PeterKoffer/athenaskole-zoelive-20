
export interface ScenarioDefinition {
  id: string;
  title: string;
  description: string;
  educational: {
    subject: string;
    gradeLevel: string;
    learningObjectives: string[];
  };
  initialContext: {
    setting: string;
    situation: string;
    character: string;
  };
  states: ScenarioState[];
}

export interface ScenarioState {
  id: string;
  type: 'narrative' | 'question' | 'interactive';
  content: {
    text: string;
    character?: string;
    backgroundImage?: string;
    question?: {
      id: string;
      type: 'multiple-choice' | 'text-input' | 'drag-drop';
      options?: {
        id: string;
        text: string;
        isCorrect: boolean;
      }[];
      explanation?: string;
    };
  };
  transitions: ScenarioTransition[];
}

export interface ScenarioTransition {
  id: string;
  text: string;
  targetState: string;
  condition?: {
    type: 'answer-correct' | 'answer-incorrect' | 'always';
  };
}
