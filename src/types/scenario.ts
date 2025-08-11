
export interface ScenarioDefinition {
  id: string;
  title: string;
  description: string;
  educational: {
    subject: string;
    gradeLevel: string | number;
    difficulty?: number;
    estimatedDuration?: number;
    learningObjectives?: string[];
    learningOutcomes?: string[];
    prerequisites?: string[];
  };
  initialContext?: {
    setting: string;
    situation: string;
    character: string;
  };
  nodes: ScenarioNode[];
  entryNodeId: string;
  exitNodeIds?: string[];
  config?: {
    allowRevisit?: boolean;
    autoSave?: boolean;
    maxDuration?: number;
    passingCriteria?: {
      minScore: number;
      requiredNodes?: string[];
    };
  };
  metadata?: Record<string, any>;
}

export interface ScenarioNode {
  id: string;
  type: 'explanation' | 'question' | 'interactive' | 'narrative' | 'summary';
  title?: string;
  content: string;
  educational?: {
    subject: string;
    skillArea?: string;
    difficultyLevel?: number;
    estimatedDuration?: number;
    learningObjectives?: string[];
  };
  connections?: {
    next?: string;
    correct?: string;
    incorrect?: string;
    branches?: { condition: string; targetNodeId: string; reason?: string }[];
    fallback?: string;
    [key: string]: any;
  };
  config?: {
    required?: boolean;
    allowHints?: boolean;
    maxAttempts?: number;
    customProperties?: {
      options?: string[];
      correctAnswer?: string;
      questionType?: string;
    };
  };
  question?: {
    id: string;
    type: 'multiple-choice' | 'text-input' | 'drag-drop';
    options?: ScenarioQuestionOption[];
    correctAnswer?: string;
    explanation?: string;
  };
  character?: string;
  backgroundImage?: string;
}

export interface ScenarioQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ScenarioSession {
  sessionId: string;
  scenarioId: string;
  userId: string;
  currentNodeId: string;
  visitedNodes: string[];
  responses: Record<string, any>;
  timestamps: {
    startedAt: Date;
    lastActiveAt: Date;
    completedAt?: Date;
  };
  status: 'active' | 'completed' | 'abandoned';
  progress: {
    percentComplete: number;
    nodesCompleted: number;
    totalNodes: number;
    score: number;
  };
}
